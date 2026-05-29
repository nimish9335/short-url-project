const { getUser } = require("../service/auth");

async function restrictToLoggedinUserOnly(req, res, next) {
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const userUid = authHeader.split("Bearer ")[1];
    if (!userUid) return res.status(401).json({ error: "Unauthorized" });
    const user = getUser(userUid);
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    req.user = user; // Append verified profile metadata straight onto request context
    next();
}

async function checkAuth(req, res, next) {
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        req.user = null; // Explicitly denote unauthenticated status for downstream handlers
        return next();
    }
  const userUid = authHeader.split("Bearer ")[1];
  if (!userUid) return res.status(401).json({ error: "Unauthorized" });
  const user = getUser(userUid);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  req.user = user;
  next();
}

module.exports = {
    restrictToLoggedinUserOnly,
    checkAuth,
};