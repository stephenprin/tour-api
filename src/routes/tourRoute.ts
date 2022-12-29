import express from 'express';
import { createTour, deleteTour, getAllTours, getMonthlyTourPlan, getTour, getTourStats, updateTour } from '../controller/tourController';
import { aliasTours } from '../middleware/alias';

const router = express.Router();

router.get('/top-5-cheap', aliasTours, getAllTours);

router.get('/monthly-plan/:year', getMonthlyTourPlan)

router.get('/all-tours', getAllTours);
router.get('/tour/:id', getTour);
router.get('/get-stats',getTourStats)
router.post('/tour', createTour)
router.patch('/tour/:id', updateTour);
router.delete('/tour/:id', deleteTour);






export default router;