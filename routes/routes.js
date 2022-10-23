const fs = require('fs')

module.exports = function (app) {
    app.get("/get-exercise-data", (req, res) => {        
        fs.readFile('./data/exerciseData.json', 'utf8', (err, jsonString) => {
            if (err) {
                return;
            }
            try {
                const exercises = JSON.parse(jsonString);
                res.status(200).send(exercises);
            } catch (err) {
                console.log('Error parsing JSON string:', err);
            }
        })

        
    })
}