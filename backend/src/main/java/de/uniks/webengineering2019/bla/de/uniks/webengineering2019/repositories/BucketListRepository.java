package de.uniks.webengineering2019.bla.de.uniks.webengineering2019.repositories;

import de.uniks.webengineering2019.bla.de.uniks.webengineering2019.model.BucketList;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BucketListRepository extends CrudRepository<BucketList, Long>{

    List<BucketList> findAll();
}
