import User from "../model/userSchema";
import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";
import { createToken } from "../utils/utility";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword, userName, phone } =
      req.body;
    const UserExist = await User.findOne({ email });
    if (UserExist) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "User already exist",
      });
    }
    const newUser = await User.create({
      name,
      email,
      password,
      userName,
      confirmPassword,
      phone,
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
  } catch (error) {
    res.status(400).json({
      MESSAGE: "User created already",
      error,
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
    const correct= await user?.correctPassword(password, user.password);

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
