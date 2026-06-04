const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "nimish@123";

function setUser(user) {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
        },
        secret,
        { expiresIn: "24h" }
    );
}

function getUser(token) {
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
}

module.exports = { setUser, getUser };