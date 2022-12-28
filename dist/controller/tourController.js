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
exports.deleteTour = exports.updateTour = exports.getTour = exports.getAllTours = exports.createTour = void 0;
const tourSchema_1 = __importDefault(require("../model/tourSchema"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
//create a tour
const createTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, rating, duration, maxGroupSize, difficulty, ratingAverage, ratingQuantity, priceDiscount, summary, description, imageCover, images, startDates, } = req.body;
    try {
        const newTour = yield tourSchema_1.default.create({
            name,
            price,
            rating,
            duration,
            maxGroupSize,
            difficulty,
            ratingAverage,
            ratingQuantity,
            priceDiscount,
            summary,
            description,
            imageCover,
            images,
            startDates,
        });
        res.status(http_status_codes_1.default.CREATED).json({
            message: "Tour created successfully 🦾 ",
            newTour
        });
    }
    catch (error) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            status: 'fail to create tour',
            message: "Tour created already🥺 ",
        });
    }
});
exports.createTour = createTour;
//get all tours
const getAllTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //build query
        const queryObj = Object.assign({}, req.query);
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        //advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        let query = tourSchema_1.default.find(JSON.parse(queryStr));
        //sorting 
        if (req.query.sort) {
            let sortBy = req.query.sort;
            query = query.sort(sortBy.split(',').join(' '));
        }
        else {
            query = query.sort('-createdAt');
        }
        //field limiting
        if (req.query.fields) {
            const fields = req.query.fields;
            query = query.select(fields.split(',').join(' '));
        }
        else {
            query = query.select('-__v');
        }
        //pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        if (req.query.page) {
            const numTours = yield tourSchema_1.default.countDocuments();
            if (skip >= numTours)
                throw new Error('This page does not exist');
        }
        query = query.skip(skip).limit(limit);
        //execute query
        const tours = yield query;
        res.status(http_status_codes_1.default.OK).json({
            message: "Successfully got all tours 🦾",
            tourCoount: tours.length,
            tours
        });
    }
    catch (error) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            status: 'fail to get all tour',
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
//update a tour
const updateTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const tour = yield tourSchema_1.default.findOneAndUpdate({ _id: id }, req.body, {
            new: true,
            runValidators: true
        });
        res.status(http_status_codes_1.default.OK).json({
            message: "Successfully updated a tour 🦾",
            tour
        });
    }
    catch (_a) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            status: 'fail to update tour',
            message: "An error occured",
        });
    }
});
exports.updateTour = updateTour;
//delete a tour
const deleteTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const tour = yield tourSchema_1.default.findByIdAndDelete({ _id: id });
        res.status(http_status_codes_1.default.OK).json({
            message: "Successfully deleted a tour 🦾",
            tour
        });
    }
    catch (_b) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            status: 'fail to delete tour',
            message: "An error occured",
        });
    }
});
exports.deleteTour = deleteTour;
