import React, { Component } from 'react';
import Button from './Button';

const style = {
	padding: '1rem',
	border: '2px solid white'
};

class Stats extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		this.props.deleteStat(this.props.id);
	}
	render() {
		return (
			<div style={style}>
				<p>
					Date:
					{` ${new Date(this.props.fullDate).toDateString()} - ${new Date(
						this.props.fullDate
					).toLocaleTimeString()}`}
				</p>
				<p>Table: {this.props.table}</p>
				<p>Single Moves: {this.props.singleMoves}</p>
				<p>Multiple Moves: {this.props.multipleMoves}</p>
				<p>Time: : {this.props.resolutionTime}</p>
				<Button action={this.handleClick}>Delete</Button>
			</div>
		);
	}
}

export default Stats;
