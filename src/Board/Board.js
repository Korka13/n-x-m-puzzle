import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Cell from './Cell';
import Button from '../Button';
import './Board.css';

class Board extends Component {
	static defaultProps = {
		rows: 4,
		columns: 4,
		shuffle: true
	};
	constructor(props) {
		super(props);
		this.state = {
			hasWon: false,
			board: this.createBoard(),
			movingCell: null,
			singleMoves: 0,
			multipleMoves: 0,
			timerOn: false,
			timerStart: 0,
			millisecondsPassed: 0,
			timerTime: '00 : 00 : 00 : 00'
		};
		this.animateCell = this.animateCell.bind(this);
		this.goToPreviousPage = this.goToPreviousPage.bind(this);
		this.startTimer = this.startTimer.bind(this);
		this.stopTimer = this.stopTimer.bind(this);
		this.replayGame = this.replayGame.bind(this);
		this.goToNextLevel = this.goToNextLevel.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	componentDidMount() {
		this.startTimer();
		document.addEventListener('keydown', this.handleKeyPress);
	}

	componentDidUpdate(prevProps) {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			this.replayGame();
		}
	}

	componentWillUnmount() {
		this.stopTimer();
		document.removeEventListener('keydown', this.handleKeyPress);
	}

	getRows() {
		return this.props.rows > 1 ? this.props.rows : 2;
	}
	getCols() {
		return this.props.columns > 1 ? this.props.columns : 2;
	}
	buildSequence() {
		let sequence = [];
		for (let i = 1; i < this.getRows() * this.getCols(); i++) {
			sequence.push(i);
		}
		sequence.push(null);
		return sequence;
	}

	createBoard() {
		let boardValues = this.buildSequence();
		if (this.props.shuffle) {
			boardValues = this.shuffleSequence(boardValues);
		}
		let board = [];
		for (let y = 0; y < this.getRows(); y++) {
			let row = [];
			for (let x = 0; x < this.getCols(); x++) {
				let cell = boardValues.splice(0, 1)[0];
				row.push(cell);
			}
			board.push(row);
		}
		return board;
	}

	shuffleSequence(sequence) {
		let shuffledValues = [];
		for (let i = 0; i < this.getRows() * this.getCols(); i++) {
			let randIdx = Math.floor(Math.random() * sequence.length);
			let randCel = sequence.splice(randIdx, 1)[0];
			shuffledValues.push(randCel);
		}
		if (this.checkSolvability(shuffledValues)) {
			return shuffledValues;
		} else {
			return this.shuffleSequence(shuffledValues);
		}
	}

	checkSolvability(sequence) {
		let row = 0; // start calculation from 1st row
		let blankRow; // define blank row
		let inversions = 0; // start from 0 inversions
		for (let i = 0; i < sequence.length; i++) {
			if (i % this.getCols() === 0) {
				// it means we are at the 1st cell of next row
				row++;
			}
			if (sequence[i] === null) {
				blankRow = row; //save y index of blank cell
			}
			for (let j = i + 1; j < sequence.length; j++) {
				//evaluate i against all cells are following it in the sequence
				if (sequence[i] > sequence[j] && sequence[j] !== null) {
					inversions++;
				}
			}
		}
		if (this.getCols() % 2 === 0) {
			//even columns configuration
			if ((this.getRows() - blankRow) % 2 === 0) {
				// columns - blankrow is even?
				console.log(inversions % 2 === 0);
				return inversions % 2 === 0;
			} else {
				// columns - blankrow is odd?
				console.log(inversions % 2 !== 0);
				return inversions % 2 !== 0;
			}
		} else {
			// odd columns configuration
			console.log(inversions % 2 === 0);
			return inversions % 2 === 0;
		}
	}

