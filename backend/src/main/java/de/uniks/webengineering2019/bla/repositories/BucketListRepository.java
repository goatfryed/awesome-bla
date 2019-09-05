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
    List<BucketList> findByPrivateListAndTitleContainsIgnoreCaseOrderByCreationDateDescIdDesc(boolean privateList, String title);
    List<BucketList> findByAccessedUsersContainsAndTitleContainsIgnoreCaseOrderByCreationDateDescIdDesc(User user, String title);
    List<BucketList> findByOwnerAndTitleContainsIgnoreCaseOrderByCreationDateDescIdDesc(User owner, String title);

    Page<BucketList> findByPrivateListOrderByCreationDateDescIdDesc(boolean value, Pageable pageable);
    Page<BucketList> findByPrivateListOrAccessedUsersContainsOrOwnerOrderByCreationDateDescIdDesc(boolean privateList, User user, User owner, Pageable pageable);

    @Query("select b from BucketList b join b.owner o where o.userName = ?2 and (b.privateList = false or b.owner = ?1 or ?1 member of b.accessedUsers) order by  b.creationDate desc, b.id desc")
    Page<BucketList> findForUserByOwnerUserName(User user, String userName, Pageable pageable);

    @Query(value = "SELECT b.id FROM bucket_list AS b LEFT JOIN bucket_list_accessed_users AS al ON b.id = al.bucket_list_id WHERE b.id = ?1 AND ( b.private_list = FALSE OR b.owner_id = ?2 OR al.accessed_users_id = ?2 ) ORDER BY  b.creation_date desc, b.id desc;",nativeQuery = true)
    Long existsBucketListByIdAnd(Long bucketlistId,Long userId);

    Page<BucketList> findByOwnerIdAndPrivateList(long userId,boolean privateList,Pageable pageable);

    @Query(value = "SELECT b FROM bucket_list AS b LEFT JOIN bucket_list_accessed_users AS al ON b.id = al.bucket_list_id WHERE b.ower_id = ?1 AND ( b.private_list = FALSE OR b.owner_id = ?2 OR al.accessed_users_id = ?2 ) ORDER BY  b.creation_date desc, b.id desc;",nativeQuery = true)
    Page<BucketList> findByownerIdandPriveleged(long ownerId,long userId,Pageable pageable);
}
