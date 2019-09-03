package de.uniks.webengineering2019.bla.repositories;

import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BucketListRepository extends CrudRepository<BucketList, Long>{

    List<BucketList> findAll();
    List<BucketList> findByPrivateListOrAccessedUsersContainsOrOwnerAndTitle(boolean privateList, User user, User owner, String title);
    List<BucketList> findByPrivateListAndTitleContainsIgnoreCase(boolean privateList, String title);
    
    Page<BucketList> findByPrivateList(boolean value, Pageable pageable);
    Page<BucketList> findByPrivateListOrAccessedUsersContainsOrOwner(boolean privateList, User user, User owner, Pageable pageable);
}
