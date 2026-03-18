package com.netflixclone.api.controller;

import com.netflixclone.api.service.OmdbService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class MovieController {

    private final OmdbService omdbService;

    public MovieController(OmdbService omdbService) {
        this.omdbService = omdbService;
    }

    @GetMapping("/search")
    public String searchMovies(@RequestParam String query,
                               @RequestParam(defaultValue = "1") int page) {
        return omdbService.searchMovies(query, page);
    }

    @GetMapping("/{id}")
    public String getMovie(@PathVariable String id) {
        return omdbService.getMovieDetails(id);
    }
}