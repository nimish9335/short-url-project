const shortid = require("shortid");
const URL = require("../models/urls");

// Short URL Generate karo
async function handleGenerateNewShortURL(req, res) {
  try {
    const body = req.body;
    if (!body.url)
      return res.status(400).json({ error: "url parameter is required" });

    const generatedId = shortid.generate();
    await URL.create({
      shortId: generatedId,
      redirectURL: body.url,
      visitHistory: [],
      createdBy: req.user._id,
    });

    return res.render("home", {
      id: generatedId,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Short URL se Redirect karo
async function handleRedirectShortURL(req, res) {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: { timestamp: Date.now() },
        },
      }
    );
    if (!entry)
      return res.status(404).json({ error: "Short URL not found" });

    return res.redirect(entry.redirectURL);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Analytics dekho
async function handleGetAnalytics(req, res) {
  try {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    if (!result)
      return res.status(404).json({ error: "Requested short ID not found" });

    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  handleGenerateNewShortURL,
  handleRedirectShortURL,
  handleGetAnalytics,
};