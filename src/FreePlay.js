import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class FreePlay extends Component {
	constructor(props) {
		super(props);

		this.state = {
			columns: 2,
			rows: 2,
			shuffle: true
		};
		this.handleNumberChange = this.handleNumberChange.bind(this);
		this.handleCheckChange = this.handleCheckChange.bind(this);
		this.goToGame = this.goToGame.bind(this);
	}
	handleNumberChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}
	handleCheckChange(event) {
		this.setState({ shuffle: event.target.checked });
	}
	goToGame() {
		this.props.history.push(
			`/freeplay/${this.state.columns}/${this.state.rows}/${
				this.state.shuffle ? 'shuffle' : 'ordered'
			}`
		);
	}
	render() {
		return (
			<div>
				<h1>Free Play</h1>
				<label htmlFor="columns">Columns</label>
				<select
					name="columns"
					id="columns"
					onChange={this.handleNumberChange}
					value={this.state.columns}
				>
					{this.props.columns.map(column => (
						<option key={column} value={column}>
							{column}
						</option>
					))}
				</select>

				<label htmlFor="rows">Rows</label>
				<select
					name="rows"
					id="rows"
					onChange={this.handleNumberChange}
					value={this.state.rows}
				>
					{this.props.rows.map(row => (
						<option key={row} value={row}>
							{row}
						</option>
					))}
				</select>
				<label htmlFor="shuffle">Shuffle</label>
				<input
					name="shuffle"
					type="checkbox"
					id="shuffle"
					checked={this.state.shuffle}
					onChange={this.handleCheckChange}
				/>
				<button onClick={this.goToGame}>Go!</button>
			</div>
		);
	}
}

export default withRouter(FreePlay);
