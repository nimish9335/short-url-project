const User = require("../models/user");
const { setUser } = require("../service/auth");
const bcrypt = require("bcryptjs");

async function handleUserSignup(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.render("signup", { error: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("signup", { error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword });

        return res.redirect("/user/login");
    } catch (err) {
        console.log("Signup error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render("login", { error: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.render("login", { error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("login", { error: "Invalid email or password" });
        }

        const token = setUser(user);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.redirect("/");
    } catch (err) {
        console.log("Login error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function handleUserLogout(req, res) {
    try {
        res.clearCookie("token");
        return res.redirect("/user/login");
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { handleUserSignup, handleUserLogin, handleUserLogout };