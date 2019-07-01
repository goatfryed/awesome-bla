import React, { Component } from 'react';

class LandingPage extends Component {
	render() {
		const bucketLists = null;

		return (
			<div>
				<nav className="nav-wrapper grey darken-3">
					<div className="container">
						<div className="brand-logo white-text">Awesome Bucket List</div>
					</div>
				</nav>
				<div className="container white">
					{ bucketLists }
				</div>
			</div>
		);
	}
}

export default LandingPage;
