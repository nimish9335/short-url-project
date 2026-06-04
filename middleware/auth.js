const { getUser } = require("../service/auth");

function checktoauthentication(req, res, next) {
    const cookieToken = req.cookies?.token;
    const authHeader = req.headers["authorization"];
    const token = cookieToken || authHeader;

    if (!token) return res.redirect("/user/login");

    const user = getUser(token);
    if (!user) return res.redirect("/user/login");

    req.user = user;
    next();
}

function checktoauthorization(...roles) {
    return function(req, res, next) {
        const user = req.user;
        if (!user) return res.redirect("/user/login");
        if (!roles.includes(user.role)) {
            return res.status(403).json({ error: "Forbidden - insufficient permissions" });
        }
        next();
    };
}

module.exports = { checktoauthentication, checktoauthorization };