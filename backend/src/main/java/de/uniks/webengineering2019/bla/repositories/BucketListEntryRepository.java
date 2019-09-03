package de.uniks.webengineering2019.bla.repositories;

import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.BucketListEntry;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BucketListEntryRepository extends CrudRepository<BucketListEntry, Long> {

    List<BucketListEntry> findAll();

    List<BucketListEntry> findBucketListEntriesByBucketList(BucketList bucketList);

}
