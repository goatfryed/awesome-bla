package de.uniks.webengineering2019.bla.service;

import de.uniks.webengineering2019.bla.authentication.UserContext;
import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.User;
import de.uniks.webengineering2019.bla.repositories.UserRepository;
import de.uniks.webengineering2019.bla.utils.PageSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService{

    @Autowired
    UserContext userContext;

    @Autowired
    UserRepository userRepository;

    @Value("${Page.User.DefaultSize:2}")
    private int elementsOnPage;

    public PageSupport<User> findUser(String user, int page){
        Pageable pageable = PageRequest.of(page,elementsOnPage);
        Page<User> pageResult  = userRepository.findByUserNameIgnoreCaseContaining(user,pageable);
        return new PageSupport<User>(pageResult,page,elementsOnPage);
    }

    public PageSupport<User> findAllUsers(int page){
        Pageable pageable = PageRequest.of(page,elementsOnPage);
        Page<User> pageResult  = userRepository.findAll(pageable);
        return new PageSupport<User>(pageResult,page,elementsOnPage);
    }

    public PageSupport<User> findUserNotPrivelegedAndName(final String user, final BucketList list, final int page){
        Pageable pageable = PageRequest.of(page,elementsOnPage);
        String userPattern = "%"+user+"%";
        Page<User> pageResult  = userRepository.findByUserNameAndNotAccesdByBucketlist(list.getId(),list.getOwner().getId(),userPattern,pageable);
        return new PageSupport<User>(pageResult,page,elementsOnPage);
        //return userRepository.findByUserNameAndNotAccesdByBucketlist(user,list.getId(),pageable);
        /*List<User> users = findUser(user,pageable);
        if(userContext.hasUser()){
            users=users.stream().filter(u->u.getId()!=userContext.getUser().getId()).collect(Collectors.toList());
        }
        return users.stream().filter(u->!list.getAccessedUsers().contains(u)).collect(Collectors.toList());*/
    }
}
