import bcrypt from "bcrypt";
import User from "../models/user.js";

export const getSignUp = (req, res) => {
    res.render("signup", { error: null });
};

export const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.render("signup", { error: "Username and password are required." });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render("signup", { error: "Username already taken." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });
        res.redirect("/login");
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).send("Unable to register user.");
    }
};

export const getLogin = (req, res) => {
    res.render("signin", { error: null });
};

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.render("signin", { error: "Missing username or password." });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.render("signin", { error: "Username or password is incorrect." });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.render("signin", { error: "Username or password is incorrect." });
        }

        res.cookie("userid", user._id.toString(), {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.redirect("/manage-books");
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).send("Unable to login.");
    }
};

export const logoutUser = (req, res) => {
    res.clearCookie("userid");
    res.redirect("/login");
};

