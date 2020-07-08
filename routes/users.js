const express = require("express");
const router = express.Router();

const https = require("https");

router.get("/", (req, res) => {
  const options = {
    hostname: "https://api.github.com",
    path: `users/${req.body.user}`,
    headers: {
      "User-Agent": "AdamPodoxin",
    },
  };

  https
    .get(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        console.log(data);
      });
    })
    .on("error", (err) => console.error(err));
});

module.exports = router;
