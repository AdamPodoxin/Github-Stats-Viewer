const express = require("express");
const router = express.Router();

const https = require("https");

const User = require("../Models/user.js");
const Repo = require("../Models/repo.js");

let userAgent = "";

const getHttpRequest = (url, onFinish) => {
  const options = {
    headers: {
      "Content-Type": "application/json",
      "User-Agent": userAgent,
      Authorization: "Basic 680566e09b342cdf1f56ef0224a46533f8792b2c",
    },
  };

  const callback = (response) => {
    let data = "";

    response.on("data", (chunk) => (data += chunk));
    response.on("end", () => {
      try {
        const jsonData = JSON.parse(data);
        onFinish(jsonData);
      } catch (err) {
        console.error(err);
        console.log(data);
      }
    });
  };

  https.get(url, options, callback).on("error", (err) => console.error(err));
};

router.get("/", (req, res) => {
  const user = req.originalUrl.replace("/api/user=", "");
  const url = `https://api.github.com/users/${user}`;

  userAgent = req.get("User-Agent");

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
