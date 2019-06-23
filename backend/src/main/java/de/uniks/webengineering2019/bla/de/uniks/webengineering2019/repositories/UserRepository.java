package de.uniks.webengineering2019.bla.de.uniks.webengineering2019.repositories;

import de.uniks.webengineering2019.bla.de.uniks.webengineering2019.model.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long>{
    User findOneById(int id);
    User findUserByUserName(String name);
}
