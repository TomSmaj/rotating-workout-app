const config = require("./config.js");
const express = require("express");
const path = require("path");
const port = process.env.PORT || 3001;
const app = express();
const cors = require("cors");

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Define API routes here
require("./routes/routes.js")(app);

console.log("are we in production?", config.NODE_ENV);

app.use(cors());

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.static("./client/build"));
