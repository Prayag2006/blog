import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import Books from "../models/Books.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const connectDB = async () => {
    try {
        let mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            const mongoServer = await MongoMemoryServer.create();
            mongoURI = mongoServer.getUri();
            console.log("Using in-memory MongoDB database.");
        }

        await mongoose.connect(mongoURI);
        console.log('Database connection successfully.!!');

        // Seed default user if empty
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await User.create({
                username: "admin",
                password: hashedPassword
            });
            console.log("Default admin user created: admin / admin123");
        }

        // Seed data if empty
        const count = await Books.countDocuments();
        if (count === 0) {
            await Books.create([
                {
                    title: "The Future of Web Development",
                    description: "Exploring the latest trends in React, Node.js, and AI-driven development.",
                    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
                    price: "Free",
                    author: "Alex Rivera",
                    publish_date: "2024-03-27"
                },
                {
                    title: "Mastering Glassmorphism",
                    description: "How to create stunning UI effects using CSS backdrop-filter and transparency.",
                    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
                    price: "Premium",
                    author: "Sarah Chen",
                    publish_date: "2024-03-25"
                },
                {
                    title: "Node.js Performance Tips",
                    description: "Optimizing your backend for scale with clustering and efficient caching.",
                    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
                    price: "Free",
                    author: "Mike Johnson",
                    publish_date: "2024-03-20"
                }
            ]);
            console.log("Sample blog posts seeded successfully!");
        }
    }
    catch (error) {
        console.log("Database connection failed.!");
        console.error(error);
    }
}

export default connectDB;