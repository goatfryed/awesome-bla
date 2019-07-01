import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";

const App = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={LandingPage}/>
				<Route path="/" component={Page404}/>
			</Switch>
		</BrowserRouter>
	);
}

export default App;
