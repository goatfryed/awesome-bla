import React from "react";
import {BucketListEntries} from "./BucketListEntries";
import {NavLink, Redirect} from "react-router-dom";
import {Route, Switch} from "react-router";
import {backendFetch} from "../../api";
import {CommentInput, Comments} from "./Comments";

export function BucketList({id, match}) {
    const [bucketList, setBucketList] = React.useState(null);

    React.useEffect(
        () => {
            (async () => {
                setBucketList(await backendFetch("/bucketlists/" + id + "/"));
            })();
        },
        [id]
    );

    if (bucketList == null) {
        return <span>Loading</span>;
    }

    return <div>
        <span>{bucketList.title}({bucketList.id})</span>
        <ul>
            {/* i'd actually prefer to just provide relative routes, but than activeClassName won't match
                see https://github.com/ReactTraining/react-router/issues/6201#issuecomment-403291934
            */}
            <li><NavLink to={match.url+"/entries"} activeClassName="selected">Entries</NavLink></li>
            <li><NavLink to={match.url+"/comments"} activeClassName="selected">comments</NavLink></li>
        </ul>
        <Switch>
            <Route path={match.path+"entries"}  render={() => <BucketListEntries id={id}/>} />
            <Route path={match.path+"comments"} render={() => <BucketListComments bucketList={bucketList}/>} />
            <Redirect to={match.url+"/entries"} />
        </Switch>
    </div>
}

function BucketListComments({bucketList}) {

    return <div>
        <CommentInput />
        <Comments comments={bucketList.comments || null} onCommentCreation={} />
    </div>
}