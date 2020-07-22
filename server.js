const express = require("express");
const bodyParser = require("body-parser");

const usersRoute = require("./routes/users");

const app = express();
let server = app.listen(process.env.PORT || 3000, () => {
  let port = server.address().port;
  console.log("Express is working on port " + port);
});

app.use(bodyParser.json());
app.use("/api/*", usersRoute);
app.use(express.static("public"));
