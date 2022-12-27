import express from 'express';
import { createTour, deleteTour, getAllTours, getTour, updateTour } from '../controller/tourController';


const router = express.Router();

router.get('/all-tours', getAllTours);
router.get('/tour/:id', getTour);
router.post('/tour', createTour)
router.patch('/tour/:id', updateTour);
router.delete('/tour/:id', deleteTour);



export default router;