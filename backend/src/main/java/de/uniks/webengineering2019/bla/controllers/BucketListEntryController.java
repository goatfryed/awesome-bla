package de.uniks.webengineering2019.bla.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.BucketListEntry;
import de.uniks.webengineering2019.bla.repositories.BucketListEntryRepository;
import de.uniks.webengineering2019.bla.repositories.CommentRepository;
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

    public BucketListEntryController(
            @NonNull BucketListEntryRepository entryRepository,
            @NonNull CommentRepository commentRepository
    ) {
        this.entryRepository = entryRepository;
        this.commentRepository = commentRepository;
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
}
