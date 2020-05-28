"use strict";
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

const router = express.Router();
router.get("/script.js", (req, res) => {
  res.send(String(fs.readFileSync("/script.js")));
  fs.readFileSync("./script.js");
  fs.readFileSync("/script.js");
  fs.readFileSync("script.js");
  fs.readFileSync("express/script.js");
  fs.readFileSync("/express/script.js");
  fs.readFileSync(__dirname + "express/script.js");
});

app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
