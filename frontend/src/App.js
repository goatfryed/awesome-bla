import React from "react";
import {Route, BrowserRouter, Switch, BrowserRouter as Router} from "react-router-dom";
import Page404 from './components/Page404';
import { AuthenticationCallback } from "./AuthenticationCallback";
import NavigationBar from './components/NavigationBar';
import LandingPage from './components/LandingPage';
import {ListEntryNew} from "./pages/ListEntryNew";
import {BucketListEntries} from "./bucketlist/BucketListEntries";
import {Header} from "./Header";

const App = () => {
	return (
		<BrowserRouter>
			<div id="app">
				<NavigationBar />
				<Header/>
				<Switch>
					<Route path="/callback" component={AuthenticationCallback}/>
					<Route exact path="/listentry/new" component={ListEntryNew}/>
					{/* https://reacttraining.com/react-router/web/api/Route/render-func */}
					<Route path="/bucketlist/:id/entries" render={({match}) => <BucketListEntries id={match.id} />} />
					<Route path="/" exact component={LandingPage} />
					<Route path="/" component={Page404} />
				</Switch>
			</div>
		</BrowserRouter>
	);
}

export default App;
