import React from "react";
import {BrowserRouter as Router, Route,Switch} from "react-router-dom";
import {Header} from "./Header";
import {AuthenticationCallback} from "./AuthenticationCallback";

function Page404() {
  return <span>These are not the pages you're looking for ¯\_(ツ)_/¯</span>
}

function LandingPage() {
  return <span>What do you want to do before you die?</span>;
}

function App() {
  return <Router>
    <Header/>
    <Switch>
      <Route path="/callback" component={AuthenticationCallback}/>
      <Route path="/" exact component={LandingPage}/>
      <Route path="/" component={Page404}/>
    </Switch>
  </Router>
}

export default App;
