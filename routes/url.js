const express = require("express");
const { handleGenerateNewShortURL, handleGetAnalytics, handleRedirectShortURL } = require("../controllers/url");
const router = express.Router();

// Short URL create karo
router.post("/", handleGenerateNewShortURL);

// Short URL se redirect karo
router.get("/:shortId", handleRedirectShortURL);

// Analytics dekho
router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;