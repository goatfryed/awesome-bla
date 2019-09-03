import {keyBy} from "lodash/collection";
import moment from "moment";
import * as PropTypes from "prop-types";
import React, {useEffect, useState, useCallback, useReducer, useMemo} from "react";
import {Route, Switch, withRouter} from "react-router";
import {Link} from "react-router-dom";

import BucketListEntryDetails from "./BucketListEntryDetails";
import {CommentsBlock} from "./Comments";
import {backendFetch} from "../../api";
import {Button, Icon} from "react-materialize";

function EntryListView({entries, refresh, onSelect, pagePath, onDelete}) {

    if (entries === null) {
        return <span>Loading</span>
    }

    entries = Object.values(entries);

    return <div className="column">
        <ul className="collection">
            {entries.map(entry => <BucketListEntry
                    key={entry.id} pagePath={pagePath}
                    entry={entry}
                    refresh={refresh}
                    onSelect={onSelect}
                    onDelete={onDelete}
                />
            )}
        </ul>
    </div>;
}

EntryListView.propTypes = {
    entries: PropTypes.any,
    refresh: PropTypes.func.isRequired,
};

export const BucketListEntries = withRouter(BucketListEntriesBase);

function BucketListEntriesBase({id, match}) {
    let pagePath = "/bucketlists/"+id+"/entries";

    let [entries, setEntries] = useState(null);

    let refresh = useCallback(
        async () => {
        const json = await backendFetch(pagePath + "/");
        setEntries(keyBy(json, o => o.id));
        },
        [pagePath]
    );

    let deleteEntry = useCallback(
        async ({id}) => {
            await  backendFetch.delete( pagePath + "/" + id + "/");
            await refresh();
        },
        [pagePath, refresh]
    );

    useEffect(() => {
            refresh();
        },
        [refresh]
    );



    return <Switch>
        <Route exact strict path={match.path}>
            <EntryListView
                pagePath={pagePath}
                entries={entries}
                refresh={refresh}
                onDelete={deleteEntry}
            />
        </Route>
        <Route path={match.path + ":entryId"}
            render={
                ({match}) => <BucketListEntryDetails
                    isLoading={entries === null}
                    selectedEntry={entries && entries[match.params.entryId]}
                    refresh={refresh}
                    pagePath={pagePath}
                />
            }
        />
    </Switch>
}

const BucketListEntry = withRouter(BucketListEntryView);

function BucketListEntryView({entry, pagePath, refresh, history,  match, onDelete}) {

    let entryBackendUrl = pagePath + "/" + entry.id + "/";
    let [showComments, toggleComments] = useReducer(isChecked => !isChecked, false);

    let toggleCompletionState = useCallback(
        async function (wasCompleted) {
            let nextEntryState = {
                completed: wasCompleted ? null : Date.now()
            };

            await backendFetch.put(
                entryBackendUrl, {
                    body: JSON.stringify(nextEntryState)
                });
            refresh();
        },
        [refresh, entryBackendUrl]
    );

    let toggleCompleted = useCallback(
        e => {
            e.stopPropagation();
            e.preventDefault();
            toggleCompletionState(entry.completed);
        },
        [toggleCompletionState, entry.completed]
    );

    let cloneLocation = useMemo(() => ({
            pathname: "/import/",
            state: {
                entry,
                from: match.url
            }
        }),
        [entry, match.url]
    );

    return <li className="collection-item">
        <div>
            <label>
            <input
                type="checkbox"
                checked={!!entry.completed}
                onChange={toggleCompleted}
            /><span/></label>
            &nbsp;<Link to={match.url + entry.id + "/"}>{entry.title}</Link>
            <small>
                {" · "+ moment(entry.created).fromNow() + " · "}
                 <Button className="btn-small" onClick={() => toggleComments(!showComments)}><Icon>comment</Icon></Button>
                 <Link className="btn btn-small" to={cloneLocation}><Icon>import_export</Icon></Link>
                 <Button className="btn-small red" onClick={() => onDelete(entry)}><Icon>delete</Icon></Button>
            </small>
        </div>
        {showComments && <ExtendedEntry entry={entry} pagePath={pagePath}/>}
    </li>;
}

function ExtendedEntry({entry, pagePath}) {
    let [details, setDetails] = useState(null);

    let entryPath = pagePath+"/"+entry.id+"/";

    let update = useCallback(
            async function update() {
            const json = await backendFetch( entryPath);
            setDetails(json);
        },
        [entryPath]
    );

    useEffect(
        function () {update();},
        [update]
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