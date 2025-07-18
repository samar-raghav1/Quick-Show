import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import showRouter from "./routes/showRoutes.js";

const app= express();
const port=3000;
await connectDB();

app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())
//Api routes
app.get('/',(req,res)=>res.send("Server is live.."));
app.use('/api/inngest',serve({client:inngest,functions}))
app.use('/api/show',showRouter)



app.listen(port,()=>console.log(`listing at http://localhost:${port}`));