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
    },
    priceDiscount: {
        type: Number,
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
    
})

const Tour = mongoose.model<TourInterface>('Tour', tourSchema);

export default Tour;
