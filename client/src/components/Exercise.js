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
            exerciseId: props.exerciseId,
            isEditMode: false
        }
        this.toggleEditMode = this.toggleEditMode.bind(this);
    }

    componentDidMount() {

    }

    toggleEditMode = () => {
        this.setState({ isEditMode: !this.state.isEditMode });
    }

    render() {
        return (
            <div className="exercise col-9">
                {/* Exercise Name */}
                <div className="row">
                    {!this.state.isEditMode ? 
                    <div className="exerciseName"><strong>{this.state.name}</strong></div> :
                    <input type="text" className="exerciseNameInput" placeholder={this.state.name} />
                }
                </div>
                {/* Reps, sets, and weight */}
                <div className="row">
                    <div className="exerciseSets">Sets: {!this.state.isEditMode ? this.state.sets : <input type="text" className="exerciseSetsInput" placeholder={this.state.sets} /> }</div>
                    <div className="exerciseReps">Reps: {!this.state.isEditMode ? this.state.reps : <input type="text" className="exerciseRepsInput" placeholder={this.state.reps} />}</div>
                    <div className="exerciseWeight">Weight: {!this.state.isEditMode ? this.state.weight : <input type="text" className="exerciseWeightInput" placeholder={this.state.weight} />}</div>
                </div>
                {/* Row of buttons */}
                <div className="row">
                    <div className="col-sm">
                        {/* Up button */}
                        <button type="button"
                            data-direction="up"
                            data-exerciseid={this.state.exerciseId}
                            className="exerBtn btn btn-warning"
                            onClick={!this.state.isEditMode ? this.props.moveExercise : null}>
                            <i data-direction="up"
                                data-exerciseid={this.state.exerciseId}
                                className="bi bi-arrow-up-square">
                            </i>
                        </button>
                        {/* Down button */}
                        <button type="button"
                            data-direction="down"
                            data-exerciseid={this.state.exerciseId}
                            className="exerBtn btn btn-warning"
                            onClick={!this.state.isEditMode ? this.props.moveExercise : null}>
                            <i data-direction="down"
                                data-exerciseid={this.state.exerciseId}
                                className="bi bi-arrow-down-square">
                            </i>
                        </button>
                        {/* Edit button, turns to save button, when save is pushed toggled isEditMode in exercise state and uses 'updateExerciseInfo' function passed down from Board to perform state change */}
                        {!this.state.isEditMode ? <button type="button" className="exerBtn btn btn-secondary" onClick={this.toggleEditMode}>Edit</button> :
                            <button type="button" className="exerBtn btn btn-success" onClick={event => {this.toggleEditMode(); this.props.updateExerciseInfo();}}>Save</button>}
                        {/* Done button */}
                        {!this.state.isEditMode ? 
                        <button type="button"
                            data-direction="done"
                            data-exerciseid={this.state.exerciseId}
                            className="exerBtn btn btn-primary"
                            onClick={this.props.moveExercise}>
                            Done
                        </button>:
                        <button type="button" className="exerBtn btn btn-danger" onClick={this.toggleEditMode}>Cancel</button>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Exercise;