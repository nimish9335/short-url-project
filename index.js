const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const urlRouter=require("./routes/url");
const staticRouter=require("./routes/staticRouter");
const URL = require("./models/urls");
const app = express();
const PORT = 8001;

// Database Connection Hook
mongoose
  .connect("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("MongoDB connected successfully."));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount the url creation routes
app.use("/url", urlRouter);

app.use("/", staticRouter);

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
