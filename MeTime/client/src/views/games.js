import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './games.css';
import saveIcon from '../assets/favourite.png';
import profileIcon from '../assets/profilepic.png';

function GamesPage() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', genre: '', platform: '', releaseYear: '' });
  const [options, setOptions] = useState({ genres: [], platforms: [], releaseYears: [] });
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    axios.get('/api/games')
      .then((response) => {
        setGames(response.data);
        setFilteredGames(response.data);

        const genres = [...new Set(response.data.map(game => game.genre))];
        const platforms = [...new Set(response.data.map(game => game.platform))];
        const releaseYears = [...new Set(response.data.map(game => new Date(game.release_date).getFullYear()))]
          .filter(year => !isNaN(year)) // Remove NaN values
          .sort((a, b) => b - a); // Sort years in descending order

        setOptions({ genres, platforms, releaseYears });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

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
    setNoResults(filtered.length === 0); // Set noResults to true if filtered array is empty
  };

  const handleSearch = () => {
    filterGames();
  };

  const clearFilters = () => {
    setFilters({ keyword: '', genre: '', platform: '', releaseYear: '' });
    setFilteredGames(games);
    setNoResults(false);
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#FFF4F1', minHeight: '100vh' }}>
      <div className="NavBar" style={{ width: '100%', height: '68px', paddingLeft: '0px', paddingRight: '0px', paddingTop: '10px', paddingBottom: '10px', background: '#705243', justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
        <div style={{ color: '#FEFEFE', fontSize: '32px', paddingLeft: '20px', fontFamily: 'Montserrat', fontWeight: '800', lineHeight: '48px', wordWrap: 'break-word' }}>MeTime</div>
        <div style={{ justifyContent: 'flex-start', alignItems: 'flex-start', gap: '32px', display: 'flex' }}>
          <div style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', lineHeight: '30px', wordWrap: 'break-word' }}>Home</div>
          <div style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', lineHeight: '30px', wordWrap: 'break-word' }}>Radio</div>
          <div style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', lineHeight: '30px', wordWrap: 'break-word' }}>News</div>
          <div style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', lineHeight: '30px', wordWrap: 'break-word' }}>Books</div>
          <div style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', lineHeight: '30px', wordWrap: 'break-word' }}>Games</div>
        </div>
        <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: '20px', display: 'flex' }}>
          <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: '8px', display: 'flex' }}>
            <img src={saveIcon} alt="Favourites" style={{ width: '25px', height: '25px' }} />
            <div style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', lineHeight: '30px', wordWrap: 'break-word' }}>My Favourites</div>
          </div>
          <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: '8px', display: 'flex' }}>
  
            <img src={profileIcon} alt="Profile" style={{ width: '25px', height: '25px' }} />
            <div style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', lineHeight: '30px', wordWrap: 'break-word' }}>My Profile</div>
          </div>
          <div style={{ justifyContent: 'flex-start', alignItems: 'flex-start', paddingRight: '20px', gap: '12px', display: 'flex' }}>
            <div style={{ width: '115px', height: '40px', paddingLeft: '16px', paddingRight: '16px', background: '#EA6767', borderRadius: '8px', justifyContent: 'center', alignItems: 'center', gap: '8px', display: 'flex' }}>
              <div style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', lineHeight: '30px', wordWrap: 'break-word' }}>Log Out</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1 className='mainTitle'>Games</h1>
        <div>
          <input
            type="text"
            name="keyword"
            placeholder="Keyword"
            value={filters.keyword}
            onChange={handleFilterChange}
          />
          <select name="genre" value={filters.genre} onChange={handleFilterChange}>
            <option value="">All Genres</option>
            {options.genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
          <select name="platform" value={filters.platform} onChange={handleFilterChange}>
            <option value="">All Platforms</option>
            {options.platforms.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
          <select name="releaseYear" value={filters.releaseYear} onChange={handleFilterChange}>
            <option value="">All Years</option>
            {options.releaseYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button className='search' onClick={handleSearch}>Search</button>
          <button className='clear' onClick={clearFilters}>Clear</button>
        </div>
        {noResults ? (
          <p style={{ textAlign: 'center', marginTop: '20px', color: '#333' }}>No results found.</p>
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
                    <button className="save" aria-label={`Save ${game.title} to Favourites`}>Save to Favourites</button>
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