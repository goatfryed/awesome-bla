import React, {useState} from "react";

function Comment({comment, onCommentCreation}) {

    return <div>
        <span>{comment.created.substr(0, 19)}: </span><span>{comment.comment}</span>
        <CommentInput onCommentCreation={(newComment) => onCommentCreation(newComment, comment)}/>
        <Comments comments={comment.comments} onCommentCreation={onCommentCreation}/>
    </div>
}

export function Comments({comments, onCommentCreation}) {
    return <ul>
        {comments && comments.map(comment => <Comment key={comment.id} comment={comment}
                                                      onCommentCreation={onCommentCreation}/>)}
    </ul>
}

export function CommentInput({onCommentCreation}) {
    let [comment, setComment] = useState('');

    function onSubmit(e) {
        e.preventDefault();

        if (comment.trim() === '') return;

        setComment('');
        onCommentCreation({comment});
    }

    return <form onSubmit={onSubmit}>
        <input type="text" value={comment} placeholder="Comment something" onChange={e => setComment(e.target.value)}/>
        <button type="submit">submit</button>
    </form>
}