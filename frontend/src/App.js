import React from "react";
import {BrowserRouter as Router, Route,Switch} from "react-router-dom";

//CSS
import './styles.scss';

//Basic Components
import {Navbar} from "./components/basic-components/Navbar";
import {AuthenticationCallback} from "./authentication/AuthenticationCallback";

//Components
import {BucketListEntries} from "./components/bucketlist/BucketListEntries";
import {ListEntryNew} from "./components/bucketlist/ListEntryNew";
import {AllBucketLists} from "./components/bucketlist/ShowAllBucketLists"

//Pages
import {frontpage} from "./components/pages/frontpage"
import {friends} from "./components/pages/friends"
import page404 from "./components/pages/Page404"
import {users} from "./components/pages/users.js"


function App() {
  return <Router>
    <div id="app">
      <Navbar/>
      <Switch>
        <Route path="/callback" component={AuthenticationCallback}/>
        <Route path="/listentry/new" component={ListEntryNew}/>
        <Route path="/bucketlist/:id/entries" component={BucketListEntries} />
        <Route path="/bucketlists/all" exact component={AllBucketLists}/>
        <Route path="/friends" component={friends}/>
        <Route path="/users" component={users}/>
        <Route path="/" exact component={frontpage}/>
        <Route path="/" component={page404}/>
      </Switch>
    </div>
  </Router>
}

export default App;
