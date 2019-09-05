package de.uniks.webengineering2019.bla.repositories;

import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BucketListRepository extends CrudRepository<BucketList, Long>{

    List<BucketList> findAll();
    List<BucketList> findByPrivateListAndTitleContainsIgnoreCase(boolean privateList, String title);
    List<BucketList> findByAccessedUsersContainsAndTitleContainsIgnoreCase(User user, String title);
    List<BucketList> findByOwnerAndTitleContainsIgnoreCase(User owner, String title);

    Page<BucketList> findByPrivateListOrderByCreationDateDescIdDesc(boolean value, Pageable pageable);
    Page<BucketList> findByPrivateListOrAccessedUsersContainsOrOwnerOrderByCreationDateDescIdDesc(boolean privateList, User user, User owner, Pageable pageable);

}
