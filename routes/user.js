const express = require("express");
const router = express.Router();
const {
    handleUserSignup,
    handleUserLogin,
    handleUserLogout,
} = require("../controllers/user");

router.get("/signup", (req, res) => res.render("signup", { error: null }));
router.get("/login", (req, res) => res.render("login", { error: null }));
router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.get("/logout", handleUserLogout);

module.exports = router;