const express = require("express");
const bodyParser = require("body-parser");

const http = require("http");

const PORT = 5000 || process.env.PORT;

const apiRoute = require("./routes/api");

const app = express();

const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);

app.use(bodyParser.json());

app.use("/api", apiRoute);
app.use("/api/*", apiRoute);

app.use(express.static("public"));
