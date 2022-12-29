import express from 'express';
import { createTour, deleteTour, getAllTours, getTour, updateTour } from '../controller/tourController';
import { aliasTours } from '../middleware/alias';

const router = express.Router();

router.get('/top-5-cheap', aliasTours, getAllTours);

router.get('/all-tours', getAllTours);
router.get('/tour/:id', getTour);
router.post('/tour', createTour)
router.patch('/tour/:id', updateTour);
router.delete('/tour/:id', deleteTour);





export default router;