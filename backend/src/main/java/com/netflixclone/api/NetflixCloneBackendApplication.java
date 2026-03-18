package com.netflixclone.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class NetflixCloneBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(NetflixCloneBackendApplication.class, args);
    }
}
