import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './games.css';

function GamesPage() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', genre: '', platform: '', releaseYear: '' });
  const [options, setOptions] = useState({ genres: [], platforms: [], releaseYears: [] });

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
  };

  const handleSearch = () => {
    filterGames();
  };

  return (
    <div>
      <h1>Games</h1>
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
        <button onClick={handleSearch}>Search</button>
      </div>
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
                  <button className="play">Play Now</button>
                </a>
                <button className="save">Save to Collection</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GamesPage;
