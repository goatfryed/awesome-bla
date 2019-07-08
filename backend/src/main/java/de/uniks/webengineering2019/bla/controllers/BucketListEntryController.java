package de.uniks.webengineering2019.bla.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.uniks.webengineering2019.bla.comments.CommentCreationService;
import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.BucketListEntry;
import de.uniks.webengineering2019.bla.model.Comment;
import de.uniks.webengineering2019.bla.repositories.BucketListEntryRepository;
import de.uniks.webengineering2019.bla.repositories.BucketListRepository;
import de.uniks.webengineering2019.bla.repositories.CommentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RequestMapping("/bucketlists/{bucketList}/entries")
@RestController
public class BucketListEntryController {

    @NonNull
    private final BucketListEntryRepository entryRepository;
    @NonNull
    private final BucketListRepository bucketListRepository;
    @NonNull
    private final CommentCreationService commentCreationService;

    public BucketListEntryController(
            @NonNull BucketListEntryRepository entryRepository,
            @NonNull BucketListRepository bucketListRepository,
            @NonNull CommentCreationService commentCreationService
    ) {
        this.entryRepository = entryRepository;
        this.bucketListRepository = bucketListRepository;
        this.commentCreationService = commentCreationService;
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

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ResponseEntity<String> addEntry(@RequestBody BucketListEntry newEntry, @PathVariable("bucketList") Long id) {
        if (bucketListRepository.existsById(id)) {
            // save entry into list
            BucketList updatedBucketList = bucketListRepository.findById(id).get();
            updatedBucketList.addEntry(newEntry);

            entryRepository.save(newEntry);
            bucketListRepository.save(updatedBucketList);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
        System.out.println("ListID does not exitst!");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
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
}
