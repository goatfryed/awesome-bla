package de.uniks.webengineering2019.bla.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.uniks.webengineering2019.bla.api_errors.InsuficientPermissionException;
import de.uniks.webengineering2019.bla.api_errors.ResourceNotFoundException;
import de.uniks.webengineering2019.bla.authentication.UserContext;
import de.uniks.webengineering2019.bla.comments.CommentCreationService;
import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.Comment;
import de.uniks.webengineering2019.bla.model.User;
import de.uniks.webengineering2019.bla.repositories.BucketListRepository;
import de.uniks.webengineering2019.bla.utils.PageSupport;
import jdk.internal.jline.internal.Nullable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

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

    void modifyBucketListByRequestingUser(Collection<BucketList> bucketListCollection){
        User user = userContext.getUserOrNull();
        for(BucketList bucketList:bucketListCollection){
            boolean userIsOwner = user != null && user.equals(bucketList.getOwner());
            bucketList.setOwnList(userIsOwner);
            if (userIsOwner) {
                continue;
            }
            bucketList.setShared(bucketList.getAccessedUsers().contains(user));
            bucketList.getAccessedUsers().clear();
        }
    }

    @GetMapping("/")
    public PageSupport<BucketList> getPublicLists(
        @RequestParam(defaultValue = "0")int page,
        @Nullable @RequestParam(required = false) String userName
    ){
        if(page<0){
            page = 0;
        }
        Pageable pageable = PageRequest.of(page,elementsOnPage);


        Page<BucketList> pageRessult;

        if (userName != null) {
            pageRessult = bucketListRepository.findForUserByOwnerUserName(userContext.getUserOrNull(), userName, pageable);
        } else {
            if(userContext.hasUser()){
                pageRessult = bucketListRepository.findByPrivateListOrAccessedUsersContainsOrOwnerOrderByCreationDateDescIdDesc(false, userContext.getUserOrThrow(), userContext.getUserOrThrow(),pageable);
            }else{
                pageRessult = bucketListRepository.findByPrivateListOrderByCreationDateDescIdDesc(false,pageable);
            }
        }

        int lasting = (int) pageRessult.getTotalElements() - (page+1) * elementsOnPage;
        if(lasting < 0){
            lasting = 0;
        }
        modifyBucketListByRequestingUser(pageRessult.getContent());
        return new PageSupport<BucketList>(pageRessult.getContent(),lasting);
    }

    @GetMapping("/{bucketList}")
    public BucketList get(@PathVariable BucketList bucketList) {
        bucketList.getEntries().clear();
        if (bucketList.isPrivateList()) {
            User user = userContext.getUserOrThrow();
            if (!user.equals(bucketList.getOwner()) && !bucketList.getAccessedUsers().contains(user)) {
                throw new InsuficientPermissionException("You can't access this list");
            }
        }
        modifyBucketListByRequestingUser(Collections.singletonList(bucketList));
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
    public ResponseEntity addPrivilegedUser(@PathVariable BucketList bucketList, @PathVariable User user){
        bucketList.getAccessedUsers().add(user);
        bucketList = bucketListRepository.save(bucketList);
        return ResponseEntity.ok(bucketList.getAccessedUsers());
    }

    @PostMapping("/{bucketList}/unprivelege/{user}")
    public ResponseEntity removePrivilegedUser(@PathVariable BucketList bucketList, @PathVariable User user){
        bucketList.getAccessedUsers().remove(user);
        bucketList = bucketListRepository.save(bucketList);
        return ResponseEntity.ok(bucketList.getAccessedUsers());
    }

    @PostMapping("/{bucketList}/private")
    public ResponseEntity removePrivilegedUser(@PathVariable BucketList bucketList, @RequestParam boolean value){
        bucketList.setPrivateList(value);
        bucketList = bucketListRepository.save(bucketList);
        return ResponseEntity.ok(bucketList.isPrivateList());
    }


    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    public void addList(@RequestBody BucketList newBucketList) {
        newBucketList.setCreationDate(new Date());
        newBucketList.setLastUpdated(new Date());
        newBucketList.setOwner(userContext.getUserOrThrow());
        newBucketList.setVoteCount(0);
        bucketListRepository.save(newBucketList);
    }

    @PostMapping("/{bucketList}/upvote")
    @ResponseStatus(HttpStatus.CREATED)
    public void upvoteList(@PathVariable BucketList bucketList) {
        final User user = userContext.getUserOrThrow();
        bucketList.upvote(user);
        bucketListRepository.save(bucketList);
    }

    @PostMapping("/{bucketList}/downvote")
    @ResponseStatus(HttpStatus.CREATED)
    public void downvoteList(@PathVariable BucketList bucketList) {
        final User user = userContext.getUserOrThrow();
        bucketList.downvote(user);
        bucketListRepository.save(bucketList);
    }

    @GetMapping("/{bucketList}/votecount")
    public int getVoteCount(@PathVariable BucketList bucketList) {
        return bucketList.getVoteCount();
    }

    @GetMapping("/search/{searchterm}")
    public List<BucketList> searchBucketList(@PathVariable("searchterm") String searchterm) {
        List<BucketList> publicResults = bucketListRepository.findByPrivateListAndTitleContainsIgnoreCaseOrderByCreationDateDescIdDesc(false, searchterm);
        List<BucketList> accessResults = bucketListRepository.findByAccessedUsersContainsAndTitleContainsIgnoreCaseOrderByCreationDateDescIdDesc(userContext.getUserOrThrow(),searchterm);
        List<BucketList> ownerResults = bucketListRepository.findByOwnerAndTitleContainsIgnoreCaseOrderByCreationDateDescIdDesc(userContext.getUserOrThrow(),searchterm);
        List<BucketList> allResults = new ArrayList<BucketList>(publicResults);
        allResults.addAll(accessResults);
        allResults.addAll(ownerResults);

        return allResults.stream().distinct().collect(Collectors.toList());
    }

    @PutMapping("/{bucketList}/")
    public BucketList updateBucketList(@PathVariable BucketList bucketList, @RequestBody String update, ObjectMapper mapper) throws IOException {
        if (bucketList == null) {
            throw new ResourceNotFoundException("requested entry unknown");
        }
        if (!userContext.getUserOrThrow().equals(bucketList.getOwner())) {
            throw new InsuficientPermissionException();
        }
        mapper.readerForUpdating(bucketList).readValue(update);
        BucketList updatedBucketList = bucketListRepository.save(bucketList);
        modifyBucketListByRequestingUser(Collections.singletonList(updatedBucketList));
        return updatedBucketList;
    }

    @DeleteMapping("/{bucketList}/delete")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void delete(@PathVariable BucketList bucketList) {
        bucketListRepository.delete(bucketList);
    }
}
