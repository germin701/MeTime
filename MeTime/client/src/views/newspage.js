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

// country codes
const countryCodes = {
  "Afghanistan": "af",  "Albania": "al",  "Algeria": "dz",  "Andorra": "ad",  "Angola": "ao",  "Argentina": "ar",  "Armenia": "am",  "Australia": "au",  "Austria": "at",  "Azerbaijan": "az",  "Bahamas": "bs",
  "Bahrain": "bh",
  "Bangladesh": "bd",
  "Barbados": "bb",
  "Belarus": "by",
  "Belgium": "be",
  "Belize": "bz",
  "Benin": "bj",
  "Bermuda": "bm",
  "Bhutan": "bt",
  "Bolivia": "bo",
  "Bosnia And Herzegovina": "ba",
  "Botswana": "bw",
  "Brazil": "br",
  "Brunei": "bn",
  "Bulgaria": "bg",
  "Burkina Faso": "bf",
  "Burundi": "bi",
  "Cambodia": "kh",
  "Cameroon": "cm",
  "Canada": "ca",
  "Cape Verde": "cv",
  "Cayman Islands": "ky",
  "Central African Republic": "cf",
  "Chad": "td",
  "Chile": "cl",
  "China": "cn",
  "Colombia": "co",
  "Comoros": "km",
  "Congo": "cg",
  "Cook Islands": "ck",
  "Costa Rica": "cr",
  "Croatia": "hr",
  "Cuba": "cu",
  "Curaçao": "cw",
  "Cyprus": "cy",
  "Czech Republic": "cz",
  "Denmark": "dk",
  "Djibouti": "dj",
  "Dominica": "dm",
  "Dominican Republic": "do",
  "DR Congo": "cd",
  "Ecuador": "ec",
  "Egypt": "eg",
  "El Salvador": "sv",
  "Equatorial Guinea": "gq",
  "Eritrea": "er",
  "Estonia": "ee",
  "Eswatini": "sz",
  "Ethiopia": "et",
  "Fiji": "fj",
  "Finland": "fi",
  "France": "fr",
  "French Polynesia": "pf",
  "Gabon": "ga",
  "Gambia": "gm",
  "Georgia": "ge",
  "Germany": "de",
  "Ghana": "gh",
  "Gibraltar": "gi",
  "Greece": "gr",
  "Grenada": "gd",
  "Guatemala": "gt",
  "Guinea": "gn",
  "Guyana": "gy",
  "Haiti": "ht",
  "Honduras": "hn",
  "Hong Kong": "hk",
  "Hungary": "hu",
  "Iceland": "is",
  "India": "in",
  "Indonesia": "id",
  "Iran": "ir",
  "Iraq": "iq",
  "Ireland": "ie",
  "Israel": "il",
  "Italy": "it",
  "Ivory Coast": "ci",
  "Jamaica": "jm",
  "Japan": "jp",
  "Jersey": "je",
  "Jordan": "jo",
  "Kazakhstan": "kz",
  "Kenya": "ke",
  "Kiribati": "ki",
  "Kosovo": "xk",
  "Kuwait": "kw",
  "Kyrgyzstan": "kg",
  "Laos": "la",
  "Latvia": "lv",
  "Lebanon": "lb",
  "Lesotho": "ls",
  "Liberia": "lr",
  "Libya": "ly",
  "Liechtenstein": "li",
  "Lithuania": "lt",
  "Luxembourg": "lu",
  "Macau": "mo",
  "Macedonia": "mk",
  "Madagascar": "mg",
  "Malawi": "mw",
  "Malaysia": "my",
  "Maldives": "mv",
  "Mali": "ml",
  "Malta": "mt",
  "Marshall Islands": "mh",
  "Mauritania": "mr",
  "Mauritius": "mu",
  "Mexico": "mx",
  "Micronesia": "fm",
  "Moldova": "md",
  "Monaco": "mc",
  "Mongolia": "mn",
  "Montenegro": "me",
  "Morocco": "ma",
  "Mozambique": "mz",
  "Myanmar": "mm",
  "Namibia": "na",
  "Nauru": "nr",
  "Nepal": "np",
  "Netherland": "nl",
  "New Caledonia": "nc",
  "New Zealand": "nz",
  "Nicaragua": "ni",
  "Niger": "ne",
  "Nigeria": "ng",
  "North Korea": "kp",
  "Norway": "no",
  "Oman": "om",
  "Pakistan": "pk",
  "Palau": "pw",
  "Palestine": "ps",
  "Panama": "pa",
  "Papua New Guinea": "pg",
  "Paraguay": "py",
  "Peru": "pe",
  "Philippines": "ph",
  "Poland": "pl",
  "Portugal": "pt",
  "Puerto Rico": "pr",
  "Qatar": "qa",
  "Romania": "ro",
  "Russia": "ru",
  "Rwanda": "rw",
  "Saint Lucia": "lc",
  "Saint Martin (Dutch)": "sx",
  "Samoa": "ws",
  "San Marino": "sm",
  "Sao Tome and Principe": "st",
  "Saudi Arabia": "sa",
  "Senegal": "sn",
  "Serbia": "rs",
  "Seychelles": "sc",
  "Sierra Leone": "sl",
  "Singapore": "sg",
  "Slovakia": "sk",
  "Slovenia": "si",
  "Solomon Islands": "sb",
  "Somalia": "so",
  "South Africa": "za",
  "South Korea": "kr",
  "Spain": "es",
  "Sri Lanka": "lk",
  "Sudan": "sd",
  "Suriname": "sr",
  "Sweden": "se",
  "Switzerland": "ch",
  "Syria": "sy",
  "Taiwan": "tw",
  "Tajikistan": "tj",
  "Tanzania": "tz",
  "Thailand": "th",
  "Timor-Leste": "tl",
  "Togo": "tg",
  "Tonga": "to",
  "Trinidad and Tobago": "tt",
  "Tunisia": "tn",
  "Turkey": "tr",
  "Turkmenistan": "tm",
  "Tuvalu": "tv",
  "Uganda": "ug",
  "Ukraine": "ua",
  "United Arab Emirates": "ae",
  "United Kingdom": "gb",
  "United States of America": "us",
  "Uruguay": "uy",
  "Uzbekistan": "uz",
  "Vanuatu": "vu",
  "Vatican": "va",
  "Venezuela": "ve",
  "Vietnam": "vi",
  "Virgin Islands (British)": "vg",
  "World": "wo",
  "Yemen": "ye",
  "Zambia": "zm",
  "Zimbabwe": "zw"
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
  //const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchFilters, setSearchFilters] = useState({ keyword: '', country: '', category: '', language: '' });
  const [appliedFilters, setAppliedFilters] = useState({ keyword: '', country: '', category: '', language: '' });
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



  // Fetch news from API
  const fetchNews = async (filters) => {
    setLoading(true);
    try {
      const country = countryCodes[filters.country] || '';
      const language = languageCodes[filters.language] || '';
      const queryParams = new URLSearchParams();
      if (filters.keyword) queryParams.append('qInTitle', filters.keyword);
      if (filters.country) queryParams.append('country', country);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.language) queryParams.append('language', language);
      const url = `https://newsdata.io/api/1/latest?apikey=pub_4479804182d66f5ac1c05709179ff0bf7f54e&${queryParams.toString()}`;
      
      const response = await axios.get(url);
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
      setNoResults(formattedNews.length === 0); // Set no results flag
      setCurrentPage(1); // Reset current page
    } catch (error) {
      console.error("Error fetching news:", error);
      // Handle error fetching data
    } finally {
      setLoading(false);
    }
  };


  // Fetch news and saved news on component mount
  useEffect(() => {
    fetchNews(appliedFilters);

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

    fetchSavedNews();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  // Apply filters and fetch news on search
  const handleSearch = () => {
    setAppliedFilters(searchFilters);
    fetchNews(searchFilters);
  };

 

  







  // Clear filters function
  const clearFilters = () => {
    const defaultFilters = { keyword: '', country: '', category: '', language: '' };
    setSearchFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    fetchNews(defaultFilters);
  };



  // function to save news as favourites
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
              value={searchFilters.keyword}
              onChange={handleFilterChange}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            <select name="category" value={searchFilters.category} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}>
              <option value="">All Categories</option>
              {options && options.categories && options.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select name="country" value={searchFilters.country} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}>
              <option value="">All Countries</option>
              {options && options.countries && options.countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <select name="language" value={searchFilters.language} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}>
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
                <img src={article.imageUrl} alt={"No image provided"} className="news-thumbnail-container" />
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