const express = require("express");
const bodyParser = require("body-parser");

const PORT = 5000 || process.env.PORT;

const app = express().listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);
