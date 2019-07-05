package de.uniks.webengineering2019.bla.controllers;


import de.uniks.webengineering2019.bla.model.Comment;
import de.uniks.webengineering2019.bla.repositories.CommentRepository;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RequestMapping("/comments/{parent}")
@RestController
public class CommentController {

    @NonNull
    CommentRepository commentRepository;

    public CommentController(
        @NonNull CommentRepository commentRepository
    ) {
        this.commentRepository = commentRepository;
    }

    @PostMapping("/")
    public void addComment(@RequestBody Comment comment, @PathVariable Comment parent)
    {
        parent.getComments().add(comment);
        commentRepository.save(comment);
        commentRepository.save(comment);

    }
}