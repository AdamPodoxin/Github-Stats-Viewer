const socket = io();

let userInput;

const getUser = () => {
  socket.emit("get user", userInput.value);
};

const loadUser = (user) => {
  const avatarImg = document.getElementById("user-avatar");
  const nameText = document.getElementById("user-name");
  const loginText = document.getElementById("user-login");

  avatarImg.src = user.avatar_url;
  nameText.innerHTML = user.name;
  loginText.innerHTML = user.login;
};

window.onload = () => {
  userInput = document.getElementById("get-user-input");
};

socket.on("return user", (user) => loadUser(user));
