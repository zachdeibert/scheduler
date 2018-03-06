import React from "react";
import Model from "./Model";
import View from "./View";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.model = new Model();
    }

    render() {
        return (
            <View model={this.model} />
        );
    }
}
