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
exports.getTour = exports.getAllTours = exports.createTour = void 0;
const tourSchema_1 = __importDefault(require("../model/tourSchema"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
//create a tour
const createTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, rating } = req.body;
    try {
        const newTour = yield tourSchema_1.default.create({
            name,
            price,
            rating,
        });
        res.status(http_status_codes_1.default.CREATED).json({
            message: "Tour created successfully ",
            newTour
        });
    }
    catch (error) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            status: 'fail to create tour',
            message: "Tour created already 👍🏼",
        });
    }
});
exports.createTour = createTour;
//get all tours
const getAllTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tours = yield tourSchema_1.default.find();
        res.status(http_status_codes_1.default.OK).json({
            message: "Successfully got all tours 🦾",
            tours
        });
    }
    catch (error) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            status: 'fail to gell all tour',
            message: "An error occured",
        });
    }
});
exports.getAllTours = getAllTours;
//get a tour
const getTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const tour = yield tourSchema_1.default.findOne({ _id: id });
        res.status(http_status_codes_1.default.OK).json({
            message: "Successfully got a tour 🦾",
            tour
        });
    }
    catch (error) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            status: 'fail to get tour',
            message: "An error occured",
        });
    }
});
exports.getTour = getTour;
