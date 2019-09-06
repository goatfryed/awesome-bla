package de.uniks.webengineering2019.bla.controllers;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.uniks.webengineering2019.bla.api_errors.InsuficientPermissionException;
import de.uniks.webengineering2019.bla.api_errors.ResourceNotFoundException;
import de.uniks.webengineering2019.bla.authentication.UserContext;
import de.uniks.webengineering2019.bla.comments.CommentCreationService;
import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.BucketListEntry;
import de.uniks.webengineering2019.bla.model.Comment;
import de.uniks.webengineering2019.bla.model.User;
import de.uniks.webengineering2019.bla.repositories.BucketListEntryRepository;
import de.uniks.webengineering2019.bla.repositories.BucketListRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RequestMapping("/bucketlists/{bucketList}/entries")
@RestController
public class BucketListEntryController {

    private static Logger logger = LoggerFactory.getLogger(BucketListEntryController.class);

    @NonNull
    private final BucketListEntryRepository entryRepository;
    @NonNull
    private final BucketListRepository bucketListRepository;
    @NonNull
    private final CommentCreationService commentCreationService;
    @NonNull
    private final ObjectMapper objectMapper;
    @NonNull
    private final UserContext userContext;

    public BucketListEntryController(
            @NonNull BucketListEntryRepository entryRepository,
            @NonNull BucketListRepository bucketListRepository,
            @NonNull CommentCreationService commentCreationService,
            @NonNull ObjectMapper objectMapper,
            @NonNull UserContext userContext
    ) {
        this.entryRepository = entryRepository;
        this.bucketListRepository = bucketListRepository;
        this.commentCreationService = commentCreationService;
        this.objectMapper = objectMapper;
        this.userContext = userContext;
    }

    @GetMapping("/")
    public List<BucketListEntry> list(@PathVariable BucketList bucketList)
    {
        guardUserCanView(bucketList);
        bucketList.getEntries().forEach(p -> p.getComments().clear());

        return new ArrayList<>(bucketList.getEntries());
    }

    @GetMapping("/{entry}/")
    public BucketListEntry comments(@PathVariable BucketListEntry entry)
    {
        guardUnknownEntry(entry);
        guardUserCanView(entry.getBucketList());
        return entry;
    }

    @PostMapping("/{entry}/comments/")
    @ResponseStatus(HttpStatus.CREATED)
    public void addComment(@RequestBody Comment comment, @PathVariable BucketListEntry entry)
    {
        guardUnknownEntry(entry);
        // every user that sees a list can create a new comment
        guardUserCanView(entry.getBucketList());
        commentCreationService.addComment(comment, entry);
    }

    @PostMapping("/add")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void addEntry(@RequestBody BucketListEntry newEntry, @PathVariable("bucketList") Long id) {
        Optional<BucketList> updatedBucketList = bucketListRepository.findById(id);

        if (!updatedBucketList.isPresent()) {
            throw new ResourceNotFoundException("requested bucketlist does not exist");
        }

        guardUserCanModify(updatedBucketList.get());

        final BucketList bucketList = updatedBucketList.get();
        // save entry into list
        bucketList.addEntry(newEntry);

        entryRepository.save(newEntry);
        bucketListRepository.save(bucketList);

    }

    @DeleteMapping("/{entry}/")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEntry(@PathVariable BucketList bucketList, @PathVariable BucketListEntry entry)
    {
        guardUnknownBucketList(bucketList);
        guardUnknownEntry(entry);
        guardUserCanModify(entry.getBucketList());//check if user or admin
        bucketList.getEntries().remove(entry);
        entryRepository.delete(entry);
    }

    @PutMapping("/{entry}/")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void comments(
            @RequestBody String updateJson,
            @PathVariable BucketListEntry entry,
            ObjectMapper mapper
    ) throws IOException {
        guardUnknownEntry(entry);

        guardUserCanModify(entry.getBucketList());
        mapper.readerForUpdating(entry).readValue(updateJson);
        entryRepository.save(entry);
    }

    @PostMapping("/cloneEntry/{entry}/")
    public ResponseEntity<Void> cloneEntry(
        @PathVariable("bucketList") BucketList targetList,
        @PathVariable("entry") BucketListEntry entryToDuplicate
    ) {
        guardUnknownBucketList(targetList);
        guardUnknownEntry(entryToDuplicate);
        guardUserCanView(entryToDuplicate.getBucketList());
        guardUserCanModify(targetList);

        final BucketListEntry newEntry = copyEntryToList(targetList, entryToDuplicate);

        if (newEntry == null) {
            return ResponseEntity.accepted().build();
        }

        entryRepository.save(newEntry);
        bucketListRepository.save(targetList);

        return ResponseEntity.created(null).build();
    }

    @PostMapping("/cloneList/{sourceList}/")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void cloneListEntries(
            @PathVariable("bucketList") BucketList targetList,
            @PathVariable("sourceList") BucketList sourceList
    ) {
        guardUnknownEntity(targetList,"target bucketlist unknown");
        guardUnknownEntity(sourceList, "source bucketlist unknown");
        guardUserCanView(sourceList);
        guardUserCanModify(targetList);

        for (BucketListEntry entry : sourceList.getEntries()) {
            final BucketListEntry newEntry = copyEntryToList(targetList, entry);

            entryRepository.save(newEntry);
        }

        bucketListRepository.save(targetList);
    }


    private BucketListEntry copyEntryToList(
            @NonNull BucketList targetList,
            @NonNull BucketListEntry entryToDuplicate
    ) {
        if (
            targetList
                .getEntries().stream()
                .anyMatch( entry -> entry.getId().equals(entryToDuplicate.getId()))
        ) {
            return null;
        }

        BucketListEntry newEntry = new BucketListEntry();

        // https://www.baeldung.com/java-deep-copy, let's go with 6.3 as it seems to be the easiest for now
        try {
            objectMapper.updateValue(newEntry, entryToDuplicate);
        } catch (JsonMappingException e) {
            // we fucked up? return 503. Shouldn't happen.
            logger.error("failed to duplicate entry", e);
            throw new RuntimeException(e);
        }

        targetList.addEntry(newEntry);

        return newEntry;
    }

    /**
     * @throws InsuficientPermissionException if user is not permitted for deleting or creating or changing an entry
     */
    void guardUserCanModify(BucketList bucketList){
        User user = userContext.getUserOrThrow();
        if (!user.getId().equals(bucketList.getOwner().getId()))
        {
            throw new InsuficientPermissionException("You can't access this list");
        }
    }

    /**
     * @throws InsuficientPermissionException if the bucket list is not visible for the current user
     */
    void guardUserCanView(BucketList bucketList) {
        if (!bucketList.isPrivateList()) {
            return;
        }
        User user = userContext.getUserOrThrow();

        if (!user.equals(bucketList.getOwner()) && !bucketList.getAccessedUsers().contains(user)) {
            throw new InsuficientPermissionException("You can't access this list");
        }
    }

    private void guardUnknownBucketList(@PathVariable BucketList bucketList) {
        guardUnknownEntity(bucketList == null, "the requested bucket list does not exist");
    }

    private void guardUnknownEntry(@PathVariable BucketListEntry entry) {
        guardUnknownEntity(entry, "the requested entry does not exist");
    }

    private void guardUnknownEntity(Object entity, String errorMessage) {
        if (entity == null) throw new ResourceNotFoundException(errorMessage);
    }
}
