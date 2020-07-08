const socket = io();

let userInput;

window.onload = () => {
  userInput = document.getElementById("get-user-input");
};

socket.on("return user", (data) => {
  console.log(data);
});

const getUser = () => {
  socket.emit("get user", userInput.value);
};
