import { UserPayload } from '../interface/User.dto';
import jwt from 'jsonwebtoken';



export const createToken = (user: UserPayload) => {
    return jwt.sign({ id: user.id, email: user.email },
        process.env.APP_SECRET!, { expiresIn: process.env.EXPIRES_IN! })
}


