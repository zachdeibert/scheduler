import React from "react";
import TableCellView from "./TableCellView";
import "./TableView.css";

export default class TableView extends React.Component {
    constructor(props) {
        super(props);
        this.checkProps(props);
    }

    checkProps(props) {
        if (!props.model) {
            throw new Error("Missing model");
        }
        if (!props.solver) {
            throw new Error("Missing solver");
        }
        if (!props.horizontal) {
            throw new Error("Missing horizontal axis");
        }
        if (!props.vertical) {
            throw new Error("Missing vertical axis");
        }
    }

    componentWillReceiveProps(props) {
        this.checkProps(props);
    }

    handleChange(axis, i, ev) {
        if (i < 0) {
            axis.append(ev.target.value);
            ev.preventDefault();
            this.forceUpdate(() => {
                const el = axis === this.props.horizontal ? this.latestHAddition : this.latestVAddition;
                el.focus();
                el.setSelectionRange(1, 1);
            });
        } else {
            axis.set(i, ev.target.value);
        }
    }

    handleBlur(axis, i, ev) {
        if (ev.target.value === "") {
            axis.remove(i);
        }
    }

    render() {
        return (
            <table className="table-view">
                <thead>
                    <tr>
                        <th />
                        {this.props.horizontal.array.map((value, i) => (
                            <th key={`option-${i}`}>
                                <input type="text"
                                       value={value}
                                       className="top-cell"
                                       onChange={ev => this.handleChange(this.props.horizontal, i, ev)}
                                       onBlur={ev => this.handleBlur(this.props.horizontal, i, ev)}
                                       ref={el => this.latestHAddition = el} />
                            </th>
                        ))}
                        <th>
                            <input type="text"
                                   value=""
                                   className="top-cell"
                                   onChange={ev => this.handleChange(this.props.horizontal, -1, ev)} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.vertical.array.map((vvalue, vi) => (
                        <tr key={`option-${vi}`}>
                            <th>
                                <input type="text"
                                       value={vvalue}
                                       onChange={ev => this.handleChange(this.props.vertical, vi, ev)}
                                       onBlur={ev => this.handleBlur(this.props.vertical, vi, ev)}
                                       ref={el => this.latestVAddition = el} />
                            </th>
                            {this.props.horizontal.array.map((hvalue, hi) => (
                                <TableCellView key={`option-${hi}`}
                                               model={this.props.model}
                                               solver={this.props.solver}
                                               hlist={this.props.horizontal}
                                               hvalue={hvalue}
                                               hi={hi}
                                               vlist={this.props.vertical}
                                               vvalue={vvalue}
                                               vi={vi} />
                            ))}
                        </tr>
                    ))}
                    <tr>
                        <th>
                            <input type="text"
                                   value=""
                                   onChange={ev => this.handleChange(this.props.vertical, -1, ev)} />
                        </th>
                    </tr>
                </tbody>
            </table>
        );
    }
}
