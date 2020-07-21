import * as sFront from "https://adampodoxin.github.io/sFront/sFront.js";

const repoTemplatePath = "../templates/repo.html",
  topicCardTemplatePath = "../templates/topicCard.html",
  languageCardTemplatePath = "../templates/languageCard.html";

import { colors } from "./languageColors.js";

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
      languages: repo.languages,
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

    let languages = [];
    let languagesTotal = 0;

    for (let key in attributes.languages) {
      languages.push(`${key}_${attributes.languages[key]}`);
      languagesTotal += attributes.languages[key];
    }

    newRepo.setAttribute("languages", languages.join());
    newRepo.setAttribute("languages-total", languagesTotal);

    reposDiv.appendChild(newRepo);
  });

  sFront.scanForElements("github-repo");
  setTimeout(() => {
    let repos = document.getElementsByTagName("github-repo");

    Array.from(repos).forEach((repo) => {
      let languages = repo.getAttribute("languages");

      if (languages != null) {
        Array.from(languages.split(",")).forEach((language) => {
          let languageCard = document.createElement("language-card");

          let languageDetails = language.split("_");
          languageCard.setAttribute("language", languageDetails[0]);
          languageCard.setAttribute("amount", languageDetails[1]);

          repo.childNodes[0].appendChild(languageCard);
        });
      }

      repo.childNodes[0].appendChild(document.createElement("br"));

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
    sFront.scanForElements("language-card");

    setTimeout(() => {
      let languageCards = document.getElementsByTagName("language-card");

      Array.from(languageCards).forEach((card) => {
        let language = card.getAttribute("language");
        let amount = parseInt(card.getAttribute("amount"));

        card.childNodes[0].style.backgroundColor = colors[language].color;

        let parentRepo = card.parentNode.parentNode;
        let languagesTotal = parseInt(
          parentRepo.getAttribute("languages-total")
        );

        let ratio = amount / languagesTotal;

        let width = ratio * 450;

        card.childNodes[0].style.width = width + "px";

        card.childNodes[0].childNodes[0].innerHTML = language;
      });
    }, 500);
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
  sFront.registerElement(languageCardTemplatePath, "language-card");
};
