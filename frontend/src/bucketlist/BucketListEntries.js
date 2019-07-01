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

    console.log(details);

    return <div>
        {
            details == null ? "loading"
                : [<CommentInput />, <Comments comments={details.comments}/>]
        }
    </div>
}

function Comment({comment}) {
    return <div>
        <span>{comment.created.substr(0,19)}: </span><span>{comment.comment}</span>
        <Comments comments={comment.comments} />
        <CommentInput />
    </div>
}

function Comments({comments}) {
    return <ul>
        {comments.map(comment => <Comment key={comment.id} comment={comment}/>)}
    </ul>
}

function CommentInput() {
    return <input type="text" placeholder="Comment something" />
}