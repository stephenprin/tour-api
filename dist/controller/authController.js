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
exports.signup = void 0;
const userSchema_1 = __importDefault(require("../model/userSchema"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, confirmPassword, userName, phone } = req.body;
        const newUser = yield userSchema_1.default.create({
            name,
            email,
            password,
            userName,
            confirmPassword,
            phone
        });
        const token = jsonwebtoken_1.default.sign({ id: newUser._id, email: newUser.email }, process.env.APP_SECRET, { expiresIn: process.env.EXPIRES_IN });
        res.status(201).json({
            MESSAGE: "User created successfully",
            token,
            data: {
                newUser
            }
        });
    }
    catch (error) {
        res.status(400).json({
            MESSAGE: "User created already",
            error
        });
    }
});
exports.signup = signup;
