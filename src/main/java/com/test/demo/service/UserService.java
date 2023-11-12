package com.test.demo.service;

import com.test.demo.entity.User;
import com.test.demo.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class UserService {

    List<User> userList = null;

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void loadUsersFromDB() {
        userList = IntStream.rangeClosed(1, 100)
                .mapToObj(i -> User.builder()
                        .name("user " + i)
                        .password("password" + i)
                        .email("user" + i + "@example.com")
                        .build()
                ).collect(Collectors.toList());
    }


    public List<User> getUsers() {
        return userList;
    }

    public User getUser(int id) {
        return userList.stream()
                .filter(product -> product.getId() == id)
                .findAny()
                .orElseThrow(() -> new RuntimeException("user " + id + " not found"));
    }


    public String addUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        repository.save(user);
        return "user added to system ";
    }
}
