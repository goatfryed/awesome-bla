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
import SearchList from "./components/bucketlist/SearchLists"

//Pages
import page404 from "./components/pages/Page404"
import {allUsers} from "./components/pages/allUsers";
import {AccessedAllBucketLists} from "./components/bucketlist/ShowAccessAllBucketLists";
import ImportTargetSelection from "./components/Import/ImportTargetSelection";


function App() {
  return <Router>
    <div id="app">
      <AppNavbar/>
      <div className="container">
        <Switch>
          <Route path="/callback" component={AuthenticationCallback}/>
          <Route strict exact path="/import/" component={ImportTargetSelection} />
          <Route path="/bucketlist/:id/newlistentry/" component={ListEntryNew}/>
          <Route path="/newlist" component={ListNew} />
          {/* https://reacttraining.com/react-router/web/api/Route/render-func */}
          <Route path="/bucketlist/:id/" render={({match, history}) => <BucketList match={match} history={history} id={match.params.id} />} />
          <Route path="/users" component={allUsers}/>
          <Route path="/" exact component={AllBucketLists}/>
          <Route path="/accessed" exact component={AccessedAllBucketLists}/>
          <Route path="/search" exact component={SearchList}/>
          <Route path="/" component={page404}/>
        </Switch>
      </div>
    </div>
  </Router>
}

export default App;
