import React from "react";
import {BrowserRouter as Router, Route,Switch} from "react-router-dom";
import {Navbar} from "./snippets/Navbar";
import {AuthenticationCallback} from "./authentication/AuthenticationCallback";
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
      <Route path="/friends" component={friends}/>
      <Route path="/" exact component={frontpage}/>
      <Route path="/" component={Page404}/>
    </Switch>
  </Router>
}

export default App;
