import React, { PureComponent } from 'react';
import {Route, Switch} from "react-router";
import { Link, Redirect } from "react-router-dom";
import { backendFetch } from "../../api";
import {NavTabs} from "./NavTabs";
import Authentication from "../../authentication/Authentication";

export function BucketListBoard({match}) {
	return (
		<div>
			<h5>Bucket Lists</h5>
			<NavTabs
				links={[
					{
						url: "/home/personal",
						title: "Personal",
					},
					{
						url: "/home/public",
						title: "All",
					},
					{
						url: "/newlist",
						title: "New List",
					},
				]}
			/>
			<Switch>
				<Route path={match.path + "/public"} exact strict
					   component={BucketListView}
				/>
				{
				    // key forces mount of a new bucket list view. didn't want to rewrite the component (yet)
					Authentication.isAuthenticated() &&
					<Route path={match.path + "/personal"} exact strict
						   render={() => <BucketListView key="personal" owner={{userName: Authentication.getUser().sub}}/>}
					/>
				}
				<Redirect to={match.path + "/public"} />
			</Switch>
		</div>
	);
}

export class BucketListView extends PureComponent {

	state = {};

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
		let query = new URLSearchParams({
			page: this.state.loadedPages,
		});
		if (this.props.owner) {
			query.append("userName", this.props.owner.userName);
		}
		backendFetch.get('/bucketlists/?' + query.toString()).then(response => {
			if(response.content.length > 0){
				this.setState({loadedPages: this.state.loadedPages+1});
			}
			this.setState({
				lastingElements: response.lastingElements,
				bucketLists: this.state.bucketLists.concat(response.content)
			});
			this.forceUpdate();
		});
	}

	componentDidMount() {
		this.loadMore = this.loadMore.bind(this);
		this.setState({loadedPages: 0});
		this.loadMore();
	}

	render() {
		const moreSides = ()=>{
			return this.state.lastingElements == null ? '':this.state.lastingElements<=0?<div>Kine Weiteren Listen verfügbar</div>:<div>{this.state.lastingElements} weiter Listen <button type="submit" onClick={this.loadMore.bind(this)}>Laden</button></div>
		};

		return <>
			<Lists bucketLists={ this.state.bucketLists } />
			{moreSides()}
		</>
	}
}

function BucketListEntry({bucketList}) {
	return <li className="collection-item avatar" style={{minHeight: "initial"}}>
		<i className="material-icons circle green">playlist_add_check</i>
		<div className="row" style={{marginBottom: "initial"}}>
			<div className="col">
				<span className="title"><Link to={"/bucketlist/" + bucketList.id}>{bucketList.title}</Link></span>
				<p>{
					bucketList.ownList ? <span>your List</span>
						: <span>{bucketList.privateList ? "shared by" : "by"} {bucketList.owner.userName}</span>
				}</p>
			</div>
			<div className="col">
				<span>{bucketList.description}</span>
			</div>
		</div>
		<Link to={"/bucketlist/" + bucketList.id} className="secondary-content"><i
			className="material-icons">send</i></Link>
	</li>;
}

const Lists = ({ bucketLists }) => {
	return <ul className="collection lighten-1">
		{
			bucketLists.map(bucketList => <BucketListEntry  key={bucketList.id}  bucketList={bucketList}/>)
		}
	</ul>
};
