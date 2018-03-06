import React from "react";
import "./SolveNotification.css";

export default class SolveNotification extends React.Component {
    render() {
        return (
            <div className={`solve-notification ${this.props.isSolving ? "active" : ""}`}>
                Solving...
            </div>
        );
    }
}
