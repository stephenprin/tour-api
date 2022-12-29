"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tourController_1 = require("../controller/tourController");
const alias_1 = require("../middleware/alias");
const router = express_1.default.Router();
router.get('/top-5-cheap', alias_1.aliasTours, tourController_1.getAllTours);
router.get('/all-tours', tourController_1.getAllTours);
router.get('/tour/:id', tourController_1.getTour);
router.post('/tour', tourController_1.createTour);
router.patch('/tour/:id', tourController_1.updateTour);
router.delete('/tour/:id', tourController_1.deleteTour);
exports.default = router;
