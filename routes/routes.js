const fs = require('fs')

// connect to database
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'r00tr00t',
  database: 'rotating_workout',
  port: 3306
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

module.exports = function (app) {
    app.get("/get-exercise-data", (req, res) => {
        fs.readFile('./data/exerciseData.json', 'utf8', (err, jsonString) => {
            if (err) {
                return;
            }
            const exercises = JSON.parse(jsonString);
            res.status(200).send(exercises);
        })
    });

    app.get("/get-exercise-order", (req, res) => {        
        fs.readFile('./data/exerciseOrder.json', 'utf8', (err, jsonString) => {
            if (err) {
                return;
            }
            try {
                const order = JSON.parse(jsonString);
                res.status(200).send(order);
            } catch (err) {
                console.log('Error parsing JSON string:', err);
            }
        })        
    })

    app.get("/get-most-recent-id", (req, res) => {        
        fs.readFile('./data/mostRecentId.json', 'utf8', (err, jsonString) => {
            if (err) {
                return;
            }
            try {
                const mostRecentId = JSON.parse(jsonString);
                res.status(200).send(mostRecentId);
            } catch (err) {
                console.log('Error parsing JSON string:', err);
            }
        })        
    })

    app.get("/get-exercise-data-db", (req, res) => {
        connection.query(
            'SELECT * FROM WORKOUT',
            function(err, results, fields){
                if (err){
                    console.log(err);
                    return;
                }
                res.status(200).send(results);
            }
        );
    });

    app.get("/get-exercise-order-db", (req, res) => {
        connection.query(
            'SELECT * FROM WORKOUT_X_ORDER',
            function(err, results, fields){
                if (err){
                    console.log(err);
                    return;
                }
                res.status(200).send(results);
            }
        );
    });

}