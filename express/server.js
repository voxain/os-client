"use strict";
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const APIURL = "http://host.phlamedev.com:6077/";
const axios = require("axios");

const router = express.Router();
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
//router.use(bodyParser.json());
//router.use(bodyParser.urlencoded({ extended: true }));

/*router.get("/script.js", (req, res) => {
  let d = "";
  let file = req.query.fil || "/";
  if (!file.endsWith("/")) {
    d = String(fs.readFileSync(file)) || '""';
  } else {
    d = fs.readdirSync(file);
  }

  res.send(__filename + " " + __dirname + "<br>" + d + "<br>" + process.cwd());
});*/
router.post("/fetchFiles", (req, res) => {
  axios
    .post(APIURL + "fetchFiles", req.body)
    .then((resp) => {
      res.json(resp || {});
    })
    .catch((error) => {
      console.error(error);
    });
});

app.use("/.netlify/functions/server", router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
