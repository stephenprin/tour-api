import User from '../model/userSchema'
import { Request, Response } from 'express';


export const signup = async (req: Request, res: Response, ) => {
    try {
        const { name, email, password,  confirmPassword,phone,userName } = req.body;
        const newUser = await User.create({
            name,
            email,
            password,
            phone,
            userName,
            photo: "",
            confirmPassword

        })
    
        res.status(201).json({
            MESSAGE: "User created successfully",
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