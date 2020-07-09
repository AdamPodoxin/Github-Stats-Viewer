const express = require("express");
const router = express.Router();

const https = require("https");

const User = require("../Models/user.js");
const Repo = require("../Models/repo.js");

const getHttpRequest = (url, onFinish) => {
  const options = {
    headers: {
      "User-Agent": "AdamPodoxin",
      Accept: "application/vnd.github.mercy-preview+json",
      Authorization: "token 99846f49b965fb742535790e25a8a288ab9d06de",
    },
  };

  const callback = (response) => {
    let data = "";

    response.on("data", (chunk) => (data += chunk));
    response.on("end", () => {
      const jsonData = JSON.parse(data);
      onFinish(jsonData);
    });
  };

  https.get(url, options, callback).on("error", (err) => console.error(err));
};

router.get("/", (req, res) => {
  const user = req.originalUrl.replace("/api/users/", "");
  const url = `https://api.github.com/users/${user}`;

  getHttpRequest(url, (userData) => {
    const user = new User(
      userData.avatar_url,
      userData.login,
      userData.name,
      userData.html_url,
      []
    );

    getHttpRequest(userData.repos_url, (reposData) => {
      getHttpRequest(`${url}/starred`, (starredData) => {
        const starredRepos = starredData.map((starredRepo) => starredRepo.name);

        const reposPromise = new Promise((resolve, reject) => {
          reposData.forEach((repo) => {
            getHttpRequest(repo.languages_url, (languagesData) => {
              const newRepo = new Repo(
                repo.id,
                repo.node_id,
                repo.name,
                repo.description,
                repo.html_url,
                repo.topics,
                languagesData,
                starredRepos.includes(repo.name)
              );
              user.repos.push(newRepo);
              if (user.repos.length >= reposData.length - 1) resolve();
            });
          });
        });

        reposPromise.then(() => {
          res.json(user);
        });
      });
    });
  });
});

module.exports = router;
