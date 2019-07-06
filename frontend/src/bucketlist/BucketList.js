import React from "react";
import {BucketListEntries} from "./BucketListEntries";
import {NavLink, Redirect} from "react-router-dom";
import {Route, Switch} from "react-router";

export function BucketList({id, match}) {
    return <div>
        <ul>
            {/* i'd actually prefer to just provide relative routes, but than activeClassName won't match
                see https://github.com/ReactTraining/react-router/issues/6201#issuecomment-403291934
            */}
            <li><NavLink to={match.url+"/entries"} activeClassName="selected">Entries</NavLink></li>
            <li><NavLink to={match.url+"/comments"} activeClassName="selected">comments</NavLink></li>
        </ul>
        <Switch>
            <Route path={match.path+"comments"}  render={() => <BucketListEntries id={id}/>} />
            <Redirect to={match.url+"/entries"} />
        </Switch>
    </div>
}