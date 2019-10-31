import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Board from './Board/Board';
import Home from './Home';
import FreePlay from './FreePlay';
import Levels from './Levels';
import NavBar from './NavBar';
import Stats from './Stats';

class Game extends Component {
	static defaultProps = {
		numLevels: 17,
		maxRows: 30,
		maxColumns: 30
	};

	constructor(props) {
		super(props);
		this.state = {
			completedLevels: JSON.parse(
				window.localStorage.getItem('completedLevelsNXMPuzzle') || '[]'
			),
			stats: JSON.parse(window.localStorage.getItem('statsNXMPuzzle') || '[]')
		};

		this.levels = this.numArrayList(1, this.props.numLevels);
		this.rowsRoutes = this.numArrayList(2, this.props.maxRows);
		this.columnsRoutes = this.numArrayList(2, this.props.maxColumns);
		this.updateCompeltedLevels = this.updateCompeltedLevels.bind(this);
		this.resetCompletedLevels = this.resetCompletedLevels.bind(this);
		this.updateStats = this.updateStats.bind(this);
		this.deleteAllStats = this.deleteAllStats.bind(this);
		this.makeAvailableLevels = this.makeAvailableLevels.bind(this);
		this.deleteStat = this.deleteStat.bind(this);
	}

	numArrayList(from, to) {
		return Array.from({ length: to - from + 1 }, (_, i) => from + i);
	}

	makeAvailableRoutes(arr) {
		return arr.map(d => d).join('|');
	}

	updateCompeltedLevels(level) {
		if (!this.state.completedLevels.includes(level)) {
			this.setState(
				({ completedLevels }) => ({
					completedLevels: [...completedLevels, level]
				}),
				() =>
					window.localStorage.setItem(
						'completedLevelsNXMPuzzle',
						JSON.stringify(this.state.completedLevels)
					)
			);
		}
	}

	resetCompletedLevels() {
		this.setState({ completedLevels: [] }, () => {
			window.localStorage.setItem(
				'completedLevelsNXMPuzzle',
				JSON.stringify(this.state.completedLevels)
			);
		});
	}

	makeAvailableLevels() {
		let availableLevels = Array.from(this.state.completedLevels);
		if (availableLevels.length === 0) {
			availableLevels.push('1');
		} else if (availableLevels.length !== this.levels.length) {
			availableLevels.push(
				String(
					1 +
						Number(
							this.state.completedLevels[this.state.completedLevels.length - 1]
						)
				)
			);
		}
		return availableLevels;
	}

	updateStats(newStat) {
		this.setState(
			({ stats }) => ({
				stats: [newStat, ...stats]
			}),
			() =>
				window.localStorage.setItem(
					'statsNXMPuzzle',
					JSON.stringify(this.state.stats)
				)
		);
	}

	deleteStat(statId) {
		this.setState({
			stats: this.state.stats.filter(stat => stat.id !== statId)
		});
	}

	deleteAllStats() {
		this.setState({ stats: [] }, () => {
			window.localStorage.setItem(
				'statsNXMPuzzle',
				JSON.stringify(this.state.stats)
			);
		});
	}

	render() {
		const getLevel = props => {
			let i = 1;
			let columns = 2;
			let rows = 2;
			while (i < props.match.params.level) {
				i % 2 === 0 ? columns++ : rows++;
				i++;
			}
			return (
				<Board
					columns={columns}
					rows={rows}
					playingMode="levels"
					level={props.match.params.level}
					winGame={this.updateCompeltedLevels}
					updateStats={this.updateStats}
					allLevels={this.levels}
				/>
			);
		};
		return (
			<div className="Game">
				<NavBar />
				<Switch>
					<Route exact path="/" component={Home} />
					<Route
						exact
						path="/freeplay"
						render={() => (
							<FreePlay rows={this.rowsRoutes} columns={this.columnsRoutes} />
						)}
					/>
					<Route
						exact
						path="/levels"
						render={() => (
							<Levels
								levels={this.levels}
								completedLevels={this.state.completedLevels}
								makeAvailableLevels={this.makeAvailableLevels}
								resetCompletedLevels={this.resetCompletedLevels}
							/>
						)}
					/>
					<Route
						exact
						path={`/freeplay/:columns(${this.makeAvailableRoutes(
							this.columnsRoutes
						)})/:rows(${this.makeAvailableRoutes(
							this.rowsRoutes
						)})/:shuffle(shuffle|ordered)`}
						render={props => (
							<Board
								columns={props.match.params.columns}
								rows={props.match.params.rows}
								shuffle={
									props.match.params.shuffle === 'shuffle' ? true : false
								}
								playingMode="freeplay"
								updateStats={this.updateStats}
							/>
						)}
					/>
					<Route
						exact
						path={`/level/:level(${this.makeAvailableRoutes(
							this.makeAvailableLevels()
						)})`}
						render={getLevel}
					/>
					<Route
						exact
						path="/stats"
						render={() => (
							<Stats
								stats={this.state.stats}
								deleteAllStats={this.deleteAllStats}
								deleteStat={this.deleteStat}
							/>
						)}
					/>
					<Route render={() => <h1>NOT FOUND</h1>} />
				</Switch>
			</div>
		);
	}
}

export default Game;
