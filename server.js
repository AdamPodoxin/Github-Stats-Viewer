const express = require("express");
const bodyParser = require("body-parser");

const http = require("http");
const socketIO = require("socket.io");

const PORT = 5000 || process.env.PORT;

const usersRoute = require("./routes/users");
const apiRoute = require("./routes/api");

const app = express();

const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);

app.use(bodyParser.json());

app.use("/api", apiRoute);
app.use("/api/*", apiRoute);

app.use(express.static("public"));

const io = socketIO(server);

io.on("connection", (socket) => {
  socket.on("get user", (user) => {
    const options = {
      host: "",
      path: `/api/users/${user}`,
      port: PORT,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const callback = (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        const jsonData = JSON.parse(data);
        socket.emit("return user", jsonData);
      });
    };

    http.request(options, callback).end();
  });
});
