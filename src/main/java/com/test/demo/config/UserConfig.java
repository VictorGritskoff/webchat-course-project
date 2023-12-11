package com.test.demo.config;

import com.test.demo.entity.User;
import com.test.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class UserConfig {
    @Bean
    CommandLineRunner commandLineRunner(UserRepository userRepository) {
        return args -> {
            User mariam = new User(
                    "Mary", "Mary123", "mary@mail.ru", "admin"
            );
            User alex = new User(
                    "Alex", "Alex123", "alex@mail.ru", "admin"
            );
            User max = new User(
                    "Max", "Max123", "max@mail.ru", "user"
            );
            userRepository.saveAll(List.of(mariam, alex, max));
        };
    }
}

