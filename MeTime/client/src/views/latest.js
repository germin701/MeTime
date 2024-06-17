import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import saveIcon from '../assets/favourite.png';
import profileIcon from '../assets/profilepic.png';
import axios from 'axios';

function LatestPage() {
  const { authState } = useContext(AuthContext);
  const { email, username } = authState;
  const [games, setGames] = useState([]);
  const [news, setNews] = useState([]);
  const [books, setBooks] = useState([]);
  const [radios, setRadios] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchGames();
    //fetchNews();
    fetchBooks();
    //fetchRadios();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get('/api/games');
      const data = response.data;
      const filteredGames = data.filter(game => new Date(game.release_date).getFullYear() === currentYear);
      setGames(filteredGames);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };
  /*
  
  const fetchNews = async () => {
    try {
      // Perform rate limiting by waiting for a set amount of time
      await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the delay as per your needs
      
      const response = await axios.get('https://newsdata.io/api/1/latest', {
        params: {
          apikey: 'pub_46583428d13077e439f4a978f7872c791c9e8',
          q: 'pizza'
        }
      });
      
      const filteredNews = response.data.results.filter(article => new Date(article.pubDate).getFullYear() === currentYear);
      setNews(filteredNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };
  */


  const fetchBooks = async () => {
    try {
    const response = await axios.get('https://openlibrary.org/search.json?q=all');
    const data = response.data.docs; // OpenLibrary returns the books in the 'docs' array
    
      // Filter books based on average rating between 4 to 5
      const filteredBooks = data.filter(book => {
        // Assuming 'rating' field represents the average rating of the book
        if (book.ratings_average && typeof book.ratings_average === 'number') {
          // Check if average rating is between 4 and 5 (inclusive)
          if (book.ratings_average >= 4 && book.ratings_average <= 5) {
            return true;
          }
        }
        return false;
      });
    
      console.log('Filtered books:', filteredBooks); // Log filtered books
    
      setBooks(filteredBooks); // Update state with filtered books
    } catch (error) {
      console.error('Error fetching books:', error);
    }
    };
  

  return (
    <div className="WrapContainer" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="NavBar" style={{ width: '100%', height: '68px', padding: '10px 0', background: '#705243', justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
        <div style={{ color: '#FEFEFE', fontSize: '32px', paddingLeft: '20px', fontFamily: 'Montserrat', fontWeight: '800' }}>MeTime</div>
        <div style={{ display: 'flex', gap: '32px' }}>
          <Link to="/homepage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Home</Link>
          <Link to="/latest" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Latest</Link>
          <Link to="/radio" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Radio</Link>
          <Link to="/news" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>News</Link>
          <Link to="/books" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Books</Link>
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
      <div style={{ width: '100%', maxWidth: '1200px', padding: '20px' }}>
        <section>
          <h2>Recent Released Games in {currentYear}</h2>
          <ul>
            {games.map(game => (
              <li key={game.id}>
                <h3>{game.title}</h3>
                <p>Release Date: {game.release_date}</p>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Latest News in {currentYear}</h2>
          <ul>
            {news.map(article => (
              <li key={article.link}>
                <h3>{article.title}</h3>
                <p>Source: <a href={article.source_url} target="_blank" rel="noopener noreferrer">{article.source_id}</a></p>
                <p>Published Date: {article.pubDate}</p>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>New Books Published in {currentYear}</h2>
          <ul>
            {books.map(book => (
              <li key={book.title}>
                <h3>{book.title}</h3>
                <p>Language: {book.language}</p>
                <p>Genre: {book.type}</p>
              </li>
            ))}
          </ul>
        </section>
       
      </div>
    </div>
  );
}

export default LatestPage;
