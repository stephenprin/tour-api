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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const tourSchema_1 = __importDefault(require("../model/tourSchema"));
dotenv_1.default.config();
mongoose_1.default.set('strictQuery', true);
mongoose_1.default.connect(process.env.DATABASE_URL, () => {
    try {
        console.log('Connected to Database');
    }
    catch (err) {
        console.log(err);
    }
});
//READ JSON DATA
const tour = JSON.parse(fs_1.default.readFileSync(`${__dirname}/tour_simple.json`, "utf-8"));
//IMPORT FROM DATABASE JSON
const importData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield tourSchema_1.default.create(tour);
        console.log("Succesfully imported from database");
    }
    catch (error) {
        console.log(error);
    }
    process.exit();
});
const deleteData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield tourSchema_1.default.deleteMany();
        console.log("Succesfully deleted from database");
    }
    catch (error) {
        console.log(error);
    }
    process.exit();
});
if (process.argv[2] === "--import") {
    importData();
}
else if (process.argv[2] === "--delete") {
    deleteData();
}
console.log(process.argv);
