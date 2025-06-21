import React, { useState, useEffect } from "react";
import $ from "jquery";
import Exercise from "./Exercise";
import "./css/Board.css";
import Modal from "react-bootstrap/Modal";

const Board = () => {
  const [boardEditMode, setBoardEditMode] = useState(false);
  const [exerciseData, setExerciseData] = useState({
    0: {
      name: "name",
      sets: 0,
      reps: 0,
      weight: 0,
      category: "category",
      workout_id: 0,
    },
  });
  const [exerciseOrder, setExerciseOrder] = useState([0]);
  const [showAddExercise, setShowAddExercise] = useState(false);

  useEffect(() => {
    console.log("Component Did Mount, getting Data");
    $.get("/get-exercise-data").then((res) => {
      let tempObj = {};
      for (let exercise in res) {
        tempObj[res[exercise].workout_id] = res[exercise];
      }
      setExerciseData(tempObj);
    });
    $.get("/get-exercise-order").then((res) => {
      let tempOrder = [];
      for (let exercise in res) {
        tempOrder.push(res[exercise].workout_id);
      }
      setExerciseOrder(tempOrder);
    });
  }, []);

  const updateBoard = () => {
    console.log("Updating board.");
    $.get("/get-exercise-data").then((res) => {
      let tempObj = {};
      for (let exercise in res) {
        tempObj[res[exercise].workout_id] = res[exercise];
      }
      setExerciseData(tempObj);
    });
    $.get("/get-exercise-order").then((res) => {
      let tempOrder = [];
      for (let exercise in res) {
        tempOrder.push(res[exercise].workout_id);
      }
      setExerciseOrder(tempOrder);
    });
  };

  const addExercise = () => {
    let addExerciseName = document.getElementsByClassName(
      "addExerciseNameInput"
    )[0].value;
    let addExerciseSets = parseInt(
      document.getElementsByClassName("addExerciseSetsInput")[0].value
    );
    let addExerciseReps = parseInt(
      document.getElementsByClassName("addExerciseRepsInput")[0].value
    );
    let addExerciseWeight = parseInt(
      document.getElementsByClassName("addExerciseWeightInput")[0].value
    );
    let addExerciseCategory = document.getElementsByClassName(
      "addExerciseCategoryInput"
    )[0].value;

    let isNameValid =
      typeof addExerciseName === "string" && addExerciseName !== "";
    let isSetsValid = !isNaN(addExerciseSets);
    let isRepsValid = !isNaN(addExerciseReps);
    let isWeightValid = !isNaN(addExerciseWeight);
    let isCategoryValid = addExerciseCategory !== "blank";

    if (
      isNameValid &&
      isSetsValid &&
      isRepsValid &&
      isWeightValid &&
      isCategoryValid
    ) {
      let newOrderId = exerciseOrder.length;
      let newExercise = {
        name: addExerciseName,
        sets: addExerciseSets,
        reps: addExerciseReps,
        weight: addExerciseWeight,
        category: addExerciseCategory,
        newOrderId: newOrderId,
      };

      $.post("/add-exercise", newExercise).then((res) => {
        console.log("reached 'then' of add exercise");
        updateBoard();
      });

      toggleShowAddExercise();
    } else {
      document.getElementsByClassName("addExerciseErrorMessage")[0].innerHTML =
        "Invalid input";
    }
  };

  const moveExercise = (event) => {
    if (!boardEditMode) {
      let direction = event.target.dataset.direction;
      let exerciseId = parseInt(event.target.dataset.exerciseid);
      let currentOrder = exerciseOrder;
      let newOrder = [...currentOrder];

      let position = currentOrder.indexOf(exerciseId);

      if (direction === "done") {
        if (position !== currentOrder.length - 1) {
          let positionValue = currentOrder[position];
          newOrder.splice(position, 1);
          newOrder.push(positionValue);
          updateOrderInDb(newOrder, direction, position);
        }
      } else {
        if (
          (direction === "up" && exerciseId === currentOrder[0]) ||
          (direction === "down" &&
            exerciseId === currentOrder[currentOrder.length - 1])
        ) {
          return;
        } else {
          let firstValue, secondValue;
          if (direction === "up") {
            firstValue = currentOrder[position - 1];
            secondValue = currentOrder[position];
            newOrder[position] = firstValue;
            newOrder[position - 1] = secondValue;
          } else if (direction === "down") {
            firstValue = currentOrder[position + 1];
            secondValue = currentOrder[position];
            newOrder[position] = firstValue;
            newOrder[position + 1] = secondValue;
          }
          updateOrderInDb(newOrder, direction, position);
        }
      }
    }
  };

  const toggleBoardEditMode = () => {
    setBoardEditMode(!boardEditMode);
  };

  const toggleShowAddExercise = () => {
    if (!boardEditMode) {
      setShowAddExercise(!showAddExercise);
    }
  };

  const updateExerciseInfo = (event) => {
    let isDelete = event.target.dataset.delete;
    let exerciseId = event.target.dataset.exerciseid;
    console.log("updateExerciseInfo reached");

    if (isDelete) {
      let tempOrder = [...exerciseOrder];
      let deleteOrderIndex = tempOrder.indexOf(parseInt(exerciseId));
      let deleteObject = {
        deleteWorkoutId: exerciseId,
        deleteOrderId: deleteOrderIndex,
      };

      $.post("/delete-exercise-by-id", deleteObject).then((res) => {
        updateBoard();
      });
    } else {
      let newExerciseName = document.getElementsByClassName(
        "exerciseNameInput-" + exerciseId
      )[0].value;
      let newExerciseSets = document.getElementsByClassName(
        "exerciseSetsInput-" + exerciseId
      )[0].value;
      let newExerciseReps = document.getElementsByClassName(
        "exerciseRepsInput-" + exerciseId
      )[0].value;
      let newExerciseWeight = document.getElementsByClassName(
        "exerciseWeightInput-" + exerciseId
      )[0].value;
      let tempNewExerciseObj = {
        name:
          newExerciseName !== "" && newExerciseName !== null
            ? newExerciseName
            : exerciseData[exerciseId].name,
        sets:
          newExerciseSets !== "" && newExerciseSets !== null
            ? parseInt(newExerciseSets)
            : exerciseData[exerciseId].sets,
        reps:
          newExerciseReps !== "" && newExerciseReps !== null
            ? parseInt(newExerciseReps)
            : exerciseData[exerciseId].reps,
        weight:
          newExerciseWeight !== "" && newExerciseWeight !== null
            ? parseInt(newExerciseWeight)
            : exerciseData[exerciseId].weight,
        category: exerciseData[exerciseId].category,
        workout_id: exerciseId,
      };
      let tempExerciseData = { ...exerciseData };
      tempExerciseData[exerciseId] = tempNewExerciseObj;

      $.post("/update-exercise-info", tempNewExerciseObj).then((res) => {
        updateBoard();
      });
    }
  };

  const updateOrderInDb = (newOrder, direction, position) => {
    let updateObj = {};
    if (direction === "done") {
      updateObj = {
        newOrder: newOrder,
        position: position,
      };
      $.post("/update-exercise-order-done", updateObj).then((res) => {
        updateBoard();
      });
    } else {
      if (direction === "up") {
        position = position - 1;
      }
      updateObj = {
        first_workout_id: newOrder[position],
        second_workout_id: newOrder[position + 1],
        first_order_id: position,
        second_order_id: position + 1,
      };
      $.post("/update-exercise-order-up-or-down", updateObj).then((res) => {
        updateBoard();
      });
    }
  };

  return (
    <div className="exerciseBoard">
      <div className="container">
        <div className="row">
          <button
            type="button"
            className="btn btn-danger exerAddButton col-9"
            onClick={toggleShowAddExercise}
          >
            Add Exercise
          </button>
        </div>
        {exerciseData[0] || exerciseOrder[0] === 0 ? (
          <div className="row">
            <Exercise
              name={"name"}
              sets={0}
              reps={0}
              weight={0}
              category={"category"}
              exerciseId={0}
              moveExercise={moveExercise}
              updateExerciseInfo={updateExerciseInfo}
              toggleBoardEditMode={toggleBoardEditMode}
              boardEditMode={boardEditMode}
              key={0}
            />
          </div>
        ) : (
          exerciseOrder.map((exercisePosition) => {
            let exercise = exerciseData[exercisePosition];
            return (
              <div className="row" key={exercisePosition}>
                <Exercise
                  name={exercise.name}
                  sets={exercise.sets}
                  reps={exercise.reps}
                  weight={exercise.weight}
                  category={exercise.category}
                  exerciseId={exercise.workout_id}
                  moveExercise={moveExercise}
                  updateExerciseInfo={updateExerciseInfo}
                  toggleBoardEditMode={toggleBoardEditMode}
                  boardEditMode={boardEditMode}
                  key={exercisePosition}
                />
              </div>
            );
          })
        )}
        <Modal className="addExerciseModal" show={showAddExercise}>
          <Modal.Header>
            <Modal.Title>Add Exercise</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="addExercise col-9">
              <div className="row">
                <span>
                  {" "}
                  Name: <input type="text" className={"addExerciseNameInput"} />
                </span>
              </div>
              <div className="row">
                <div className="col">
                  <div className="row">
                    <span>
                      {" "}
                      Sets:{" "}
                      <input
                        type="text"
                        size="4"
                        className={"addExerciseSetsInput"}
                      />
                    </span>
                  </div>
                  <div className="row">
                    <span>
                      {" "}
                      Reps:{" "}
                      <input
                        type="text"
                        size="4"
                        className={"addExerciseRepsInput"}
                      />
                    </span>
                  </div>
                  <div className="row">
                    <span>
                      {" "}
                      Weight:{" "}
                      <input
                        type="text"
                        size="4"
                        className={"addExerciseWeightInput"}
                      />
                    </span>
                  </div>
                  <div className="row">
                    <span>
                      {" "}
                      Category:{" "}
                      <select
                        className="addExerciseCategoryInput"
                        name="Category"
                      >
                        <option value="blank"></option>
                        <option value="arm">Arm</option>
                        <option value="back">Back</option>
                        <option value="cardio">Cardio</option>
                        <option value="chest">Chest</option>
                        <option value="core">Core</option>
                        <option value="leg">Leg</option>
                        <option value="other">Other</option>
                      </select>{" "}
                    </span>
                  </div>
                </div>
              </div>
              <div className="row addExerciseErrorMessage"></div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-success"
              onClick={addExercise}
            >
              Add
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={toggleShowAddExercise}
            >
              Cancel
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Board;
