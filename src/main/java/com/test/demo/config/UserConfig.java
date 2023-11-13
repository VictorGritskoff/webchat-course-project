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
                    "Mariam", "Mariam123", "maraiam@mail.ru", "user"
            );
            User alex = new User(
                    "Alex", "Alex123", "alex@mail.ru", "user"
            );
            userRepository.saveAll(List.of(mariam, alex));
        };
    }
}

