import React, { Component } from 'react';
import Axios from 'axios';
import {Link} from "react-router-dom";

export class AllBucketLists extends Component {
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
                <div><Link  to={"/bucketlist/" + bucketList.id} className="collection-item grey lighten-3">{bucketList.title}</Link></div>
			);
		});

		return (
			<div className="container left content">
				<h5>Bucket Lists</h5>
				<div className="collection grey lighten-1">
					{ bucketLists }
				</div>
			</div>
		);
	}
}
