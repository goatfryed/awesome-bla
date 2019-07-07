package de.uniks.webengineering2019.bla.repositories;

import de.uniks.webengineering2019.bla.model.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface UserRepository extends CrudRepository<User, Long>{
    User findOneById(int id);
    User findUserByUserName(String name);
    List<User> findAll();
}
