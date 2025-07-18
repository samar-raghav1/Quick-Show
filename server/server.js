import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";


const app= express();
const port=3000;
await connectDB();


app.get('/',(req,res)=>res.send("Server is live.."));




app.listen(port,()=>console.log(`listing at http://localhost:${port}`));