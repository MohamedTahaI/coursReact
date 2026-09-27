import { useEffect, useState, useRef } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "254708c0";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);
  const [watched, setWatched] = useLocalStorageState([], "watched");


  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main >
        <Box>
          {isLoading && <Loading />}
          {!isLoading && !error && <MovieList onSelectMovie={handleSelectMovie} movies={movies} />}
          {error && <ErrorMessage error={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              id={selectedId}
              handleCloseMovie={handleCloseMovie}
              handleAddWatched={handleAddWatched}
              watched={watched} />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedList watched={watched} onDeleteWatched={handleDeleteWatched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function MovieDetails({ id, handleCloseMovie, handleAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState(0);

  const refCountRef = useRef(0);


  useEffect(function () {
    if (userRating) refCountRef.current++;
  }, [userRating]);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre
  } = movie;

  const isWatched = watched.map((movie) => movie.imdbID).includes(id);
  console.log(isWatched);


  function handleAdd() {
    const newWatchedMovie = {
      imdbID: id,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: Number(userRating),
      countRatingDecisions: refCountRef.current
    };
    handleAddWatched(newWatchedMovie);
    handleCloseMovie();
  }

  useKey("Escape", handleCloseMovie);

  useEffect(function () {
    async function getMovieDetails() {
      try {
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${id}`);
        if (!res.ok) throw new Error("Failed to fetch movie details");

        const data = await res.json();
        if (data.Response === "False") {
          throw new Error("Movie not found");
        }
        setMovie(data);
      }
      catch (err) {
        console.error(err.message);
      }
    }

    getMovieDetails();

  }, [id]);


  useEffect(function () {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return function () {
      document.title = "usePopcorn";
    };
  }, [title]);

  return (
    <div className="details">

      <header>
        <button className="btn-back " onClick={handleCloseMovie}>&larr;</button>
        <img src={poster} alt={`${title} poster`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>{released} &bull; {runtime}</p>
          <p>{genre}</p>
          <p><span>⭐️</span>{imdbRating} IMDb rating</p>
        </div>
      </header>

      <section>
        <div className="rating">
          {isWatched ?
            (
              <p>You rated this movie {watched.find((movie) => movie.imdbID === id)?.userRating} <span>🌟</span></p>
            )
            :
            (
              <>
                <StarRating maxRating={10} size={24} color="gold" onSetRating={setUserRating} />
                {(userRating > 0 && isWatched) ? " " :
                  (<button className="btn-add" onClick={handleAdd}>
                    + Add to list
                  </button>)}
              </>
            )}
        </div>
        <div className="details-info">
          <p>
            <em>
              {plot}
            </em>
          </p>
          <h3>Starring</h3>
          <p>{actors}</p>
          <h3>Director by</h3>
          <p>{director}</p>
        </div>
      </section>
    </div>
  );
}

function Loading() {
  return (
    <p className="loader">Loading...</p>
  );
}

function ErrorMessage({ error }) {
  return (
    <p className="error">{error}</p>
  );
}

function NavBar({ children }) {

  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputRef = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputRef.current) return;
    inputRef.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputRef}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length || 0}</strong> results
    </p>
  );
}

function Main({ children }) {

  return (
    <main className="main">
      {children}
    </main>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}


function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie key={movie.imdbID} movie={movie} onDeleteWatched={onDeleteWatched} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li >
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>X</button>
    </li>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies ">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

