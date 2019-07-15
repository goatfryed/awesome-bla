package de.uniks.webengineering2019.bla.controllers;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.uniks.webengineering2019.bla.comments.CommentCreationService;
import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.BucketListEntry;
import de.uniks.webengineering2019.bla.model.Comment;
import de.uniks.webengineering2019.bla.repositories.BucketListEntryRepository;
import de.uniks.webengineering2019.bla.repositories.BucketListRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
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

    public BucketListEntryController(
            @NonNull BucketListEntryRepository entryRepository,
            @NonNull BucketListRepository bucketListRepository,
            @NonNull CommentCreationService commentCreationService,
            @NonNull ObjectMapper objectMapper
    ) {
        this.entryRepository = entryRepository;
        this.bucketListRepository = bucketListRepository;
        this.commentCreationService = commentCreationService;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/api/bucketlists/entries")
    public List<BucketListEntry> listAll() {
        return entryRepository.findAll();
    }

    @GetMapping("/")
    public List<BucketListEntry> list(@PathVariable BucketList bucketList)
    {
        bucketList.getEntries().forEach(p -> p.getComments().clear());

        return new ArrayList<>(bucketList.getEntries());
    }

    @GetMapping("/{entry}/")
    public BucketListEntry comments(@PathVariable BucketListEntry entry)
    {
        return entry;
    }

    @PostMapping("/{entry}/comments/")
    @ResponseStatus(HttpStatus.CREATED)
    public void addComment(@RequestBody Comment comment, @PathVariable BucketListEntry entry)
    {
        if (entry == null) {
            throw new ResourceNotFoundException("requested entry unknown");
        }
        commentCreationService.addComment(comment, entry);
    }

    @PostMapping("/add")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void addEntry(@RequestBody BucketListEntry newEntry, @PathVariable("bucketList") Long id) {
        Optional<BucketList> updatedBucketList = bucketListRepository.findById(id);

        if (!updatedBucketList.isPresent()) {
            throw new ResourceNotFoundException("requested bucketlist does not exist");
        }

        final BucketList bucketList = updatedBucketList.get();
        // save entry into list
        bucketList.addEntry(newEntry);

        entryRepository.save(newEntry);
        bucketListRepository.save(bucketList);

    }

    @PutMapping("/{entry}/")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void comments(
            @RequestBody String updateJson,
            @PathVariable BucketListEntry entry,
            ObjectMapper mapper
    ) throws IOException {
        if (entry == null) {
            throw new ResourceNotFoundException("requested entry unknown");
        }

        mapper.readerForUpdating(entry).readValue(updateJson);
        entryRepository.save(entry);
    }

    @GetMapping("/cloneEntry/{entry}/")
    public void cloneEntry(
        @PathVariable("bucketList") BucketList targetList,
        @PathVariable("entry") BucketListEntry entryToDuplicate
    ) {
        if (targetList == null) {
            throw new ResourceNotFoundException("requested bucketlist unknown");
        }
        if (entryToDuplicate == null) {
            throw new ResourceNotFoundException("requested entry unknown");
        }

        final boolean entryInTargetList = targetList
                .getEntries().stream()
                .anyMatch( entry -> entry.getId().equals(entryToDuplicate.getId()));

        // maybe return a 400 response?
        if (entryInTargetList) {
            return;
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

        entryRepository.save(newEntry);
        bucketListRepository.save(targetList);
    }
}
