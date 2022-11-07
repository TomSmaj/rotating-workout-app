import React, { Component } from 'react';
import "./css/Exercise.css"

class Exercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: (props.name ? props.name : "-"),
            sets: (props.sets ? props.sets : "-"),
            reps: (props.reps ? props.reps : "-"),
            weight: (props.weight ? props.weight : "-")
        }

    }


    render() {
        return (
            <div className="exercise col-9">                
                    <div className="exerciseName"><strong>{this.state.name}</strong></div>
                    <div className="exerciseSets">Sets: {this.state.sets}</div>
                    <div className="exerciseReps">Reps: {this.state.reps}</div>
                    <div className="exerciseWeight">Weight: {this.state.weight}</div>
                <button type="button" class="btn btn-secondary exerEditButton">Edit</button>
                <button type="button" class="btn btn-primary exerDoneButton">Done</button>
            </div>
        )
    }
}

export default Exercise;