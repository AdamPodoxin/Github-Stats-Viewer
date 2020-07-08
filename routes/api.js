const express = require("express");
const router = express.Router();

const https = require("https");

router.get("/", (req, res) => {
  const path = req.originalUrl.replace("/api/", "");
  const url = `https://api.github.com/${path}`;

  const options = {
    headers: {
      "User-Agent": "AdamPodoxin",
    },
  };

  const callback = (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    });
  };

  https.get(url, options, callback).on("error", (err) => console.error(err));
});

module.exports = router;
