import React from "react";
import {BucketListEntries} from "./BucketListEntries";
import {Link, NavLink, Redirect} from "react-router-dom";
import {Route, Switch, withRouter} from "react-router";
import {backendFetch} from "../../api";
import {CommentsBlock} from "./Comments";
import moment from "moment";
import * as PropTypes from "prop-types";

function BucketListDetails(props) {
    return <article className="media">
        <figure className="media-left">
            <p className="image is-64x64">
                <img src="https://bulma.io/images/placeholders/128x128.png"/>
            </p>
        </figure>
        <div className="media-content">
            <strong>{props.bucketList.title}({props.bucketList.id})</strong>
            <br/>
            <small>{props.counter} · <a onClick={props.onLike}>Like</a>
                · <span>{moment(props.bucketList.created).fromNow()}</span>
                · <button onClick={props.onImport}>copy</button>
            </small>
        </div>
    </article>;
}

BucketListDetails.propTypes = {
    bucketList: PropTypes.any,
    counter: PropTypes.number,
    onLike: PropTypes.func,
    onImport: PropTypes.func
};

function SubTabNavigation(props) {
    return <ul className="tabs">
        {/* i'd actually prefer to just provide relative routes, but than activeClassName won't match
                        see https://github.com/ReactTraining/react-router/issues/6201#issuecomment-403291934
                    */}
        <li className="tb col s3"><NavLink to={props.url + "/entries"}>Entries</NavLink></li>
        <li className="tb col s3"><NavLink to={props.url + "/comments"}>Comments</NavLink></li>
        <li className="tb col s3"><NavLink to={props.url + "/newlistentry"}>New Entry</NavLink></li>
    </ul>
}

SubTabNavigation.propTypes = {url: PropTypes.any};

export function BucketList({match, history}) {
    const id = match.params.id;
    const [bucketList, setBucketList] = React.useState(null);

    function update() {
        backendFetch("/bucketlists/" + id + "/")
            .then(data => setBucketList(data))
            .catch( e => setBucketList(null))
        ;
    }

    React.useEffect(
        () => {
            update();
        },
        [id]
    );

    const [counter, setCounter] = React.useState(66);
    function incrementCounter() { setCounter(i => i+1);}

    if (bucketList == null) {
        return <span>Loading</span>;
    }
    console.log(bucketList);

    async function importBucketList() {
        let targetListId = NaN;
        while (isNaN(targetListId)) {
            let input = prompt("id of target bucket list?");
            if (input === null) {
                return;
            }
            targetListId = parseInt( input);
        }
        await backendFetch.post("/bucketlists/" + targetListId + "/entries/cloneList/" + id + "/");


        let returnValue = window.confirm("Do you want to see your list?");
        if (returnValue) {
            history.push({pathname: "/bucketlist/" + targetListId} + "/entries/");
        }
    }

    return <div className="container">
        <div className="row">
            <BucketListDetails bucketList={bucketList} counter={counter} onLike={incrementCounter}
                               onImport={importBucketList}/>
        </div>
        <div className="row">
            <SubTabNavigation url={match.url}/>
        </div>
        <div className="row">
            <Switch>
                <Route path={match.path + "entries"}
                       render={() => <div className="col"><BucketListEntries id={id}/></div>}/>
                <Route path={match.path + "comments"}
                       render={() => <div className="col"><BucketListComments bucketList={bucketList} update={update}/>
                       </div>}/>
                <Redirect to={match.url + "/entries"}/>
            </Switch>
        </div>
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