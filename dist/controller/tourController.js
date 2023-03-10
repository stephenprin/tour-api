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
exports.getMonthlyTourPlan = exports.getTourStats = exports.deleteTour = exports.updateTour = exports.getTour = exports.getAllTours = exports.createTour = void 0;
const tourSchema_1 = __importDefault(require("../model/tourSchema"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const apiQuery_1 = __importDefault(require("../utils/apiQuery"));
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
            message: "Tour created successfully ???? ",
            newTour
        });
    }
    catch (error) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            status: 'fail to create tour',
            message: "Tour created already???? ",
        });
    }
});
exports.createTour = createTour;
//get all tours
const getAllTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //execute query
        const features = new apiQuery_1.default(tourSchema_1.default.find(), req.query).filter().sort().limitFields().paginate();
        const tours = yield features.query;
        res.status(http_status_codes_1.default.OK).json({
            message: "Successfully got all tours ????",
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
            message: "Successfully got a tour ????",
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
            message: "Successfully updated a tour ????",
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
            message: "Successfully deleted a tour ????",
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
const getTourStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield tourSchema_1.default.aggregate([
            {
                $match: { ratingAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRating: { $sum: '$ratingQuantity' },
                    avgRating: { $avg: '$ratingAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                },
            },
            {
                $sort: { avgPrice: 1 }
            }
        ]);
        res.status(http_status_codes_1.default.OK).json({
            message: "Successfully got tour stats ????",
            stats
        });
    }
    catch (error) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            status: 'fail',
            message: error,
        });
    }
});
exports.getTourStats = getTourStats;
const getMonthlyTourPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const year = parseInt(req.params.year);
        const plan = yield tourSchema_1.default.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1 }
            }, {
                $limit: 5
            }
        ]);
        res.status(http_status_codes_1.default.OK).json({
            message: "Successfully got tour month ????",
            plan
        });
    }
    catch (error) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            status: 'fail',
            message: error,
        });
    }
});
exports.getMonthlyTourPlan = getMonthlyTourPlan;
