package de.uniks.webengineering2019.bla.controllers;

import de.uniks.webengineering2019.bla.authentication.UserContext;
import de.uniks.webengineering2019.bla.comments.CommentCreationService;
import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.Comment;
import de.uniks.webengineering2019.bla.model.User;
import de.uniks.webengineering2019.bla.repositories.BucketListRepository;
import de.uniks.webengineering2019.bla.repositories.CommentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
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
        //return bucketListRepository.findByPrivateList(false);
    }

    @GetMapping("/all2")
    public List<BucketList> getAllLists2(){
        if(userContext.hasUser()){
            return bucketListRepository.findByPrivateListOrAccessedUsersContainsOrOwner(false, userContext.getUser(), userContext.getUser());
        }else{
            return bucketListRepository.findByPrivateList(false);
        }

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
        bucketListRepository.save(newBucketList);
    }


}
