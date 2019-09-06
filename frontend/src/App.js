import React, {PureComponent} from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
//CSS
import './styles.scss';
//Basic Components
import {AppNavbar} from "./components/basic-components/Navbar";
import {AuthenticationCallback} from "./authentication/AuthenticationCallback";
//Components
import {ListEntryNew} from "./components/bucketlist/ListEntryNew";
import {BucketList} from "./components/bucketlist/BucketList";
import ListNew from "./components/bucketlist/ListNew";
//Pages
import page404 from "./components/pages/Page404"
import {allUsers} from "./components/pages/allUsers";
import {BucketListBoard} from "./components/bucketlist/BucketListBoard";
import ImportTargetSelection from "./components/Import/ImportTargetSelection";
import {Unauthorized401} from "./components/pages/Unauthorized401";
import {withRouter} from "react-router";
import {ApiError, setErrorHandler} from "./api";
import * as PropTypes from "prop-types";
import ListSearch from "./components/bucketlist/SearchLists";
import {Login} from "./authentication/Login";
import {About} from "./pages/about";

function App() {
    return <Router>
        <UnauthorizedHandler>
            <div id="mainContainer" className="container">
                <AppNavbar/>
                <div id="contentWrapper">
                    <Switch>
                        <Route path="/about" component={About} />
                        <Route path="/login" component={Login}/>
                        <Route path="/callback" component={AuthenticationCallback}/>
                        <Route strict exact path="/import/" component={ImportTargetSelection}/>
                        <Route path="/bucketlist/:id/newlistentry/" component={ListEntryNew}/>
                        <Route path="/newlist" component={ListNew}/>
                        {/* https://reacttraining.com/react-router/web/api/Route/render-func */}
                        <Route path="/bucketlist/:id/"
                               render={({match, history}) => <BucketList match={match} history={history}
                                                                         id={match.params.id}/>}/>
                        <Route path="/users" component={allUsers}/>
                        <Route path="/home" component={BucketListBoard}/>
                        <Route path="/search" exact component={ListSearch}/>
                        <Route path="/401" strict exact component={Unauthorized401}/>
                        <Route path="/" exact><Redirect to="/home"/></Route>
                        <Route path="/" component={page404}/>
                    </Switch>
                </div>
            </div>
        </UnauthorizedHandler>
    </Router>
}

class UnauthorizedHandlerComponent extends PureComponent {

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
