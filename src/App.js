import React from "react";
import Model from "./Model";
import Solver from "./Solver";
import View from "./View";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.model = new Model();
        this.solver = new Solver(this.model);
        this.model.solver = this.solver;
    }

    componentDidMount() {
        this.solver.beginSolve();
    }

    render() {
        return (
            <View model={this.model} solver={this.solver} />
        );
    }
}
