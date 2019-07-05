import React, { Component } from 'react';
import Axios from 'axios';

class LandingPage extends Component {
	state = {
		bucketLists: []
	};

	componentDidMount() {
		Axios.get('http://localhost:8080/bucketlists/all').then(response => {
			this.setState({
				bucketLists: response.data
			});
		});
	}

	render() {
		const bucketLists = this.state.bucketLists.map(bucketList => {
			return (
				<div className="collection-item grey lighten-3">{bucketList.title}</div>
			);
		});

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
