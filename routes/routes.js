require("dotenv").config();
const config = require("../config.js");
const DB_HOST = config.DB_HOST;
const DB_USER = config.DB_USER;
const DB_PASSWORD = config.DB_PASSWORD;
const DB = config.DB;
const DB_PORT = config.DB_PORT;
const WORKOUT_TABLE = config.WORKOUT_TABLE;
const WORKOUT_X_ORDER_TABLE = config.WORKOUT_X_ORDER_TABLE;

// connect to database
const mysql = require("mysql2");
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

module.exports = function (app) {
  // pass in exercise info and what the order id should be of the new exercise and enter both into respective tables
  app.post("/add-exercise", (req, res) => {
    let name = req.body.name;
    let sets = req.body.sets ? req.body.sets : null;
    let reps = req.body.reps ? req.body.reps : null;
    let weight = req.body.weight ? req.body.weight : null;
    let category = req.body.category;
    let newOrderId = req.body.newOrderId;
    let paramArray = [name, sets, reps, weight, category, newOrderId];

    let sql1 =
      `INSERT INTO ` +
      WORKOUT_TABLE +
      ` (name, sets, reps, weight, category) VALUES(?, ?, ?, ?, ?);`;
    let sql2 =
      `INSERT INTO ` +
      WORKOUT_X_ORDER_TABLE +
      ` (workout_id, order_id) VALUES(?, ?);`;

    console.log(sql1);
    console.log(paramArray);
    pool.query(sql1, paramArray, function (err, results, fields) {
      if (err) {
        console.log(err);
        return;
      } else {
        // get autoincremented id from WORKOUT table and insert it into WORKOUT_X_ORDER
        let paramArray2 = [results.insertId, newOrderId];
        console.log(sql2);
        console.log(paramArray2);
        pool.query(sql2, paramArray2, function () {
          if (err) {
            console.log(err);
            return;
          }
          res.status(200).send();
        });
      }
    });
  });

  app.get("/get-exercise-data", (req, res) => {
    pool.query(
      "SELECT * FROM " + WORKOUT_TABLE,
      function (err, results, fields) {
        if (err) {
          console.log(err);
          return;
        }
        res.status(200).send(results);
      }
    );
  });

  app.get("/get-exercise-order", (req, res) => {
    pool.query(
      // returning workout_ids in the order of the order_id (i.e. the order they will appear in)
      "SELECT * FROM " + WORKOUT_X_ORDER_TABLE + " ORDER BY order_id ASC",
      function (err, results, fields) {
        if (err) {
          console.log(err);
          return;
        }
        res.status(200).send(results);
      }
    );
  });

  app.get("/get-most-recent-id", (req, res) => {
    pool.query(
      "SELECT workout_id FROM " +
        WORKOUT_TABLE +
        " ORDER BY workout_id DESC LIMIT 1",
      function (err, results, fields) {
        if (err) {
          console.log(err);
          return;
        }
        // should only be 1 result, so sending first index of array of results from db
        res.status(200).send(results[0]);
      }
    );
  });

  // UPDATE rotating_workout.WORKOUT SET name='This is a new name', sets=30, reps=14, weight=300, category='front' WHERE workout_id = 1;
  app.post("/update-exercise-info", (req, res) => {
    let name = req.body.name;
    let sets = req.body.sets ? req.body.sets : null;
    let reps = req.body.reps ? req.body.reps : null;
    let weight = req.body.weight ? req.body.weight : null;
    let category = req.body.category;
    let workout_id = req.body.workout_id;
    let paramArray = [name, sets, reps, weight, category, workout_id];

    let sql =
      "UPDATE " +
      WORKOUT_TABLE +
      " SET name= ? , sets= ? , reps= ? , weight= ? , category= ? WHERE workout_id = ?";
    console.log(sql);
    console.log(paramArray);
    pool.query(sql, paramArray, function (err, results, fields) {
      if (err) {
        console.log(err);
        return;
      }
      res.status(200).send();
    });
  });

  // Board.js will sent workout_id and new order_id of 2 exercises. Send one query to DB to update the order_id of these 2 workouts
  app.post("/update-exercise-order-up-or-down", (req, res) => {
    let first_workout_id = parseInt(req.body.first_workout_id);
    let second_workout_id = parseInt(req.body.second_workout_id);
    let first_order_id = parseInt(req.body.first_order_id);
    let second_order_id = parseInt(req.body.second_order_id);
    let paramArray = [
      first_workout_id,
      first_order_id,
      second_workout_id,
      second_order_id,
      first_workout_id,
      second_workout_id,
    ];

    let sql =
      `UPDATE ` +
      WORKOUT_X_ORDER_TABLE +
      `
                    SET order_id = (case when workout_id = ? then ?
                                        when workout_id = ? then ?
                                    end)
                        WHERE workout_id in (?, ?);`;
    console.log(sql);
    console.log(paramArray);
    pool.query(sql, paramArray, function (err, results, field) {
      if (err) {
        console.log(err);
        return;
      }
      res.status(200).send();
    });
  });

  app.post("/update-exercise-order-done", (req, res) => {
    let newOrder = req.body.newOrder;
    // position of clicked exercise in order array, index for array starts at zero
    let position = parseInt(req.body.position);

    for (order in newOrder) {
      newOrder[order] = parseInt(newOrder[order]);
    }

    let sqlStatement1 =
      "UPDATE " +
      WORKOUT_X_ORDER_TABLE +
      " SET order_id = (case when workout_id = ? then ? when workout_id = ? then ?";
    let sqlStatement2 = " end) WHERE workout_id in (?,?";

    paramArray1 = [
      newOrder[position],
      position,
      newOrder[position + 1],
      position + 1,
    ];
    paramArray2 = [newOrder[position], newOrder[position + 1]];

    // appending to the sql statement strings. In the above we have the first 2 instances hard coded, so starting 2 after the position
    for (let i = position + 2; i < newOrder.length; i++) {
      sqlStatement1 += " when workout_id = ? then ?";
      sqlStatement2 += ",?";
      paramArray1.push(newOrder[i]);
      paramArray1.push(i);
      paramArray2.push(newOrder[i]);
    }

    let sql = sqlStatement1 + sqlStatement2 + ");";
    let paramArray = paramArray1.concat(paramArray2);
    console.log(sql);
    console.log(paramArray);
    pool.query(sql, paramArray, function (err, results, field) {
      if (err) {
        console.log(err);
        return;
      }
      res.status(200).send();
    });
  });

  // forseeing that when an exercise is a deleted, the order id of all exercises following that exercise will need to be decremented
  // make 2 separate sql requests from this route, one to delete the exercise, and the other to update the order id of all following exercises
  app.post("/delete-exercise-by-id", (req, res) => {
    // ids of clicked exercise to be deleted
    let deleteWorkoutId = parseInt(req.body.deleteWorkoutId);
    let deleteOrderId = parseInt(req.body.deleteOrderId);

    let workoutDeleteSql =
      "DELETE FROM " + WORKOUT_TABLE + " WHERE workout_id = ?";
    let orderDeleteSql =
      "DELETE FROM " + WORKOUT_X_ORDER_TABLE + " WHERE workout_id = ?";
    let orderUpdateSql =
      "UPDATE " +
      WORKOUT_X_ORDER_TABLE +
      " SET order_id = order_id - 1 WHERE order_id > ?";

    console.log("deleteWorkoutId: " + deleteWorkoutId);
    console.log("deleteOrderId: " + deleteOrderId);

    // delete the exercise from the workout table based on the workout id
    console.log(workoutDeleteSql);
    console.log(deleteWorkoutId);
    pool.query(
      workoutDeleteSql,
      deleteWorkoutId,
      function (err, results, field) {
        if (err) {
          console.log(err);
          return;
        } else {
          // delete the exercise from the order table based on the workout id
          console.log(orderDeleteSql);
          console.log(deleteWorkoutId);
          pool.query(
            orderDeleteSql,
            deleteWorkoutId,
            function (err, results, field) {
              if (err) {
                console.log(err);
                return;
              } else {
                // decrement the order_id of every exercise with order_id > than the one being deleted
                console.log(orderUpdateSql);
                console.log(deleteOrderId);
                pool.query(
                  orderUpdateSql,
                  deleteOrderId,
                  function (err, results, field) {
                    if (err) {
                      console.log(err);
                      return;
                    }
                    res.status(200).send();
                  }
                );
              }
            }
          );
        }
      }
    );
  });
};
