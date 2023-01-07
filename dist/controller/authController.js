"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.restrictTo = exports.protect = exports.deleteUser = exports.login = exports.signup = void 0;
const userSchema_1 = __importDefault(require("../model/userSchema"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utility_1 = require("../utils/utility");
const email_1 = __importDefault(require("../utils/email"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, confirmPassword, phone, passwordChangedAt, role, } = req.body;
        const UserExist = yield userSchema_1.default.findOne({ email });
        if (UserExist) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                message: "User already exist",
            });
        }
        const newUser = yield userSchema_1.default.create({
            name,
            email,
            password,
            confirmPassword,
            phone,
            passwordChangedAt,
            role,
        });
        const token = (0, utility_1.createToken)({
            id: newUser.id,
            email: newUser.email,
        });
        res.status(201).json({
            MESSAGE: "User created successfully",
            token,
            data: {
                newUser,
            },
        });
    }
    catch (err) {
        res.status(400).json({
            MESSAGE: "User creation failed",
            err,
        });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                message: "Please provide email and password",
            });
        }
        const user = yield userSchema_1.default.findOne({ email }).select("+password");
        const correct = yield (user === null || user === void 0 ? void 0 : user.correctPassword(password, user.password));
        if (!user || !correct) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                message: "Incorrect email or password",
            });
        }
        const token = (0, utility_1.createToken)({
            id: user.id,
            email: user.email,
        });
        res.status(200).json({
            message: "Login successful",
            token,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Login failed",
            error,
        });
    }
});
exports.login = login;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.deleteUser = deleteUser;
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //check if the token exist
        let token = "";
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({
                message: "You are not logged in! Please login to get access",
            });
        }
        //verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.APP_SECRET);
        //console.log(decoded);
        if (!decoded) {
            res.status(401).json({
                Error: "unauthorize",
            });
        }
        //check if the user still exist
        const currentUser = yield userSchema_1.default.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                message: "The user belonging to this token does no longer exist",
            });
        }
        //check if the user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return res.status(401).json({
                message: "User recently changed password! Please login again",
            });
        }
        //grant access to protected route
        req.user = currentUser;
        // req.
        next();
    }
    catch (error) {
        res.status(401).json({
            message: "Error encountered while verifying token",
            error,
        });
    }
});
exports.protect = protect;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(http_status_codes_1.default.FORBIDDEN).json({
                message: "You do not have permission to perform this action"
            });
        }
        next();
    };
};
exports.restrictTo = restrictTo;
//forgot password and reset password
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userSchema_1.default.findOne({ email: req.body.email });
    if (!user) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({
            message: "There is no user with this email address"
        });
    }
    //generate the random reset token
    const resetToken = user.createPasswordResetToken();
    yield user.save({ validateBeforeSave: false });
    //send via email
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and 
    passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    try {
        const resp = yield (0, email_1.default)({
            email: user.email,
            subject: "Your password reset token (valid for 10 min)",
            message,
        });
        res.status(http_status_codes_1.default.OK).json({
            message: "Token sent to email",
        });
        console.log(resp);
    }
    catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        yield user.save({ validateBeforeSave: false });
        return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "There was an error sending the email. Try again later!",
            error
        });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.resetPassword = resetPassword;
