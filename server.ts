import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
require("dotenv").config();
import router from "./router/index";
const PORT = process.env.PORT || '3001';
const app = express();
// import errorMiddleware from "./middlewares/error-middleware";

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    })
);
app.use("/api", router);
// app.use(errorMiddleware);
const start = async () => {
    try {
        await mongoose
            .connect(process.env.DB_URL as string)
            .then(() => console.log("Connect to DB"));
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
};
start();