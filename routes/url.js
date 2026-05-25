const express = require("express");
 const { handleGenerateNewShortURL, handleGetAnalytics } = require("../controllers/url");

 const router = express.Router();
 
 // Map base POST route for shortening links
 router.post("/", handleGenerateNewShortURL);

 // Map GET route for analytics
 router.get("/analytics/:shortId", handleGetAnalytics);

 module.exports = router;
