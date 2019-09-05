package de.uniks.webengineering2019.bla.comments;

import de.uniks.webengineering2019.bla.api_errors.UnauthenticatedRequestException;
import de.uniks.webengineering2019.bla.authentication.UserContext;
import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.Comment;
import de.uniks.webengineering2019.bla.model.Commentable;
import de.uniks.webengineering2019.bla.model.User;
import de.uniks.webengineering2019.bla.repositories.BucketListRepository;
import de.uniks.webengineering2019.bla.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
public class CommentCreationService {

    private final CommentRepository commentRepository;
    private final UserContext userContext;
    private final BucketListRepository bucketListRepository;

    @Autowired
    public CommentCreationService (
        CommentRepository commentRepository,
        UserContext userContext,
        BucketListRepository bucketListRepository
    ) {
        this.commentRepository = commentRepository;
        this.userContext = userContext;
        this.bucketListRepository = bucketListRepository;
    }

    public void addComment(Comment comment, Commentable parent) {
        //BucketList bucketList = bucketListRepository.findById(parent.getCommentableRootListId()).get();
        final User user = userContext.getUser();
        if(!bucketListRepository.existsBucketListByIdAnd(parent.getCommentableRootListId(),user.getId()).equals(parent.getCommentableRootListId())){//safe for fake request so check accces
            throw new UnauthenticatedRequestException("the request requires a fully authenticated user, but was made anonymous");
        }
        comment.setUser(user);
        parent.getComments().add(comment);
        comment.setRoot_id(parent.getCommentableRootListId());
        commentRepository.save(comment);
    }
}
