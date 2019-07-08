import React, {useState} from "react";
import {addCommentReply} from "../../api";
import Authentication from "../../authentication/Authentication";

export function CommentsBlock({onRootCommentCreation, onReplyCreated, comments}) {
    return <div className="content">
        <CommentInput onCommentCreation={onRootCommentCreation}/>
        {
            comments.length === 0 ? <span>No comments yet</span>
            : <Comments comments={comments} onCommentReplyCreated={onReplyCreated}/>
        }
    </div>
}

function Comment({comment, onCommentReplyCreated}) {

    async function onCommentCreation(reply) {
        await addCommentReply(reply, comment.id);
        onCommentReplyCreated && onCommentReplyCreated(reply, comment);
    };

    let user = comment.user == null ? "anonymous" : comment.user.userName;

    return <li className="collection-item">
        <small>{user} · {comment.created.substr(0, 19)}</small>
        <div>{comment.comment}</div>
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

    if (!Authentication.isAuthenticated()) {
        return null;
    }

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