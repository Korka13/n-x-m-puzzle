import React, {Component} from 'react'
import "./Cell.css"

class Cell extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.animateCell(this.props.yIndex, this.props.xIndex);
  }

  render() {
    
    let classes
    if (this.props.ncols % 2 === 0){
      let counter = 1;
      let evenRows = [];
      let oddRows = []
      for(let y = 0; y < this.props.nrows; y++){
        if(y % 2 === 0){
          for(let x = 0; x < this.props.ncols; x++){
            evenRows.push(counter)
            counter++
          }
        }else{
          for(let x = 0; x < this.props.ncols; x++){
            oddRows.push(counter)
            counter++
          }
        }
        classes = "Cell" + 
            (this.props.cell === null 
              ? " Cell-empty" 
              : (evenRows.includes(this.props.cell) && this.props.cell % 2 === 0 
                ? " Cell-even" 
                : (oddRows.includes(this.props.cell) && this.props.cell % 2 !== 0 
                  ? " Cell-even" 
                  : " Cell-odd")));
      }
    }else{
      classes = "Cell" + (this.props.cell === null ? " Cell-empty" : (this.props.cell % 2 === 0 ? " Cell-even" : " Cell-odd"));
    }

    if(this.props.isMoving){
      classes += ` move-${this.props.direction}`
    }

    return (
        <td className={classes} onClick={this.handleClick} >{this.props.cell}</td>
    )
  }
}


export default Cell