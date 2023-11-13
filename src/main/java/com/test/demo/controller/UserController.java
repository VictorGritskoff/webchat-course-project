package com.test.demo.controller;

import com.test.demo.entity.User;
import com.test.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/users")
public class UserController {
        private final UserService userService;

        @Autowired
        public UserController(UserService userService) {
            this.userService = userService;
        }
    @GetMapping
    List<User> getUsers() {
        return userService.getUsers();
    }
    @PostMapping
    public void registerNewUser(@RequestBody User user) {
            userService.addNewUser(user);
    }
    @DeleteMapping(path="{userId}")
    public void deleteStudent(@PathVariable("userId") Long id){
        userService.deleteUser(id);
    }
    @PutMapping(path = "{userId}")
    public void updateUser(
            @PathVariable("userId") Long userId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email) {
        userService.updateUser(userId, name, email);
    }
}
