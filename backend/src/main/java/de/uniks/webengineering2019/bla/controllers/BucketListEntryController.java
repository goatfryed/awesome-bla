package de.uniks.webengineering2019.bla.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.util.List;

@CrossOrigin
@RequestMapping("/bucketlists/{bucketList}/entries")
@RestController
public class BucketListEntryController {

    @NonNull
    private final BucketListEntryRepository entryRepository;
    @NonNull
    private final CommentRepository commentRepository;
    @NonNull
    private final BucketListRepository bucketListRepository;

    public BucketListEntryController(
            @NonNull BucketListEntryRepository entryRepository,
            @NonNull BucketListRepository bucketListRepository,
            @NonNull CommentRepository commentRepository
    ) {
        this.entryRepository = entryRepository;
        this.commentRepository = commentRepository;
        this.bucketListRepository = bucketListRepository;
    }

    @GetMapping("/api/bucketlists/entries")
    public List<BucketListEntry> listAll() {
        return entryRepository.findAll();
    }

    @GetMapping("/")
    public List<BucketListEntry> list(@PathVariable BucketList bucketList, ObjectMapper mapper)
    {
        final List<BucketListEntry> entries = entryRepository.findBucketListEntriesByBucketList(bucketList);
        entries.forEach(p -> p.setCommentBoard(null));

        return entries;
    }

    @GetMapping("/{entry}/")
    public BucketListEntry comments(@PathVariable BucketListEntry entry)
    {
        return entry;
    }

    @PostMapping("/{entry}/comments/")
    public void addComment(@RequestBody Comment comment, @PathVariable BucketListEntry entry)
    {
        comment.setParent(entry.getCommentBoard());
        comment.setMaster(entry.getCommentBoard());
        commentRepository.save(comment);
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ResponseEntity<String> addEntry(@RequestBody BucketListEntry newEntry, @PathVariable("bucketList") Long id) {
        if (bucketListRepository.existsById(id)) {
            entryRepository.save(newEntry);
            // save entry into list
            BucketList updatedBucketList = bucketListRepository.findById(id).get();
            updatedBucketList.addEntry(newEntry);
            bucketListRepository.save(updatedBucketList);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
        System.out.println("ListID does not exitst!");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
