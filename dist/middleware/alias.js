"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aliasTours = void 0;
const aliasTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,summary,difficulty, ratingAverage';
    next();
};
exports.aliasTours = aliasTours;
