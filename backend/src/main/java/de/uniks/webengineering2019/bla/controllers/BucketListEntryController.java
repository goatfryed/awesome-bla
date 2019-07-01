package de.uniks.webengineering2019.bla.controllers;

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
    public List<BucketListEntry> list(@PathVariable BucketList bucketList)
    {
        return entryRepository.findBucketListEntriesByBucketList(bucketList);
    }

    @GetMapping("/{entry}/")
    public BucketListEntry list(@PathVariable BucketListEntry entry)
    {
        return entry;
    }
}
