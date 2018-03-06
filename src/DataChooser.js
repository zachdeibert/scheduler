import React from "react";
import "./DataChooser.css";

export default class DataChooser extends React.Component {
    constructor(props) {
        super(props);
        this.checkProps(props);
    }

    checkProps(props) {
        if (!props.options) {
            throw new Error("Missing options");
        }
        if (props.orientation !== "horizontal" && props.orientation !== "vertical") {
            throw new Error("Invalid orientation");
        }
    }

    componentWillReceiveProps(props) {
        this.checkProps(props);
    }

    handleClick(key, i) {
        if (this.props.options[key] !== this.props.selected && this.props.onChange) {
            this.props.onChange(this.props.options[key], i);
        }
    }

    render() {
        return (
            <div>
                <ul className={`data-chooser data-chooser-${this.props.orientation}`}>
                    {Object.getOwnPropertyNames(this.props.options).map((name, i) => (
                        <li key={`option-${i}`}
                            className={this.props.selected === this.props.options[name] ? "active" : undefined}
                            onClick={() => this.handleClick(name, i)}>
                            {name}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
