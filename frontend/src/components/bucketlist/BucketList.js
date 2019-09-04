import React, {useCallback, useMemo, useState, useRef} from "react";
import {Link, Redirect} from "react-router-dom";
import {Route, Switch} from "react-router";
import {backendFetch} from "../../api";
import {CommentsBlock} from "./Comments";
import moment from "moment";
import * as PropTypes from "prop-types";
import {NavTabs} from "./NavTabs";
import {Button, Icon} from "react-materialize";
import {BucketListEntries} from "./BucketListEntries";
import {ListSettings} from "./ListSettings";

function DefaultListHeader({bucketList}) {
    const {description, title} = bucketList;
    return <>
        <h5>{title}</h5>
        <hr/>
        <p><strong>{description}</strong></p>
    </>;
}

DefaultListHeader.propTypes = {
    bucketList: PropTypes.object,
};

function EditableListHeader({bucketList, changedBucketListRef}) {

    let [title, setTitle] = useState(bucketList.title);
    let [description, setDescription] = useState(bucketList.description || "");
    changedBucketListRef.current = {
        title,
        description
    };

    return <>
        <input value={title} onChange={e => setTitle(e.target.value)}/>
        <hr/>
        <textarea value={description} onChange={e => setDescription(e.target.value)}
                  rows={5}
                  style={{resize: "vertical"}}
        />
    </>
}

DefaultListHeader.propTypes = {
    bucketList: PropTypes.object,
};

function BucketListDetails({bucketList, onUpdateBucketList, history}) {

    let cloneLocation = useMemo(
        () => ({
            pathname: "/import/",
            state: {
                bucketList,
            }
        }),
        [bucketList]
    );

    let [editing, setEditing] = useState(false);
    let changedBucketList = useRef(null);

    let [counter, setCounter] = useState(bucketList.voteCount)

    function upvoteList() {
        backendFetch.post("/bucketlists/" + bucketList.id + "/upvote/", {}).then(updateVoteCount);
    }

    function downvoteList() {
        backendFetch.post("/bucketlists/" + bucketList.id + "/downvote/", {}).then(updateVoteCount);
    }

    async function updateVoteCount() {
        let newCounter = await backendFetch.get("/bucketlists/" + bucketList.id + "/votecount");
        setCounter(newCounter);
    }

    function deleteList() {
        backendFetch.delete("/bucketlists/" + bucketList.id + "/delete").then(response => {
            history.push("/");
        });
    }

    let editIconType = editing ? "save" : "edit";

    let onSubmit = useCallback(
        async e => {
            // interesting enough, if we would tougle the button type between submit and button based on editing state
            // the event is only processed after the toggle applied, not before
            if (e !== undefined) {
                e.preventDefault()
            }
            if (!editing) {
                setEditing(true);
                return;
            }
            let isDirty = false;
            for (let field in changedBucketList.current) {
                if (changedBucketList.current.hasOwnProperty(field) && changedBucketList.current[field] !== bucketList[field]) {
                    isDirty = true;
                    break;
                }
            }
            if (isDirty) {
                await onUpdateBucketList(changedBucketList.current);
            }
            setEditing(false);
        },
        [editing, onUpdateBucketList, bucketList]
    );

    return <form className="row" onSubmit={onSubmit}>
        <div className="col s10 offset-s1">
            <div>
                {editing ? <EditableListHeader
                    key={bucketList.id} bucketList={bucketList}
                    changedBucketListRef={changedBucketList}
                /> : <DefaultListHeader bucketList={bucketList}/>}
                <small>{counter} · <a onClick={upvoteList} href="#like">Like</a> | <a onClick={downvoteList}
                                                                                      href="#dislike">Dislike</a>
                    · <span>{moment(bucketList.created).fromNow()}</span>
                    · <Link className="button" to={cloneLocation}>Copy</Link>
                </small>
            </div>
        </div>
        <div className="col s1 valign-wrapper">
            <ul>
                <li><Button type="submit" disabled={!bucketList.ownList}
                            waves="light"><Icon>{editIconType}</Icon></Button></li>
                <li style={{marginTop: "5px"}}><Button onClick={deleteList} type="button" className="red" waves="light"><Icon>delete</Icon></Button>
                </li>
            </ul>
        </div>
    </form>;
}

BucketListDetails.propTypes = {
    bucketList: PropTypes.any,
    counter: PropTypes.number,
    onLike: PropTypes.func,
    editUrl: PropTypes.string,
};

function BucketListDefaultView({bucketList, url, path, onUpdateBucketList, history}) {

    let renderEntries = useCallback(() => <BucketListEntries id={bucketList.id}/>, [bucketList.id]);
    let renderComments = useCallback(() => <BucketListComments bucketList={bucketList}/>, [bucketList]);
    let renderSettings = useCallback(() => <ListSettings bucketList={bucketList}/>, [bucketList]);


    return <>
        <div className="row">
            <BucketListDetails
                bucketList={bucketList}
                editUrl={url + "/edit/"}
                onUpdateBucketList={onUpdateBucketList}
                history={history}
            />
        </div>
        <div className="row">
            <NavTabs links={bucketList.ownList ? [
                {
                    url: url + "/entries/",
                    title: "Entries",
                },
                {
                    url: url + "/comments/",
                    title: "Comments",
                },
                {
                    url: url + "/settings",
                    title: "Settings",
                },
                {
                    url: url + "/newlistentry",
                    title: "New list entry",
                    navLinkProps: {target: "_self"},
                }
            ] : [
                {
                    url: url + "/entries/",
                    title: "Entries",
                },
                {
                    url: url + "/comments/",
                    title: "Comments",
                },
                {
                    url: url + "/newlistentry",
                    title: "New list entry",
                    navLinkProps: {target: "_self"},
                }
            ]}/>
        </div>
        <div>
            <Switch>
                <Route strict path={path + "entries/"}
                       render={renderEntries}/>
                <Route strict path={path + "comments/"}
                       render={renderComments}/>
                <Route path={path + "settings"}
                       render={renderSettings}/>
                <Redirect to={url + "/entries/"}/>
            </Switch>
        </div>
    </>;
}

BucketListDefaultView.propTypes = {
    bucketList: PropTypes.any,
    counter: PropTypes.number,
    onLike: PropTypes.func,
    url: PropTypes.any,
    path: PropTypes.any,
    render: PropTypes.func,
    render1: PropTypes.func,
    render2: PropTypes.func
};

export function BucketList({match, history}) {
    const id = match.params.id;
    const [bucketList, setBucketList] = React.useState(null);

    let loadBucketList = useCallback(
        function () {
            backendFetch.get("/bucketlists/" + id + "/")
                .then(data => setBucketList(data))
                .catch(() => {
                    setBucketList(null)
                })
            ;
        },
        [id]
    );

    let updateBucketList = useCallback(
        async update => {
            let jsonChange = JSON.stringify(update);
            let data = await backendFetch.put(
                "/bucketlists/" + id + "/", {
                    body: jsonChange
                });
            setBucketList(data);
        },
        [id]
    );

    React.useEffect(
        () => {
            loadBucketList();
        },
        [loadBucketList]
    );


    if (bucketList == null) {
        return <span>Loading</span>;
    }


    return <div>
        <BucketListDefaultView
            bucketList={bucketList}
            url={match.url}
            path={match.path}
            update={loadBucketList}
            onUpdateBucketList={updateBucketList}
            history={history}
        />
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
