import React, {useEffect, useState} from "react";
import {backendUrl} from "../config";

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

    useEffect(
        function () {
            (async function() {
                const response = await fetch( pagePath+"/"+entry.id+"/");
                const json = await response.json();
                setDetails(json);
            })();
        },
        [entry]
    );

    function onCommentCreation(comment) {
        console.log(comment);
    }



    return details == null
        ? <div>"loading"</div>
        : <div>
            <CommentInput onCommentCreation={onCommentCreation}/>
            <Comments comments={details.comments}/>
        </div>
}

function Comment({comment}) {
    function onCommentCreation(comment) {
        console.log(comment);
    }

    return <div>
        <span>{comment.created.substr(0,19)}: </span><span>{comment.comment}</span>
        <Comments comments={comment.comments} />
        <CommentInput onCommentCreation={onCommentCreation}/>
    </div>
}

function Comments({comments}) {
    return <ul>
        {comments.map(comment => <Comment key={comment.id} comment={comment}/>)}
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