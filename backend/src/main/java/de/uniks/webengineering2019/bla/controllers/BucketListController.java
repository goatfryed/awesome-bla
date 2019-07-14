package de.uniks.webengineering2019.bla.controllers;

import de.uniks.webengineering2019.bla.comments.CommentCreationService;
import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.Comment;
import de.uniks.webengineering2019.bla.repositories.BucketListRepository;
import de.uniks.webengineering2019.bla.repositories.CommentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RequestMapping("/bucketlists/")
@RestController
public class BucketListController{

    private final BucketListRepository bucketListRepository;
    private final CommentCreationService commentCreationService;

    public BucketListController(
        BucketListRepository bucketListRepository,
        CommentCreationService commentCreationService
    ) {
        this.bucketListRepository = bucketListRepository;
        this.commentCreationService = commentCreationService;
    }

    @GetMapping("/all")
    public List<BucketList> getAllLists(){
        return bucketListRepository.findAll();
        //return bucketListRepository.findByPrivateList(false);
    }

    @GetMapping("/{bucketList}/")
    public BucketList get(@PathVariable BucketList bucketList) {
        bucketList.getEntries().clear();
        return bucketList;
    }

    @PostMapping("/{bucketList}/comments/")
    @ResponseStatus(HttpStatus.CREATED)
    public void addComment(
            @RequestBody Comment comment,
            @PathVariable BucketList bucketList
    ) {
        if (bucketList == null) {
            throw new ResourceNotFoundException("requested entry unknown");
        }
        commentCreationService.addComment(comment, bucketList);
    }
}
