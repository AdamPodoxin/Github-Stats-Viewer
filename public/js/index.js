import * as sFront from "https://adampodoxin.github.io/sFront/sFront.js";

const repoTemplatePath = "../templates/repo.html";

let userInput, reposDiv;

const getUser = () => {
  getApiRequest(`users/${userInput.value}`, (user) => loadUser(user));
};

const loadUser = (user) => {
  const avatarImg = document.getElementById("user-avatar");
  const nameText = document.getElementById("user-name");
  const loginText = document.getElementById("user-login");

  avatarImg.src = user.avatar_url;
  nameText.innerHTML = user.name;
  loginText.innerHTML = user.login;

  Array.from(user.repos).forEach((repo) => {
    const variables = {
      name: repo.name,
      description: repo.description,
      githubURL: repo.html_url,
    };

    sFront.createElementFromTemplate(repoTemplatePath, variables, reposDiv);
  });
};

const loadGithubRepo = (repoURL) => {
  window.open(repoURL, "_blank");
};

window.onload = () => {
  userInput = document.getElementById("get-user-input");
  reposDiv = document.querySelector("#repos");

  sFront.registerFunctionsInWindow({ getUser, loadGithubRepo });
};
