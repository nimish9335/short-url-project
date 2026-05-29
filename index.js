require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middleware/auth");
const URL = require("./models/urls");

const urlRoute=require("./routes/url");
const staticRoute=require("./routes/staticRouter");
const userRoute = require("./routes/user");

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
app.use(cookieParser());

// Mount the url creation routes
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

// Dynamic Redirection Handler and Analytic Logging
app.get("/url/:shortId", async (req, res) => {
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

app.get("/analytics/:shortId",urlRoute);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
