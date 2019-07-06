import React, {useEffect, useState} from "react";
import {backendUrl} from "../../config";

const commentsUrl = backendUrl + "/comments";

export function BucketListEntries({match}) {
    let {id} = match.params;
    let pagePath = backendUrl + "/bucketlists/"+id+"/entries";

    let [entries, setEntries] = useState(null);

    let update = async () => {
        const response = await fetch(pagePath + "/");
        const json = await response.json();
        setEntries(json);
    };

    useEffect(() => {
            update();
        },
        [pagePath]
    );
    return <ul>
            {entries && entries.map( entry => <BucketListEntry key={entry.id} entry={entry} pagePath={pagePath} forceUpdate={update}/>)}
    </ul>;
}



function BucketListEntry({entry, pagePath, forceUpdate}) {
    let [showDetails, setShowDetails] = useState(false);


    async function toggleCompletionState(wasCompleted) {
        let nextEntryState = {
            completed: wasCompleted ? null : Date.now()
        };

        const response = await fetch(
            pagePath + "/" + entry.id + "/", {
            method: "put",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nextEntryState)
        });
        forceUpdate();
    }

    return <li>
        <input type="checkbox" checked={entry.completed || false} onChange={() => toggleCompletionState(entry.completed)}/>
        <span onClick={() => setShowDetails(!showDetails)}>{entry.title}</span>
        {showDetails && <ExtendedEntry entry={entry} pagePath={pagePath}/>}
    </li>;
}

function ExtendedEntry({entry, pagePath}) {
    let [details, setDetails] = useState(null);

    let entryPath = pagePath+"/"+entry.id+"/";

    async function update() {
        const response = await fetch( entryPath);
        const json = await response.json();
        setDetails(json);
    }

    useEffect(
        function () {update();},
        [entryPath]
    );

    async function onCommentCreation(comment) {
        await createComment(comment, entryPath + "comments/");
        update();
    }

    return details == null
        ? <div>"loading"</div>
        : <div>
            <CommentInput onCommentCreation={onCommentCreation}/>
            <Comments comments={details.comments} forceUpdate={update}/>
        </div>
}

function Comment({comment, forceUpdate}) {
    async function onCommentCreation(newComment) {

        await createComment(newComment, commentsUrl + "/" + comment.id +"/");
        forceUpdate();
    }

    return <div>
        <span>{comment.created.substr(0,19)}: </span><span>{comment.comment}</span>
        <CommentInput onCommentCreation={onCommentCreation}/>
        <Comments comments={comment.comments} forceUpdate={forceUpdate}/>
    </div>
}

function Comments({comments, forceUpdate}) {
    return <ul>
        {comments && comments.map(comment => <Comment key={comment.id} comment={comment} forceUpdate={forceUpdate}/>)}
    </ul>
}

function CommentInput({onCommentCreation}) {
    let [comment, setComment] = useState('');

    function onSubmit(e) {
        e.preventDefault();

        if(comment.trim() === '') return;

        setComment('');
        onCommentCreation({comment});
    }

    return <form onSubmit={onSubmit}>
        <input type="text" value={comment} placeholder="Comment something" onChange={e => setComment(e.target.value)} />
        <button type="submit">submit</button>
    </form>
}

function createComment(comment, url) {
    return fetch(
        url,{
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment)
    });
}