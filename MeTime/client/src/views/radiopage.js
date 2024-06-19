import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './radio.css';
import saveIcon from '../assets/favourite.png';
import profileIcon from '../assets/profilepic.png';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function RadioPage() {
  const { authState, setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [filters, setFilters] = useState({ name: '', country: '', state: '', language: '' });
  const [options, setOptions] = useState({ countries: [], states: [], languages: [] });
  const [noResults, setNoResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const stationsPerPage = 200;

  // log out
  const logout = () => {
    // clear token, session ended
    localStorage.removeItem('authToken');
    setAuthState({ isAuthenticated: false, email: '', username: '', password: '' });
    console.log("Log Out");
    navigate('/login');
  };

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get(`https://de1.api.radio-browser.info/json/stations?offset=${(currentPage - 1) * stationsPerPage}&limit=${stationsPerPage}`);
        setStations(response.data);
        setFilteredStations(response.data);
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };

    fetchStations();
    // Fetch stations
    // axios.get('https://de1.api.radio-browser.info/json/stations?limit=200')
    //   .then(response => {
    //     setStations(response.data);
    //     setFilteredStations(response.data);
    //   })
    //   .catch(error => {
    //     console.error("Error fetching stations:", error);
    //   });

    // Fetch countries
    axios.get('https://de1.api.radio-browser.info/json/countries')
      .then(response => {
        setOptions(prev => ({ ...prev, countries: response.data }));
      })
      .catch(error => {
        console.error("Error fetching countries:", error);
      });

    // Fetch languages
    axios.get('https://de1.api.radio-browser.info/json/languages')
      .then(response => {
        setOptions(prev => ({ ...prev, languages: response.data }));
      })
      .catch(error => {
        console.error("Error fetching languages:", error);
      });

    // Fetch states
    axios.get('https://de1.api.radio-browser.info/json/states')
      .then(response => {
        setOptions(prev => ({ ...prev, states: response.data }));
      })
      .catch(error => {
        console.error("Error fetching states:", error);
      });
  }, [currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filterStations = () => {
    let filtered = stations;
    if (filters.name) {
      filtered = filtered.filter(station => station.name.toLowerCase().includes(filters.name.toLowerCase()));
    }
    if (filters.country) {
      filtered = filtered.filter(station => station.country.toLowerCase() === filters.country.toLowerCase());
    }
    if (filters.state) {
      filtered = filtered.filter(station => station.state.toLowerCase() === filters.state.toLowerCase());
    }
    if (filters.language) {
      filtered = filtered.filter(station => station.language.toLowerCase() === filters.language.toLowerCase());
    }
    setFilteredStations(filtered);
    setNoResults(filtered.length === 0);
  };

  const handleSearch = () => {
    filterStations();
  };

  const clearFilters = () => {
    setFilters({ name: '', country: '', state: '', language: '' });
    setFilteredStations(stations);
    setNoResults(false);
  };

  const nextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#FFF4F1', minHeight: '100vh' }}>
      <div className="NavBar" style={{ width: '100%', height: '68px', paddingLeft: '0px', paddingRight: '0px', paddingTop: '10px', paddingBottom: '10px', background: '#705243', justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
        <div style={{ color: '#FEFEFE', fontSize: '32px', paddingLeft: '20px', fontFamily: 'Montserrat', fontWeight: '800', lineHeight: '48px', wordWrap: 'break-word' }}>MeTime</div>
        <div style={{ justifyContent: 'flex-start', alignItems: 'flex-start', gap: '32px', display: 'flex' }}>
          <Link to="/homepage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Home</Link>
          <Link to="/latest" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Latest</Link>
          <Link to="/radiopage" style={{ color: 'lightgray', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Radio</Link>
          <Link to="/newspage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>News</Link>
          <Link to="/bookspage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Books</Link>
          <Link to="/gamespage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Games</Link>
        </div>
        <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: '20px', display: 'flex' }}>
          <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: '8px', display: 'flex' }}>
            <img src={saveIcon} alt="Favourites" style={{ width: '25px', height: '25px' }} />
            <Link to="/favourites" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>My Favourites</Link>
          </div>
          <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: '8px', display: 'flex' }}>
            <img src={profileIcon} alt="Profile" style={{ width: '25px', height: '25px' }} />
            <Link to="/profile" style={{ color: 'white', fontSize: '20px', textDecoration: 'none' }}>My Profile</Link>
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
      <div>
        <h1 className='mainTitle'>Radio</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginTop: '10px', justifyContent: 'center' }}>
            <input
              type="text"
              name="name"
              placeholder="Station Name"
              value={filters.name}
              onChange={handleFilterChange}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            <select name="country" value={filters.country} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}>
              <option value="">All Countries</option>
              {options.countries.map(country => (
                <option key={country.name} value={country.name}>{country.name}</option>
              ))}
            </select>
            <select name="state" value={filters.state} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}>
              <option value="">All States</option>
              {options.states.map(state => (
                <option key={state.name} value={state.name}>{state.name}</option>
              ))}
            </select>
            <select name="language" value={filters.language} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}>
              <option value="">All Languages</option>
              {options.languages.map(language => (
                <option key={language.name} value={language.name}>{language.name}</option>
              ))}
            </select>
            <button className='search' onClick={handleSearch} style={{ 'margin-right': '6px' }}>Search</button>
            <button className='clear' onClick={clearFilters}>Clear</button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={prevPage} disabled={currentPage === 1}>Previous Page</button>
          {/* Optionally, add buttons for specific pages */}
          {/* Example: 
        {[...Array(Math.ceil(stations.length / stationsPerPage))].map((_, index) => (
          <button key={index} onClick={() => goToPage(index + 1)}>{index + 1}</button>
        ))}
      */}
          <button onClick={nextPage} disabled={filteredStations.length < stationsPerPage}>Next Page</button>
        </div>
        {noResults ? (
          <p>No results found.</p>
        ) : (
          <div className="stations-list">
            {filteredStations.map(station => (
              <div key={station.stationuuid} className="station-item">
                <img src={station.favicon} alt={station.name} className="station-thumbnail" />
                <div className="station-details">
                  <h2 className="station-title">{station.name}</h2>
                  <hr />
                  <p><span className="bold-title">Country:</span> {station.country}</p>
                  <p><span className="bold-title">State:</span> {station.state}</p>
                  <p><span className="bold-title">Language:</span> {station.language}</p>
                  <div className="station-buttons">
                    <a href={station.homepage} target="_blank" rel="noopener noreferrer">
                      <button className="visit" aria-label={`Visit ${station.name} homepage`}>Visit Homepage</button>
                    </a>
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
// {
/* <div className="RadioPage" style={{width: 1920, height: 1053, background: '#FFF4F1', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 32, display: 'inline-flex'}}>
<div className="NavBar" style={{width: 1920, paddingLeft: 40, paddingRight: 40, paddingTop: 10, paddingBottom: 10, background: '#705243', justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex'}}>
  <div className="Metime" style={{color: '#FEFEFE', fontSize: 32, fontFamily: 'Montserrat', fontWeight: '800', lineHeight: 48, wordWrap: 'break-word'}}>MeTime</div>
  <div className="List" style={{justifyContent: 'flex-start', alignItems: 'flex-start', gap: 32, display: 'flex'}}>
    <div className="Home" style={{color: 'white', fontSize: 20, fontFamily: 'Montserrat', fontWeight: '500', lineHeight: 30, wordWrap: 'break-word'}}>Home</div>
    <div className="Radio" style={{color: 'white', fontSize: 20, fontFamily: 'Montserrat', fontWeight: '500', lineHeight: 30, wordWrap: 'break-word'}}>Radio</div>
    <div className="News" style={{color: 'white', fontSize: 20, fontFamily: 'Montserrat', fontWeight: '500', lineHeight: 30, wordWrap: 'break-word'}}>News</div>
    <div className="Books" style={{color: 'white', fontSize: 20, fontFamily: 'Montserrat', fontWeight: '500', lineHeight: 30, wordWrap: 'break-word'}}>Books</div>
    <div className="Games" style={{color: 'white', fontSize: 20, fontFamily: 'Montserrat', fontWeight: '500', lineHeight: 30, wordWrap: 'break-word'}}>Games</div>
  </div>
  <div className="Buttons" style={{justifyContent: 'flex-start', alignItems: 'center', gap: 20, display: 'flex'}}>
    <div className="MyFavourites" style={{justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
      <div className="Vector" style={{width: 15.56, height: 20, background: 'white'}}></div>
      <div className="MyFavourites" style={{color: 'white', fontSize: 20, fontFamily: 'Montserrat', fontWeight: '500', lineHeight: 30, wordWrap: 'break-word'}}>My Favourites</div>
    </div>
    <div className="MyProfile" style={{justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
      <div className="PersonSvgrepoCom" style={{width: 30, height: 30, paddingLeft: 4.69, paddingRight: 4.69, paddingTop: 5.08, paddingBottom: 5.08, justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
        <div className="Vector" style={{width: 20.62, height: 19.84, background: 'white'}}></div>
      </div>
      <div className="MyProfile" style={{color: 'white', fontSize: 20, fontFamily: 'Montserrat', fontWeight: '500', lineHeight: 30, wordWrap: 'break-word'}}>My Profile</div>
    </div>
    <div className="AccountButtons" style={{justifyContent: 'flex-start', alignItems: 'flex-start', gap: 12, display: 'flex'}}>
      <div className="Button" style={{width: 115, height: 40, paddingLeft: 16, paddingRight: 16, background: '#EA6767', borderRadius: 8, justifyContent: 'center', alignItems: 'center', gap: 8, display: 'flex'}}>
        <div className="LogOut" style={{color: 'white', fontSize: 20, fontFamily: 'Montserrat', fontWeight: '500', lineHeight: 30, wordWrap: 'break-word'}}>Log Out</div>
      </div>
    </div>
  </div>
</div>
<div className="Frame29" style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 20, display: 'flex'}}>
  <div className="RadioTitle" style={{color: 'black', fontSize: 48, fontFamily: 'Montserrat', fontWeight: '800', lineHeight: 72, wordWrap: 'break-word'}}>Radio</div>
  <div className="SearchBar" style={{justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, display: 'inline-flex'}}>
    <div className="InputField" style={{width: 420, height: 50, padding: 10, background: 'white', borderRadius: 8, border: '1px #D0AA8D solid', justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
      <div className="Frame16" style={{flex: '1 1 0', height: 20, justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
        <div className="Text" style={{flex: '1 1 0', color: '#D0AA8D', fontSize: 16, fontFamily: 'Montserrat', fontWeight: '600', wordWrap: 'break-word'}}>Keyword</div>
      </div>
    </div>
    <div className="InputField" style={{width: 208, height: 50, padding: 10, background: 'white', borderRadius: 8, border: '1px #D0AA8D solid', justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
      <div className="Frame16" style={{flex: '1 1 0', height: 20, justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
        <div className="Text" style={{flex: '1 1 0', color: '#D0AA8D', fontSize: 16, fontFamily: 'Montserrat', fontWeight: '600', wordWrap: 'break-word'}}>Country</div>
      </div>
    </div>
    <div className="InputField" style={{width: 208, height: 50, padding: 10, background: 'white', borderRadius: 8, border: '1px #D0AA8D solid', justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
      <div className="Frame16" style={{flex: '1 1 0', height: 20, justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
        <div className="Text" style={{flex: '1 1 0', color: '#D0AA8D', fontSize: 16, fontFamily: 'Montserrat', fontWeight: '600', wordWrap: 'break-word'}}>State</div>
      </div>
    </div>
    <div className="InputField" style={{width: 234, height: 50, padding: 10, background: 'white', borderRadius: 8, border: '1px #D0AA8D solid', justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
      <div className="Frame16" style={{flex: '1 1 0', height: 20, justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
        <div className="Text" style={{flex: '1 1 0', color: '#D0AA8D', fontSize: 16, fontFamily: 'Montserrat', fontWeight: '600', wordWrap: 'break-word'}}>Tags</div>
        <div className="Component2" style={{padding: 1.15, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
          <div className="Vector" style={{width: 17.54, height: 8.77, border: '1.75px #D0AA8D solid'}}></div>
        </div>
      </div>
    </div>
    <div className="InputField" style={{width: 208, height: 50, padding: 10, background: 'white', borderRadius: 8, border: '1px #D0AA8D solid', justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
      <div className="Frame16" style={{flex: '1 1 0', height: 20, justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
        <div className="Text" style={{flex: '1 1 0', color: '#D0AA8D', fontSize: 16, fontFamily: 'Montserrat', fontWeight: '600', wordWrap: 'break-word'}}>Genres</div>
        <div className="Component2" style={{padding: 1.15, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
          <div className="Vector" style={{width: 17.54, height: 8.77, border: '1.75px #D0AA8D solid'}}></div>
        </div>
      </div>
    </div>
    <div className="Button" style={{width: 78, height: 50, padding: 10, background: '#EA6767', borderRadius: 8, justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
      <div className="Search" style={{color: 'white', fontSize: 16, fontFamily: 'Montserrat', fontWeight: '700', wordWrap: 'break-word'}}>Search</div>
    </div>
  </div>
  <div className="RadioResults" style={{justifyContent: 'flex-start', alignItems: 'flex-start', gap: 20, display: 'flex'}}>
    <div className="Results" style={{justifyContent: 'flex-start', alignItems: 'center', display: 'flex'}}>
      <div className="Image" style={{width: 320, height: 240, borderRadius: 8, background: 'url("/path/to/image.jpg")', backgroundSize: 'cover', justifyContent: 'center', alignItems: 'center', display: 'flex'}}></div>
    </div>
    <div className="Results" style={{justifyContent: 'flex-start', alignItems: 'center', display: 'flex'}}>
      <div className="Image" style={{width: 320, height: 240, borderRadius: 8, background: 'url("/path/to/image.jpg")', backgroundSize: 'cover', justifyContent: 'center', alignItems: 'center', display: 'flex'}}></div>
    </div>
    <div className="Results" style={{justifyContent: 'flex-start', alignItems: 'center', display: 'flex'}}>
      <div className="Image" style={{width: 320, height: 240, borderRadius: 8, background: 'url("/path/to/image.jpg")', backgroundSize: 'cover', justifyContent: 'center', alignItems: 'center', display: 'flex'}}></div>
    </div>
    <div className="Results" style={{justifyContent: 'flex-start', alignItems: 'center', display: 'flex'}}>
      <div className="Image" style={{width: 320, height: 240, borderRadius: 8, background: 'url("/path/to/image.jpg")', backgroundSize: 'cover', justifyContent: 'center', alignItems: 'center', display: 'flex'}}></div>
    </div>
  </div>
</div>
</div> */
// }

export default RadioPage;
