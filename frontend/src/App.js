
import * as React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import {Switch} from "react-router";

function Page404() {
  return <span>These are not the pages you're looking for ¯\_(ツ)_/¯</span>
}

function LandingPage() {
  return <span>What do you want to do before you die?</span>;
}

function BucketListEntries() {
  return <span>Under construction</span>;
}

function App() {
  return <Router>
    <Switch>
      <Route path="/" exact component={LandingPage}/>
      <Route path="/bucketlist/:id/entries" component={BucketListEntries} />
      <Route path="/" component={Page404}/>
    </Switch>
  </Router>
}

export default App;
