package de.uniks.webengineering2019.bla.controllers;

import de.uniks.webengineering2019.bla.authentication.UserContext;
import de.uniks.webengineering2019.bla.comments.CommentCreationService;
import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.Comment;
import de.uniks.webengineering2019.bla.model.User;
import de.uniks.webengineering2019.bla.repositories.BucketListRepository;
import de.uniks.webengineering2019.bla.repositories.CommentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@CrossOrigin
@RequestMapping("/bucketlists/")
@RestController
public class BucketListController{

    private final BucketListRepository bucketListRepository;
    private final CommentCreationService commentCreationService;
    private final UserContext userContext;

    public BucketListController(
        BucketListRepository bucketListRepository,
        CommentCreationService commentCreationService,
        UserContext userContext
    ) {
        this.bucketListRepository = bucketListRepository;
        this.commentCreationService = commentCreationService;
        this.userContext = userContext;
    }

    @GetMapping("/all")
    public List<BucketList> getAllLists(){
        return bucketListRepository.findAll();
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

    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    public void addList(@RequestBody BucketList newBucketList) {
        newBucketList.setCreationDate(new Date());
        newBucketList.setLastUpdated(new Date());
        bucketListRepository.save(newBucketList);
    }

    @PostMapping("/{bucketList}/upvote")
    @ResponseStatus(HttpStatus.CREATED)
    public void upvoteList(@PathVariable BucketList bucketList) {
        final User user = userContext.getUser();
        bucketList.upvote(user);
    }

    @PostMapping("/{bucketList}/downvote")
    @ResponseStatus(HttpStatus.CREATED)
    public void downvoteList(@PathVariable BucketList bucketList) {
        final User user = userContext.getUser();
        bucketList.downvote(user);
    }

    @GetMapping("/{bucketList}/votecount")
    public int getVoteCount(@PathVariable BucketList bucketList) {
        return bucketList.countVotes();
    }
}
