import * as sFront from "https://adampodoxin.github.io/sFront/sFront.js";

const repoTemplatePath = "../templates/repo.html",
  topicCardTemplatePath = "../templates/topicCard.html";

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

  reposDiv.innerHTML = "";

  Array.from(user.repos).forEach((repo) => {
    let attributes = {
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      topics: repo.topics,
    };

    let newRepo = document.createElement("github-repo");
    newRepo.setAttribute(
      "name",
      attributes.name == null ? "" : attributes.name
    );
    newRepo.setAttribute(
      "description",
      attributes.description == null ? "" : attributes.description
    );
    newRepo.setAttribute(
      "html_url",
      attributes.html_url == null ? "" : attributes.html_url
    );

    if (attributes.topics.length > 0) {
      newRepo.setAttribute("topics", attributes.topics.join());
    }

    reposDiv.appendChild(newRepo);
  });

  sFront.scanForElements("github-repo");
  setTimeout(() => {
    let repos = document.getElementsByTagName("github-repo");

    Array.from(repos).forEach((repo) => {
      let topics = repo.getAttribute("topics");

      if (topics != null) {
        Array.from(topics.split(",")).forEach((topic) => {
          let topicCard = document.createElement("topic-card");
          topicCard.setAttribute("topic", topic);

          repo.childNodes[0].appendChild(topicCard);
        });
      }
    });

    sFront.scanForElements("topic-card");
  }, 500);
};

const loadGithubRepo = (repoURL) => {
  window.open(repoURL, "_blank");
};

window.onload = () => {
  userInput = document.getElementById("get-user-input");
  reposDiv = document.querySelector("#repos");

  sFront.registerFunctionsInWindow({ getUser, loadGithubRepo });
  sFront.registerElement(repoTemplatePath, "github-repo");
  sFront.registerElement(topicCardTemplatePath, "topic-card");
};
