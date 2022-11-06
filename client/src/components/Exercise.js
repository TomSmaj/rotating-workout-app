import React, { Component } from 'react';
import "./css/Exercise.css"

class Exercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            sets: props.sets,
            reps: props.reps,
            weight: (props.weight ? props.weight : "-")
        }

    }


    render() {
        return (
            <div className="exercise">
                <ul>
                    <li>{this.state.name}</li>
                    <li>{this.state.sets}</li>
                    <li>{this.state.reps}</li>
                    <li>{this.state.weight}</li>
                </ul>
            </div>
        )
    }
}

export default Exercise;