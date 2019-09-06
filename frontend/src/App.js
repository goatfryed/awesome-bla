import React, {PureComponent} from "react";
import {Route, Switch, BrowserRouter as Router, Redirect} from "react-router-dom";

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

function About() {
    return <div className="valign-wrapper" style={{minHeight: "70vh"}}>
        <div className="row">
            <div className="col offset-l3 l6">
                <h2 className="title center-align">Awesome Bucket List!</h2>
                <div>
                    This is an awesome bucket list application where you can make lists of things you want to do before you die or before you
                    go on your next alumni meetup or before you forget it or before your husband and your girlfriend meet each other.
                </div>
                <br />
                <div>
                    Awesome Bucket List was made as an lecture project by students of <a href="https://www.uni-kassel.de/uni/">university kassel</a>
                </div>
                <br />
                <div>
                    <h5><a href="https://xkcd.com/1998/">Regarding privacy</a></h5>
                    All registered users' full names and user names are public.
                    We don't retrieve other user information. We don't do anything with it.
                </div>
                <br />
                <div>
                    <h5>Code of conduct</h5>
                    <ol className="browser-default">
                        <li>Please don't be an asshole.</li>
                        <li>Please don't take this side serious</li>
                        <li>
                            Don't upload links that you shouldn't, insult people, make public kill lists, or anything.
                            You know it. The usual stuff. If in doubt, refer to 1.
                        </li>
                        <li>If you happen to notice problematic content, please file a github issue and we'll delete it
                            <ul className="browser-default">
                                <li>We'll probably just drop the database</li>
                                <li>In all honesty, we'll probably take the page down because I can't see us putting effort into community management</li>
                                <li>Unlike features. I can see us putting some effort in some new shitty features</li>
                            </ul>
                        </li>
                    </ol>
                </div>
                <div>
                    <h5>Contact</h5>
                    Source code at <a href="https://gitlab.com/MichaelPrasil/awesome-bucket-list/">
                        <img alt="gitlab" src="https://about.gitlab.com/images/press/press-kit-icon.svg"
                             style={{height: "1.5ex", width:"1em"}}
                        />
                        MichealPrasil/awesome-bucket-list
                    </a><br />
                    To get in contact, please file an issue or write to one of us.
                    <ul className="browser-default">
                        <li><a href="https://gitlab.com/tost11">Lukas {"<toast11>"} Hagenhauer</a></li>
                        <li><a href="https://gitlab.com/goatfryed">Omar {"<goatfryed>"} Sood</a></li>
                        <li><a href="https://gitlab.com/Maggi64">Maximilian {"<Maggi64>"} Dewald</a></li>
                        <li><a href="https://gitlab.com/MichaelPrasil">Michael {"<MichaelPrasil>"} Prasil</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
}

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
