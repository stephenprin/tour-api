import User, { UserInterface } from "../model/userSchema";
import { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { promisify } from "util";
import { createToken } from "../utils/utility";
import { UserPayload } from "../interface/User.dto";
import sendEmail from "../utils/email"; 

import { createNoSubstitutionTemplateLiteral } from "typescript";

export const signup = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      phone,
      passwordChangedAt,

      role,
    } = req.body;
    const UserExist = await User.findOne({ email });
    if (UserExist) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User already exist",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      confirmPassword,
      phone,
      passwordChangedAt,
      role,

    });

   
    const token = createToken({
      id: newUser.id,
      email: newUser.email,
    });

    res.status(201).json({
      MESSAGE: "User created successfully",
      token,
      data: {
        newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      MESSAGE: "User creation failed",
      err,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    const correct = await user?.correctPassword(password, user.password);

    if (!user || !correct) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Incorrect email or password",
      });
    }

    const token = createToken({
      id: user.id,
      email: user.email,
    });

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(400).json({
      message: "Login failed",
      error,
    });
  }
};


export const deleteUser = async (req: Request, res: Response) => { 

}



declare global {
  namespace Express {
    interface Request {
      user: UserInterface;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //check if the token exist
    let token = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "You are not logged in! Please login to get access",
      });
    }

    //verify the token
    const decoded = jwt.verify(token, process.env.APP_SECRET!) as UserPayload &
      JwtPayload;
    //console.log(decoded);
    if (!decoded) {
      res.status(401).json({
        Error: "unauthorize",
      });
    }
    //check if the user still exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        message: "The user belonging to this token does no longer exist",
      });
    }
    //check if the user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        message: "User recently changed password! Please login again",
      });
    }
    //grant access to protected route
    req.user = currentUser;

    // req.
    next();
  } catch (error) {
    res.status(401).json({
      message: "Error encountered while verifying token",
      error,
    });
  }
};


export const restrictTo = (...roles:string[]) => { 
  return (req: Request, res: Response, next: NextFunction) => { 
    if (!roles.includes(req.user.role)) { 
   
     return res.status(StatusCodes.FORBIDDEN).json({ 
       message: "You do not have permission to perform this action"
     })
   }
    next()
  }
}


//forgot password and reset password
export const forgotPassword = async (req: Request, res: Response) => { 
  
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "There is no user with this email address"
      })
    }
     //generate the random reset token
    const resetToken = user.createPasswordResetToken()
    
    await user.save({ validateBeforeSave: false })

    //send via email
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}` 
    const message = `Forgot your password? Submit a PATCH request with your new password and 
    passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`
  
    

  
  try {
    
        const resp=await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 10 min)",
          message,
          
          
      })
  
      res.status(StatusCodes.OK).json({
        message: "Token sent to email",
      })

      console.log(resp)
      
      
    } catch (error) {
      user.passwordResetToken = undefined
      user.passwordResetExpires = undefined
      await user.save({ validateBeforeSave: false })

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "There was an error sending the email. Try again later!",
        error
      })
    }
   
}
export const resetPassword = async (req: Request, res: Response) => { }