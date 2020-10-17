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

router.post("/fetchFiles", (req, res) => {
  return res.send({}); //temp
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
  return res.send({ error: "", token: "token" }); //temp
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
