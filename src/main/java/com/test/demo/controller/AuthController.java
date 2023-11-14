package com.test.demo.controller;

import com.test.demo.entity.User;
import com.test.demo.service.AuthRequest;
import com.test.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest authRequest) {
        // Получение данных из запроса
        String username = authRequest.getUsername();
        String password = authRequest.getPassword();

        // Проверка данных в базе данных
        User user = userService.getUserByUsernameAndPassword(username, password);

        if (user != null) {
            return ResponseEntity.ok().build();
        } else {
            System.out.println("Authentication failed for user: " + username);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
