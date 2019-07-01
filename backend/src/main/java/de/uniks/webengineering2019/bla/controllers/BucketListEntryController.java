package de.uniks.webengineering2019.bla.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.BucketListEntry;
import de.uniks.webengineering2019.bla.repositories.BucketListEntryRepository;
import de.uniks.webengineering2019.bla.repositories.BucketListRepository;

@CrossOrigin
@RestController
public class BucketListEntryController {

  /*@NonNull
  private final BucketListEntryRepository entryRepository;

  public BucketListEntryController(BucketListEntryRepository entryRepository) {
    this.entryRepository = entryRepository;
  }*/

  @Autowired
  BucketListEntryRepository bucketListEntryRepository;

  @Autowired
  BucketListRepository bucketListRepository;

  @GetMapping("/api/bucketlists/entries")
  public List<BucketListEntry> list() {
    return bucketListEntryRepository.findAll();
  }

  @RequestMapping(value = "/api/bucketlists/{id}/entries/add", method = RequestMethod.POST)
  public ResponseEntity<String> addEntry(@RequestBody BucketListEntry newEntry, @PathVariable("id") Long id) {
    if (bucketListRepository.existsById(id)) {
      bucketListEntryRepository.save(newEntry);
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
