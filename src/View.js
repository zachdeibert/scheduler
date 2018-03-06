import React from "react";
import DataChooser from "./DataChooser";
import TableView from "./TableView";
import "./View.css";

export default class View extends React.Component {
    constructor(props) {
        super(props);
        this.checkProps(props);
        this.state = {
            "horizontal": this.props.model.serializableCollections[this.props.model.tabs[0]],
            "vertical": this.props.model.serializableCollections[this.props.model.tabs[1]]
        };
    }

    checkProps(props) {
        if (!props.model) {
            throw new Error("View must have a model");
        }
    }

    componentWillReceiveProps(props) {
        this.checkProps(props);
    }

    componentDidMount() {
        this.props.model.onChange = this.table.forceUpdate.bind(this.table);
    }

    componentWillUnmount() {
        this.props.model.onChange = null;
    }

    handleChange(axis, axisI, value, valueI) {
        let state = {};
        state[axis] = value;
        this.setState(state);
        this.props.model.tabs[axisI] = valueI;
        this.props.model.updateHash();
    }

    render() {
        return (
            <table className="view">
                <tbody>
                    <tr>
                        <td />
                        <td>
                            <DataChooser options={{
                                             "People": this.props.model.people,
                                             "Events": this.props.model.events,
                                             "Times": this.props.model.times
                                         }}
                                         orientation="horizontal"
                                         selected={this.state.horizontal}
                                         onChange={(val, i) => this.handleChange("horizontal", 0, val, i)} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <DataChooser options={{
                                             "People": this.props.model.people,
                                             "Events": this.props.model.events,
                                             "Times": this.props.model.times
                                         }}
                                         orientation="vertical"
                                         selected={this.state.vertical}
                                         onChange={(val, i) => this.handleChange("vertical", 1, val, i)} />
                        </td>
                        <td>
                            <TableView model={this.props.model}
                                       horizontal={this.state.horizontal}
                                       vertical={this.state.vertical}
                                       ref={el => this.table = el} />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
