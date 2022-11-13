import React, { Component } from 'react';
import "./css/Exercise.css"

class Exercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: (props.name ? props.name : "-"),
            sets: (props.sets ? props.sets : "-"),
            reps: (props.reps ? props.reps : "-"),
            weight: (props.weight ? props.weight : "-"),
            exerciseId: props.exerciseId
        }        
    }

    componentDidMount(){
        
    }    

    render() {
        return (
            <div className="exercise col-9">
                <div className="row">
                    <div className="exerciseName"><strong>{this.state.name}</strong></div>
                </div>
                <div className="row">
                    <div className="exerciseSets">Sets: {this.state.sets}</div>
                    <div className="exerciseReps">Reps: {this.state.reps}</div>
                    <div className="exerciseWeight">Weight: {this.state.weight}</div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <button type="button" data-direction="up" data-exerciseid={this.state.exerciseId} className="exerBtn btn btn-warning" onClick={this.props.moveExercise}><i data-direction="up" data-exerciseid={this.state.exerciseId} className="bi bi-arrow-up-square"></i></button>
                        <button type="button" data-direction="down" data-exerciseid={this.state.exerciseId} className="exerBtn btn btn-warning" onClick={this.props.moveExercise}><i data-direction="down" data-exerciseid={this.state.exerciseId} className="bi bi-arrow-down-square"></i></button>
                        <button type="button" className="exerBtn btn btn-secondary">Edit</button>
                        <button type="button" data-direction="done" data-exerciseid={this.state.exerciseId} className="exerBtn btn btn-primary" onClick={this.props.moveExercise}>Done</button>
                    </div>
                </div>
            </div>
        )
    }    
}

export default Exercise;