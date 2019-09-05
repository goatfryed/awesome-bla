package de.uniks.webengineering2019.bla.comments;

import de.uniks.webengineering2019.bla.authentication.UserContext;
import de.uniks.webengineering2019.bla.model.Comment;
import de.uniks.webengineering2019.bla.model.Commentable;
import de.uniks.webengineering2019.bla.model.User;
import de.uniks.webengineering2019.bla.repositories.CommentRepository;
import org.springframework.stereotype.Component;

@Component
public class CommentCreationService {

    private final CommentRepository commentRepository;
    private final UserContext userContext;

    public CommentCreationService (
        CommentRepository commentRepository,
        UserContext userContext
    ) {
        this.commentRepository = commentRepository;
        this.userContext = userContext;
    }

    public void addComment(Comment comment, Commentable parent) {
        final User user = userContext.geUserOrThrow();
        comment.setUser(user);
        parent.getComments().add(comment);
        commentRepository.save(comment);
    }
}
