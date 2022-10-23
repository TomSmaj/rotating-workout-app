const express = require("express");
const path = require("path");
const port = process.env.PORT || 3001;
const app = express();

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Define API routes here
require("./routes/routes.js")(app);

console.log('are we in production?', process.env.NODE_ENV)

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.static("./client/build"));