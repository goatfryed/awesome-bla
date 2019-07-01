import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import Page404 from './components/Page404';
import NavigationBar from './components/NavigationBar';
import LandingPage from './components/LandingPage';

const App = () => {
	return (
		<BrowserRouter>
			<div id="app">
				<NavigationBar />
				<Switch>
					<Route path="/" exact component={LandingPage} />
					<Route path="/" component={Page404} />
				</Switch>
			</div>
		</BrowserRouter>
	);
}

export default App;
