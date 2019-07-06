import React from "react";
import {BrowserRouter as Router, Route,Switch} from "react-router-dom";

//Basic Components
import {Navbar} from "./components/Navbar";

//Components
import {BucketListEntries} from "./components/BucketListEntries";
import {ListEntryNew} from "./pages/ListEntryNew";
import {AuthenticationCallback} from "./authentication/AuthenticationCallback";

//Pages
import {frontpage} from "./pages/frontpage"
import {friends} from "./pages/friends"

function Page404() {
  return <span>These are not the pages you're looking for ¯\_(ツ)_/¯</span>
}

function App() {
  return <Router>
    <Navbar/>
    <Switch>
      <Route path="/callback" component={AuthenticationCallback}/>
      <Route exact path="/listentry/new" component={ListEntryNew}/>
      <Route path="/bucketlist/:id/entries" component={BucketListEntries} />
      {/*<Route path="/" exact component={LandingPage}/>*/}
      <Route path="/friends" component={friends}/>
      <Route path="/" exact component={frontpage}/>
      <Route path="/" component={Page404}/>
    </Switch>
  </Router>
}

export default App;
