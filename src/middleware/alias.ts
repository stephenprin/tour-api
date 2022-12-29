import express, {Request, Response, NextFunction} from 'express';

export const aliasTours = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,summary,difficulty, ratingAverage';
    next();
}