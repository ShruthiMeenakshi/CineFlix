package com.netflixclone.api.service;

import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class OmdbService {

    public String searchMovies(String query, int page) {
        try {
            String url = "http://www.omdbapi.com/?apikey=73370347&s=batman&page=1";
            System.out.println("Calling URL: " + url);

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("Status Code: " + response.statusCode());
            System.out.println("Response Body: " + response.body());

            return response.body();

        } catch (Exception e) {
            e.printStackTrace();
            return "{\"Response\":\"False\",\"Error\":\"" + e.getMessage().replace("\"", "'") + "\"}";
        }
    }

    public String getMovieDetails(String imdbId) {
        try {
            String url = "http://www.omdbapi.com/?apikey=73370347&i=" + imdbId;
            System.out.println("Calling URL: " + url);

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("Status Code: " + response.statusCode());
            System.out.println("Response Body: " + response.body());

            return response.body();

        } catch (Exception e) {
            e.printStackTrace();
            return "{\"Response\":\"False\",\"Error\":\"" + e.getMessage().replace("\"", "'") + "\"}";
        }
    }
}