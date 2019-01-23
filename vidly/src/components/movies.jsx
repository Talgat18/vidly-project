import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast} from "react-toastify";
import MoviesTable from "./moviesTable";
import SearchBox from './searchBox';
import Pagination from "./common/pagination";
//import ListGenres from "./common/list";
import ListGroup from "./common/listGroup";
import { getMovies, deleteMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import { paginate } from "../utils/paginate";
import _ from "lodash";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
    searchQuary: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" }
  };

  async componentDidMount() {
    const {data} = await getGenres();
    const genres = [{ _id: "", name: "All Genres" }, ...data];     // в начало массива добавляем

   const {data: movies} =  await getMovies();
    this.setState({ movies, genres: genres });
  }
  handleDelete = async movie => {
    const originalMovies = this.state.movies;

    const movies = originalMovies.filter(m => m._id !== movie._id);
    this.setState({ movies });
    
    try{
    await deleteMovie(movie._id);
    }
    catch (ex){
      if(ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted.")

        this.setState( {movies: originalMovies});
    }
  };
  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = page => { 
    this.setState({ currentPage: page });
  };
  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, searchQuary: "", currentPage: 1 });


  };
  handleSearch = query => {
    this.setState({ searchQuary: query, selectedGenre:"", currentPage:1})
  }

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedGenre,
      searchQuary,
      movies: allMovies
    } = this.state;

    let filtered = allMovies;
    if (searchQuary)
      filtered = allMovies.filter (m =>
        m.title.toLowerCase().startsWith(searchQuary.toLowerCase())
  );
    else if (selectedGenre && selectedGenre._id)
     filtered = allMovies.filter(m => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]); // сортируем по алфавиту

    const movies = paginate(sorted, currentPage, pageSize); //call paginate func

    return { totalCount: filtered.length, data: movies };
  };
  render() {
    //const { length: count } = this.state.movies;
    const { pageSize, currentPage, sortColumn, searchQuary } = this.state;
    const { user } = this.props;


    const { totalCount, data: movies } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
       {user &&  <Link
        to="/movies/new"
        className="btn btn-primary"
        style ={{marginBottom: 20}}
        >
        New Movie
        </Link>}
          <p>Showing {totalCount} movies in the database</p>        
          <SearchBox value={searchQuary}  onChange={this.handleSearch} />
          <MoviesTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}           
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
