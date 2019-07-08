import React from "react";
import {BucketListEntries} from "./BucketListEntries";
import {Link, NavLink, Redirect} from "react-router-dom";
import {Route, Switch, withRouter} from "react-router";
import {backendFetch} from "../../api";
import {CommentInput, Comments, CommentsBlock} from "./Comments";

export function BucketList({id, match}) {
    const [bucketList, setBucketList] = React.useState(null);

    function update() {
        backendFetch("/bucketlists/" + id + "/").then(data => setBucketList(data));
    }

    React.useEffect(
        () => {
            update();
        },
        [id]
    );

    if (bucketList == null) {
        return <span>Loading</span>;
    }

    return <div className="container">
            <div>
                <span>{bucketList.title}({bucketList.id})</span><br/>
                <span>{bucketList.created}</span>
        </div>
        <div className="tabs">
            <ul>
                {/* i'd actually prefer to just provide relative routes, but than activeClassName won't match
                    see https://github.com/ReactTraining/react-router/issues/6201#issuecomment-403291934
                */}
                <NavTab to={match.url+"/newlistentry"}>New Entry</NavTab>
                <NavTab to={match.url+"/entries"}>Entries</NavTab>
                <NavTab to={match.url+"/comments"}>Comments</NavTab>
            </ul>
        </div>
        <Switch>
            <Route path={match.path+"entries"}  render={() => <BucketListEntries id={id}/>} />
            <Route path={match.path+"comments"} render={() => <BucketListComments bucketList={bucketList} update={update}/>} />
            <Redirect to={match.url+"/entries"} />
        </Switch>
    </div>
}

function BucketListComments({bucketList, update}) {

    async function addCommentToBucketList(comment) {
        await backendFetch.post(
            "/bucketlists/" + bucketList.id + "/comments/",
            {body: JSON.stringify(comment)}
        );
        update();
    }

    return <CommentsBlock
        onRootCommentCreation={addCommentToBucketList}
        onReplyCreated={update}
        comments={bucketList.comments}
    />
}

// with router provides route awareness to this component, so it can set a class to the li, if it's matching
// using NavLink could do similiar things, but could only add a class to the <a> link
const NavTab = withRouter(({to, location, children}) =>{
    return <li className={location.pathname.startsWith(to) ? "is-active" : null}>
        <Link to={to}>{children}</Link>
    </li>
});