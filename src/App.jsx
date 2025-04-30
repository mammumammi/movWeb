import { div, ul } from 'framer-motion/client'
import React from 'react'
import Search from './components/Search'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { useDebounce } from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite'
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTION = {
  method: 'GET',
  headers: {
    accept : 'application/json',
    Authorization :`Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [movieList, setMovieList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [debouncedSearchTerm, setdebouncedSearchTerm] = useState('')
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(()=> setdebouncedSearchTerm(searchTerm),500,[searchTerm])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const fetchMovies = async ( query = '') => {
    setIsLoading(true)
    setErrorMsg('')
    try {
      const endpoint = query ?
      `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      :`${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTION);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
     setMovieList(data.results || [])

     if (query && data.results.length >0){
      await updateSearchCount(searchTerm,data.results[0])
     }

      
    } catch (error) {
      console.error(`Error occurred while fetching: ${error}`);
      setErrorMsg(`Error fetching movies: ${error.message}`); // Improved error message
    }
    finally {
      setIsLoading(false)
    }
  };

  const LoadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies()
      setTrendingMovies(movies);
    }
    catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect( ()=>{
    LoadTrendingMovies();
  },[])
  return (
    <main className="h-screen bg-[url('/public/BG.png')] bg-cover bg-center overflow-x-hidden ">
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src="./logo.png" alt="" className='w-13.5 h-13.5 -my-5' />
          <motion.img 
            src="./hero.png" alt="herobanner" 
            className="transition-transform hover:scale-120 duration-1000 hover:ease-out"
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1.0 }}
            transition={{ duration: 1, delay: 0.01, ease: "easeInOut" }}
          />
          <h1>Find <motion.span
            viewport={{ once: true }}
            initial={{ fontSize: "100%", scale: 1 }}
            animate={loaded ? { scale: [1, 1.45, 1], fontSize: "120%" } : {}}
            transition={{ duration: 1, delay: 0.1, ease: "anticipate", times: [0, 0, 1] }}
            whileHover={loaded ? { color: "#EABDE6", duration: 0.5, fontSize: "145%", transition: { duration: 0.5 } } : {}}
            className="text-gradient"
          >Movies</motion.span> you'll Enjoy without hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && !isLoading && !debouncedSearchTerm  && (
          <section className='trending animate-fade-up animate-once animate-duration-[2000ms] animate-delay-[250ms] animate-ease-in-out animate-normal
'>
            <h2>Trending</h2>
            <ul>
              {trendingMovies.map((movie,index) => (
                <li key={movie.$id}>
                  <p>{index+1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))};
            </ul>
          </section>
        )}
        
        <section className='all-movies animate-fade-up animate-once animate-duration-[2000ms] animate-delay-[600ms] animate-ease-in-out animate-normal
'>
          
          {debouncedSearchTerm ? (<h2>Result</h2>)  :  (<h2>All Movies</h2>)}
          {
            isLoading ? (<p className='text-white'><Spinner /></p>)
            : errorMsg ? (<p className='text-red-300'>'Failed to fetch movies</p>)
            : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard  key={movie.id} movie={movie} />
                ))}
              </ul>
            )
          }
        </section>
      </div>
    </main>
  );
};

export default App;
