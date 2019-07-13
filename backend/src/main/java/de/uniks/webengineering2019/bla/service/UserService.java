package de.uniks.webengineering2019.bla.service;

import de.uniks.webengineering2019.bla.model.User;
import de.uniks.webengineering2019.bla.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService{
    @Autowired
    UserRepository userRepository;

    public List<User> findUser(String user){
        return userRepository.findByUserNameIgnoreCaseContaining(user);
    }
}
