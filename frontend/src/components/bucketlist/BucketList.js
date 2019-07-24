import React from "react";
import {Redirect} from "react-router-dom";
import {Route, Switch} from "react-router";
import {BucketListEntries} from "./BucketListEntries";
import {backendFetch} from "../../api";
import {CommentsBlock} from "./Comments";
import moment from "moment";
import * as PropTypes from "prop-types";
import {NavTabs} from "./NavTabs";

function BucketListDetails(props) {
    return <article className="media">
        <figure className="media-left">
            <p className="image is-64x64">
                <img src="https://bulma.io/images/placeholders/128x128.png" alt="icon"/>
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

export function BucketList({match, history}) {
    const id = match.params.id;
    const [bucketList, setBucketList] = React.useState(null);

    function update() {
        backendFetch("/bucketlists/" + id + "/")
            .then(data => setBucketList(data))
            .catch( () => setBucketList(null))
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
            <NavTabs links={[
                {
                    url: match.url + "/entries",
                    title: "Entries",
                },
                {
                    url: match.url + "/comments",
                    title: "Comments",
                },
                {
                    url: match.url + "/newlistentry",
                    title: "New list entry",
                    navLinkProps: {target: "_self"},
                }
            ]} />
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