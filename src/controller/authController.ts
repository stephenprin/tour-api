import User from '../model/userSchema'
import { Request, Response } from 'express';
import StatusCodes from 'http-status-codes';   
import jwt from 'jsonwebtoken';
import {UserPayload} from '../interface/User.dto';

export const signup = async (req: Request, res: Response, ) => {
    try {
        const { name, email, password,  confirmPassword,userName, phone} = req.body;
        const newUser = await User.create({
            name,
            email,
            password,
            userName,
            confirmPassword,
            phone

        })
      
        const token = jwt.sign({ id: newUser._id, email: newUser.email } as unknown as UserPayload,
            process.env.APP_SECRET!, { expiresIn: process.env.EXPIRES_IN! })

    
        res.status(201).json({
            MESSAGE: "User created successfully",
            token,
            data: {
                newUser
            }
        })
    } catch (error) {
        res.status(400).json({
            MESSAGE: "User created already",
            error
        })
    }
 }