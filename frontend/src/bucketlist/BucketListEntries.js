import React, {useEffect, useState} from "react";
import {backendUrl} from "../config";

const commentsUrl = backendUrl + "/comments";

export function BucketListEntries({match}) {
    let {id} = match.params;
    let pagePath = backendUrl + "/bucketlists/"+id+"/entries";

    let [entries, setEntries] = useState(null);

    useEffect(() => {
            (async () => {
                const response = await fetch( pagePath+"/");
                const json = await response.json();
                setEntries(json);
            })();
        },
        [pagePath]
    );
    return <ul>
            {entries && entries.map( entry => <BucketListEntry key={entry.id} entry={entry} pagePath={pagePath}/>)}
    </ul>;
}



function BucketListEntry({entry, pagePath}) {
    let [showDetails, setShowDetails] = useState(false);


    return <li>
        <input type="checkbox" defaultChecked={entry.completed} />
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
        <Comments comments={comment.comments} forceUpdate={forceUpdate}/>
        <CommentInput onCommentCreation={onCommentCreation}/>
    </div>
}

function Comments({comments, forceUpdate}) {
    return <ul>
        {comments.map(comment => <Comment key={comment.id} comment={comment} forceUpdate={forceUpdate}/>)}
    </ul>
}

function CommentInput({onCommentCreation}) {
    let [comment, setComment] = useState('');

    function onSubmit(e) {
        e.preventDefault();

        if(comment.trim() === '') return;

        onCommentCreation && onCommentCreation({comment});
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