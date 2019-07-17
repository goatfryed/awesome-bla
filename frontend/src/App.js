import React from "react";
import {Route, Switch, BrowserRouter as Router} from "react-router-dom";

//CSS
import './styles.scss';

//Basic Components
import {AppNavbar} from "./components/basic-components/Navbar";
import {AuthenticationCallback} from "./authentication/AuthenticationCallback";

//Components
import {ListEntryNew} from "./components/bucketlist/ListEntryNew";
import {AllBucketLists} from "./components/bucketlist/ShowAllBucketLists"
import {BucketList} from "./components/bucketlist/BucketList";
import ListNew from "./components/bucketlist/ListNew";

//Pages
import {frontpage} from "./components/pages/frontpage"
import {friends} from "./components/pages/friends"
import page404 from "./components/pages/Page404"
import {users} from "./components/pages/users.js"


function App() {
  return <Router>
    <div id="app">
      <AppNavbar/>
      <div class="container">
        <Switch>
          <Route path="/callback" component={AuthenticationCallback}/>
          <Route path="/bucketlist/:id/newlistentry/" component={ListEntryNew}/>
          <Route path="/newlist" component={ListNew} />
          {/* https://reacttraining.com/react-router/web/api/Route/render-func */}
          <Route path="/bucketlist/:id/" component={BucketList} />
          <Route path="/friends" component={friends}/>
          <Route path="/users" component={users}/>
          <Route path="/" exact component={AllBucketLists}/>
          <Route path="/" component={page404}/>
        </Switch>
      </div>
    </div>
  </Router>
}

export default App;
