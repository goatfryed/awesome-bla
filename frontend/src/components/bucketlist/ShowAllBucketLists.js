import React, { Component } from 'react';
import { Route, Switch, withRouter } from "react-router";
import { Link, NavLink, Redirect } from "react-router-dom";
import { backendFetch } from "../../api";

export class AllBucketLists extends Component {
	state = {
		bucketLists: []
	};

	componentDidMount() {
		backendFetch.get('/bucketlists/all').then(response => {
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
			<div className="left content">
				<h5>Bucket Lists</h5>
				<div className="tabs">
					<ul>
						<NavTab to="/">Lists</NavTab>
						<NavTab to="/newlist">New List</NavTab>
					</ul>
				</div>
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
}

// with router provides route awareness to this component, so it can set a class to the li, if it's matching
// using NavLink could do similiar things, but could only add a class to the <a> link
const NavTab = withRouter(({to, location, children}) => {
	return <li className={location.pathname.startsWith(to) ? "is-active" : null}>
			<Link to={to}>{children}</Link>
	</li>
});
