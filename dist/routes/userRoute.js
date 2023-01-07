"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: 'public/img/users' });
const router = express_1.default.Router();
router.post('/signup', authController_1.signup);
router.post('/login', authController_1.login);
router.delete("/id", authController_1.deleteUser);
router.post("/forgotPassword", authController_1.forgotPassword);
router.patch("/resetPassword/:token", authController_1.resetPassword);
exports.default = router;
