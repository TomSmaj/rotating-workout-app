const fs = require('fs')

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
}