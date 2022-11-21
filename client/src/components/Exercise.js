import React, { Component } from 'react';
import "./css/Exercise.css"

class Exercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            /*{name: (props.name ? props.name : "-"),
            sets: (props.sets ? props.sets : "-"),
            reps: (props.reps ? props.reps : "-"),
            weight: (props.weight ? props.weight : "-"),*/
            exerciseId: props.exerciseId,
            exerEditMode: false
        }
        this.toggleEditMode = this.toggleEditMode.bind(this);
    }

    componentDidMount() {

    }

    toggleEditMode = () => {
        this.setState({ exerEditMode: !this.state.exerEditMode });
    }

    render() {
        return (
            <div className="exercise col-9">
                {/* Exercise Name */}
                <div className="row">
                    {!this.state.exerEditMode ?
                        <strong><div className="exerciseName">{this.props.name}</div></strong> :
                        <input type="text" className={"exerciseNameInput-" + this.state.exerciseId} placeholder={this.props.name} />
                    }
                </div>
                {/* Reps, sets, and weight */}
                <div className="row">
                    <div className="exerciseSets">Sets: {!this.state.exerEditMode ? this.props.sets : <input type="text" className={"exerciseSetsInput-" + this.state.exerciseId} placeholder={this.props.sets} />}</div>
                    <div className="exerciseReps">Reps: {!this.state.exerEditMode ? this.props.reps : <input type="text" className={"exerciseRepsInput-" + this.state.exerciseId} placeholder={this.props.reps} />}</div>
                    <div className="exerciseWeight">Weight: {!this.state.exerEditMode ? this.props.weight : <input type="text" className={"exerciseWeightInput-" + this.state.exerciseId} placeholder={this.props.weight} />}</div>
                </div>
                {/* Row of buttons */}
                <div className="row">
                    <div className="col-sm">
                        {/* Up button */}
                        <button type="button"
                            data-direction="up"
                            data-exerciseid={this.state.exerciseId}
                            className="exerBtn btn btn-warning"
                            onClick={!this.state.exerEditMode ? this.props.moveExercise : null}>
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
                            onClick={!this.state.exerEditMode ? this.props.moveExercise : null}>
                            <i data-direction="down"
                                data-exerciseid={this.state.exerciseId}
                                className="bi bi-arrow-down-square">
                            </i>
                        </button>
                        {/* Edit button, turns to save button, when save is pushed toggled exerEditMode in exercise state and uses 'updateExerciseInfo' function passed down from Board to perform state change */}
                        {/* only toggle board and exercise edit mode if another exercise is not in edit mode (determine this by checking if boardEditMode is false in edit mode button onClick) */}
                        {!this.state.exerEditMode ? <button type="button" className="exerBtn btn btn-secondary" onClick={!this.props.boardEditMode ? event => { this.toggleEditMode(); this.props.toggleBoardEditMode(); } : null}>Edit</button> :
                            <button type="button" className="exerBtn btn btn-success" data-exerciseid={this.state.exerciseId} onClick={event => { this.props.updateExerciseInfo(event); this.toggleEditMode(); this.props.toggleBoardEditMode(); }}>Save</button>}
                        {/* Done button */}
                        {!this.state.exerEditMode ?
                            <button type="button"
                                data-direction="done"
                                data-exerciseid={this.state.exerciseId}
                                className="exerBtn btn btn-primary"
                                onClick={this.props.moveExercise}>
                                Done
                        </button> :
                            <button type="button" className="exerBtn btn btn-danger" onClick={event => { this.toggleEditMode(); this.props.toggleBoardEditMode(); }}>Cancel</button>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Exercise;