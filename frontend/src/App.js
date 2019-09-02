import React, {useEffect, useCallback, Component} from "react";
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
import page404 from "./components/pages/Page404"
import {allUsers} from "./components/pages/allUsers";
import {AccessedAllBucketLists} from "./components/bucketlist/ShowAccessAllBucketLists";
import ImportTargetSelection from "./components/Import/ImportTargetSelection";
import {Unauthorized401} from "./components/pages/Unauthorized401";
import {withRouter} from "react-router";
import {ApiError, setErrorHandler} from "./api";
import * as PropTypes from "prop-types";


function App() {
  return <Router>
      <UnauthorizedHandler>
          <AppNavbar/>
          <div className="container">
            <Switch>
              <Route path="/callback" component={AuthenticationCallback}/>
              <Route strict exact path="/import/" component={ImportTargetSelection} />
              <Route path="/bucketlist/:id/newlistentry/" component={ListEntryNew}/>
              <Route path="/newlist" component={ListNew} />
              {/* https://reacttraining.com/react-router/web/api/Route/render-func */}
              <Route path="/bucketlist/:id/" render={({match}) => <BucketList match={match} id={match.params.id} />} />
              <Route path="/users" component={allUsers}/>
              <Route path="/" exact component={AllBucketLists}/>
              <Route path="/accessed" exact component={AccessedAllBucketLists}/>
              <Route path="/401" exact component={Unauthorized401} />
              <Route path="/" component={page404}/>
            </Switch>
          </div>
      </UnauthorizedHandler>
  </Router>
}

class UnauthorizedHandlerComponent extends Component {

    componentDidCatch(error, errorInfo) {
        console.log(error);
        if (error instanceof ApiError && error.response.status === 401) {
            this.props.history.push("/401");
        }
    }

    componentDidMount() {
        setErrorHandler(401, () => this.props.history.push("/401"));
    }

    render() {
        return this.props.children;
    }
}

UnauthorizedHandlerComponent.propTypes = {
    history: PropTypes.any,
    children: PropTypes.any
};

const UnauthorizedHandler = withRouter(UnauthorizedHandlerComponent);

export default App;
