import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './games.css';
import saveIcon from '../assets/favourite.png';
import profileIcon from '../assets/profilepic.png';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';

//Games Page
function GamesPage() {
  const { authState, setAuthState } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', genre: '', platform: '', releaseYear: '' });
  const [options, setOptions] = useState({ genres: [], platforms: [], releaseYears: [] });
  const [noResults, setNoResults] = useState(false);
  const [savedGames, setSavedGames] = useState([]);
  const { username } = authState;

  // get logged-in username
  useEffect(() => {
    console.log('Username:', { username });

    // fetch games data from games api (stated in package.json [proxy])
    axios.get('/api/games')
      .then((response) => {
        setGames(response.data);
        setFilteredGames(response.data);

        // get data for genres, platforms, released years for filtering purposes
        const genres = [...new Set(response.data.map(game => game.genre))];
        const platforms = [...new Set(response.data.map(game => game.platform))];
        const releaseYears = [...new Set(response.data.map(game => new Date(game.release_date).getFullYear()))]
          .filter(year => !isNaN(year))
          .sort((a, b) => b - a);

        setOptions({ genres, platforms, releaseYears });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    // fetch saved favourites games for the user
    axios.get(`http://localhost:5000/api/saveGame?username=${username}`)
      .then((response) => {
        const savedGameId = response.data.map(game => game.id);
        setSavedGames(savedGameId);
        // store saved games in localStorage
        localStorage.setItem('savedGames', JSON.stringify(savedGameId));
      })
      .catch((error) => {
        console.error("Error fetching saved games:", error);
      });
  }, [username]);


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // filter function
  const filterGames = () => {
    let filtered = games;
    if (filters.keyword) {
      filtered = filtered.filter(game => game.title.toLowerCase().includes(filters.keyword.toLowerCase()));
    }
    if (filters.genre) {
      filtered = filtered.filter(game => game.genre.toLowerCase() === filters.genre.toLowerCase());
    }
    if (filters.platform) {
      filtered = filtered.filter(game => game.platform.toLowerCase() === filters.platform.toLowerCase());
    }
    if (filters.releaseYear) {
      filtered = filtered.filter(game => new Date(game.release_date).getFullYear() === parseInt(filters.releaseYear));
    }
    setFilteredGames(filtered);
    setNoResults(filtered.length === 0);
  };

  // search function
  const handleSearch = () => {
    filterGames();
  };

  // clear all filtering
  const clearFilters = () => {
    setFilters({ keyword: '', genre: '', platform: '', releaseYear: '' });
    setFilteredGames(games);
    setNoResults(false);
  };

  // function to save games as favourites
  const saveToFavourites = async (game) => {
    try {
      console.log('Game to save:', game);

      // save to server (api)
      await axios.post('http://localhost:5000/api/saveGame', {
        username: username,
        game: {
          id: game.id,
          title: game.title,
          genre: game.genre,
          platform: game.platform,
          publisher: game.publisher,
          developer: game.developer,
          release_date: game.release_date,
          thumbnail: game.thumbnail,
          short_description: game.short_description,
          game_url: game.game_url,
        }
      });

      // update local state and localStorage
      const updatedSavedGames = [...savedGames, game.id];
      setSavedGames(updatedSavedGames);
      localStorage.setItem('savedGames', JSON.stringify(updatedSavedGames));

      alert("Game saved successfully");

    } catch (error) {
      console.error('Failed to save game:', error);
    }
  };

  // log out
  const logout = () => {
    // clear token, session ended
    localStorage.removeItem('authToken'); 
    setAuthState({ isAuthenticated: false, email: '', username: '', password: '' });
  };

  return (
    // navigation bar
    <div style={{ width: '100%', backgroundColor: '#FFF4F1', minHeight: '100vh' }}>
      <div className="NavBar" style={{ width: '100%', height: '68px', paddingLeft: '0px', paddingRight: '0px', paddingTop: '10px', paddingBottom: '10px', background: '#705243', justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
        <div style={{ color: '#FEFEFE', fontSize: '32px', paddingLeft: '20px', fontFamily: 'Montserrat', fontWeight: '800', lineHeight: '48px', wordWrap: 'break-word' }}>MeTime</div>
        <div style={{ justifyContent: 'flex-start', alignItems: 'flex-start', gap: '32px', display: 'flex' }}>
          <Link to="/homepage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Home</Link>
          <Link to="/latest" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Latest</Link>
          <Link to="/radiopage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Radio</Link>
          <Link to="/newspage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>News</Link>
          <Link to="/bookspage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Books</Link>
          <Link to="/gamespage" style={{ color: 'lightgray', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Games</Link>
        </div>
        <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: '20px', display: 'flex' }}>
          <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: '8px', display: 'flex' }}>
            <img src={saveIcon} alt="Favourites" style={{ width: '25px', height: '25px' }} />
            <Link to="/favourites" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>My Favourites</Link>
          </div>
          <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: '8px', display: 'flex' }}>
            <img src={profileIcon} alt="Profile" style={{ width: '25px', height: '25px' }} />
            <Link to="/profile" style={{ color: 'inherit', textDecoration: 'none' }}>My Profile</Link>
          </div>
          <div style={{ justifyContent: 'flex-start', alignItems: 'flex-start', paddingRight: '20px', gap: '12px', display: 'flex' }}>
            <div
              style={{ width: '115px', height: '40px', paddingLeft: '16px', paddingRight: '16px', background: '#EA6767', borderRadius: '8px', justifyContent: 'center', alignItems: 'center', gap: '8px', display: 'flex' }}
              onClick={logout}>
              <div style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', lineHeight: '30px', wordWrap: 'break-word' }}>Log Out</div>
            </div>
          </div>

        </div>
      </div>
      <div>
        <div>
          <h1 className='mainTitle'>Games</h1>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px', marginTop: '10px', justifyContent: 'center' }}>
              <input
                type="text"
                name="keyword"
                placeholder="Keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
              />
              <select name="genre" value={filters.genre} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}>
                <option value="">All Genres</option>
                {options.genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              <select name="platform" value={filters.platform} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}>
                <option value="">All Platforms</option>
                {options.platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
              <select name="releaseYear" value={filters.releaseYear} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}>
                <option value="">All Years</option>
                {options.releaseYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <button className='search' onClick={handleSearch}>Search</button>
              <button className='clear' onClick={clearFilters}>Clear Filters</button>
            </div>
          </div>
        </div>
        {noResults ? (
          <p>No results found.</p>
        ) : (
          <div className="games-list">
            {filteredGames.map(game => (
              <div key={game.id} className="game-item">
                <img src={game.thumbnail} alt={game.title} className="game-thumbnail" />
                <div className="game-details">
                  <h2 className="game-title">{game.title}</h2>
                  <hr />
                  <p>"{game.short_description}"</p>
                  <p><span className="bold-title">Game Type/ Genre:</span> {game.genre}</p>
                  <p><span className="bold-title">Platform:</span> {game.platform}</p>
                  <p><span className="bold-title">Publisher:</span> {game.publisher}</p>
                  <p><span className="bold-title">Developer:</span> {game.developer}</p>
                  <p><span className="bold-title">Released On:</span> {game.release_date}</p>
                  <div className="game-buttons">
                    <a href={game.game_url} target="_blank" rel="noopener noreferrer">
                      <button className="play" aria-label={`Play ${game.title}`}>Play Now</button>
                    </a>
                    <button
                      className="save"
                      aria-label={`Save ${game.title} to Favourites`}
                      onClick={() => saveToFavourites(game)}
                      disabled={savedGames.includes(game.id)}
                    >
                      {savedGames.includes(game.id) ? 'Saved' : 'Save to Favourites'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GamesPage;