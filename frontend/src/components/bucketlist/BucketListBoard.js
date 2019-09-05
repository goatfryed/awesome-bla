import React, { PureComponent } from 'react';
import { Route, Switch} from "react-router";
import { Link, Redirect } from "react-router-dom";
import { backendFetch } from "../../api";
import {NavTabs} from "./NavTabs";

export class BucketListBoard extends PureComponent {

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
		backendFetch.get('/bucketlists/?page='+this.state.loadedPages).then(response => {
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

		return (
			<div>
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
					<Route path="/" render={() => <Lists bucketLists={ this.state.bucketLists } />} />
					<Redirect to="/newlist" />
				</Switch>
				{moreSides()}
			</div>
		);
	}
}

function BucketListEntry({bucketList}) {
	return <li className="collection-item avatar" style={{minHeight: "initial"}}>
		<i className="material-icons circle green">playlist_add_check</i>
		<div className="row" style={{marginBottom: "initial"}}>
			<div className="col">
				<span className="title"><Link to={"/bucketlist/" + bucketList.id}>{bucketList.title}</Link></span>
				<p>by {bucketList.ownList ? "you" : bucketList.owner.userName}</p>
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
