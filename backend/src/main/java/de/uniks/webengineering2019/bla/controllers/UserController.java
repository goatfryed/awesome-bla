package de.uniks.webengineering2019.bla.controllers;

import de.uniks.webengineering2019.bla.model.BucketList;
import de.uniks.webengineering2019.bla.model.User;
import de.uniks.webengineering2019.bla.repositories.UserRepository;
import de.uniks.webengineering2019.bla.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<User> getAll(){
        return userRepository.findAll();
    }

    @GetMapping("/find")
    public ResponseEntity findUsers(@RequestParam String name){
        if(StringUtils.isEmpty(name)){
            return ResponseEntity.ok(userService.findAllUsers());
        }
        return ResponseEntity.ok(userService.findUser(name));
    }

    @GetMapping("/byList")
    public ResponseEntity findNotPrivelegedUsersByName(@RequestParam BucketList bucketlist,@RequestParam String name){
        return ResponseEntity.ok(userService.findUserNotPrivelegedAndName(name,bucketlist).stream());
    }
}