	checkWinner(currentSequence) {
		const solution = this.buildSequence();
		for (let i = 0; i < solution.length; i++) {
			if (currentSequence[i] !== solution[i]) {
				return false;
			}
		}
		if (this.props.playingMode === 'levels') {
			this.props.winGame(this.props.level);
		}
		this.stopTimer();
		const { hours, minutes, seconds, centiseconds } = this.millisecondsToHours(
			this.state.millisecondsPassed
		);
		const gameStats = {
			fullDate: new Date().toJSON(),
			table: `${this.getCols()} X ${this.getCols()} - ${
				this.props.playingMode === 'levels'
					? `Level ${this.props.level}`
					: `Free Play - ${this.props.shuffle ? 'Shuffle' : 'Ordered'}`
			}`,
			singleMoves: this.state.singleMoves,
			multipleMoves: this.state.multipleMoves,
			resolutionTime: `${hours}hr : ${minutes}min : ${seconds}sec : ${centiseconds}cs`,
			id: Date.now()
		};
		this.props.updateStats(gameStats);

		return true;
	}

	moveCell(board) {
		const currentSequence = [].concat.apply([], board);
		const hasWon = this.checkWinner(currentSequence);
		this.setState({
			board,
			hasWon,
			movingCell: null
		});
	}

	findEmptyCellCoordinates() {
		const emptyCell = { x: 0, y: 0 };
		this.state.board.forEach((row, yIndex) => {
			row.forEach((cell, xIndex) => {
				if (cell === null) {
					emptyCell.y = yIndex;
					emptyCell.x = xIndex;
				}
			});
		});
		return emptyCell;
	}

	animateCell(y, x) {
		if (!this.state.movingCell) {
			const board = JSON.parse(JSON.stringify(this.state.board));
			let direction;
			let moveY = [y];
			let moveX = [x];
			let singleMoves = 0;
			let multipleMoves = 0;
			const emptyCell = this.findEmptyCellCoordinates();
			if (x === emptyCell.x) {
				if (y < emptyCell.y) {
					for (let i = emptyCell.y; i > y; i--) {
						board[i][x] = board[i - 1][x];
						moveY.push(i - 1);
						direction = 'down';
						singleMoves++;
					}
				} else if (y > emptyCell.y) {
					for (let i = emptyCell.y; i < y; i++) {
						board[i][x] = board[i + 1][x];
						moveY.push(i + 1);
						direction = 'up';
						singleMoves++;
					}
				}
				board[y][x] = null;
				multipleMoves++;
			}
			if (y === emptyCell.y) {
				if (x < emptyCell.x) {
					for (let i = emptyCell.x; i > x; i--) {
						board[y][i] = board[y][i - 1];
						moveX.push(i - 1);
						direction = 'right';
						singleMoves++;
					}
				} else if (x > emptyCell.x) {
					for (let i = emptyCell.x; i < x; i++) {
						board[y][i] = board[y][i + 1];
						moveX.push(i + 1);
						direction = 'left';
						singleMoves++;
					}
				}
				board[y][x] = null;
				multipleMoves++;
			}
			this.setState(
				prevState => ({
					singleMoves: prevState.singleMoves + singleMoves,
					multipleMoves: prevState.multipleMoves + multipleMoves,
					movingCell: { y: moveY, x: moveX, direction }
				}),
				() => {
					setTimeout(() => {
						this.moveCell(board);
					}, 200);
				}
			);
		}
	}

	makeTable() {
		let tblBoard = this.state.board.map((row, yIndex) => {
			return (
				<tr key={yIndex}>
					{row.map((cell, xIndex) => {
						return (
							<Cell
								key={`${yIndex}-${xIndex}`}
								cell={cell}
								animateCell={this.animateCell}
								yIndex={yIndex}
								xIndex={xIndex}
								ncols={this.getCols()}
								nrows={this.getRows()}
								isMoving={
									this.state.movingCell &&
									this.state.movingCell.y.includes(yIndex) &&
									this.state.movingCell.x.includes(xIndex)
										? true
										: false
								}
								direction={
									this.state.movingCell &&
									this.state.movingCell.y.includes(yIndex) &&
									this.state.movingCell.x.includes(xIndex)
										? this.state.movingCell.direction
										: null
								}
							/>
						);
					})}
				</tr>
			);
		});
		return (
			<table className="Board">
				<tbody>{tblBoard}</tbody>
			</table>
		);
	}

