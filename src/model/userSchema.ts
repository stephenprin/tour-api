import { NextFunction } from "express";
import mongoose from "mongoose";
import validator from "validator"
import bcrypt from "bcryptjs"
import crypto from "crypto"

//name, email, photo, password,passwordConfirm

export interface UserInterface{
    [x: string]: any;
    name: string;
    email: string;
    photo: string;
    password: string;
    confirmPassword:string | undefined;
    phone: string;
    passwordChangedAt: Date | undefined;
    role: string;
    passwordResetToken: string | undefined;
    passwordResetExpires: Date | undefined;

}

const userSchema = new mongoose.Schema<UserInterface>({
    name: {
        type: String,
        required: [true, 'A name must be enter'],
        trim: true,
        maxlength: [30, 'A  name must have less or equal then 30 characters'],
        minlength: [5, 'A name must have more or equal then 30 characters'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
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
        minlength: 8,
        select: false
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
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,


})

userSchema.pre<UserInterface>("save", async function (next) { 
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword= undefined;
    next();
})
    
userSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
    try {
        return await bcrypt.compare(candidatePassword, userPassword)
    } catch (error) {
        return error
    }
 }
userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) { 
    if (this.passwordChangedAt) { 
        const changeTimeStamp = this.passwordChangedAt.getTime() / 1000
        
        return JWTTimestamp < changeTimeStamp
     
    }
       
    return false
}


userSchema.methods.createPasswordResetToken = function () { 
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    return resetToken;


}

const User = mongoose.model<UserInterface>("User", userSchema)

export default User;