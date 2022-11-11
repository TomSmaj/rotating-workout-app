import React, { Component } from 'react';
import $ from 'jquery';
import Exercise from './Exercise';
import "./css/Board.css"

class Board extends Component {
    state = {
        exerciseData: {},
        exerciseOrder: []
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

    render() {
        console.log("exerciseData output in render:")
        console.log(this.state.exerciseData);
        return (
            <div className="exerciseBoard container">
                <div className="row">
                    <button type="button" className="btn btn-danger exerAddButton col-9">Add Exercise</button>
                </div>
                {this.state.exerciseOrder.map(exercisePosition => {
                    let exercise = this.state.exerciseData[exercisePosition];
                    return (
                        <div className="row">
                            <Exercise name={exercise.name} sets={exercise.sets} reps={exercise.reps} weight={exercise.weight} exerciseId={exercisePosition} />
                        </div>
                    )
                })
                }
            </div>
        )
    }
}

export default Board;