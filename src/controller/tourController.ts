import express, { Request, Response } from 'express'
import Tour from '../model/tourSchema';
import StatusCodes from 'http-status-codes';
import APIFeatures  from '../utils/apiQuery';

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
       
       //execute query
        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();

     const tours = await features.query;
        res.status(StatusCodes.OK).json({
            message: "Successfully got all tours 🦾",
            tourCoount: tours.length,
            tours
        })

    
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            status: 'fail to get all tour',
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


export const getTourStats = async (req: Request, res: Response) => { 
    try {
        const stats = await Tour.aggregate([
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
        ])
        res.status(StatusCodes.OK).json({
            message: "Successfully got tour stats 🦾",
            stats
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            status: 'fail',
            message:error,
        });
    }
}

export const getMonthlyTourPlan = async (req: Request, res: Response) => { 
    try {
        const year = parseInt(req.params.year) ;
        const plan = await Tour.aggregate([
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
            
        ])
        res.status(StatusCodes.OK).json({
            message: "Successfully got tour month 🦾",
            plan
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            status: 'fail',
            message:error,
        });
    }
}