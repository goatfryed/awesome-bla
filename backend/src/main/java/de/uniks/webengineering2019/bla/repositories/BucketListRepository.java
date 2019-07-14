package de.uniks.webengineering2019.bla.repositories;

import de.uniks.webengineering2019.bla.model.BucketList;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BucketListRepository extends CrudRepository<BucketList, Long>{

    List<BucketList> findAll();
    List<BucketList> findByPrivateList(boolean value);
}
