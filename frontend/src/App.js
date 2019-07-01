
import * as React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import {Switch} from "react-router";

//Pages
import {ListEntryNew} from "./pages/ListEntryNew";

function Page404() {
  return <span>These are not the pages you're looking for ¯\_(ツ)_/¯</span>
}

function LandingPage() {
  return <span>What do you want to do before you die?</span>;
}

function App() {
  return <Router>
    <Switch>
      <Route exact path="/listentry/new" component={ListEntryNew}/>
      <Route path="/" exact component={LandingPage}/>
      <Route path="/" component={Page404}/>
    </Switch>
  </Router>
}

export default App;
