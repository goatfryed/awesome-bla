package de.uniks.webengineering2019.bla.de.uniks.webengineering2019.repositories;

import de.uniks.webengineering2019.bla.de.uniks.webengineering2019.model.BucketList;
import de.uniks.webengineering2019.bla.de.uniks.webengineering2019.model.BucketListEntry;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BucketListEntryRepository extends CrudRepository<BucketListEntry, Long> {

    List<BucketListEntry> findAll();

    List<BucketListEntry> findBucketListEntriesByBucketList(BucketList bucketList);

}
