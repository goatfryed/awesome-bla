import React, { useState, useEffect} from 'react';
import { Route, Switch} from "react-router";
import { Link, Redirect } from "react-router-dom";
import { backendFetch } from "../../api";
import {NavTabs} from "./NavTabs";
import PropTypes from "prop-types";

export function BucketListProvider ({children: Child}) {

	let [bucketLists, setBucketLists] = useState([]);

	useEffect(
		() => {
			backendFetch.get('/bucketlists/all').then(response => setBucketLists(response))
		},
		[]
	);

	return <Child bucketLists={bucketLists} />
}

BucketListProvider.propTypes = {
	children: PropTypes.func.isRequired,
};

export function AllBucketLists(){
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
				<Route path="/"><BucketListProvider>{Lists}</BucketListProvider></Route>
				<Redirect to="/newlist" />
			</Switch>
		</div>
	);
}

function Lists({bucketLists}){
	return (
		<div className="collection grey lighten-1">
			{ bucketLists.map( bucketList => (
				<div>
					<Link to={"/bucketlist/" + bucketList.id} className="collection-item grey lighten-3">
						{bucketList.title}
					</Link>
				</div>
			))}
		</div>
	);
}
