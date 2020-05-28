"use strict";
console.log("SERVER STARTING...");
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");

const router = express.Router();
router.get("/test", (req, res) => {
  res.send("Hello.");
});

app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

module.exports = app;
module.exports.handler = serverless(app);
