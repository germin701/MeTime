import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './radio.css';
import saveIcon from '../assets/favourite.png';
import profileIcon from '../assets/profilepic.png';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';

function RadioPage() {
  const { authState, setAuthState } = useContext(AuthContext);
  const { username } = authState;
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [filters, setFilters] = useState({ name: '', country: '', state: '', language: '' });
  const [options, setOptions] = useState({ countries: [], states: [], languages: [] });
  const [noResults, setNoResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageRange, setPageRange] = useState([1, 20]);
  const [loading, setLoading] = useState(false);
  const [savedRadios, setSavedRadios] = useState([]);
  const [stateDisabled, setStateDisabled] = useState(true);
  const [isFiltered, setIsFiltered] = useState(false);
  const [totalNumberPage, setTotalNumberPages] = useState(0);
  const stationsPerPage = 10;
  const pagesPerRange = 20;

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({ isAuthenticated: false, email: '', username: '', password: '' });
    console.log("Log Out");
    navigate('/login');
  };

  // Fetch the country list and language list from the third party API endpoint
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [countriesRes, languagesRes] = await Promise.all([
          axios.get('https://de1.api.radio-browser.info/json/countries'),
          axios.get('https://de1.api.radio-browser.info/json/languages')
        ]);
        setOptions({
          countries: countriesRes.data.map(country => country.name),
          states: [],
          languages: languagesRes.data.map(language => language.name)
        });
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  // Verify the user have filter the country by country field or not and fetch state list from the third party API endpoint
  const handleFilterChange = async (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });

    if (name === 'country') {
      setStateDisabled(true);
      setFilters(prevFilters => ({ ...prevFilters, state: '' }));

      if (value) {
        try {
          const response = await axios.get(`http://de1.api.radio-browser.info/json/states/${value}/`);
          setOptions(prevOptions => ({ ...prevOptions, states: response.data.map(state => state.name) }));
          setStateDisabled(false);
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      } else {
        setOptions(prevOptions => ({ ...prevOptions, states: [] }));
        setStateDisabled(true);
      }
    }
  };
  
  // Search function to filter the radio stations
  const handleSearch = async () => {
    setLoading(true);
    setIsFiltered(true);
    clearStations();
    try {
      const queryParams = new URLSearchParams();
      if (filters.name) queryParams.append('name', filters.name);
      if (filters.country) queryParams.append('country', filters.country);
      if (filters.state) queryParams.append('state', filters.state);
      if (filters.language) queryParams.append('language', filters.language);

      const response = await axios.get(`https://de1.api.radio-browser.info/json/stations/search?&${queryParams.toString()}`);
      const stationsByHomepage = new Map();
      response.data.forEach(station => {
        const currentStation = stationsByHomepage.get(station.homepage);
        if (!currentStation || new Date(currentStation.lastchangetime) < new Date(station.lastchangetime)) {
          stationsByHomepage.set(station.homepage, station);
        }
      });
      const uniqueStations = Array.from(stationsByHomepage.values());
      setFilteredStations(uniqueStations);
      setNoResults(uniqueStations.length === 0);
      setTotalPages(Math.ceil(uniqueStations.length / stationsPerPage));
      setCurrentPage(1);
      setPageRange([1, 20]);
      handlePageClick(1);
    } catch (error) {
      console.error("Error filtering stations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Clear filter function and show initial render content without filter
  const clearFilters = async () => {
    setFilters({ name: '', country: '', state: '', language: '' });
    setCurrentPage(1);
    setPageRange([1, 20]);
    setIsFiltered(false);
    setStateDisabled(true);
    await renderInitialContent(currentPage);
    setTotalPages(totalNumberPage);
  };

  // Fetch the total number of radio station
  useEffect(() => {
    const fetchTotalStations = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://de1.api.radio-browser.info/json/stations');
        const totalStations = response.data.length;
        setTotalNumberPages(Math.ceil(totalStations / stationsPerPage));
        setTotalPages(Math.ceil(totalStations / stationsPerPage));
      } catch (error) {
        console.error("Error fetching total stations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalStations();
  }, []);

  // Get the page number choosen from the pagination bar to show the particular render content
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (isFiltered) {
      renderFilteredContent(pageNumber);
    } else {
      renderInitialContent(pageNumber);
    }
  };

  // Handle switch next page range on the pagination bar
  const nextPageRange = () => {
    if (pageRange[1] < totalPages) {
      setPageRange([pageRange[0] + pagesPerRange, pageRange[1] + pagesPerRange]);
    }
  };

  // Handle switch previous page range on the pagination bar
  const prevPageRange = () => {
    if (pageRange[0] > 1) {
      setPageRange([pageRange[0] - pagesPerRange, pageRange[1] - pagesPerRange]);
    }
  };

  // Verify the content is filtered or not to show the particular render content
  useEffect(() => {
    if (isFiltered) {
      renderFilteredContent(currentPage);
    } else {
      renderInitialContent(currentPage);
    }
  }, [currentPage]);

  // Render content without filter
  const renderInitialContent = async (currentPage) => {
    setLoading(true);
    clearStations();
    try {
      const response = await axios.get(`https://de1.api.radio-browser.info/json/stations?offset=${(currentPage - 1) * stationsPerPage}&limit=${stationsPerPage}`);
      const stationsByHomepage = new Map();
      response.data.forEach(station => {
        const currentStation = stationsByHomepage.get(station.homepage);
        if (!currentStation || new Date(currentStation.lastchangetime) < new Date(station.lastchangetime)) {
          stationsByHomepage.set(station.homepage, station);
        }
      });
      const uniqueStations = Array.from(stationsByHomepage.values());
      setStations(uniqueStations);
      setFilteredStations(uniqueStations);
      setNoResults(uniqueStations.length === 0);
      setTotalPages(totalNumberPage);
    } catch (error) {
      console.error("Error fetching stations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Render content with filter
  const renderFilteredContent = async (page) => {
    setLoading(true);
    clearStations();
    try {
      const queryParams = new URLSearchParams();
      if (filters.name) queryParams.append('name', filters.name);
      if (filters.country) queryParams.append('country', filters.country);
      if (filters.state) queryParams.append('state', filters.state);
      if (filters.language) queryParams.append('language', filters.language);

      // Fetch the filtered stations for the current page
      const response = await axios.get(`https://de1.api.radio-browser.info/json/stations/search?offset=${(page - 1) * stationsPerPage}&limit=${stationsPerPage}&${queryParams.toString()}`);
      const stationsByHomepage = new Map();
      response.data.forEach(station => {
        const currentStation = stationsByHomepage.get(station.homepage);
        if (!currentStation || new Date(currentStation.lastchangetime) < new Date(station.lastchangetime)) {
          stationsByHomepage.set(station.homepage, station);
        }
      });
      const uniqueStations = Array.from(stationsByHomepage.values());

      // Fetch the total count of filtered stations
      const totalResponse = await axios.get(`https://de1.api.radio-browser.info/json/stations/search?${queryParams.toString()}`);
      const totalFilteredStations = totalResponse.data.length;

      setFilteredStations(uniqueStations);
      setNoResults(uniqueStations.length === 0);
      setTotalPages(Math.ceil(totalFilteredStations / stationsPerPage));
    } catch (error) {
      console.error("Error filtering stations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Post particular favourite radio station to the server
  const saveToFavourites = async (station) => {
    try {
      await axios.post('http://localhost:5000/api/saveRadio', {
        username: username,
        station: {
          stationuuid: station.stationuuid,
          name: station.name,
          favicon: station.favicon,
          country: station.country,
          state: station.state,
          language: station.language,
          url_resolved: station.url_resolved,
          homepage: station.homepage,
        }
      });

      const updatedSavedRadios = [...savedRadios, station.stationuuid];
      setSavedRadios(updatedSavedRadios);
      localStorage.setItem('savedRadios', JSON.stringify(updatedSavedRadios));

      alert("Radio saved successfully");

    } catch (error) {
      console.error('Failed to save radio:', error);
    }
  };

  // Fetch favourite radios from server
  useEffect(() => {
    const fetchSavedRadios = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/saveRadio?username=${username}`);
        const savedRadioIds = response.data.map(station => station.stationuuid);
        setSavedRadios(savedRadioIds);
        localStorage.setItem('savedRadios', JSON.stringify(savedRadioIds));
      } catch (error) {
        console.error("Error fetching saved radios:", error);
      }
    };

    fetchSavedRadios();
  }, [username]);

  // Clear station lists on the render content
  const clearStations = () => {
    setStations([]);
    setFilteredStations([]);
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
            <Link to="/profile" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>My Profile</Link>
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
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginTop: '10px', marginLeft: '-10px', justifyContent: 'center' }}>
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
              {options.countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </select>
            <select name="state" value={filters.state} onChange={handleFilterChange} disabled={stateDisabled} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}>
              <option value="">All States</option>
              {options.states.map((state, index) => (
                <option key={index} value={state}>{state}</option>
              ))}
            </select>
            <select name="language" value={filters.language} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}>
              <option value="">All Languages</option>
              {options.languages.map((language, index) => (
                <option key={index} value={language}>{language}</option>
              ))}
            </select>
            <button className='search' onClick={handleSearch}>Search</button>
            <button className='clear' onClick={clearFilters}>Clear</button>
          </div>
        </div>
        <div className="pagination" style={{ marginBottom: '8px' }}>
          {pageRange[0] > 1 && (
            <button onClick={prevPageRange} style={{ padding: '8px', margin: '0 5px', background: '#705243', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>&laquo;</button>
          )}
          {Array.from({ length: Math.min(pagesPerRange, totalPages - pageRange[0] + 1) }, (_, i) => pageRange[0] + i).map(pageNumber => (
            <button
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              style={{
                padding: '8px',
                margin: '0 5px',
                background: currentPage === pageNumber ? '#D0AA8D' : '#705243',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {pageNumber}
            </button>
          ))}
          {pageRange[1] < totalPages && (
            <button onClick={nextPageRange} style={{ padding: '8px', margin: '0 5px', background: '#705243', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>&raquo;</button>
          )}
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : noResults ? (
          <p>No results found.</p>
        ) : (
          <div className="stations-list">
            {filteredStations.map((station, index) => (
              <div key={index} className="station-item">
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
                      className="save"
                      aria-label={`Save ${station.name} to Favourites`}
                      onClick={() => saveToFavourites(station)}
                      disabled={savedRadios.includes(station.stationuuid)}
                    >
                      {savedRadios.includes(station.stationuuid) ? 'Saved' : 'Save to Favourites'}
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

export default RadioPage;
