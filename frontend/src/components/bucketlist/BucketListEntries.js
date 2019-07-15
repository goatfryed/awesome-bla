import React, {useEffect, useState} from "react";
import {CommentInput, Comments, CommentsBlock} from "./Comments";
import {backendFetch} from "../../api";
import {withRouter} from "react-router";

export function BucketListEntries({id}) {
    let pagePath = "/bucketlists/"+id+"/entries";

    let [entries, setEntries] = useState(null);

    let update = async () => {
        const json = await backendFetch(pagePath + "/");
        setEntries(json);
    };

    useEffect(() => {
            update();
        },
        [pagePath]
    );
    return <div  className=""><ul className="collection">
        {entries && entries.map( entry => <BucketListEntry key={entry.id} entry={entry} pagePath={pagePath} forceUpdate={update}/>)}
    </ul></div>;
}

const BucketListEntry = withRouter(BucketListEntryView);

function BucketListEntryView({entry, pagePath, forceUpdate, history}) {
    let [showDetails, setShowDetails] = useState(false);


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
            history.push({pathname: "/bucketlist/" + targetListId} + "/entries/");
        }
    }

    return <li className="collection-item">
        <div>
            <input type="checkbox"
                   checked={entry.completed || false}
                   onChange={onToggleDone}
                   // don't let the onClick handler for expander fire, if this checkbox is toggled
                   onClick={event => event.stopPropagation()}
            />&nbsp;<a onClick={e => {e.preventDefault(); setShowDetails(!showDetails)}}>{entry.title}</a>
            <br/>
            <small>
                {entry.created}
                 · <button onClick={copyEntryToBucketList}>copy</button>
            </small>
        </div>
        {showDetails && <ExtendedEntry entry={entry} pagePath={pagePath}/>}
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