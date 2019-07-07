import React, {useEffect, useState} from "react";
import {CommentInput, Comments} from "./Comments";
import {backendFetch} from "../../api";

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
    return <div  className="content"><ul className="collection">
        {entries && entries.map( entry => <BucketListEntry key={entry.id} entry={entry} pagePath={pagePath} forceUpdate={update}/>)}
    </ul></div>;
}

function BucketListEntry({entry, pagePath, forceUpdate}) {
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

    return <li className="collection-item">
        <label>
            <input type="checkbox" checked={entry.completed || false} onChange={() => toggleCompletionState(entry.completed)}/>
            <span onClick={() => setShowDetails(!showDetails)}>{entry.title}</span>
        </label>
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
        : <div>
            <CommentInput onCommentCreation={onCommentToEntry}/>
            <Comments comments={details.comments} onCommentReplyCreated={update}/>
        </div>
}

function createComment(comment, url) {
    return backendFetch.post(
        url,{
        body: JSON.stringify(comment)
    });
}