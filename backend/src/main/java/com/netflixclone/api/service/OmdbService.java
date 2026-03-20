package com.netflixclone.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
public class OmdbService {

    private static final String API_KEY = "73370347";
    private static final String BASE_URL = "https://www.omdbapi.com/";

    private final HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final ObjectMapper mapper = new ObjectMapper();

    public String searchMovies(String query, int page, String type, String year) {
        try {
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
            StringBuilder url = new StringBuilder(BASE_URL)
                    .append("?apikey=")
                    .append(API_KEY)
                    .append("&s=")
                    .append(encodedQuery)
                    .append("&page=")
                    .append(page);

            if (type != null && !type.isBlank()) {
                url.append("&type=").append(URLEncoder.encode(type, StandardCharsets.UTF_8));
            }
            if (year != null && !year.isBlank()) {
                url.append("&y=").append(URLEncoder.encode(year, StandardCharsets.UTF_8));
            }

            System.out.println("Calling URL: " + url);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url.toString()))
                    .timeout(Duration.ofSeconds(10))
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
            String url = BASE_URL + "?apikey=" + API_KEY + "&i=" + imdbId;

            System.out.println("Calling URL: " + url);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(10))
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

    /**
     * Fetch a list of random poster URLs from OMDB.
     */
    public List<String> getRandomPosters(int count) {
        List<String> posters = new ArrayList<>();

        List<String> keywords = Arrays.asList(
                "avengers", "batman", "matrix", "inception", "harry potter", "terminator",
                "alien", "star wars", "lord of the rings", "spider-man", "joker", "toy story",
                "up", "parasite", "gladiator", "shawshank", "fight club", "interstellar"
        );

        Random rnd = new Random();
        int attempts = 0;

        while (posters.size() < count && attempts < count * 8) {
            attempts++;
            String kw = keywords.get(rnd.nextInt(keywords.size()));
            int page = 1 + rnd.nextInt(3);

            try {
                String json = searchMovies(kw, page, null, null);
                JsonNode root = mapper.readTree(json);

                if (root.has("Search")) {
                    for (JsonNode item : root.get("Search")) {
                        if (posters.size() >= count) {
                            break;
                        }

                        if (item.has("Poster")) {
                            String posterUrl = item.get("Poster").asText();

                            if (posterUrl != null
                                    && !"N/A".equalsIgnoreCase(posterUrl)
                                    && !posters.contains(posterUrl)
                                    && isUrlAccessible(posterUrl)) {
                                posters.add(posterUrl);
                            }
                        }
                    }
                }
            } catch (Exception e) {
                System.out.println("Ignoring search error for keyword " + kw + " page " + page + ": " + e.getMessage());
            }
        }

        return posters;
    }

    private boolean isUrlAccessible(String url) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(5))
                    .method("HEAD", HttpRequest.BodyPublishers.noBody())
                    .build();

            HttpResponse<Void> response = client.send(request, HttpResponse.BodyHandlers.discarding());
            int statusCode = response.statusCode();

            return statusCode >= 200 && statusCode < 300;

        } catch (Exception e) {
            return false;
        }
    }
}