package de.uniks.webengineering2019.bla.controllers;

import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.User;
import de.uniks.webengineering2019.bla.repositories.UserRepository;
import de.uniks.webengineering2019.bla.service.UserService;
import de.uniks.webengineering2019.bla.utils.PageSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController{

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/all")
    public PageSupport<User> getAll(@RequestParam(defaultValue = "0")int page){
        return userService.findAllUsers(page);
    }

    @GetMapping("/find")
    public PageSupport<User> findUsers(@RequestParam String name,@RequestParam(defaultValue = "0")int page){
        if(StringUtils.isEmpty(name)){
            return userService.findAllUsers(page);
        }
        return userService.findUser(name,page);
    }

    @GetMapping("/byList")
    public PageSupport<User> findNotPrivelegedUsersByName(@RequestParam BucketList bucketlist,@RequestParam String name,@RequestParam(defaultValue = "0")int page,@RequestParam(required = false,defaultValue = "false") boolean reload){
        return userService.findUserNotPrivelegedAndName(name,bucketlist,page,reload);
    }
}
