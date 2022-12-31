import { NextFunction } from "express";
import mongoose from "mongoose";
import validator from "validator"
import bcrypt from "bcryptjs"

//name, emaiil, photo, password,passwordConfiirm

interface UserInterface{
    [x: string]: any;
    name: string;
    userName:string
    email: string;
    photo: string;
    password: string;
    confirmPassword:string | undefined;
    phone:string

}

const userSchema = new mongoose.Schema<UserInterface>({
    name: {
        type: String,
        required: [true, 'A name must be enter'],
        trim: true,
        maxlength: [30, 'A  name must have less or equal then 30 characters'],
        minlength: [5, 'A name must have more or equal then 30 characters'],
    },
    userName: {
        type: String,
        required: [true, 'Please provide a username'],
        unique:true
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number'], 
        unique: true,
        
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        validate:[validator.isEmail]
    },
    photo:{
        type: String,

    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength:8
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm password'],
        validate: {
            validator: function (this:UserInterface  ,el: string) { 
                return el === this.password
            },
            message:'Password are not the same'
        }
    }


})

userSchema.pre<UserInterface>("save", async function (next) { 
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword= undefined;
    next();
    })

const User = mongoose.model<UserInterface>("User", userSchema)

export default User;