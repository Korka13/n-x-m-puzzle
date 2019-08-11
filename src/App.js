import React, { Component } from "react";
import Board from "./Board";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className='App'>
        <Board nrows={5} ncols={1} shuffle={true} />
      </div>
    );
  }
}

export default App;