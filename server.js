const express = require("express");
const bodyParser = require("body-parser");

const usersRoute = require("./routes/users");

const app = express();
app.listen(process.env.PORT || 5000);

app.use(bodyParser.json());
app.use("/api/users/*", usersRoute);
app.use(express.static("public"));
