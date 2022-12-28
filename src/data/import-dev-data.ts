import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs"; 
import Tour from "../model/tourSchema";

dotenv.config();

mongoose.set('strictQuery', true);

mongoose.connect(process.env.DATABASE_URL as string, () => { 
  try {
    console.log('Connected to Database');
  }catch (err) {
    console.log(err);
  }
});

//READ JSON DATA
const tour = JSON.parse(fs.readFileSync(`${__dirname}/tour_simple.json`, "utf-8"))

//IMPORT FROM DATABASE JSON
const importData = async() => {
  try {
      await Tour.create(tour)
      console.log("Succesfully imported from database")
  } catch (error) {
    console.log(error)
  }
   process.exit()
}


const deleteData = async () => {
    try {
        await Tour.deleteMany()
        console.log("Succesfully deleted from database")
    } catch (error) {
      console.log(error)
    }
   process.exit()
}


if (process.argv[2] === "--import") {
    importData()
} else if (process.argv[2] === "--delete") {
    deleteData()
}

console.log(process.argv)
