import React, { useState } from "react";
import "./css/Exercise.css";
import Modal from "react-bootstrap/Modal";

const Exercise = (props) => {
  // Initialize state using the useState hook
  const [exerciseId] = useState(props.exerciseId);
  const [exerEditMode, setExerEditMode] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setExerEditMode(!exerEditMode);
  };

  // Function to toggle delete confirmation modal
  const toggleShowDelete = () => {
    setShowDelete(!showDelete);
  };

  // Function to validate edit information
  const validateEditInfo = (event) => {
    let isDelete = event.target.dataset.delete;
    let exerciseId = event.target.dataset.exerciseid;

    if (isDelete) {
      props.updateExerciseInfo(event);
      toggleEditMode();
      props.toggleBoardEditMode();
    } else {
      let newExerciseSets = document.getElementsByClassName(
        "exerciseSetsInput-" + exerciseId
      )[0].value;
      let newExerciseReps = document.getElementsByClassName(
        "exerciseRepsInput-" + exerciseId
      )[0].value;
      let newExerciseWeight = document.getElementsByClassName(
        "exerciseWeightInput-" + exerciseId
      )[0].value;

      let isSetsValid = !isNaN(newExerciseSets);
      let isRepsValid = !isNaN(newExerciseReps);
      let isWeightValid = !isNaN(newExerciseWeight);

      if (isSetsValid && isRepsValid && isWeightValid) {
        props.updateExerciseInfo(event);
        toggleEditMode();
        props.toggleBoardEditMode();
      } else {
        return;
      }
    }
  };

  return (
    <div className="exercise col-9">
      {/* Exercise Name */}
      <div className="row">
        {!exerEditMode ? (
          <strong>
            <div className="exerciseName">{props.name}</div>
          </strong>
        ) : (
          <input
            type="text"
            className={"exerciseNameInput-" + exerciseId}
            placeholder={props.name}
          />
        )}
      </div>
      {/* Reps, sets, and weight */}
      <div className="row">
        <div className="col">
          <div className="exerciseSets">
            Sets:{" "}
            {!exerEditMode ? (
              props.sets
            ) : (
              <input
                type="text"
                size="4"
                className={"exerciseSetsInput-" + exerciseId}
                placeholder={props.sets}
              />
            )}
          </div>
          <div className="exerciseReps">
            Reps:{" "}
            {!exerEditMode ? (
              props.reps
            ) : (
              <input
                type="text"
                size="4"
                className={"exerciseRepsInput-" + exerciseId}
                placeholder={props.reps}
              />
            )}
          </div>
          <div className="exerciseWeight">
            Weight:{" "}
            {!exerEditMode ? (
              props.weight
            ) : (
              <input
                type="text"
                size="4"
                className={"exerciseWeightInput-" + exerciseId}
                placeholder={props.weight}
              />
            )}
          </div>
        </div>
        <div className="col">
          {!exerEditMode ? null : (
            <button
              type="button"
              className="deleteBtn btn btn-dark"
              onClick={toggleShowDelete}
            >
              Delete
            </button>
          )}
        </div>
      </div>
      {/* Row of buttons */}
      <div className="row">
        <div className="col-sm">
          {/* Up button */}
          <button
            type="button"
            data-direction="up"
            data-exerciseid={exerciseId}
            className="exerBtn btn btn-warning"
            onClick={!exerEditMode ? props.moveExercise : null}
          >
            <i
              data-direction="up"
              data-exerciseid={exerciseId}
              className="bi bi-arrow-up-square"
            ></i>
          </button>
          {/* Down button */}
          <button
            type="button"
            data-direction="down"
            data-exerciseid={exerciseId}
            className="exerBtn btn btn-warning"
            onClick={!exerEditMode ? props.moveExercise : null}
          >
            <i
              data-direction="down"
              data-exerciseid={exerciseId}
              className="bi bi-arrow-down-square"
            ></i>
          </button>
          {/* Edit/Save button */}
          {!exerEditMode ? (
            <button
              type="button"
              className="exerBtn btn btn-secondary"
              onClick={
                !props.boardEditMode
                  ? () => {
                      toggleEditMode();
                      props.toggleBoardEditMode();
                    }
                  : null
              }
            >
              Edit
            </button>
          ) : (
            <button
              type="button"
              className="exerBtn btn btn-success"
              data-exerciseid={exerciseId}
              onClick={validateEditInfo}
            >
              Save
            </button>
          )}
          {/* Done/Cancel button */}
          {!exerEditMode ? (
            <button
              type="button"
              data-direction="done"
              data-exerciseid={exerciseId}
              className="exerBtn btn btn-primary"
              onClick={props.moveExercise}
            >
              Done
            </button>
          ) : (
            <button
              type="button"
              className="exerBtn btn btn-danger"
              onClick={() => {
                toggleEditMode();
                props.toggleBoardEditMode();
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      <Modal className="deleteModal" show={showDelete}>
        <Modal.Header>
          <Modal.Title>Delete Exercise?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-danger"
            data-delete="true"
            data-exerciseid={exerciseId}
            onClick={(event) => {
              toggleShowDelete();
              props.updateExerciseInfo(event);
              props.toggleBoardEditMode();
            }}
          >
            Delete
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={toggleShowDelete}
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Exercise;
