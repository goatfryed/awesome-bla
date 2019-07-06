import React, {useState} from "react";
import {addCommentReply} from "../../api";

function Comment({comment, onCommentReplyCreated}) {

    async function onCommentCreation(reply) {
        await addCommentReply(reply, comment.id);
        onCommentReplyCreated && onCommentReplyCreated(reply, comment);
    };

    return <li className="collection-item">
        <span>{comment.created.substr(0, 19)}: </span><span>{comment.comment}</span>
        <CommentInput onCommentCreation={onCommentCreation}/>
        <Comments comments={comment.comments} onCommentReplyCreated={onCommentReplyCreated}/>
    </li>
}

export function Comments({comments, onCommentReplyCreated}) {
    return <ul className="collection">
        {comments && comments.map(comment => <Comment key={comment.id} comment={comment}
                                                      onCommentReplyCreated={onCommentReplyCreated}/>)}
    </ul>
}

export function CommentInput({onCommentCreation}) {
    let [comment, setComment] = useState('');

    function onSubmit(e) {
        e.preventDefault();

        if (comment.trim() === '') return;

        setComment('');
        onCommentCreation && onCommentCreation({comment});
    }

    return <form onSubmit={onSubmit}>
        <input type="text" value={comment} placeholder="Comment something" onChange={e => setComment(e.target.value)}/>
        <button type="submit">submit</button>
    </form>
}