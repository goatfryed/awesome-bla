import React, { Component } from 'react';
import { Route, Switch} from "react-router";
import { Link, Redirect } from "react-router-dom";
import { backendFetch } from "../../api";
import {NavTabs} from "./NavTabs";
import {Users} from "../basic-components/users";

export class AccessedAllBucketLists extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bucketLists: [],
			lastingElements: null,
			loadedPages: 0
		};
		this.loadMore = this.loadMore.bind(this);

	}

	loadMore(){
		backendFetch.get('/bucketlists/all2?page='+this.state.loadedPages).then(response => {
			if(response.content.length > 0){
				this.state.loadedPages++;
			}
			this.state.lastingElements = response.lastingElements;
			this.state.bucketLists = this.state.bucketLists.concat(response.content);
			this.forceUpdate();
		});
	}

	componentDidMount() {
		this.loadMore = this.loadMore.bind(this);
		this.state.loadedPages = 0;
		this.loadMore();
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

		const moreSides = ()=>{
			return this.state.lastingElements == null ? '':this.state.lastingElements<=0?<div>Kine Weiteren Listen verfügbar</div>:<div>{this.state.lastingElements} weiter Listen <button type="submit" onClick={this.loadMore.bind(this)}>Laden</button></div>
		};

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
				{moreSides()}
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