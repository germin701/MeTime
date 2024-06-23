import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import saveIcon from '../assets/favourite.png';
import profileIcon from '../assets/profilepic.png';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import './favourite.css';

// User's Favourite Collection Page
function FavoritesPage() {
  const { authState, setAuthState } = useContext(AuthContext);
  const [savedGames, setSavedGames] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [savedRadios, setSavedRadios] = useState([]);
  const [savedNews, setSavedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = authState;
  const [selectedCategory, setSelectedCategory] = useState('games');
  const navigate = useNavigate();

  const fetchItems = async (category) => {
    setLoading(true); // start loading
    setError(null);

    try {
      switch (category) {
        case 'games':
          // fetch the list of saved games
          const responseGames = await axios.get('http://localhost:5000/api/saveGame', {
            params: { username, category: 'games' }
          });
          setSavedGames(responseGames.data);
          break;
        case 'books':
          // fetch the list of saved books
          const responseBooks = await axios.get('http://localhost:5000/api/saveBook', {
            params: { username, category: 'books' }
          });
          setSavedBooks(responseBooks.data);
          break;
        case 'radios':
          // fetch the list of saved games
          const responseRadios = await axios.get('http://localhost:5000/api/saveRadio', {
            params: { username, category: 'radios' }
          });
          setSavedRadios(responseRadios.data);
          break;
        case 'news':
          // fetch the list of saved news
          const responseNews = await axios.get('http://localhost:5000/api/saveNews', {
            params: { username, category: 'news' }
          });
          setSavedNews(responseNews.data);
          break;
        default:
          throw new Error('Unknown category: ' + category);
      }
      setLoading(false); // stop loading
    } catch (error) {
      console.error('Failed to fetch saved items:', error);
      setError('Failed to fetch saved items');
      setLoading(false); // stop loading
    }
  };

  useEffect(() => {
    fetchItems('games'); // initial fetch when component mounts, display game at first before any selections
  }, [username]);

  // delete item function
  const deleteItem = async (itemId, category) => {
    let url = '';
    switch (category) {
      case 'games':
        // contruct the url to search for selected game
        url = `http://localhost:5000/api/saveGame?username=${username}&gameId=${itemId}`;
        break;
      case 'books':
        // contruct the url to search for selected book
        url = `http://localhost:5000/api/saveBook?username=${username}&bookId=${itemId}`;
        break;
      case 'radios':
        // contruct the url to search for selected radio
        url = `http://localhost:5000/api/saveRadio?username=${username}&radioId=${itemId}`;
        break;
      case 'news':
        // contruct the url to search for selected news
        url = `http://localhost:5000/api/saveNews?username=${username}&newsId=${itemId}`;
        break;
      default:
        console.error('Unknown category:', category);
        return;
    }

    try {
      // call to delete the selected item
      const response = await axios.delete(url);

      if (response.status === 200) {
        switch (category) {
          case 'games':
            // update the game list after deletions
            const updatedSavedGames = savedGames.filter(game => game.id !== itemId);
            setSavedGames(updatedSavedGames);
            break;
          case 'books':
            // update the book list after deletions
            const updatedSavedBooks = savedBooks.filter(book => book.id !== itemId);
            setSavedBooks(updatedSavedBooks);
            break;
          case 'radios':
            // update the radio list after deletions
            const updatedSavedRadios = savedRadios.filter(radio => radio.stationuuid !== itemId);
            setSavedRadios(updatedSavedRadios);
            break;
          case 'news':
            // update the news list after deletions
            const updatedSavedNews = savedNews.filter(news => news.article_id !== itemId);
            setSavedNews(updatedSavedNews);
            break;
          default:
            console.error('Unknown category:', category);
            break;
        }
        alert('Item deleted successfully');
      } else {
        throw new Error('Failed to delete item');
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item');
    }
  };

  // ask for user confirmation before deletions
  const handleDeleteItem = (itemId, category) => {
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (confirmed) {
      deleteItem(itemId, category);
    }
  };

  // handle data fetching based on category selections
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category === 'games') {
      fetchItems('games');
    }
    else if (category === 'books') {
      fetchItems('books');
    }
    else if (category === 'radios') {
      fetchItems('radios');
    }
    else if (category === 'news') {
      fetchItems('news');
    }
  };

  // log out
  const logout = () => {
    // clear token, session ended
    localStorage.removeItem('authToken');
    setAuthState({ isAuthenticated: false, email: '', username: '', password: '' });
    console.log("Log Out");
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const renderContent = () => {
    switch (selectedCategory) {
      // if game category is chosen
      case 'games':
        return savedGames.length > 0 ? (
          <div className="games-list">
            {savedGames.map((game) => (
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
                      className="delete"
                      aria-label={`Delete ${game.title}`}
                      onClick={() => handleDeleteItem(game.id, 'games')}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // if there's no saved games
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>No saved games found.</p>
          </div>
        );
      case 'books':
        return savedBooks.length > 0 ? (
          <div className="books-list">
            {savedBooks.map(book => (
              <div key={book.id} className="book-item">
                <img src={`http://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`} alt={book.title} className="book-thumbnail" />
                <div className="book-details">
                  <h2 className="book-title">{book.title}</h2>
                  <hr />
                  <p><span className="bold-title">Description: </span>{book.first_sentence}</p>
                  <p><span className="bold-title">Author: </span>{book.author}</p>
                  <p><span className="bold-title">Published On: </span>{book.first_publish_year}</p>
                  <p><span className="bold-title">Languages Available: </span>{Array.isArray(book.language) ? book.language.join(', ') : book.language}</p>
                  <p><span className="bold-title">Time: </span>{Array.isArray(book.time) ? book.time.join(', ') : book.time}</p>
                  <p><span className="bold-title">Average Rating: </span>{book.ratings_average}</p>
                  <div className="book-buttons">
                    <a href={`https://openlibrary.org${book.id}`} target="_blank" rel="noopener noreferrer">
                      <button className="view">View Book</button>
                    </a>
                    <button
                      className="delete"
                      aria-label={`Delete ${book.title}`}
                      onClick={() => handleDeleteItem(book.id, 'books')}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // if there's no saved books
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>No saved books found.</p>
          </div>
        );
      case 'radios':
        return savedRadios.length > 0 ? (
          <div className="stations-list">
            {savedRadios.map(station => (
              <div key={station.stationuuid} className="station-item">
                <img src={station.favicon || 'default_station_image_url'} alt={'No Image'} className="station-thumbnail" />
                <div className="station-details">
                  <h2 className="station-title">{station.name.trim() || '(No Title Provided)'}</h2>
                  <hr />
                  <p><span className="bold-title">Country:</span> {station.country || 'N/A'}</p>
                  <p><span className="bold-title">State:</span> {station.state || 'N/A'}</p>
                  <p><span className="bold-title">Language:</span> {station.language || 'N/A'}</p>
                  <div className="station-buttons">
                    <a href={station.url_resolved} target="_blank" rel="noopener noreferrer">
                      <button className="listen">
                        <FontAwesomeIcon icon={faMusic} style={{ marginRight: '8px' }} />
                        Listen Now
                      </button>
                    </a>
                    <a href={station.homepage} target="_blank" rel="noopener noreferrer">
                      <button className="visit" aria-label={`Visit ${station.name} homepage`}>Visit Homepage</button>
                    </a>
                    <button
                      className="delete"
                      aria-label={`Delete ${station.name}`}
                      onClick={() => handleDeleteItem(station.stationuuid, 'radios')}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // if there's no saved radios
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>No saved radios found.</p>
          </div>
        );
      case 'news':
        return savedNews.length > 0 ? (
          <div className="news-list">
            {savedNews.map(article => (
              <div key={article.article_id} className="news-item">
                <img src={article.imageUrl} alt={'No Image Provided'} className="news-thumbnail-container" />
                <div className="news-details">
                  <h2 className="news-title">{article.title}</h2>
                  <hr />
                  <p><span className="bold-title">Description: </span>{article.description || 'N/A'}</p>
                  <p><span className="bold-title">Creator: </span>{article.creator || 'N/A'}</p>
                  <p><span className="bold-title">Published Date: </span>{article.pubDate || 'N/A'}</p>
                  <p><span className="bold-title">Source: </span>{article.sourceId || 'N/A'}</p>
                  <p><span className="bold-title">Language: </span>{article.language || 'N/A'}</p>
                  <p><span className="bold-title">Country: </span>{article.country || 'N/A'}</p>
                  <p><span className="bold-title">Category: </span>{article.category || 'N/A'}</p>
                  <div className="station-buttons">
                    <a href={article.link} target="_blank" rel="noopener noreferrer">
                      <button className="view">View Article</button>
                    </a>
                    <button
                      className="delete"
                      aria-label={`Delete`}
                      onClick={() => handleDeleteItem(article.article_id, 'news')}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // if there's no saved news
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>No saved news found.</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
          <Link to="/gamespage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Games</Link>
        </div>
        <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: '20px', display: 'flex' }}>
          <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: '8px', display: 'flex' }}>
            <img src={saveIcon} alt="Favourites" style={{ width: '25px', height: '25px' }} />
            <Link to="/favourites" style={{ color: 'lightgray', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>My Favourites</Link>
          </div>
          <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: '8px', display: 'flex' }}>
            <img src={profileIcon} alt="Profile" style={{ width: '25px', height: '25px' }} />
            <Link to="/profile" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', textDecoration: 'none' }}>My Profile</Link>
          </div>
          <div style={{ justifyContent: 'flex-start', alignItems: 'flex-start', paddingRight: '20px', gap: '12px', display: 'flex' }}>
            <div style={{ padding: '0 20px' }}>
              <button onClick={logout} style={{ width: '120px', height: '40px', background: '#EA6767', borderRadius: '8px', color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', border: 'none', cursor: 'pointer' }}>
                Log Out
              </button>

            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '20px' }}>
        <h1>Favourites</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
          <button onClick={() => handleCategoryClick('games')} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>Games</button>
          <button onClick={() => handleCategoryClick('books')} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>Books</button>
          <button onClick={() => handleCategoryClick('radios')} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>Radios</button>
          <button onClick={() => handleCategoryClick('news')} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>News</button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default FavoritesPage;

