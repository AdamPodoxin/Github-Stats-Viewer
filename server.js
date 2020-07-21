const express = require("express");
const bodyParser = require("body-parser");

const http = require("http");

const usersRoute = require("./routes/users");

const app = express();
app.listen(5000 || process.env.PORT);

app.use(bodyParser.json());
app.use("/api/users/*", usersRoute);
app.use(express.static("public"));
