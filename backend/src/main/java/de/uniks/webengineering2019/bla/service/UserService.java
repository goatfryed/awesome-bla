package de.uniks.webengineering2019.bla.service;

import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.User;
import de.uniks.webengineering2019.bla.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService{
    @Autowired
    UserRepository userRepository;

    public List<User> findUser(String user){
        return userRepository.findByUserNameIgnoreCaseContaining(user);
    }

    public List<User> findAllUsers(){
        return userRepository.findAll();
    }

    public List<User> findUserNotPrivelegedAndName(String user, BucketList list){
        List<User> users = findUser(user);
        return users.stream().filter(u->!list.getAccessedUsers().contains(u)).collect(Collectors.toList());
    }
}
