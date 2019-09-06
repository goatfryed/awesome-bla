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
    const {description, title, created, owner} = bucketList;
    return <>
        <h2>{title} from {owner.userName}</h2>
        <hr/>
        <p><strong>{description}</strong> • created {moment(created).fromNow()}</p>
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

    function upvoteList(event) {
        event.preventDefault();
        backendFetch.post("/bucketlists/" + bucketList.id + "/upvote/", {}).then(updateVoteCount);
    }

    function downvoteList(event) {
        event.preventDefault();
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

    const buttonBar =
        <>
            <span className="btn-small">{counter} Votes</span>
            <Button waves="light" small className="ml05" onClick={upvoteList}><Icon>arrow_upward</Icon></Button>
            <Button waves="light" small className="cancelBtn ml05"
                    onClick={downvoteList}><Icon>arrow_downward</Icon></Button>
            <Link to={cloneLocation}><Button waves="light" small className="ml05 light-blue"><Icon
                left>content_copy</Icon>Copy</Button></Link>
        </>
    ;

    return <>
        <form className="row" onSubmit={onSubmit}>
            <div className="col s2 noPadding">
                <img className="mt2rem" src="/list.svg" alt="ListIcon"/>
            </div>
            <div className="col s8 m9">
                <div>
                    {editing ? <EditableListHeader
                        key={bucketList.id} bucketList={bucketList}
                        changedBucketListRef={changedBucketList}
                    /> : <DefaultListHeader bucketList={bucketList}/>}
                    <div id="desktop_buttonBar">
                        {buttonBar}
                    </div>
                </div>
            </div>
            <div className="col s2 m1 noPadding">
                <Button className="mt2rem fullWidth" type="submit" disabled={!bucketList.ownList}
                        waves="light"><Icon>{editIconType}</Icon></Button>
                <Button disabled={!bucketList.ownList} onClick={deleteList} type="button" className="red mt05 fullWidth"
                        waves="light"><Icon>delete</Icon></Button>
            </div>
        </form>

        <div id="mobile_buttonBar">
            {buttonBar}
        </div>
    </>
        ;
}

BucketListDetails.propTypes = {
    bucketList: PropTypes.any,
    counter: PropTypes.number,
    onLike: PropTypes.func,
    editUrl: PropTypes.string,
};

function BucketListDefaultView({bucketList, url, path, onUpdateBucketList, history, refresh}) {

    let renderEntries = useCallback(() => <BucketListEntries id={bucketList.id}/>, [bucketList.id]);
    let renderComments = useCallback(() => <BucketListComments refresh={refresh} bucketList={bucketList}/>, [bucketList, refresh]);
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
            refresh={loadBucketList}
            onUpdateBucketList={updateBucketList}
            history={history}
        />
    </div>
}

function BucketListComments({bucketList, refresh}) {

    async function addCommentToBucketList(comment) {
        await backendFetch.post(
            "/bucketlists/" + bucketList.id + "/comments/",
            {body: JSON.stringify(comment)}
        );
        refresh();
    }

    return <CommentsBlock
        onRootCommentCreation={addCommentToBucketList}
        onReplyCreated={refresh}
        comments={bucketList.comments}
    />
}
