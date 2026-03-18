package com.netflixclone.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "omdb.api")
public record OmdbApiProperties(String baseUrl, String key) {
}
