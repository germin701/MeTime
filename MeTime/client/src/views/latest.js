import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import saveIcon from '../assets/favourite.png';
import profileIcon from '../assets/profilepic.png';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faMusic, faGamepad, faNewspaper } from '@fortawesome/free-solid-svg-icons';

// Page to display latest/ highly recommended information for games, books, news and radios (4 APIs)
function LatestPage() {
  const { authState } = useContext(AuthContext);
  const { email, username } = authState;
  const [games, setGames] = useState([]);
  const [news, setNews] = useState([]);
  const [books, setBooks] = useState([]);
  const [radios, setRadios] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();

  // fetch all data
  useEffect(() => {
    fetchGames();
    fetchNews();
    fetchBooks();
    fetchRadios();
  }, []);

  // fetch games data to get the recently released games in the current year
  const fetchGames = async () => {
    try {
      const response = await axios.get('/api/games'); // api base link stated in package.json (proxy)
      const data = response.data;
      const filteredGames = data.filter(game => new Date(game.release_date).getFullYear() === currentYear);
      setGames(filteredGames);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  // fetch news data to get the today's published news information
  const fetchNews = async () => {
    try {
      // perform rate limiting by waiting for a set amount of time
      await new Promise(resolve => setTimeout(resolve, 1000)); // adjust the delay as per your needs

      const response = await axios.get('https://newsdata.io/api/1/latest', {
        params: {
          apikey: 'pub_46583428d13077e439f4a978f7872c791c9e8',
        }
      });

      const filteredNews = response.data.results.filter(article => new Date(article.pubDate).getFullYear() === currentYear);
      setNews(filteredNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  // fetch books data to get those books with ratings between 4 and 5
  const fetchBooks = async () => {
    setLoading(true); // set loading to true before fetching data
    try {
      const response = await axios.get('https://openlibrary.org/search.json?q=all');
      const data = response.data.docs; // OpenLibrary returns the books in the 'docs' array

      // filter books based on average rating between 4 to 5 
      const filteredBooks = data.filter(book => {
        if (book.ratings_average && typeof book.ratings_average === 'number') {
          if (book.ratings_average >= 4 && book.ratings_average <= 5) {
            return true;
          }
        }
        return false;
      }).map(book => ({
        title: book.title,
        cover_id: book.cover_i, // book cover image
        ratings_average: book.ratings_average,
        type: book.type,
        url: `https://openlibrary.org${book.key}` // construct the URL to the book 
      }));

      console.log('Filtered books:', filteredBooks); // log filtered books
      setBooks(filteredBooks); // update state with filtered books
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false); // set loading to false after data is fetched
    }
  };

  // fetch radios data to get the top 30 recently changed or released radios
  // limit the number of data as the data fetched may be very huge
  const fetchRadios = async () => {
    try {
      const response = await axios.get('https://de1.api.radio-browser.info/json/stations/lastchange/30');
      const data = response.data;
      setRadios(data);
    } catch (error) {
      console.error('Error fetching radios:', error);
    }
  };

  return (
    // navigation bar
    <div className="WrapContainer" style={{ width: '100%', backgroundColor: '#FFF4F1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="NavBar" style={{ width: '100%', height: '68px', padding: '10px 0', background: '#705243', justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
        <div style={{ color: '#FEFEFE', fontSize: '32px', paddingLeft: '20px', fontFamily: 'Montserrat', fontWeight: '800' }}>MeTime</div>
        <div style={{ display: 'flex', gap: '32px' }}>
          <Link to="/homepage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Home</Link>
          <Link to="/latest" style={{ color: 'lightgray', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Latest</Link>
          <Link to="/radiopage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Radio</Link>
          <Link to="/newspage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>News</Link>
          <Link to="/bookspage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Books</Link>
          <Link to="/gamespage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Games</Link>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <img src={saveIcon} alt="Favourites" style={{ width: '25px', height: '25px' }} />
            <Link to="/favourites" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>My Favourites</Link>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <img src={profileIcon} alt="Profile" style={{ width: '25px', height: '25px' }} />
            <Link to="/profile" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>My Profile</Link>
          </div>
          <div style={{ padding: '0 20px' }}>
            <button style={{ width: '115px', height: '40px', background: '#EA6767', borderRadius: '8px', color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', border: 'none', cursor: 'pointer' }}>Log Out</button>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', maxWidth: '1200px', padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', width: '100%', gap: '20px' }}>
          <section style={{ flex: '1', maxHeight: '400px', overflowY: 'auto', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
            <h2>Recent Released Games in {currentYear}</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {games.map(game => (
                <li key={game.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <img src={game.thumbnail || 'placeholder.jpg'} alt={game.title} style={{ width: '100px', height: '100px', marginRight: '10px', borderRadius: '10px' }} />
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3>{game.title}</h3>
                      <p>{game.short_description}</p>
                    </div>
                    <p>
                      <a className="StyledLink" href={game.game_url} target="_blank" rel="noopener noreferrer">
                        <button style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                          <FontAwesomeIcon icon={faGamepad} style={{ marginRight: '8px' }} />
                          Play Now
                        </button>
                      </a>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section style={{ flex: '1', maxHeight: '400px', overflowY: 'auto', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#e8f0fe' }}>
            <h2>Latest News Today in {currentYear}</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {news.map(article => (
                <li key={article.article_id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  {article.image_url && (
                    <img src={article.image_url} alt={article.title} style={{ width: '100px', height: '100px', marginRight: '10px', borderRadius: '10px' }} />
                  )}
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3>{article.title}</h3>
                      <p>{article.description}</p>
                    </div>
                    <p>
                      <a className="StyledLink" href={article.link} target="_blank" rel="noopener noreferrer">
                        <button style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                          <FontAwesomeIcon icon={faNewspaper} style={{ marginRight: '8px' }} />
                          Read More
                        </button>
                      </a>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div style={{ display: 'flex', width: '100%', gap: '20px' }}>
          <section style={{ flex: '1', maxHeight: '400px', overflowY: 'auto', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fce8e8' }}>
            <h2>Highly Rated Books</h2>
            {loading ? (
              <p>Loading books...</p>
            ) : (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {books.map(book => (
                  <li key={book.title} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <img src={`http://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`} alt={book.title} style={{ width: '100px', height: '100px', marginRight: '10px', borderRadius: '10px' }} />
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3>{book.title}</h3>
                        <p>Ratings: {book.ratings_average.toFixed(2)}</p>
                      </div>
                      <p>
                        <a className="StyledLink" href={book.url} target="_blank" rel="noopener noreferrer">
                          <button style={{ padding: '8px 16px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            <FontAwesomeIcon icon={faBookOpen} style={{ marginRight: '8px' }} />
                            Read Now
                          </button>
                        </a>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section style={{ flex: '1', maxHeight: '400px', overflowY: 'auto', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#e8f7e8' }}>
            <h2>Latest Updated Radio Stations</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {radios.map(radio => (
                <li key={radio.stationuuid} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3>{radio.name}</h3>
                      <p>Country: {radio.country}</p>
                      <p>Language: {radio.language ? radio.language : "(not provided)"}</p>
                    </div>
                    <p>
                      <a className="StyledLink" href={radio.url_resolved} target="_blank" rel="noopener noreferrer">
                        <button style={{ padding: '8px 16px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                          <FontAwesomeIcon icon={faMusic} style={{ marginRight: '8px' }} />
                          Listen Now
                        </button>
                      </a>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default LatestPage;
