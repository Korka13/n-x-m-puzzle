import React, { Component } from 'react';
import './Button.css';

class Button extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		if (this.props.parameter) {
			this.props.action(this.props.parameter);
		} else if (this.props.action) {
			this.props.action();
		} else {
			return;
		}
	}
	render() {
		return (
			<button className="Button" onClick={this.handleClick}>
				{this.props.children}
			</button>
		);
	}
}

export default Button;
