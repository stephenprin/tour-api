import express, { Request, Response } from 'express'
import Tour from '../model/tourSchema';
import StatusCodes from 'http-status-codes';

//create a tour
export const createTour = async(req: Request, res: Response) => { 
    const { name, price, rating,duration,
        maxGroupSize,
        difficulty,
        ratingAverage,
        ratingQuantity,
        priceDiscount,
        summary,
        description,
        imageCover,
        images,
        startDates,} = req.body;
try {
    const newTour = await Tour.create({
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
    

    })
    res.status(StatusCodes.CREATED).json({
        message: "Tour created successfully 🦾 ",
       newTour
    });
} catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail to create tour',
        message: "Tour created already🥺 ",
    });
}
}


//get all tours
export const getAllTours = async (req: Request, res: Response) => { 
    try {
        //build query
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        console.log(req.query, queryObj);

        //advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        const query = Tour.find(JSON.parse(queryStr));
        
        //execute query
        const tours = await query;
        res.status(StatusCodes.OK).json({
            message: "Successfully got all tours 🦾",
            tours
        })
    
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            status: 'fail to gell all tour',
            message: "An error occured",
        });
    }

}
//get a tour
export const getTour = async (req: Request, res: Response) => { 
    try {
        const id=req.params.id
        const tour = await Tour.findOne({_id:id});
        res.status(StatusCodes.OK).json({
            message: "Successfully got a tour 🦾",
            tour
        })
    
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            status: 'fail to get tour',
            message: "An error occured",
        });
    }

}
//update a tour
export const updateTour = async (req: Request, res: Response) => { 
    try {
        const id = req.params.id
        const tour = await Tour.findOneAndUpdate({ _id: id }, req.body, {
            new: true,
            runValidators: true

        })
        res.status(StatusCodes.OK).json({
            message: "Successfully updated a tour 🦾",
            tour
        })
        
    } catch {
        res.status(StatusCodes.BAD_REQUEST).json({
            status: 'fail to update tour',
            message: "An error occured",
        });
    }
}
//delete a tour
export const deleteTour = async (req: Request, res: Response) => { 
    try {
        const id = req.params.id
        const tour = await Tour.findByIdAndDelete({ _id: id })
        res.status(StatusCodes.OK).json({
            message: "Successfully deleted a tour 🦾",
            tour
        })
    } catch { 
        res.status(StatusCodes.BAD_REQUEST).json({
            status: 'fail to delete tour',
            message: "An error occured",
        });
    }
}