import mongoose from "mongoose";

interface TourInterface{
    name: string;
    price: number;
    rating: number;
    duration: number;
    maxGroupSize: number;
    difficulty: string;
    ratingAverage: number;
    ratingQuantity: number;
    priceDiscount: number;
    summary: string;
    description: string;
    imageCover: string;
    images: string[];
    createdAt: Date;
    startDates: Date[];

}

const tourSchema = new mongoose.Schema<TourInterface>({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'A tour name must have less or equal then 40 characters'],
        minlength: [5, 'A tour name must have more or equal then 10 characters'],
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price'],
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
    },
    ratingQuantity: {
        type: Number,
        default: 0,
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration'],
    },  
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size'],
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult',
        }
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (this: TourInterface, val: number) {
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price',
        }
    },
    summary: {
        type: String,
        trim: true, 
        required: [true, 'A tour must have a summary'],
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    startDates: [Date],

   
    
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

tourSchema.virtual('durationWeeks').get(function (this: TourInterface) { 
    return (this.duration / 7).toFixed(1);

}) 

const Tour = mongoose.model<TourInterface>('Tour', tourSchema);

export default Tour;
