import React, { Component } from 'react';
import $ from 'jquery';
import Exercise from './Exercise';
import "./css/Board.css"
import Modal from 'react-bootstrap/Modal';


class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boardEditMode: false,
            exerciseData: {
                "0": {
                    name: "name",
                    sets: 0,
                    reps: 0,
                    weight: 0,
                    category: "category",
                    workout_id: 0
                }
            },
            exerciseOrder: [0],
            showAddExercise: false
        }

        this.addExercise = this.addExercise.bind(this);
        this.moveExercise = this.moveExercise.bind(this);
        this.toggleBoardEditMode = this.toggleBoardEditMode.bind(this);
        this.toggleShowAddExercise = this.toggleShowAddExercise.bind(this);
        //this.updateBoard = this.updateBoard.bind(this);
        this.updateExerciseInfo = this.updateExerciseInfo.bind(this);
        this.updateOrderInDb = this.updateOrderInDb.bind(this);
    }

    componentDidMount() {
        console.log("Component Did Mount, getting Data")
        $.get("/get-exercise-data").then(res => {
            // res is an array of objects for each exercise, the fields for each being the individual columns from the WORKOUT table
            let tempObj = {};
            for (let exercise in res) {
                tempObj[res[exercise].workout_id] = res[exercise];
            }
            this.setState({ exerciseData: tempObj })
        });
        $.get("/get-exercise-order").then(res => {
            // results are returned ordered by order_id ascending. Step through results and append workout_id to order array
            // res is an array of objects for each exercise, each containing workout_id and order_id field
            let tempOrder = [];
            for (let exercise in res) {
                tempOrder.push(res[exercise].workout_id);
            }
            this.setState({ exerciseOrder: tempOrder });
        });
    }

    // gets exercise info and exercise data from table and sets it to state
    // intended to be called after any change to the DB is made to reflect any changes that have been made
    updateBoard() {
        console.log("Updating board.");
        $.get("/get-exercise-data").then(res => {
            // res is an array of objects for each exercise, the fields for each being the individual columns from the WORKOUT table
            let tempObj = {};
            for (let exercise in res) {
                tempObj[res[exercise].workout_id] = res[exercise];
            }
            this.setState({ exerciseData: tempObj })
        });
        $.get("/get-exercise-order").then(res => {
            // results are returned ordered by order_id ascending. Step through results and append workout_id to order array
            // res is an array of objects for each exercise, each containing workout_id and order_id field
            let tempOrder = [];
            for (let exercise in res) {
                tempOrder.push(res[exercise].workout_id);
            }
            this.setState({ exerciseOrder: tempOrder });
        });
    }

    addExercise = () => {

        // get values from add exercise modal
        let addExerciseName = document.getElementsByClassName("addExerciseNameInput")[0].value;
        let addExerciseSets = parseInt(document.getElementsByClassName("addExerciseSetsInput")[0].value);
        let addExerciseReps = parseInt(document.getElementsByClassName("addExerciseRepsInput")[0].value);
        let addExerciseWeight = parseInt(document.getElementsByClassName("addExerciseWeightInput")[0].value);
        let addExerciseCategory = document.getElementsByClassName("addExerciseCategoryInput")[0].value;

        // check to see if name is a string, the number values are infact numbers, and the blank dropdown option was not chosen
        let isNameValid = typeof addExerciseName === 'string' && addExerciseName !== "";
        let isSetsValid = !isNaN(addExerciseSets);
        let isRepsValid = !isNaN(addExerciseReps);
        let isWeightValid = !isNaN(addExerciseWeight);
        let isCategoryValid = addExerciseCategory !== "blank";

        // perform exercise addition if all above 5 varaible are true
        if (isNameValid && isSetsValid && isRepsValid && isWeightValid && isCategoryValid) {
            let newOrderId = this.state.exerciseOrder.length;

            // put new values in object
            let newExercise = {
                "name": addExerciseName,
                "sets": addExerciseSets,
                "reps": addExerciseReps,
                "weight": addExerciseWeight,
                "category": addExerciseCategory,
                "newOrderId": newOrderId
            };

            // make API call to add-exercise (provide exercise info and new order_id)
                $.post('/add-exercise', newExercise).then(res => {
                    console.log("reached 'then' of add exercise");                    
                    this.updateBoard();
                });
                        
            this.toggleShowAddExercise();
            
        }
        else {
            document.getElementsByClassName("addExerciseErrorMessage")[0].innerHTML = "Invalid input";
        }
    }

    // this function is passed down to exercise components via props
    // direction to move and the ID (index in order array) of exercise is taken from data attributes on target that is clicked
    moveExercise = (event) => {
        // do not allow a an exercise to be moved if boardEditMode is true (which should only be true when one exercise edit mode is true)
        if (!this.state.boardEditMode) {
            let direction = event.target.dataset.direction;
            let exerciseId = parseInt(event.target.dataset.exerciseid);
            let currentOrder = this.state.exerciseOrder;
            let newOrder = currentOrder;

            // find what position of currentOrder the selected exercise is at
            let position = 0;
            for (let index in currentOrder) {
                if (currentOrder[index] === exerciseId) {
                    position = parseInt(index);
                    break;
                }
            }

            switch (direction) {
                case 'done':
                    // get value for exercise that has been clicked, will assign it to last index of order array
                    let positionValue = currentOrder[position];
                    let lastIndex = currentOrder.length - 1;
                    let found = false;
                    // don't perform move if exercise clicked is the last exercise
                    if (position !== lastIndex) {
                        for (let index = 0; index < currentOrder.length; index++) {
                            // when we arrive at the position of the exercise that was clicked, change found to true and set position of done exercise in NewOrder to the exercise following the done exercise
                            if (index === position) {
                                found = true;
                                newOrder[index] = currentOrder[index + 1];
                            }
                            // until the position where the clicked exercise is reached, newOrder is the same as old order
                            else if (!found && index !== lastIndex) {
                                newOrder[index] = currentOrder[index];
                            }
                            // after position of clicked exercise has been reached, each newOrder spot is equal to currentOrder position + 1
                            else if (found && index !== lastIndex) {
                                newOrder[index] = currentOrder[index + 1];
                            }
                            // at the last position, assign the done exercise, which was saved in positionValue
                            else if (index === lastIndex) {
                                newOrder[index] = positionValue;
                            }
                            else {
                                break
                            }
                        }
                        this.updateOrderInDb(newOrder, direction, position);
                    }
                    break;
                // if the case isn't done, then it is either up or down
                default:
                    // if the up button has been pressed and the exercise is at the top, or if the down button is pressed and the exercise is at the bottom, nothing should happen                
                    if ((direction === 'up' && exerciseId === currentOrder[0]) || (direction === 'down' && exerciseId === currentOrder[currentOrder.length - 1])) {
                        break;
                    }
                    else {
                        let firstValue, secondValue;
                        // switch the 2 indexes being moved, either position and the index before it for up, or position and the index after it for down
                        if (direction === "up") {
                            firstValue = currentOrder[position - 1];
                            secondValue = currentOrder[position];
                            newOrder[position] = firstValue;
                            newOrder[position - 1] = secondValue;
                        }
                        else if (direction === "down") {
                            firstValue = currentOrder[position + 1];
                            secondValue = currentOrder[position];
                            newOrder[position] = firstValue;
                            newOrder[position + 1] = secondValue;
                        }
                        else {
                            break;
                        }
                        this.updateOrderInDb(newOrder, direction, position);
                    }
            }
        }
    }

    // turns edit mode on and off at board level. When true, no buttons can be moved and no other edit modes can be started
    toggleBoardEditMode = () => {
        this.setState({ boardEditMode: !this.state.boardEditMode });
    }

    // shows add exercise modal when true (is toggled by add exercise button)
    toggleShowAddExercise = () => {
        if (!this.state.boardEditMode) {
            this.setState({ showAddExercise: !this.state.showAddExercise });
        }
    }

    // passed into each exercise component via props, is accessed by edit mode save button
    // also where exercise is deleted
    updateExerciseInfo = (event) => {
        let isDelete = event.target.dataset.delete;
        let exerciseId = event.target.dataset.exerciseid;
        let tempExerciseData = this.state.exerciseData;
        // check if the update is for deleting exercise
        console.log("updateExerciseInfo reached");
        if (isDelete) {
            // create temp variables or data and info, remove the related info and order for exerciseId being deleted, set temps with exercise removed to state            
            let tempOrder = this.state.exerciseOrder;
            let deleteOrderIndex = tempOrder.indexOf(parseInt(exerciseId));
            let deleteObject = {
                "deleteWorkoutId": exerciseId,
                "deleteOrderId": deleteOrderIndex
            }

            $.post("/delete-exercise-by-id", deleteObject).then(res => {
                this.updateBoard();
            });
        }
        else {
            let newExerciseName = document.getElementsByClassName("exerciseNameInput-" + exerciseId)[0].value;
            let newExerciseSets = document.getElementsByClassName("exerciseSetsInput-" + exerciseId)[0].value;
            let newExerciseReps = document.getElementsByClassName("exerciseRepsInput-" + exerciseId)[0].value;
            let newExerciseWeight = document.getElementsByClassName("exerciseWeightInput-" + exerciseId)[0].value;
            let tempNewExerciseObj = {
                name: (newExerciseName !== "" && newExerciseName !== null ? newExerciseName : this.state.exerciseData[exerciseId].name),
                sets: (newExerciseSets !== "" && newExerciseSets !== null ? parseInt(newExerciseSets) : this.state.exerciseData[exerciseId].sets),
                reps: (newExerciseReps !== "" && newExerciseReps !== null ? parseInt(newExerciseReps) : this.state.exerciseData[exerciseId].reps),
                weight: (newExerciseWeight !== "" && newExerciseWeight !== null ? parseInt(newExerciseWeight) : this.state.exerciseData[exerciseId].weight),
                category: this.state.exerciseData[exerciseId].category,
                workout_id: exerciseId
            }
            tempExerciseData[exerciseId.toString()] = tempNewExerciseObj;

            $.post('/update-exercise-info', tempNewExerciseObj).then(res => {
                this.updateBoard();
            });

        }
    }

    // called from moveExercise(), writes new order of exercise to the database after an exercise has been moved up or down
    updateOrderInDb = (newOrder, direction, position) => {
        let updateObj = {};
        if (direction === "done") {
            console.log(newOrder);
            console.log(newOrder[position]);
            updateObj = {
                'newOrder': newOrder,
                'position': position,
            }
            $.post('/update-exercise-order-done', updateObj).then(res => {
                this.updateBoard();
            });
        }
        // direction is up or down
        else {
            // if the move is up, then position and position - 1 is where the switch has occurred and are the indexes to send to the db
            // if the move is down, then the position and position + 1 is where the switch has occurred
            if (direction === "up") {
                console.log("position decremeneted");
                position = position - 1;
            }
            updateObj = {
                'first_workout_id': newOrder[position],
                'second_workout_id': newOrder[position + 1],
                'first_order_id': position,
                'second_order_id': position + 1
            }
            console.log("update object: ");
            console.log(updateObj);
            $.post('/update-exercise-order-up-or-down', updateObj).then(res => {
                this.updateBoard();
            });
        }
    }

    render() {
        return (
            <div className="exerciseBoard">
                <div className="container">
                    <div className="row">
                        <button type="button" className="btn btn-danger exerAddButton col-9" onClick={this.toggleShowAddExercise}>Add Exercise</button>
                    </div>

                    {/* using a single line if operator thing ( expression ? A : B) */}
                    {/* if either of the default values exist (exerciseData[0] or this.state.exerciseOrder[0] === 0, which are set in state), display only exerciseData[0] */}
                    {/* if that condition is not true, perform map function over state data */}
                    {/* the purpose of this is to use the default values until both exerciseData and exerciseOrder have loaded, at which point the map function is used */}
                    {/* But, if exerciseData has loaded, and exerciseOrder hasn't, hard coded values will be displayed until Data and Order are loaded*/}

                    {(this.state.exerciseData[0] || this.state.exerciseOrder[0] === 0) ?
                        <div className="row">
                            <Exercise name={"name"}
                                sets={0}
                                reps={0}
                                weight={0}
                                category={"category"}
                                exerciseId={0}
                                moveExercise={this.moveExercise}
                                updateExerciseInfo={this.updateExerciseInfo}
                                toggleBoardEditMode={this.toggleBoardEditMode}
                                boardEditMode={this.state.boardEditMode}
                                key={0} />
                        </div>

                        :

                        this.state.exerciseOrder.map(exercisePosition => {
                            let exercise = this.state.exerciseData[exercisePosition];
                            return (
                                <div className="row">
                                    <Exercise name={exercise.name}
                                        sets={exercise.sets}
                                        reps={exercise.reps}
                                        weight={exercise.weight}
                                        category={exercise.category}
                                        exerciseId={exercise.workout_id}
                                        moveExercise={this.moveExercise}
                                        updateExerciseInfo={this.updateExerciseInfo}
                                        toggleBoardEditMode={this.toggleBoardEditMode}
                                        boardEditMode={this.state.boardEditMode}
                                        key={exercisePosition} />
                                </div>
                            )
                        })}

                    <Modal className="addExerciseModal" show={this.state.showAddExercise}>
                        <Modal.Header>
                            <Modal.Title>Add Exercise</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="addExercise col-9">
                                {/* Exercise Name */}
                                <div className="row">
                                    <span> Name: <input type="text" className={"addExerciseNameInput"} /></span>
                                </div>
                                {/* Reps, sets, and weight */}
                                <div className="row">
                                    <div className="col">
                                        <div className="row">
                                            <span> Sets:  <input type="text" size="4" className={"addExerciseSetsInput"} /></span>
                                        </div>
                                        <div className="row">
                                            <span> Reps:  <input type="text" size="4" className={"addExerciseRepsInput"} /></span>
                                        </div>
                                        <div className="row">
                                            <span> Weight:  <input type="text" size="4" className={"addExerciseWeightInput"} /></span>
                                        </div>
                                        <div className="row">
                                            <span> Category: <select className="addExerciseCategoryInput" name="Category">
                                                <option value="blank"></option>
                                                <option value="arm">Arm</option>
                                                <option value="back">Back</option>
                                                <option value="cardio">Cardio</option>
                                                <option value="chest">Chest</option>
                                                <option value="core">Core</option>
                                                <option value="leg">Leg</option>
                                                <option value="other">Other</option>
                                            </select> </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="row addExerciseErrorMessage"></div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="button" className="btn btn-success" onClick={this.addExercise}>Add</button>
                            <button type="button" className="btn btn-danger" onClick={this.toggleShowAddExercise}>Cancel</button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        )
    }
}

export default Board;