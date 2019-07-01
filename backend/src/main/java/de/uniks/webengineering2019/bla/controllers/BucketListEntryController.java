package de.uniks.webengineering2019.bla.controllers;

import de.uniks.webengineering2019.bla.model.BucketListEntry;
import de.uniks.webengineering2019.bla.repositories.BucketListEntryRepository;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RequestMapping("/bucketlists/{id}/entries")
@RestController
public class BucketListEntryController {

    @NonNull
    private final BucketListEntryRepository entryRepository;

    public BucketListEntryController(BucketListEntryRepository entryRepository) {
        this.entryRepository = entryRepository;
    }

    @GetMapping("/")
    public List<BucketListEntry> list()
    {
        return entryRepository.findAll();
    }
}
