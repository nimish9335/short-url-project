const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const secretKey = "Nimish@123";

function setUser(user) {
    const token = jwt.sign({ 
        id: user.id, 
        email: user.email
        }, secretKey);
    return token;
}

function getUser(token) {
    try{
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        return null;
    }
}

module.exports = {
    setUser,
    getUser,
};