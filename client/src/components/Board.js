import React, { Component } from 'react';
import $ from 'jquery';
import Exercise from './Exercise';
import "./css/Board.css"
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boardEditMode: false,
            exerciseData: {},
            exerciseOrder: [],
            mostRecentId: 0,
            showAddExercise: false
        }

        this.addExercise = this.addExercise.bind(this);
        this.moveExercise = this.moveExercise.bind(this);
        this.toggleBoardEditMode = this.toggleBoardEditMode.bind(this);
        this.toggleShowAddExercise = this.toggleShowAddExercise.bind(this);
        this.updateExerciseInfo = this.updateExerciseInfo.bind(this);
    }

    componentDidMount() {
        console.log("Component Did Mount, getting Data")
        $.get("/get-exercise-data").then(res => {
            this.setState({ exerciseData: res });
            // console.log("Exercise data API request complete");
        }).then($.get("/get-exercise-order").then(res => {
            this.setState({ exerciseOrder: res.order });
            // console.log("Order API request complete");
        })).then($.get("/get-most-recent-id").then(res => {
            this.setState({ mostRecentId: res.mostRecentId });
            // console.log("Most recent id API request complete");
        }))
    }


    addExercise = () => {        
        
        // get values from add exercise modal
        let addExerciseName = document.getElementsByClassName("addExerciseNameInput")[0].value;
        let addExerciseSets = parseInt(document.getElementsByClassName("addExerciseSetsInput")[0].value);
        let addExerciseReps = parseInt(document.getElementsByClassName("addExerciseRepsInput")[0].value);
        let addExerciseWeight = parseInt(document.getElementsByClassName("addExerciseWeightInput")[0].value);
        let addExerciseCategory = document.getElementsByClassName("addExerciseCategoryInput")[0].value;

        // increment the Id from most recent Id variable, since the most recent one is the last one in use
        let newExerciseId = this.state.mostRecentId + 1;

        // put new values in object
        let newExercise = {
            "name": addExerciseName,
            "sets": addExerciseSets,
            "reps": addExerciseReps,
            "weight": addExerciseWeight,
            "category": addExerciseCategory
        };

        // create a temporary variable to hold all exercise data, then add newExercise with the newExerciseId as the field
        let tempExerciseData = this.state.exerciseData;
        tempExerciseData[String(newExerciseId)] = newExercise;

        // create a temporary variable to hold exercise order, add new exercise to end
        let tempExerciseOrder = this.state.exerciseOrder;
        tempExerciseOrder.push(newExerciseId);

        // set the state values to the temp variables (which have the new exercise added)
        this.setState({exerciseData: tempExerciseData});
        this.setState({exerciseOrder: tempExerciseOrder});

        // update the most recent exercise Id
        this.setState({mostRecentId: newExerciseId});
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
                    }
            }
            this.setState({ exerciseOrder: newOrder });
        }
    }

    // turns edit mode on and off at board level. When true, no buttons can be moved and no other edit modes can be started
    toggleBoardEditMode = () => {
        this.setState({ boardEditMode: !this.state.boardEditMode });
    }

    // shows add exercise modal when true (is toggled by add exercise button)
    toggleShowAddExercise = () => {
        this.setState({ showAddExercise: !this.state.showAddExercise });
    }

    // passed into each exercise component via props, is accessed by edit mode save button
    updateExerciseInfo = (event) => {
        let isDelete = event.target.dataset.delete;
        let exerciseId = event.target.dataset.exerciseid;
        let tempExerciseData = this.state.exerciseData;
        // check if the update is for deleting exercise
        console.log("updatedExerciseInfo reached");
        if (isDelete) {
            // create temp variables or data and info, remove the related info and order for exerciseId being deleted, set temps with exercise removed to state
            let tempOrder = this.state.exerciseOrder;
            let deleteOrderIndex = tempOrder.indexOf(parseInt(exerciseId));
            delete tempExerciseData[exerciseId];
            tempOrder.splice(deleteOrderIndex, 1);
            this.setState({ exerciseData: tempExerciseData });
            this.setState({ exerciseOrder: tempOrder });
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
                weight: (newExerciseWeight !== "" && newExerciseWeight !== null ? parseInt(newExerciseWeight) : this.state.exerciseData[exerciseId].weight)
            }
            tempExerciseData[exerciseId.toString()] = tempNewExerciseObj;
            this.setState({ exerciseData: tempExerciseData });
        }
    }

    render() {
        return (
            <div className="exerciseBoard container">
                <div className="row">
                    <button type="button" className="btn btn-danger exerAddButton col-9" onClick={this.toggleShowAddExercise}>Add Exercise</button>
                </div>
                {this.state.exerciseOrder.map(exercisePosition => {
                    let exercise = this.state.exerciseData[exercisePosition];
                    return (
                        <div className="row">
                            <Exercise name={exercise.name}
                                sets={exercise.sets}
                                reps={exercise.reps}
                                weight={exercise.weight}
                                category={exercise.category}
                                exerciseId={exercisePosition}
                                moveExercise={this.moveExercise}
                                updateExerciseInfo={this.updateExerciseInfo}
                                toggleBoardEditMode={this.toggleBoardEditMode}
                                boardEditMode={this.state.boardEditMode}
                                key={exercisePosition} />
                        </div>
                    )
                })
                }
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
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-success" onClick={event => { this.toggleShowAddExercise(); this.addExercise(); }}>Add</button>
                        <button type="button" className="btn btn-danger" onClick={this.toggleShowAddExercise}>Cancel</button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default Board;