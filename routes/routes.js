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

    app.get("/get-exercise-order", (req, res) => {
        connection.query(
            'SELECT * FROM WORKOUT_X_ORDER ORDER BY order_id ASC',
            function(err, results, fields){
                if (err){
                    console.log(err);
                    return;
                }
                res.status(200).send(results);
            }
        );
    });

    app.get("/get-most-recent-id", (req, res) => {
        connection.query(
            'SELECT workout_id FROM WORKOUT ORDER BY workout_id DESC LIMIT 1',
            function(err, results, fields){
                if(err){
                    console.log(err);
                    return;
                }
                // should only be 1 result, so sending first index of array of results from db
                res.status(200).send(results[0]);
            }
        )
    });
}