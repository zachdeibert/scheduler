import React from "react";
import "./TableCellView.css";

export default class TableCellView extends React.Component {
    constructor(props) {
        super(props);
        this.checkProps(props);
        this.handleChange = this.handleChange.bind(this);
    }

    checkProps(props) {
        if (!props.model) {
            throw new Error("Missing Model");
        }
        if (!props.solver) {
            throw new Error("Missing Solver");
        }
        if (!props.hlist) {
            throw new Error("Missing HList");
        }
        if (!props.hvalue && props.hvalue !== "") {
            throw new Error("Missing HValue");
        }
        if (!props.hi && props.hi !== 0) {
            throw new Error("Missing HI");
        }
        if (!props.vlist) {
            throw new Error("Missing VList");
        }
        if (!props.vvalue && props.vvalue !== "") {
            throw new Error("Missing VValue");
        }
        if (!props.vi && props.vi !== 0) {
            throw new Error("Missing VI");
        }
    }

    componentWillReceiveProps(props) {
        this.checkProps(props);
    }

    handleChange(ev) {
        let mapping;
        if ((this.props.hlist === this.props.model.people || this.props.hlist === this.props.model.events)
         && (this.props.vlist === this.props.model.people || this.props.vlist === this.props.model.events)) {
            mapping = this.props.model.eventPeople;
        } else if ((this.props.hlist === this.props.model.times || this.props.hlist === this.props.model.events)
                && (this.props.vlist === this.props.model.times || this.props.vlist === this.props.model.events)) {
            mapping = this.props.model.eventTimes;
        } else {
            throw new Error("Invalid state");
        }
        let key1, key2;
        if (this.props.hlist === this.props.model.events) {
            key1 = this.props.hi;
            key2 = this.props.vi;
        } else {
            key1 = this.props.vi;
            key2 = this.props.hi;
        }
        if (ev.target.checked) {
            mapping.set(key1, key2);
        } else {
            mapping.unset(key1, key2);
        }
    }

    isChecked() {
        let mapping;
        if ((this.props.hlist === this.props.model.people || this.props.hlist === this.props.model.events)
         && (this.props.vlist === this.props.model.people || this.props.vlist === this.props.model.events)) {
            mapping = this.props.model.eventPeople;
        } else if ((this.props.hlist === this.props.model.times || this.props.hlist === this.props.model.events)
                && (this.props.vlist === this.props.model.times || this.props.vlist === this.props.model.events)) {
            mapping = this.props.model.eventTimes;
        } else {
            throw new Error("Invalid state");
        }
        let key1, key2;
        if (this.props.hlist === this.props.model.events) {
            key1 = this.props.hi;
            key2 = this.props.vi;
        } else {
            key1 = this.props.vi;
            key2 = this.props.hi;
        }
        return mapping.lookup(key1, key2);
    }

    render() {
        if (this.props.hi === TableCellView.SHOW_IMPOSSIBLE || this.props.vi === TableCellView.SHOW_IMPOSSIBLE) {
            const solution = this.props.solver.getSolution();
            if (solution) {
                const person = this.props.hi === TableCellView.SHOW_IMPOSSIBLE ? this.props.vi : this.props.hi;
                const unsolved = solution.getUnsolved(person);
                return (
                    <td className="table-cell-view">
                        <ul className="unsolved-list">
                            {unsolved.map((event, i) => (
                                <li key={`event-${i}`}>
                                    {event.name}
                                </li>
                            ))}
                        </ul>
                    </td>
                );
            } else {
                return (
                    <td className="table-cell-view" />
                );
            }
        } else if (this.props.hlist === this.props.vlist) {
            if (this.props.hvalue === this.props.vvalue) {
                return (
                    <td className="table-cell-view">
                        <input type="checkbox" checked={true} readOnly />
                    </td>
                );
            } else {
                return (
                    <td className="table-cell-view">
                        <input type="checkbox" checked={false} readOnly />
                    </td>
                );
            }
        } else if (this.props.hlist === this.props.model.events || this.props.vlist === this.props.model.events) {
            return (
                <td className="table-cell-view">
                    <input type="checkbox" checked={this.isChecked()} onChange={this.handleChange} />
                </td>
            );
        } else if (this.props.solver.isSolving()) {
            return (
                <td className="table-cell-view" />
            );
        } else {
            let personId, timeId;
            if (this.props.hlist === this.props.model.people) {
                personId = this.props.hi;
                timeId = this.props.vi;
            } else {
                personId = this.props.vi;
                timeId = this.props.hi;
            }
            const solution = this.props.solver.getSolution();
            if (solution) {
                return (
                    <td className="table-cell-view">
                        {solution.getEvent(personId, timeId)}
                    </td>
                );
            } else {
                return (
                    <td className="table-cell-view" />
                );
            }
        }
    }
}

TableCellView.SHOW_IMPOSSIBLE = -9001;
