const shortid = require("shortid");
const URL = require("../models/urls");

async function handleGenerateNewShortURL(req, res) {
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
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  if (!result)
    return res.status(404).json({ error: "Requested short ID not found" });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
