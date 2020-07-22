const express = require("express");
const router = express.Router();

const fetch = require("node-fetch");

const User = require("../Models/user.js");
const Repo = require("../Models/repo.js");

const { client_id, client_secret } = require("../private_data.js");
const auth = `client_id=${client_id}&client_secret=${client_secret}`;

router.get("/", (req, res) => {
  const user = req.originalUrl.replace("/api/user=", "");
  const url = `https://api.github.com/users/${user}`;

  fetch(`${url}?${auth}`).then((userData) =>
    userData.json().then((userJson) => {
      let user = new User(
        userJson.avatar_url,
        userJson.login,
        userJson.name,
        userJson.html_url,
        []
      );

      fetch(`${userJson.repos_url}?${auth}`).then((reposData) =>
        reposData.json().then((reposJson) => {
          fetch(`${url}/starred?${auth}`).then((starredData) => {
            starredData.json().then((starredJson) => {
              let starredRepos = starredJson.map(
                (starredRepo) => starredRepo.name
              );

              new Promise((resolve, reject) => {
                reposJson.forEach((repo) => {
                  fetch(`${repo.languages_url}?${auth}`).then((languagesData) =>
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
