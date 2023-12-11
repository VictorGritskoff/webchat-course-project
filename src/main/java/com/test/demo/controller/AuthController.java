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

import java.util.HashMap;
import java.util.Map;

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
    @PostMapping("/checkUser")
    public ResponseEntity<Map<String, Boolean>> checkUser(@RequestBody AuthRequest authRequest) {
        try {
            String username = authRequest.getUsername();
            String password = authRequest.getPassword();

            User user = userService.getUserByUsernameAndPassword(username, password);

            Map<String, Boolean> response = new HashMap<>();
            response.put("exists", user != null);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Boolean> response = new HashMap<>();
            response.put("error", true);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
