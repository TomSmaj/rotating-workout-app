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
            <div className="exerciseBoard">
                {Object.keys(this.state.exerciseData).map(exercisePosition => {
                    let exercise = this.state.exerciseData[exercisePosition];
                    console.log(exercise.name);
                    return <Exercise name={exercise.name} sets={exercise.sets} reps={exercise.reps} weight={exercise.weight} />
                    // <Exercise name={"hello"} sets={"3"} reps={"12"} weight={"100"} />
                })}
                {/* <Exercise name={"hello"} sets={"3"} reps={"12"} weight={"100"} /> */}
            </div>
        )
    }
}

export default Board;