package de.uniks.webengineering2019.bla.repositories;

import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BucketListRepository extends CrudRepository<BucketList, Long>{

    List<BucketList> findAll();
    List<BucketList> findByPrivateListAndTitleContainsIgnoreCase(boolean privateList, String title);
    List<BucketList> findByAccessedUsersContainsAndTitleContainsIgnoreCase(User user, String title);
    List<BucketList> findByOwnerAndTitleContainsIgnoreCase(User owner, String title);

    Page<BucketList> findByPrivateList(boolean value, Pageable pageable);
    Page<BucketList> findByPrivateListOrAccessedUsersContainsOrOwner(boolean privateList, User user, User owner, Pageable pageable);

    @Query(value = "SELECT b.id FROM bucket_list AS b LEFT JOIN bucket_list_accessed_users AS al ON b.id = al.bucket_list_id WHERE b.id = ?1 AND ( b.private_list = FALSE OR b.owner_id = ?2 OR al.accessed_users_id = ?2 );",nativeQuery = true)
    Long existsBucketListByIdAnd(Long bucketlistId,Long userId);
}
