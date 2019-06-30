
import * as React from "react";
import {render} from "react-dom";
import {BrowserRouter as Router, Route} from "react-router-dom";
import {Switch} from "react-router";
import {Header} from "./Header";
import {AuthenticationCallback} from "./AuthenticationCallback";

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
            <Route path="/" exact component={LandingPage}/>
            <Route path="/" component={Page404}/>
            <Route path="/callback" component={AuthenticationCallback}/>
        </Switch>
    </Router>
}

window.addEventListener(
    "DOMContentLoaded",
    function () {
        render(
            <App />,
            document.getElementById("app")
        )
    }
);