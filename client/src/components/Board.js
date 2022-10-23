import React, { Component } from 'react';
//import exercises from '../data/exercises';
//import exerciseOrder from '../data/exercise-order';
import $ from 'jquery';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //exercises: exercises,
            //exerciseOrder: exerciseOrder
            exerciseData: {},            
        }
        
    }

    componentDidMount(){
        console.log("making exercise data request");
        $.get("/get-exercise-data").then(res => {            
            this.setState({exerciseData: res});
        })
    }

    render() {
        return (
            <div className="exerciseBoard">
                Exercise Board
            </div>
        )
    }
}

export default Board;