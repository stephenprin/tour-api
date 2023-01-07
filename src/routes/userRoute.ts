import express from 'express';
import { deleteUser, forgotPassword, login, resetPassword, signup }  from '../controller/authController';
import multer from 'multer';

const upload = multer({ dest: 'public/img/users' });


const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.delete("/id", deleteUser)



router.post("/forgotPassword", forgotPassword)
router.patch("/resetPassword/:token", resetPassword) 

export default router;