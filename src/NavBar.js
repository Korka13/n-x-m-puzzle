import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from './Button';
import './NavBar.css';

class NavBar extends Component {
	constructor(props) {
		super(props);
		this.goToPage = this.goToPage.bind(this);
	}
	goToPage(page) {
		this.props.history.push(page);
	}
	render() {
		return (
			<div className="NavBar">
				<div className="Title">
					<h1>The Ultimate N x M Puzzle</h1>
				</div>
				<nav>
					<Button action={this.goToPage} parameter="/">
						Home
					</Button>

					<Button action={this.goToPage} parameter="/freeplay">
						Free Play
					</Button>

					<Button action={this.goToPage} parameter="/levels">
						Levels
					</Button>

					<Button action={this.goToPage} parameter="/stats">
						Stats
					</Button>
				</nav>
			</div>
		);
	}
}

export default withRouter(NavBar);
