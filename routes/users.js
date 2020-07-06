const express = require("express");
const router = express.Router();

const GitHub = require("github-api");
const gh = new GitHub();

router.get("/", (req, res) => {
  gh.getUser(req.body.user)
    .listRepos()
    .then(({ data: reposJson }) => {
      res.json(reposJson);
    });
});

module.exports = router;
