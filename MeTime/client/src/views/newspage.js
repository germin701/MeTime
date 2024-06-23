import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './news.css';
import saveIcon from '../assets/favourite.png';
import profileIcon from '../assets/profilepic.png';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

// "af","al","dz","ad","ao","ar","am","au","at","az","bs","bh","bd","bb","by","be","bz","bj","bm","bt","bo","ba","bw","br","bn","bg","bf","bi","kh","cm","ca",
//         "cv","ky","cf","td","cl","cn","co","km","cg","ck","cr","hr","cu","cw","cy","cz","dk","dj","dm","do","","","","","","","","","","","",
//         "","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",

//country codes
const countryCodes = {
  "China": "cn",
  "Australia": "au",
  "Malaysia": "my"
  // Add more countries and their codes here
};


//language codes
const languageCodes = {
  "Chinese": "zh",
  "English": "en",
  // Add more countries and their codes here
};

//News page
function NewsPage() {
  const [loading, setLoading] = useState(false);
  const { authState, setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', country: '', category: '', language: '' });
  const [options, setOptions] = useState(
    { 
      countries: [
        "China", "Australia", "Malaysia"
      ],
      categories: [
        "business","crime","domestic","education","entertainment","environment",
        "food","health","lifestyle","other","politics","science","sports","technology",
        "top","tourism","world"

      ], 
      languages: [
        "Chinese", "English"
      ] 
    });
  const [noResults, setNoResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedNews, setSavedNews] = useState([]);
  const newsPerPage = 10;
  const { username } = authState;




  // log out
  const logout = () => {
    // clear token, session ended
    localStorage.removeItem('authToken');
    setAuthState({ isAuthenticated: false, email: '', username: '', password: '' });
    console.log("Log Out");
    navigate('/login');
  };


  //fetch news data when filters change
  // useEffect(() => {
  //   // Fetch news data when filters change
  //   const fetchNews = async () => {
  //     const country = countryCodes[filters.country] || '';
  //     const language = languageCodes[filters.language] || '';
  //     const url = `https://newsdata.io/api/1/latest?apikey=pub_4479804182d66f5ac1c05709179ff0bf7f54e&country=${country}&category=${filters.category}&language=${language}&keyword=${filters.keyword}`;
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     setNews(data.results);
  //   };

  //   fetchNews();
  // }, [filters]);

  useEffect(() => {
    // Fetch news from API
    const fetchNews = async () => {
      setLoading(true);
      try {
        const country = countryCodes[filters.country] || '';
        const language = languageCodes[filters.language] || '';
        const queryParams = new URLSearchParams();
        if (filters.title) queryParams.append('qInTitle', filters.title);
        if (filters.country) queryParams.append('country', countryCodes[filters.country]);
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.language) queryParams.append('language', languageCodes[filters.language]);
        const url = `https://newsdata.io/api/1/latest?apikey=pub_43388a64d771db816152ebab81977eb147833&${queryParams.toString()}`;
   
        const response = await axios.get(url);
        //const { data } = response.data; // Assuming your data structure matches your provided JSON snippet
        console.log(response.data);
        //Map fetched data to match your display format
        const formattedNews = response.data.results.map(article => ({
          article_id: article.article_id,
          title: article.title,
          link: article.link,
          creator: Array.isArray(article.creator) ? article.creator.join(', ') : (article.creator || ''),
          description: article.description,
          pubDate: article.pubDate,
          imageUrl: article.image_url,
          sourceId: article.source_id,
          language: article.language,
          country: Array.isArray(article.country) ? article.country.join(', ') : (article.country || ''),
          category: Array.isArray(article.category) ? article.category.join(', ') : (article.category || ''),
        }));
  
        setNews(formattedNews); // Set original news data
        setFilteredNews(formattedNews); // Initialize filtered news with original data
        setNoResults(false); // Reset no results flag
        setCurrentPage(1); // Reset current page
  
      } catch (error) {

        console.error("Error fetching news:", error);
        // Handle error fetching data
      } finally{
        setLoading(false);
      }

    };

    // get the news saved by user
    const fetchSavedNews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/saveNews?username=${username}`);
        const savedNewsIds = response.data.map(news => news.id);
        setSavedNews(savedNewsIds);
        localStorage.setItem('savedNews', JSON.stringify(savedNewsIds));
      } catch (error) {
        console.error("Error fetching saved news:", error);
      }
    };
  
    fetchNews();
    fetchSavedNews();
  }, [filters]); // Fetch whenever filters change
  

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  // filter function
  const filterNews = () => {
    let filtered = news; // Assuming `news` is your original list of news articles

    // Filter by keyword
    if (filters.keyword) {
      filtered = filtered.filter(article => article.title.toLowerCase().includes(filters.keyword.toLowerCase()));
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(article => article.category.toLowerCase() === filters.category.toLowerCase());
    }

    // Filter by country
    if (filters.country) {
      const country = countryCodes[filters.country];
      filtered = filtered.filter(article => article.country.toLowerCase() === country.toLowerCase());
    }

    // Filter by language
    if (filters.language) {
      const language = languageCodes[filters.language];
      filtered = filtered.filter(article => article.language.toLowerCase() === language.toLowerCase());
    }

    // Update filtered news state
    setFilteredNews(filtered);
    
    // Check if no results were found
    setNoResults(filtered.length === 0);
    
    // Reset current page to 1
    setCurrentPage(1);
  };


  // search function
  const handleSearch = () => {
    filterNews();
  };


  // Clear filters function
  const clearFilters = () => {
    setFilters({ keyword: '', country: '', category: '', language: '' }); // Reset filter state to initial values

    // Reset filtered news state
    setFilteredNews([]);

    // Reset no results flag
    setNoResults(false);

    // Reset current page to 1
    setCurrentPage(1);
  };

  // pagination function
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // function to save news as favourites
  //code

  const saveToFavourites = async (article) => {
    try {

      // Log the article object to ensure article_id is present
      console.log('Saving article:', article);
      // make POST request to save the book
      await axios.post('http://localhost:5000/api/saveNews', {
        username: username,
        article: {
          article_id: article.article_id.toString(),
          title: article.title,
          link: article.link,
          creator: Array.isArray(article.creator) ? article.creator.join(', ') : (article.creator || ''),
          description: article.description,
          pubDate: article.pubDate,
          imageUrl: article.image_url,
          sourceId: article.source_id,
          language: article.language,
          country: Array.isArray(article.country) ? article.country.join(', ') : (article.country || ''),
          category: Array.isArray(article.category) ? article.category.join(', ') : (article.category || ''),
        }
      });
  
      // update savedNews state and local storage
      const updatedSavedNews = [...savedNews, article.article_id];
      setSavedNews(updatedSavedNews);
      localStorage.setItem('savedNews', JSON.stringify(updatedSavedNews));
  
      // notify user
      alert("News saved successfully");
  
    } catch (error) {
      // handle error
      console.error('Failed to save news:', error);
      // optionally notify user about the error
      alert("Failed to save news. Please try again later.", error);
    }
  };

  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews);

  const totalPages = Math.ceil(filteredNews.length / newsPerPage);


  return (
    //the whole page container
    <div style={{ width: '100%', backgroundColor: '#FFF4F1', minHeight: '100vh' }}>
    {/* navigation bar */}
      <div className="WrapContainer" style={{ width: '100%', backgroundColor: '#FFF4F1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="NavBar" style={{ width: '100%', height: '68px', padding: '10px 0', background: '#705243', justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
          <div style={{ color: '#FEFEFE', fontSize: '32px', paddingLeft: '20px', fontFamily: 'Montserrat', fontWeight: '800' }}>MeTime</div>
          <div style={{ display: 'flex', gap: '32px' }}>
            <Link to="/homepage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Home</Link>
            <Link to="/latest" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Latest</Link>
            <Link to="/radiopage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Radio</Link>
            <Link to="/newspage" style={{ color: 'lightgray', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>News</Link>
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
              <button onClick={logout} style={{ width: '120px', height: '40px', background: '#EA6767', borderRadius: '8px', color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', border: 'none', cursor: 'pointer' }}>
                Log Out
              </button>

            </div>
          </div>
        </div>
        
      </div>
      {/* end of nav bar */}

      {/* content */}
      <div>
        <h1 className='mainTitle'>News</h1>
        {/* search bar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginTop: '10px', justifyContent: 'center' }}>
            {/* keyword */}
            <input
              type="text"
              name="keyword"
              placeholder="News Keyword"
              value={filters.keyword}
              onChange={handleFilterChange}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            <select name="category" value={filters.category} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}>
              <option value="">All Categories</option>
              {options && options.categories && options.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select name="country" value={filters.country} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}>
              <option value="">All Countries</option>
              {options && options.countries && options.countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <select name="language" value={filters.language} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}>
              <option value="">All Languages</option>
              {options && options.languages && options.languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>

            
            <button className='search' onClick={handleSearch} style={{ marginRight: '6px' }}>Search</button>
            <br />
            <button className='clear' onClick={clearFilters}>Clear</button>
          </div>
        </div>
        {/* end of search bar */}

        

        {/* results */}
        {loading ? (
          <p>Loading...</p>
        ) : noResults ? (
          <p>No results found.</p>
        ) : (
          <div className="news-list">
            {filteredNews.map(article => (
              <div key={article.article_id} className="news-item">
                <img src={article.imageUrl} alt={article.title} className="news-thumbnail-container" />
                <div className="news-details">
                  <h2 className="news-title">{article.title}</h2>
                  <hr/>
                  {/* <p><span className="bold-title">article id: </span>{article.article_id || 'N/A'}</p> */}
                  <p><span className="bold-title">Description: </span>{article.description || 'N/A'}</p>
                  <p><span className="bold-title">Creator: </span>{article.creator || 'N/A'}</p>
                  <p><span className="bold-title">Published Date: </span>{article.pubDate || 'N/A'}</p>
                  <p><span className="bold-title">Source: </span>{article.sourceId || 'N/A'}</p>
                  <p><span className="bold-title">Language: </span>{article.language || 'N/A'}</p>
                  <p><span className="bold-title">Country: </span>{article.country || 'N/A'}</p>
                  <p><span className="bold-title">Category: </span>{article.category || 'N/A'}</p>
                  <div className="news-buttons">
                    <a href={article.link} target="_blank" rel="noopener noreferrer">
                      <button className="view">View Article</button>
                    </a>
                    <button
                      className="save"
                      onClick={() => saveToFavourites(article)}
                      disabled={savedNews.includes(article.article_id)}
                    >
                      {savedNews.includes(article.article_id) ? 'Saved' : 'Save to Favourites'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* end of results */}
      
      </div>
      {/* end of content */}


    </div>
    

  );
}

export default NewsPage;