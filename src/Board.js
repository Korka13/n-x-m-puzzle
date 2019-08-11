import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';

class Board extends Component {
  static defaultProps = {
    nrows: 4,
    ncols: 4,
    shuffle: true
  }
  constructor(props) {
    super(props);
    this.state = {
      hasWon: false,
      board: this.createBoard(),
      movingCell: {
        x: "",
        y: "",
        direction: ""
      }
    }
    this.animateCell = this.animateCell.bind(this);
  }

  getRows(){
    let rows;
    this.props.nrows > 1 ? rows = this.props.nrows : rows = 2
    return rows
  }

  getCols(){
    let cols;
    this.props.ncols > 1 ? cols = this.props.ncols : cols = 2
    return cols
  }

  buildSequence(){
    let sequence = [];
    let counter = 1;
    for(let i = 1; i < this.getRows() * this.getCols(); i++){
      sequence.push(counter);
      counter++
    }
    sequence.push(null)
    return sequence
  }

  createBoard() {
    let boardValues = this.buildSequence()
    if(this.props.shuffle){
      boardValues = this.shuffleSequence(boardValues)
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

  shuffleSequence(sequence){

    let shuffledValues = [];
      for(let i = 0; i < this.getRows() * this.getCols(); i ++){
        let randIdx = Math.floor(Math.random() * sequence.length);
        let randCel = sequence.splice(randIdx, 1)[0];
        shuffledValues.push(randCel);
      }
      if(this.checkSolvability(shuffledValues)){
        return shuffledValues
      }else{
        return this.shuffleSequence(shuffledValues)
      }
      
  }

  checkSolvability(sequence){
    let row = 1; // start calculation from 1st row
    let blankRow; // define blank row
    let inversions = 0; // start from 0 inversions
    for(let i = 0; i < sequence.length; i ++){
      if(i % this.getCols() === 0){ // it means we are at the 1st cell of next row
        row++
      }
      if(sequence[i] === null){
        blankRow = row; //save y index of blank cell
      }
      for(let j = i + 1; j < sequence.length; j++){ //evaluate i against all cells are following it in the sequence
        if(sequence[i] > sequence[j] && sequence[j] !== null){
          inversions++
        }
      }
    }
    if (this.getCols() % 2 === 0){ //even columns configuration
      if (this.getRows() -  blankRow % 2 === 0){ // columns - blankrow is even?
        console.log(inversions % 2 === 0)
        return inversions % 2 === 0
      }else{ // columns - blankrow is odd?
        console.log(inversions % 2 !== 0)
        return inversions % 2 !== 0
      }
    }else{ // odd columns configuration
      console.log(inversions % 2 === 0)
      return inversions % 2 === 0
    }
  }

  checkWinner(currentSequence){
    const solution = this.buildSequence()
    for(let i = 0; i < solution.length; i++){
      if(currentSequence[i] !== solution[i]){
        return false
      }
    }
    return true
  }

  moveCell(board) {

    const currentSequence = [].concat.apply([], board)
    const hasWon = this.checkWinner(currentSequence);

    this.setState({board, hasWon, movingCell: {y: "", x: "", direction: ""}});
  }

  animateCell(y, x){
    const board = JSON.parse(JSON.stringify(this.state.board));
    let direction;
    if(x + 1 < this.getCols() && board[y][x + 1] === null){
      board[y][x + 1] = board[y][x];
      board[y][x] = null;
      direction = "right";
    }
    if(x - 1 >= 0 && board[y][x - 1] === null){
      board[y][x - 1] = board[y][x];
      board[y][x] = null;
      direction = "left";
    }
    if(y + 1 < this.getRows() && board[y + 1][x] === null){
      board[y + 1][x] = board[y][x];
      board[y][x] = null;
      direction = "down";
    }
    if(y - 1 >= 0 && board[y - 1][x] === null){
      board[y - 1][x] = board[y][x];
      board[y][x] = null;
      direction = "up";
    }

    this.setState({movingCell: {y, x, direction}}, () => {
      setTimeout(() => {
        this.moveCell(board);
      }, 200);
    });
  }

  makeTable(){
    let tblBoard = this.state.board.map((row, yIndex) => {
      return (
        <tr key={yIndex}>
          {
            row.map((cell, xIndex) => {
              return  <Cell 
                        key={`${yIndex}-${xIndex}`} 
                        cell={cell} 
                        animateCell={this.animateCell} 
                        yIndex={yIndex} 
                        xIndex={xIndex} 
                        ncols={this.getCols()}
                        nrows={this.getRows()}
                        isMoving={this.state.movingCell.y === yIndex && this.state.movingCell.x === xIndex ? true : false}
                        direction={this.state.movingCell.y === yIndex && this.state.movingCell.x === xIndex ? this.state.movingCell.direction : null}
                      />
            })
          }
        </tr>
      )
    });
    return (
      <table className='Board'>
        <tbody>{tblBoard}</tbody>
      </table>
    )
  }


  render() {    
    return (
      <div>
      {this.state.hasWon ? (
        <div className='winner'>
          <span className='neon-orange'>YOU</span>
          <span className='neon-blue'>WIN!</span>
        </div>
      ) : (
        <div>
          <div className='Board-title'>
            <div className='neon-orange'>Lights</div>
            <div className='neon-blue'>Out</div>
          </div>
          {this.makeTable()}
        </div>
      )}
    </div>
    )

  }
}


export default Board;
