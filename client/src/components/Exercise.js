import React, { Component } from 'react';
import "./css/Exercise.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Modal';

class Exercise extends Component {
    constructor(props) {
        super(props);
        // using props for things that displayed (sets/reps/name/weight) so that they update when the Board state changes
        // only using exercise state for Id (doesn't change) and exerEditMode (needs to be handled in exercise component)
        this.state = {
            /*{name: (props.name ? props.name : "-"),
            sets: (props.sets ? props.sets : "-"),
            reps: (props.reps ? props.reps : "-"),
            weight: (props.weight ? props.weight : "-"),*/
            exerciseId: props.exerciseId,
            exerEditMode: false,
            showDelete: false
        }
        this.toggleEditMode = this.toggleEditMode.bind(this);
        this.toggleShowDelete = this.toggleShowDelete.bind(this);
    }

    componentDidMount() {

    }

    toggleEditMode = () => {
        this.setState({ exerEditMode: !this.state.exerEditMode });
    }

    toggleShowDelete = () => {
        this.setState({ showDelete: !this.state.showDelete });
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
                    <div className="col">
                        <div className="exerciseSets">Sets: {!this.state.exerEditMode ? this.props.sets : <input type="text" size="4" className={"exerciseSetsInput-" + this.state.exerciseId} placeholder={this.props.sets} />}</div>
                        <div className="exerciseReps">Reps: {!this.state.exerEditMode ? this.props.reps : <input type="text" size="4" className={"exerciseRepsInput-" + this.state.exerciseId} placeholder={this.props.reps} />}</div>
                        <div className="exerciseWeight">Weight: {!this.state.exerEditMode ? this.props.weight : <input type="text" size="4" className={"exerciseWeightInput-" + this.state.exerciseId} placeholder={this.props.weight} />}</div>
                    </div>
                    <div className="col">
                        {!this.state.exerEditMode ? null : <button type="button" className="deleteBtn btn btn-dark" onClick={this.toggleShowDelete}>Delete</button>}
                    </div>
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
                <Modal className="deleteModal" show={this.state.showDelete}>
                    <Modal.Header>
                        <Modal.Title>Delete Exercise?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <button type="button" className="btn btn-danger" data-delete="true" data-exerciseid={this.state.exerciseId} onClick={event => { this.toggleShowDelete(); this.props.updateExerciseInfo(event); this.props.toggleBoardEditMode(); }}>Delete</button>
                        <button type="button" className="btn btn-secondary" onClick={this.toggleShowDelete}>Cancel</button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default Exercise;