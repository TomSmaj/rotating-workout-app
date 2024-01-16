const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});

module.exports = {
    NODE_ENV : process.env.NODE_ENV,
    CLOUDFRONT_DIST_DOMAIN : process.env.CLOUDFRONT_DIST_DOMAIN,
    DB_HOST : process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD : process.env.DB_PASSWORD,
    DB : process.env.DB, 
    DB_PORT : process.env.DB_PORT,
    WORKOUT_TABLE : process.env.WORKOUT_TABLE,
    WORKOUT_X_ORDER_TABLE : process.env.WORKOUT_X_ORDER_TABLE
}   