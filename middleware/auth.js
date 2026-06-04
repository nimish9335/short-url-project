const { getUser } = require("../service/auth");

function checktoauthentication(req, res, next) {
    // pehle header check karo (Postman/API)
    const authHeader = req.headers["authorization"];
    
    // phir cookie check karo (Browser)
    const cookieToken = req.cookies?.token;

    const token = authHeader || cookieToken;

    if (!token) return res.redirect("/user/login");

    const user = getUser(token);
    if (!user) return res.redirect("/user/login");

    req.user = user;
    next();
}


function checktoauthorization(...roles) {
    return function(req, res, next) {
        const user = req.user;
        if (!user) {
            return res.status(403).json({ error: "Forbidden" });
        }
        if (!roles.includes(user.role)) {
            return res.status(403).json({ error: "Forbidden" });
        }
        next();
    };
}

module.exports = {
    checktoauthentication,
    checktoauthorization
};