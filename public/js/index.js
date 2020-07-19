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
    let newRepo = document.createElement("github-repo");
    newRepo.setAttribute("name", repo.name);
    newRepo.setAttribute("description", repo.description);
    newRepo.setAttribute("github-url", repo.html_url);

    reposDiv.appendChild(newRepo);
  });

  sFront.scanForElements("github-repo");
};

const loadGithubRepo = (repoURL) => {
  window.open(repoURL, "_blank");
};

window.onload = () => {
  userInput = document.getElementById("get-user-input");
  reposDiv = document.querySelector("#repos");

  sFront.registerFunctionsInWindow({ getUser, loadGithubRepo });
  sFront.registerElement(repoTemplatePath, "github-repo");
};
