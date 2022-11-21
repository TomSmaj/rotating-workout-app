import React, { Component } from 'react';
import $ from 'jquery';
import Exercise from './Exercise';
import "./css/Board.css"

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exerciseData: {},
            exerciseOrder: [],
            boardEditMode: false
        }
        this.moveExercise = this.moveExercise.bind(this);
        this.updateExerciseInfo = this.updateExerciseInfo.bind(this);
        this.toggleBoardEditMode = this.toggleBoardEditMode.bind(this);
    }

    componentDidMount() {
        console.log("Component Did Mount, getting Data")
        $.get("/get-exercise-data").then(res => {
            this.setState({ exerciseData: res });
        }).then($.get("/get-exercise-order").then(res => {
            this.setState({ exerciseOrder: res.order });
            console.log("Data request complete");
        }))
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

    updateExerciseInfo = (event) => {
        console.log("updatedExerciseInfo reached");
        let exerciseId = event.target.dataset.exerciseid;
        let newExerciseName = document.getElementsByClassName("exerciseNameInput-" + exerciseId)[0].value;
        let newExerciseSets = document.getElementsByClassName("exerciseSetsInput-" + exerciseId)[0].value;
        let newExerciseReps = document.getElementsByClassName("exerciseRepsInput-" + exerciseId)[0].value;  
        let newExerciseWeight = document.getElementsByClassName("exerciseWeightInput-" + exerciseId)[0].value;
        console.log(this.state.exerciseData[exerciseId]);
        let tempNewExerciseObj = {
            name: (newExerciseName !== ""  && newExerciseName !== null ? newExerciseName : this.state.exerciseData[exerciseId].name),
            sets: (newExerciseSets !== ""  && newExerciseSets !== null ? parseInt(newExerciseSets) : this.state.exerciseData[exerciseId].sets),
            reps: (newExerciseReps !== ""  && newExerciseReps !== null ? parseInt(newExerciseReps) : this.state.exerciseData[exerciseId].reps),            
            weight: (newExerciseWeight !== ""  && newExerciseWeight !== null ? parseInt(newExerciseWeight) : this.state.exerciseData[exerciseId].weight)
        }
        let tempExerciseData = this.state.exerciseData;
        tempExerciseData[exerciseId.toString()] = tempNewExerciseObj;
        this.setState({exerciseData: tempExerciseData});        
    }

    toggleBoardEditMode = () => {
        this.setState({ boardEditMode: !this.state.boardEditMode });
    }

    render() {
        return (
            <div className="exerciseBoard container">
                <div className="row">
                    <button type="button" className="btn btn-danger exerAddButton col-9">Add Exercise</button>
                </div>
                {this.state.exerciseOrder.map(exercisePosition => {
                    let exercise = this.state.exerciseData[exercisePosition];
                    return (
                        <div className="row">
                            <Exercise name={exercise.name}
                                sets={exercise.sets}
                                reps={exercise.reps}
                                weight={exercise.weight}
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
            </div>
        )
    }
}

export default Board;