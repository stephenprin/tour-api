import express from 'express';
import { createTour, deleteTour, getAllTours, getMonthlyTourPlan, getTour, getTourStats, updateTour } from '../controller/tourController';
import { aliasTours } from '../middleware/alias';
import { protect, restrictTo} from '../controller/authController'

const router = express.Router();

router.get('/top-5-cheap', aliasTours, getAllTours);

router.get('/monthly-plan/:year', getMonthlyTourPlan)

router.get('/all-tours',protect, getAllTours);
router.get('/tour/:id', getTour);
router.get('/get-stats',getTourStats)
router.post('/tour', createTour)
router.patch('/tour/:id', updateTour);
router.delete('/tour/:id',protect, restrictTo("admin"),deleteTour);






export default router;