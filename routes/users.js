const express = require("express");
const router = express.Router();

const fetch = require("node-fetch");

const User = require("../Models/user.js");
const Repo = require("../Models/repo.js");

const { token } = require("../private_data.js");

const headers = {
  Authorization: token,
  Accept: "application/vnd.github.mercy-preview+json",
};
const parameters = { method: "GET", headers };

router.get("/", (req, res) => {
  const user = req.originalUrl.replace("/api/user=", "");
  const url = `https://api.github.com/users/${user}`;

  fetch(url, parameters).then((userData) =>
    userData.json().then((userJson) => {
      let user = new User(
        userJson.avatar_url,
        userJson.login,
        userJson.name,
        userJson.html_url,
        []
      );

      fetch(userJson.repos_url, parameters).then((reposData) =>
        reposData.json().then((reposJson) => {
          fetch(`${url}/starred`, parameters).then((starredData) => {
            starredData.json().then((starredJson) => {
              let starredRepos = starredJson.map(
                (starredRepo) => starredRepo.name
              );

              new Promise((resolve, reject) => {
                reposJson.forEach((repo) => {
                  fetch(repo.languages_url, parameters).then((languagesData) =>
                    languagesData.json().then((languagesJson) => {
                      let newRepo = new Repo(
                        repo.id,
                        repo.node_id,
                        repo.name,
                        repo.description,
                        repo.html_url,
                        repo.topics,
                        languagesJson,
                        starredRepos.includes(repo.name)
                      );

                      user.repos.push(newRepo);
                      if (user.repos.length >= reposJson.length - 1) resolve();
                    })
                  );
                });
              }).then(() => res.json(user));
            });
          });
        })
      );
    })
  );
});

module.exports = router;
