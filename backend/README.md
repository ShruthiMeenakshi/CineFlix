# Netflix Clone Backend (Spring Boot + OMDb)

This backend provides API endpoints to search and fetch movie details from OMDb.

## Requirements

- Java 17+
- Maven 3.9+

## Run

```bash
cd backend
mvn spring-boot:run
```

Server starts on `http://localhost:8080`.

## Endpoints

### Search movies

`GET /api/movies/search?query=batman&page=1&type=movie&year=2022`

- `query` (required)
- `page` (optional, 1-100)
- `type` (optional: `movie`, `series`, `episode`)
- `year` (optional)

### Get movie details by IMDb ID

`GET /api/movies/{imdbId}?plot=full`

- `imdbId` (required, e.g. `tt3896198`)
- `plot` (optional: `short` or `full`)

## OMDb Configuration

Configured in `src/main/resources/application.properties`:

- `omdb.api.base-url=http://www.omdbapi.com/`
- `omdb.api.key=50438a2d`

You can replace the key with your own if needed.
