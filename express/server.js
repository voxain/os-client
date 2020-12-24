"use strict";
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const APIURL = "https://phlameos-server.glitch.me/";
const axios = require("axios");

const router = express.Router();
app.use(bodyParser.json());

router.post("/fetchFiles", (req, res) => {
  console.log(req.body);
  axios
    .post(APIURL + "fetchFiles", req.body)
    .then((resp) => {
      res.send(resp.data || {});
    })
    .catch((error) => {
      console.error(error);
    });
});
router.post("/login", (req, res) => {
  axios
    .post(APIURL + "login", req.body)
    .then((resp) => {
      res.send(resp.data || {});
    })
    .catch((error) => {
      console.error(error);
    });
});

app.use("/.netlify/functions/server", router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
