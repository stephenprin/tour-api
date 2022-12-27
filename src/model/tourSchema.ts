import mongoose from "mongoose";

interface TourInterface{
    name: string;
    price: number;
    rating: number;
    duration: number;

}

const tourSchema = new mongoose.Schema<TourInterface>({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price'],
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration'],
    },  
    
})

const Tour = mongoose.model<TourInterface>('Tour', tourSchema);

export default Tour;
