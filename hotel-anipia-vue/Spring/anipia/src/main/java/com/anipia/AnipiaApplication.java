package com.anipia;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AnipiaApplication {
    public static void main(String[] args) {
        SpringApplication.run(AnipiaApplication.class, args);
    }
}
