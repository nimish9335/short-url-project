const User = require("../models/user");
const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;
    await User.create({
        name,
        email,
        password,
    });
    return res.redirect("/"); // Redirect back to front-end landing dashboard
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
        return res.render("login", {
            error: "Invalid Email Username or Password combination."
        });
    }
    // Allocate session tokens for successful authentication
    const sessionId = setUser(user);
    res.cookie("uid", sessionId); // Store session token via standard browser cookie
    return res.redirect("/");
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
};