package com.netflixclone.api.controller;

import com.netflixclone.api.service.OmdbService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final OmdbService omdbService;

    public MovieController(OmdbService omdbService) {
        this.omdbService = omdbService;
    }

    @GetMapping("/search")
    public String searchMovies(@RequestParam String query,
                               @RequestParam(defaultValue = "1") int page,
                               @RequestParam(required = false) String type,
                               @RequestParam(required = false) String year) {
        return omdbService.searchMovies(query, page, type, year);
    }

    @GetMapping("/{id}")
    public String getMovie(@PathVariable String id) {
        return omdbService.getMovieDetails(id);
    }

    @GetMapping("/random-posters")
    public java.util.List<String> getRandomPosters(@RequestParam(defaultValue = "12") int count) {
        return omdbService.getRandomPosters(count);
    }
}