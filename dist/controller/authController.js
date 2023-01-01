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
exports.login = exports.signup = void 0;
const userSchema_1 = __importDefault(require("../model/userSchema"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const utility_1 = require("../utils/utility");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, confirmPassword, userName, phone } = req.body;
        const UserExist = yield userSchema_1.default.findOne({ email });
        if (UserExist) {
            res.status(http_status_codes_1.default.BAD_REQUEST).json({
                message: "User already exist",
            });
        }
        const newUser = yield userSchema_1.default.create({
            name,
            email,
            password,
            userName,
            confirmPassword,
            phone,
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
    catch (error) {
        res.status(400).json({
            MESSAGE: "User created already",
            error,
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
