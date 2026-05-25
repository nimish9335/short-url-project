const express = require("express");
const mongoose = require("mongoose");
const urlRouter=require("./routes/url");
const URL = require("./models/urls");
const app = express();
const PORT = 8001;

// Database Connection Hook
mongoose
  .connect("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("MongoDB connected successfully."));

// Middleware Configuration
app.use(express.json());

// Mount the url creation routes
app.use("/url", urlRouter);

// Dynamic Redirection Handler and Analytic Logging
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    },
  );
  if (!entry) return res.status(404).json({ error: "Short URL not found" });
  return res.redirect(entry.redirectURL);
});

app.get("/analytics/:shortId",urlRouter);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
