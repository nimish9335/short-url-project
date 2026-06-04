const express = require("express");
const URL = require("../models/urls");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const allurls = await URL.find({ createdBy: req.user._id });
        return res.render("home", {
            urls: allurls,
        });
    } catch (err) {
        console.log("Static route error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;