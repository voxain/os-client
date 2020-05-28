"use strict";
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
var find = require("find");

const router = express.Router();
router.get("/script.js", (req, res) => {
  let d = "";
  let file = req.query.fil || "/";
  if (!file.endsWith("/")) {
    d = String(fs.readFileSync(file)) || '""';
  } else {
    d = fs.readdirSync(file);
  }

  find.file(__dirname, function (files) {
    console.log(files.length);
    res.send(
      __filename +
        " " +
        __dirname +
        "<br>" +
        d +
        "<br>" +
        process.cwd() +
        "<br>" +
        files
    );
  });
});

app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
