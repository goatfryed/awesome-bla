import React from "react";
import {Route, Switch, BrowserRouter as Router} from "react-router-dom";

//CSS
import './styles.scss';

//Basic Components
import {Navbar} from "./components/basic-components/Navbar";
import {AuthenticationCallback} from "./authentication/AuthenticationCallback";

//Components
import {ListEntryNew} from "./components/bucketlist/ListEntryNew";
import {AllBucketLists} from "./components/bucketlist/ShowAllBucketLists"
import {BucketList} from "./components/bucketlist/BucketList";

//Pages
import {frontpage} from "./components/pages/frontpage"
import {friends} from "./components/pages/friends"
import page404 from "./components/pages/Page404"

function App() {
  return <Router>
    <div id="app">
      <Navbar/>
      <Switch>
        <Route path="/callback" component={AuthenticationCallback}/>
        <Route path="/listentry/new" component={ListEntryNew}/>
        {/* https://reacttraining.com/react-router/web/api/Route/render-func */}
        <Route path="/bucketlist/:id/" render={({match}) => <BucketList match={match} id={match.params.id} />} />
        <Route path="/bucketlists/all" exact component={AllBucketLists}/>
        <Route path="/friends" component={friends}/>
        <Route path="/" exact component={frontpage}/>
        <Route path="/" component={page404}/>
      </Switch>
    </div>
  </Router>
}

export default App;
