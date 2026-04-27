import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

import patch from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = patch.dirname(__filename);

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(patch.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    res.locals.userId = req.cookies ? req.cookies.userid : null;
    next();
});


import bookRoutes from "./routes/bookRoutes.js";
import userRoutes from "./routes/userRoutes.js";

app.use("/", bookRoutes);
app.use("/", userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http:localhost:${PORT}`);
});