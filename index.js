require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checktoauthentication, checktoauthorization } = require("./middleware/auth");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 8001;

mongoose
    .connect("mongodb://127.0.0.1:27017/short-url")
    .then(() => console.log("MongoDB connected successfully."))
    .catch((err) => console.log("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/user", userRoute);
app.use("/url", checktoauthentication, checktoauthorization("NORMAL", "ADMIN"), urlRoute);
app.use("/", checktoauthentication, staticRoute);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));