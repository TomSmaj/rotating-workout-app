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
            'SELECT * FROM WORKOUT_TEST',
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
        connection.query(
            // returning workout_ids in the order of the order_id (i.e. the order they will appear in)
            'SELECT * FROM WORKOUT_X_ORDER_TEST ORDER BY order_id ASC',
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
        connection.query(
            'SELECT workout_id FROM WORKOUT_TEST ORDER BY workout_id DESC LIMIT 1',
            function (err, results, fields) {
                if (err) {
                    console.log(err);
                    return;
                }
                // should only be 1 result, so sending first index of array of results from db
                res.status(200).send(results[0]);
            }
        )
    });

    // UPDATE rotating_workout.WORKOUT_TEST SET name='This is a new name', sets=30, reps=14, weight=300, category='front' WHERE workout_id = 1; 
    app.post("/update-exercise-info", (req, res) => {
        
        let name = req.body.name;
        let sets = (req.body.sets ? req.body.sets : null);
        let reps = (req.body.reps ? req.body.reps : null);;
        let weight = (req.body.weight ? req.body.weight : null);
        let category = req.body.category;
        let workout_id = req.body.workout_id;

        let sql = "UPDATE WORKOUT_TEST SET name= ? , sets= ? , reps= ? , weight= ? , category= ? WHERE workout_id = ?";
        console.log(sql);
        connection.query(sql, [name, sets, reps, weight, category, workout_id], function (err, rows, fields) {
            if (err) {
                console.log(err);
                return;
            }
            res.status(200).send();
        });
    })

    // Board.js will sent workout_id and new order_id of 2 exercises. Send one query to DB to update the order_id of these 2 workouts
    app.post("/update-exercise-order-up-or-down", (req, res) => {        
        let first_workout_id = parseInt(req.body.first_workout_id); 
        let second_workout_id = parseInt(req.body.second_workout_id);
        let first_order_id = parseInt(req.body.first_order_id); 
        let second_order_id = parseInt(req.body.second_order_id);

        let sql = `UPDATE WORKOUT_X_ORDER_TEST
                    SET order_id = (case when workout_id = ? then ?
                                        when workout_id = ? then ?
                                    end)
                        WHERE workout_id in (?, ?);`;
        console.log(sql);                
        connection.query(sql, [first_workout_id, first_order_id, second_workout_id, second_order_id, first_workout_id, second_workout_id], function(err, rows, field){
            if(err){
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

        for(order in newOrder){
            newOrder[order] = parseInt(newOrder[order]);
        }

        let sqlStatement1 = 'UPDATE WORKOUT_X_ORDER_TEST SET order_id = (case when workout_id = ? then ? when workout_id = ? then ?'
        let sqlStatement2 = ' end) WHERE workout_id in (?,?';

        paramArray1 = [newOrder[position], position, newOrder[position + 1], position + 1];
        paramArray2 = [newOrder[position], newOrder[position + 1]];

        // appending to the sql statement strings. In the above we have the first 2 instances hard coded, so starting 2 after the position
        for(let i = position + 2; i < newOrder.length; i++){
            sqlStatement1 += " when workout_id = ? then ?";
            sqlStatement2 += ",?"
            paramArray1.push(newOrder[i]);
            paramArray1.push(i);
            paramArray2.push(newOrder[i]);
        }

        let sql = sqlStatement1 + sqlStatement2 + ");"        
        let paramArray = paramArray1.concat(paramArray2);
        console.log(sql);
        console.log(paramArray);

        connection.query(sql, paramArray, function(err, rows, field){
            if(err){
                console.log(err);
                return;
            }
            res.status(200).send();
        });
    });

    // forseeing that when an exercise is a deleted, the order id of all exercises following that exercise will need to be decremented
    // make 2 separate sql requests from this route, one to delete the exercise, and the other to update the order id of all following exercises
    app.post("/delete-exercise-by-id", (req, res) => {
        // going to need id to delete, and orderId list
        let newOrder = req.body.newOrder; 
        // position of clicked exercise to be deleted
        let deleteWorkoutId = parseInt(req.body.deleteWorkoutId);
        let deleteOrderId = parseInt(req.body.deleteOrderId);

        let workoutDeleteSql = 'DELETE FROM WORKOUT_TEST WHERE workout_id = ?';
        let orderDeleteSql = 'DELETE FROM WORKOUT_X_ORDER_TEST WHERE workout_id = ?';
        let orderUpdateSql = 'UPDATE WORKOUT_X_ORDER_TEST SET order_id = order_id - 1 WHERE order_id > ?'

        // delete the exercise from the workout table based on the workout id
        connection.query(workoutDeleteSql, deleteWorkoutId, function(err, rows, field){
            if(err){
                console.log(err);
                return;
            }
        });

        // delete the exercise from the order table based on the workout id
        connection.query(orderDeleteSql, deleteOrderId, function(err, rows, field){
            if(err){
                console.log(err);
                return;
            }
        });

        // decrement the order_id of every exercise with order_id > than the one being deleted
        connection.query(orderUpdateSql, deleteOrderId, function(err, rows, field){
            if(err){
                console.log(err);
                return;
            }
            res.status(200).send();
        });
    })
    
}