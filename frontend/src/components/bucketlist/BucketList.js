import React, {useMemo} from "react";
import {Link, Redirect} from "react-router-dom";
import {Route, Switch} from "react-router";
import {BucketListEntries} from "./BucketListEntries";
import {backendFetch} from "../../api";
import {CommentInput, Comments, CommentsBlock} from "./Comments";
import {ListSettings} from "./ListSettings";
import moment from "moment";
import * as PropTypes from "prop-types";
import {NavTabs} from "./NavTabs";

function BucketListDetails({onLike, bucketList, counter}) {

    let cloneLocation = useMemo(
        () => ({
            pathname: "/import/",
            state: {
                bucketList,
            }
        }),
        [bucketList]
    );

    return <article className="row">
        <div className="col s10 offset-s1">
            <div>
                <h5>{bucketList.title}</h5>
                <hr/>
                <small>{counter} · <a onClick={onLike}>Like</a>
                    · <span>{moment(bucketList.created).fromNow()}</span>
                    · <Link className="button" to={cloneLocation}>Copy</Link>
                </small>
            </div>
        </div>
    </article>;
}

BucketListDetails.propTypes = {
    bucketList: PropTypes.any,
    counter: PropTypes.number,
    onLike: PropTypes.func,
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



    return <div className="container">
        <div className="row">
            <BucketListDetails bucketList={bucketList} counter={counter} onLike={incrementCounter} />
        </div>
        <div className="row">
            <NavTabs links={bucketList.ownList?[
                {
                    url: match.url + "/entries/",
                    title: "Entries",
                },
                {
                    url: match.url + "/comments/",
                    title: "Comments",
                },
                {
                    url: match.url + "/settings",
                    title: "Settings",
                },
                {
                    url: match.url + "/newlistentry",
                    title: "New list entry",
                    navLinkProps: {target: "_self"},
                }
            ]:[
                {
                    url: match.url + "/entries/",
                    title: "Entries",
                },
                {
                    url: match.url + "/comments/",
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
                <Route strict path={match.path + "entries/"}
                       render={() => <div className="col"><BucketListEntries id={id}/></div>}/>
                <Route strict path={match.path + "comments/"}
                       render={() => <div className="col"><BucketListComments bucketList={bucketList} update={update}/>
                       </div>}/>
                <Route path={match.path+"settings"}
                       render={() => <ListSettings bucketList={bucketList}/>} />
                <Redirect to={match.url + "/entries/"}/>
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