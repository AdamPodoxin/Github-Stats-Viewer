const express = require("express");
const bodyParser = require("body-parser");

const http = require("http");

const PORT = 5000 || process.env.PORT;

const usersRoute = require("./routes/users");

const app = express();
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.use(bodyParser.json());
app.use("/api/users/*", usersRoute);
app.use(express.static("public"));
