package de.uniks.webengineering2019.bla.controllers;

import antlr.StringUtils;
import de.uniks.webengineering2019.bla.authentication.UserContext;
import de.uniks.webengineering2019.bla.comments.CommentCreationService;
import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.Comment;
import de.uniks.webengineering2019.bla.model.User;
import de.uniks.webengineering2019.bla.repositories.BucketListRepository;
import de.uniks.webengineering2019.bla.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin
@RequestMapping("/bucketlists/")
@RestController
public class BucketListController{

    private final BucketListRepository bucketListRepository;
    private final CommentCreationService commentCreationService;
    private final UserContext userContext;

    @Value("${Page.Bucketlist.DefaultSize:10}")
    private int elementsOnPage;

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
        //return bucketListRepository.findByPrivateList(false);
    }

    void changeAccesedUsersByOwnder(Collection<BucketList> bucketListCollection){
        for(BucketList bucketList:bucketListCollection){
            if(bucketList.getOwner().getId() != userContext.getUser().getId()){
                bucketList.getAccessedUsers().clear();
            }
            bucketList.setOwnList(bucketList.getOwner().getId() == userContext.getUser().getId());
        }
    }

    @GetMapping("/all2")
    public List<BucketList> getAllLists2(@RequestParam(defaultValue = "0")int page){
        if(page<0){
            page = 0;
        }
        Pageable pageable = PageRequest.of(page,elementsOnPage);

        List<BucketList> list;
        if(userContext.hasUser()){
            list = bucketListRepository.findByPrivateListOrAccessedUsersContainsOrOwner(false, userContext.getUser(), userContext.getUser(),pageable).getContent();
        }else{
            list = bucketListRepository.findByPrivateList(false,pageable).getContent();
        }
        changeAccesedUsersByOwnder(list);
        return list;

    }

    @GetMapping("/{bucketList}/")
    public BucketList get(@PathVariable BucketList bucketList) {
        bucketList.getEntries().clear();
        changeAccesedUsersByOwnder(Collections.singletonList(bucketList));
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

    @PostMapping("/{bucketList}/privelege/{user}")
    public ResponseEntity addPriveledUser(@PathVariable BucketList bucketList,@PathVariable User user){
        bucketList.getAccessedUsers().add(user);
        bucketList = bucketListRepository.save(bucketList);
        return ResponseEntity.ok(bucketList.getAccessedUsers());
    }

    @PostMapping("/{bucketList}/unprivelege/{user}")
    public ResponseEntity removePriveledUser(@PathVariable BucketList bucketList,@PathVariable User user){
        bucketList.getAccessedUsers().remove(user);
        bucketList = bucketListRepository.save(bucketList);
        return ResponseEntity.ok(bucketList.getAccessedUsers());
    }

    @PostMapping("/{bucketList}/private")
    public ResponseEntity removePriveledUser(@PathVariable BucketList bucketList,@RequestParam boolean value){
        bucketList.setPrivateList(value);
        bucketList = bucketListRepository.save(bucketList);
        return ResponseEntity.ok(bucketList.isPrivateList());
    }


    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    public void addList(@RequestBody BucketList newBucketList) {
        newBucketList.setCreationDate(new Date());
        newBucketList.setLastUpdated(new Date());
        newBucketList.setOwner(userContext.getUser());
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
