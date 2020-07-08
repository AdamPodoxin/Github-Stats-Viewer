const express = require("express");
const router = express.Router();

const https = require("https");

const User = require("../Models/user.js");
const Repo = require("../Models/repo.js");

router.get("/", (req, res) => {
  const path = req.originalUrl.replace("/api/", "");
  const url = `https://api.github.com/${path}`;

  const options = {
    headers: {
      "User-Agent": "AdamPodoxin",
      Accept: "application/vnd.github.mercy-preview+json",
    },
  };

  const callback = (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      const jsonData = JSON.parse(data);
      let repos = [];

      https
        .get(jsonData.repos_url, options, (response) => {
          let data = "";

          response.on("data", (chunk) => {
            data += chunk;
          });

          response.on("end", () => {
            const rawRepos = JSON.parse(data);

            Array.from(rawRepos).forEach((repo) => {
              repos.push(
                new Repo(
                  repo.id,
                  repo.node_id,
                  repo.name,
                  repo.description,
                  repo.html_url,
                  repo.languages,
                  repo.topics
                )
              );
            });

            const user = new User(
              jsonData.avatar_url,
              jsonData.login,
              jsonData.name,
              jsonData.html_url,
              repos
            );

            res.json(user);
          });
        })
        .on("error", (err) => console.error(err));
    });
  };

  https.get(url, options, callback).on("error", (err) => console.error(err));
});

module.exports = router;
