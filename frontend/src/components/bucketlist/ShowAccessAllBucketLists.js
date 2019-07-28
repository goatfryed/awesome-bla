import React, { Component } from 'react';
import { Route, Switch} from "react-router";
import { Link, Redirect } from "react-router-dom";
import { backendFetch } from "../../api";
import {NavTabs} from "./NavTabs";

export class AccessedAllBucketLists extends Component {
	state = {
		bucketLists: []
	};

	componentDidMount() {
		backendFetch.get('/bucketlists/all2').then(response => {
			this.setState({
				bucketLists: response
			});
		});
	}

	render() {
		const bucketLists = this.state.bucketLists.map(bucketList => {
			return (
				<div>
					<Link to={"/bucketlist/" + bucketList.id} className="collection-item grey lighten-3">
						{bucketList.title}
					</Link>
				</div>
			);
		});

		return (
			<div className="container">
				<h5>Bucket Lists</h5>
				<NavTabs
					links={[
						{
							url: "/",
							title: "Lists",
						},
						{
							url: "/newlist",
							title: "New List",
							navLinkProps: {target: "_self"},
						},
					]}
				/>
				<Switch>
					<Route path="/" render={() => <Lists bucketLists={ bucketLists } />} />
					<Redirect to="/newlist" />
				</Switch>
			</div>
		);
	}
}

const Lists = ({ bucketLists }) => {
	return (
		<div className="collection grey lighten-1">
			{ bucketLists }
		</div>
	);
};
