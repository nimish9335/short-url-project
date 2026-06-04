const express = require("express");
const router = express.Router();
const {
    handleGenerateNewShortURL,
    handleRedirectShortURL,
    handleGetAnalytics,
} = require("../controllers/url");

router.post("/", handleGenerateNewShortURL);
router.get("/analytics/:shortId", handleGetAnalytics);
router.get("/:shortId", handleRedirectShortURL);

module.exports = router;