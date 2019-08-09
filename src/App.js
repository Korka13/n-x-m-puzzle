import React, { Component } from "react";
import Board from "./Board";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className='App'>
        <Board nrows={4} ncols={4} shuffle={true} />
      </div>
    );
  }
}

export default App;