import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Levels extends Component {
	constructor(props) {
		super(props);
		this.goToLevel = this.goToLevel.bind(this);
		this.resetProgress = this.resetProgress.bind(this);
	}

	goToLevel(level) {
		this.props.history.push(`/level/${level}`);
	}
	resetProgress() {
		this.props.resetCompletedLevels();
		this.props.makeAvailableLevels();
	}
	render() {
		return (
			<div>
				{this.props.levels.map(level => (
					<button
						disabled={!this.props.makeAvailableLevels().includes(String(level))}
						key={level}
						onClick={() => this.goToLevel(level)}
					>
						Level {level}
					</button>
				))}

				<div>
					<button onClick={this.resetProgress}>Reset Progress</button>
				</div>
			</div>
		);
	}
}

export default withRouter(Levels);
