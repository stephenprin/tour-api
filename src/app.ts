import express, { application, Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app= express();
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});



//connecting too database and server
const PORT = process.env.PORT || 3500;

mongoose.set('strictQuery', true);

mongoose.connect(process.env.DATABASE_URL as string, () => { 
  try {
    app.listen(PORT, () => {
      console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
    });
    console.log('Connected to Database');
  }catch (err) {
    console.log(err);
  }
});




