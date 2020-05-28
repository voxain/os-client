"use strict";
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

const router = express.Router();
router.get("/script.js", (req, res) => {
  let d = fs.readdirSync("/");
  res.send(__filename + " " + __dirname + "<br>" + d + "<br>" + process.cwd());
});

app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
