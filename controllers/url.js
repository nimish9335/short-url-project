const shortid = require("shortid");
const URL = require("../models/urls");

async function handleGenerateNewShortURL(req, res) {
    try {
        const { url } = req.body;
        if (!url)
            return res.status(400).json({ error: "URL parameter is required" });

        const generatedId = shortid.generate();
        await URL.create({
            shortId: generatedId,
            redirectURL: url,
            visitHistory: [],
            createdBy: req.user._id,
        });

        return res.redirect("/");
    } catch (err) {
        console.log("URL generation error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function handleRedirectShortURL(req, res) {
    try {
        const { shortId } = req.params;
        const entry = await URL.findOneAndUpdate(
            { shortId },
            { $push: { visitHistory: { timestamp: Date.now() } } },
            { new: true }
        );
        if (!entry)
            return res.status(404).json({ error: "Short URL not found" });

        return res.redirect(entry.redirectURL);
    } catch (err) {
        console.log("Redirect error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function handleGetAnalytics(req, res) {
    try {
        const { shortId } = req.params;
        const result = await URL.findOne({ shortId });
        if (!result)
            return res.status(404).json({ error: "Short URL not found" });

        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
        });
    } catch (err) {
        console.log("Analytics error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    handleGenerateNewShortURL,
    handleRedirectShortURL,
    handleGetAnalytics,
};