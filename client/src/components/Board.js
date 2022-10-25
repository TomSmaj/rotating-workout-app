import React, { Component } from 'react';
import $ from 'jquery';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exerciseData: {},
            exerciseOrder: []
        }

    }

    componentDidMount() {

        $.get("/get-exercise-data").then(res => {
            this.setState({ exerciseData: res });
        }).then($.get("/get-exercise-order").then(res => {
            this.setState({ exerciseOrder: res.order });
        }))
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