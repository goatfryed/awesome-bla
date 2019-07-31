import {keyBy} from "lodash/collection";
import moment from "moment";
import * as PropTypes from "prop-types";
import React, {useEffect, useState, useCallback} from "react";
import {Route, Switch, withRouter} from "react-router";
import {Link} from "react-router-dom";
import {Checkbox} from "react-materialize";

import BucketListEntryDetails from "./BucketListEntryDetails";
import {CommentsBlock} from "./Comments";
import {backendFetch} from "../../api";

function EntryListView({entries, forceUpdate, onSelect, pagePath}) {

    if (entries === null) {
        return <span>Loading</span>
    }

    entries = Object.values(entries);

    return <div className="column">
        <ul className="collection">
            {entries.map(entry => <BucketListEntry key={entry.id} entry={entry} pagePath={pagePath}
                                        forceUpdate={forceUpdate} onSelect={onSelect}/>
            )}
        </ul>
    </div>;
}

EntryListView.propTypes = {
    entries: PropTypes.any.isRequired,
    forceUpdate: PropTypes.func.isRequired,
};

export const BucketListEntries = withRouter(BucketListEntriesBase)

function BucketListEntriesBase({id, match}) {
    let pagePath = "/bucketlists/"+id+"/entries";

    let [entries, setEntries] = useState(null);

    let update = useCallback(
        async () => {
        const json = await backendFetch(pagePath + "/");
        setEntries(keyBy(json, o => o.id));
        },
        [pagePath]
    );

    useEffect(() => {
            update();
        },
        [update]
    );



    return <Switch>
        <Route exact strict path={match.path}>
            <EntryListView pagePath={pagePath} entries={entries} forceUpdate={update}/>
        </Route>
        <Route path={match.path + ":entryId"}
            render={
                ({match}) => <BucketListEntryDetails
                    isLoading={entries === null}
                    selectedEntry={entries && entries[match.params.entryId]}
                    onUpdate={update}
                    pagePath={pagePath}
                />
            }
        />
    </Switch>
}

const BucketListEntry = withRouter(BucketListEntryView);

function BucketListEntryView({entry, pagePath, forceUpdate, history, onSelect, match}) {
    let [showComments, setShowComments] = useState(false);


    async function toggleCompletionState(wasCompleted) {
        let nextEntryState = {
            completed: wasCompleted ? null : Date.now()
        };

        const response = await backendFetch.put(
            pagePath + "/" + entry.id + "/", {
            body: JSON.stringify(nextEntryState)
        });
        forceUpdate();
    }

    let onToggleDone = e => {
        e.stopPropagation();
        e.preventDefault();
        toggleCompletionState(entry.completed);
    };

    async function copyEntryToBucketList() {
        let targetListId = NaN;
        while (isNaN(targetListId)) {
            let input = prompt("id of target bucket list?");
            if (input === null) {
                return;
            }
            targetListId = parseInt( input);
        }
        await backendFetch.post("/bucketlists/" + targetListId + "/entries/cloneEntry/" + entry.id + "/");

        let returnValue = window.confirm("Do you want to see your list?");
        if (returnValue) {
            history.push({pathname: "/bucketlist/" + targetListId + "/entries/"});
        }
    }

    return <li className="collection-item">
        <div>
            <label>
            <input
                type="checkbox"
                checked={!!entry.completed}
                onChange={onToggleDone}
            /><span/></label>
            &nbsp;<Link to={match.url + entry.id + "/"}>{entry.title}</Link>
            <small>
                 ·
                {moment(entry.created).fromNow()}
                 · <button onClick={() => setShowComments(!showComments)}>Talk</button>
                 · <button onClick={copyEntryToBucketList}>copy</button>
            </small>
        </div>
        {showComments && <ExtendedEntry entry={entry} pagePath={pagePath}/>}
    </li>;
}

function ExtendedEntry({entry, pagePath}) {
    let [details, setDetails] = useState(null);

    let entryPath = pagePath+"/"+entry.id+"/";

    async function update() {
        const json = await backendFetch( entryPath);
        setDetails(json);
    }

    useEffect(
        function () {update();},
        [entryPath]
    );

    async function onCommentCreation(comment, url) {
        await createComment(comment, url);
        return await update();
    }

    function onCommentToEntry(comment) {
        return onCommentCreation(comment, entryPath + "comments/");
    }

    return details == null
        ? <div>"loading"</div>
        : <CommentsBlock
            comments={details.comments}
            onRootCommentCreation={onCommentToEntry}
            onReplyCreated={update}
        />
}



function createComment(comment, url) {
    return backendFetch.post(
        url,{
        body: JSON.stringify(comment)
    });
}