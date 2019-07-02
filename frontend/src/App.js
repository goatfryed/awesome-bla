import React from "react";
import {BrowserRouter as Router, Route,Switch} from "react-router-dom";

import {Header} from "./Header";

import {AuthenticationCallback} from "./AuthenticationCallback";
import {BucketListEntries} from "./bucketlist/BucketListEntries";

import {ListEntryNew} from "./pages/ListEntryNew";

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
      <Route exact path="/listentry/new" component={ListEntryNew}/>
      <Route path="/bucketlist/:id/entries" component={BucketListEntries} />
      <Route path="/" exact component={LandingPage}/>
      <Route path="/" component={Page404}/>
    </Switch>
  </Router>
}

export default App;