	handleKeyPress(e) {
		const key = 'which' in e ? e.which : e.keyCode;
		const { x, y } = this.findEmptyCellCoordinates();
		if (key === 37 || key === 38 || key === 39 || key === 40) {
			e.preventDefault();
		}
		if (key === 37 && x + 1 < this.getCols()) {
			this.animateCell(y, x + 1);
		}
		if (key === 38 && y + 1 < this.getRows()) {
			this.animateCell(y + 1, x);
		}
		if (key === 39 && x - 1 >= 0) {
			this.animateCell(y, x - 1);
		}
		if (key === 40 && y - 1 >= 0) {
			this.animateCell(y - 1, x);
		}
	}

	startTimer() {
		this.setState(
			{
				timerOn: true,
				timerStart: Date.now() - this.state.millisecondsPassed
			},
			() => {
				this.timer = setInterval(() => {
					const milliseconds = Date.now() - this.state.timerStart;
					const {
						hours,
						minutes,
						seconds,
						centiseconds
					} = this.millisecondsToHours(milliseconds);

					this.setState({
						timerTime: `${hours} : ${minutes} : ${seconds} : ${centiseconds}`,
						millisecondsPassed: milliseconds
					});
				}, 10);
			}
		);
	}

	stopTimer() {
		this.setState({ timerOn: false });
		clearInterval(this.timer);
	}

	millisecondsToHours(milliseconds) {
		let hours = ('0' + Math.floor(milliseconds / 3600000)).slice(-2);
		let minutes = ('0' + (Math.floor(milliseconds / 60000) % 60)).slice(-2);
		let seconds = ('0' + (Math.floor(milliseconds / 1000) % 60)).slice(-2);
		let centiseconds = ('0' + (Math.floor(milliseconds / 10) % 100)).slice(-2);

		return { hours, minutes, seconds, centiseconds };
	}

	goToPreviousPage() {
		this.props.history.push(`/${this.props.playingMode}`);
	}

	replayGame() {
		this.setState(
			{
				board: this.createBoard(),
				hasWon: false,
				singleMoves: 0,
				multipleMoves: 0,
				timerStart: 0,
				millisecondsPassed: 0,
				timerTime: '00 : 00 : 00 : 00'
			},
			() => this.startTimer()
		);
	}

	goToNextLevel() {
		this.props.history.push(`/level/${1 + Number(this.props.level)}`);
	}

	render() {
		return (
			<div>
				{this.state.hasWon && <h1>YOU WIN!</h1>}
				{!this.state.hasWon && this.state.timerOn && (
					<div>{this.makeTable()}</div>
				)}
				<div className="Timer">
					<div className="Timer-display">{this.state.timerTime}</div>
					{this.state.timerOn && <Button action={this.stopTimer}>Pause</Button>}
					{!this.state.timerOn && !this.state.hasWon && (
						<Button action={this.startTimer}>Resume</Button>
					)}
				</div>
				<h2>Single Moves: {this.state.singleMoves}</h2>
				<h2>Multiple Moves: {this.state.multipleMoves}</h2>
				{this.state.hasWon && (
					<>
						<Button action={this.goToPreviousPage}>
							Back to{' '}
							{this.props.playingMode === 'levels'
								? 'all Levels'
								: 'Free Play page'}
						</Button>
						<Button action={this.replayGame}>Replay</Button>
					</>
				)}
				{this.state.hasWon &&
					this.props.playingMode === 'levels' &&
					Number(this.props.level) !==
						Number(this.props.allLevels[this.props.allLevels.length - 1]) && (
						<Button action={this.goToNextLevel}>Next Level</Button>
					)}
			</div>
		);
	}
}

export default withRouter(Board);
