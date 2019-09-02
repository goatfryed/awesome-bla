package de.uniks.webengineering2019.bla.comments;


import de.uniks.webengineering2019.bla.api_errors.ResourceNotFoundException;
import de.uniks.webengineering2019.bla.model.Comment;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RequestMapping("/comments/{parent}")
@RestController
public class CommentController {

    @NonNull
    private final CommentCreationService commentCreationService;

    public CommentController(
            @NonNull CommentCreationService commentCreationService
            ) {
        this.commentCreationService = commentCreationService;
    }

    @PostMapping("/")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void addComment(@RequestBody Comment comment, @PathVariable Comment parent)
    {
        if (parent == null) {
            throw new ResourceNotFoundException("comment not found");
        }
        commentCreationService.addComment(comment, parent);
    }
}
