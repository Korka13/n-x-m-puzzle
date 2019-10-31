import React, { Component } from 'react';
import Stat from './Stat';
import Button from './Button';

class Stats extends Component {
	render() {
		return (
			<div>
				<Button action={this.props.deleteAllStats}>
					Delete all the statistics
				</Button>
				{this.props.stats.map(stat => (
					<Stat key={stat.id} {...stat} deleteStat={this.props.deleteStat} />
				))}
			</div>
		);
	}
}

export default Stats;
