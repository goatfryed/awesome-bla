import React, { Component } from 'react';

class LandingPage extends Component {
	render() {
		const bucketLists = (
			<div>
				<div className="collection-item grey lighten-3">Alpha</div>
				<div className="collection-item grey lighten-3">Beta</div>
				<div className="collection-item grey lighten-3">Gamma</div>
				<div className="collection-item grey lighten-3">Delta</div>
			</div>
		);

		return (
			<div className="container left">
				<h5>Bucket Lists</h5>
				<div className="collection grey lighten-1">
					{ bucketLists }
				</div>
			</div>
		);
	}
}

export default LandingPage;
