package de.uniks.webengineering2019.bla.repositories;

import de.uniks.webengineering2019.bla.model.User;
import org.hibernate.annotations.NamedQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface UserRepository extends CrudRepository<User, Long>{
    User findOneById(int id);
    User findUserByUserName(String name);
    Page<User> findAll(Pageable page);
    Page<User> findByUserNameIgnoreCaseContaining(String name, Pageable page);

    //@Query(value = "select u.* from users as u inner join bucket_list_accessed_users as au on u.id = au.accessed_users_id where u.id in ?1",nativeQuery = true)
    @Query(value = "select * from users as u where u.id not in (select u.id from users as u inner join bucket_list_accessed_users as au on u.id = au.accessed_users_id where au.bucket_list_id = ?1) and not u.id = ?2 and lower(u.user_name) like ?3",nativeQuery = true)
    Page<User> findByUserNameAndNotAccesdByBucketlist(Long bucketListId,Long ownerId,String name,Pageable pageable);
    //Page<User> findByUserNameAndNotAccesdByBucketlist(String name, long bucketlistId, Pageable page);

}
