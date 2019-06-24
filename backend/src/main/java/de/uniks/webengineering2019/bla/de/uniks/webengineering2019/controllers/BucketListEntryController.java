package de.uniks.webengineering2019.bla.de.uniks.webengineering2019.controllers;

import de.uniks.webengineering2019.bla.de.uniks.webengineering2019.model.BucketList;
import de.uniks.webengineering2019.bla.de.uniks.webengineering2019.model.BucketListEntry;
import de.uniks.webengineering2019.bla.de.uniks.webengineering2019.repositories.BucketListEntryRepository;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RequestMapping("/bucketlists/{bucketList}/entries")
@RestController
public class BucketListEntryController {

    @NonNull
    private final BucketListEntryRepository entryRepository;

    public BucketListEntryController(BucketListEntryRepository entryRepository) {
        this.entryRepository = entryRepository;
    }

    @GetMapping("/")
    public List<BucketListEntry> list(@PathVariable BucketList bucketList)
    {
        return entryRepository.findBucketListEntriesByBucketList(bucketList);
    }
}
