package com.netflixclone.api.controller;

import com.netflixclone.api.service.OmdbService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://localhost:5173",
        "http://localhost:3000",
        "https://cine-flix-topaz.vercel.app"
})
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

    @GetMapping("/random-posters")
    public java.util.List<String> getRandomPosters(@RequestParam(defaultValue = "12") int count) {
        return omdbService.getRandomPosters(count);
    }
}