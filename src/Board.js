import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
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

  buildSequence(){
    let sequence = [];
    let counter = 1;
    for(let i = 1; i < this.props.nrows * this.props.ncols; i++){
      sequence.push(counter);
      counter++
    }
    sequence.push(null)
    return sequence
  }

  createBoard() {
    let boardValues = this.buildSequence();
    let board = [];
    for (let y = 0; y < this.props.nrows; y++) {
      let row = [];
      for (let x = 0; x < this.props.ncols; x++) {
        if(this.props.shuffle){
          let randIdx = Math.floor(Math.random() * boardValues.length);
          let randCel = boardValues.splice(randIdx, 1)[0];
          row.push(randCel);
        }
        else{
          let cell = boardValues.splice(0, 1)[0];
          row.push(cell);
        }
      }
      board.push(row);
    }
    return board;
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
    let {ncols, nrows} = this.props;
    const board = JSON.parse(JSON.stringify(this.state.board));
    let direction;
    if(x + 1 < ncols && board[y][x + 1] === null){
      board[y][x + 1] = board[y][x];
      board[y][x] = null;
      direction = "right";
    }
    if(x - 1 >= 0 && board[y][x - 1] === null){
      board[y][x - 1] = board[y][x];
      board[y][x] = null;
      direction = "left";
    }
    if(y + 1 < nrows && board[y + 1][x] === null){
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
                        ncols={this.props.ncols}
                        nrows={this.props.nrows}
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
