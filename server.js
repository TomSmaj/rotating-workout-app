const config = require('./config.js');
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

console.log('are we in production?', config.NODE_ENV)

app.get('*', (req, res) => {
    res.redirect(config.CLOUDFRONT_DIST_DOMAIN);
    // or serve an HTML that points to your CloudFront distribution
    // res.sendFile(path.join(__dirname, 'path_to_html_pointing_to_cloudfront.html'));
  });

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));