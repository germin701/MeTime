import React, { useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import './books.css';
import saveIcon from '../assets/favourite.png';
import profileIcon from '../assets/profilepic.png';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const URL = "http://openlibrary.org/search.json?";
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState("all");
    const [books, setBooks] = useState([]);
    const [allBooks, setAllBooks] = useState([]); // To keep a copy of the original dataset
    const [loading, setLoading] = useState(true);
    const [resultTitle, setResultTitle] = useState("");
    const [filters, setFilters] = useState({ keyword: '', ratings_average: '', language: '', first_publish_year: '' });
    const [options, setOptions] = useState({ ratings: [1, 2, 3, 4, 5], languages: [], firstPublishYears: [] });
    const [currentPage, setCurrentPage] = useState(1);

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        try {
            let query = URL;
            const [title, year] = searchTerm.split(' year:');
            if (title.trim()) {
                query += `title=${title.trim()}`;
            }
            if (year) {
                query += `&first_publish_year=${year.trim()}`;
            }
            const response = await fetch(query);
            const data = await response.json();
            const { docs } = data;

            if (docs) {
                const newBooks = docs.slice(0, 500).map((bookSingle) => {
                    const { key, author_name, cover_i, edition_count, first_publish_year, title, publisher, language, ratings_average } = bookSingle;

                    return {
                        id: key,
                        author: author_name,
                        cover_id: cover_i,
                        edition_count: edition_count,
                        first_publish_year: first_publish_year,
                        title: title,
                        publisher: publisher ? publisher.join(', ') : 'Unknown',
                        language: language ? language : ['Unknown'], // Ensure language is an array
                        ratings_average: ratings_average || 0
                    };
                });

                setBooks(newBooks);
                setAllBooks(newBooks); // Save a copy of the original dataset

                // Generate unique language options
                const languages = [...new Set(newBooks.flatMap(book => book.language))];
                const firstPublishYears = [...new Set(newBooks.map(book => book.first_publish_year))]
                    .filter(year => !isNaN(year)) // Remove NaN values
                    .sort((a, b) => b - a); // Sort years in descending order

                setOptions(prevOptions => ({ ...prevOptions, languages, firstPublishYears }));

                if (newBooks.length > 0) {
                    setResultTitle("Your Search Result");
                } else {
                    setResultTitle("No Search Result Found!");
                }
            } else {
                setBooks([]);
                setAllBooks([]); // Clear the original dataset
                setResultTitle("No Search Result Found!");
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const filterBooks = () => {
        let filtered = allBooks; // Start filtering from the original dataset
        if (filters.keyword) {
            filtered = filtered.filter(book => book.title.toLowerCase().includes(filters.keyword.toLowerCase()));
        }
        if (filters.ratings_average) {
            const selectedRating = parseFloat(filters.ratings_average);
            filtered = filtered.filter(book => book.ratings_average >= selectedRating && book.ratings_average < selectedRating + 1);
        }
        if (filters.language) {
            filtered = filtered.filter(book => book.language && book.language.map(lang => lang.toLowerCase()).includes(filters.language.toLowerCase()));
        }
        if (filters.first_publish_year) {
            filtered = filtered.filter(book => book.first_publish_year === parseInt(filters.first_publish_year));
        }
        setBooks(filtered);
        setCurrentPage(1);
    };

    const handleSearch = async () => {
        if (filters.keyword) {
            setLoading(true);
            try {
                const response = await axios.get(`https://openlibrary.org/search.json?q=${filters.keyword}`);
                const data = response.data.docs;
                const newBooks = data.slice(0, 500).map((bookSingle) => {
                    const { key, author_name, cover_i, edition_count, first_publish_year, title, publisher, language, ratings_average } = bookSingle;

                    return {
                        id: key,
                        author: author_name,
                        cover_id: cover_i,
                        edition_count: edition_count,
                        first_publish_year: first_publish_year,
                        title: title,
                        publisher: publisher ? publisher.join(', ') : 'Unknown',
                        language: language ? language : ['Unknown'], // Ensure language is an array
                        ratings_average: ratings_average || 0
                    };
                });

                setBooks(newBooks);
                setAllBooks(newBooks); // Save a copy of the original dataset

                // Generate unique language options
                const languages = [...new Set(newBooks.flatMap(book => book.language))];
                const firstPublishYears = [...new Set(newBooks.map(book => book.first_publish_year))]
                    .filter(year => !isNaN(year)) // Remove NaN values
                    .sort((a, b) => b - a); // Sort years in descending order

                setOptions(prevOptions => ({ ...prevOptions, languages, firstPublishYears }));

                if (newBooks.length > 0) {
                    setResultTitle("Your Search Result");
                } else {
                    setResultTitle("No Search Result Found!");
                }
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        } else {
            filterBooks();
        }
    };

    const clearFilters = () => {
        setFilters({ keyword: '', ratings_average: '', language: '', first_publish_year: '' });
        setBooks(allBooks);
        setCurrentPage(1); // Reset to the first page
    };

    return (
        <AppContext.Provider value={{
            loading, books, setSearchTerm, resultTitle, setResultTitle, filters, handleFilterChange, options, handleSearch, clearFilters
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useGlobalContext = () => {
    return useContext(AppContext);
}

const BooksPage = () => {
    const { loading, books, resultTitle, filters, handleFilterChange, options, handleSearch, clearFilters } = useGlobalContext();
    const { authState, setAuthState } = useContext(AuthContext);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;

    // log out
    const logout = () => {
        // clear token, session ended
        localStorage.removeItem('authToken');
        setAuthState({ isAuthenticated: false, email: '', username: '', password: '' });
        console.log("Log Out");
        navigate('/login');
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(books.length / booksPerPage);

    return (
        <div style={{ width: '100%', backgroundColor: '#FFF4F1', minHeight: '100vh' }}>
            <div className="NavBar" style={{ width: '100%', height: '68px', paddingLeft: '0px', paddingRight: '0px', paddingTop: '10px', paddingBottom: '10px', background: '#705243', justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
                <div style={{ color: '#FEFEFE', fontSize: '32px', paddingLeft: '20px', fontFamily: 'Montserrat', fontWeight: '800', lineHeight: '48px', wordWrap: 'break-word' }}>MeTime</div>
                <div style={{ justifyContent: 'flex-start', alignItems: 'flex-start', gap: '32px', display: 'flex' }}>
                    <Link to="/homepage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Home</Link>
                    <Link to="/latest" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Latest</Link>
                    <Link to="/radiopage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Radio</Link>
                    <Link to="/newspage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>News</Link>
                    <Link to="/bookspage" style={{ color: 'lightgray', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Books</Link>
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
                <h1 className='mainTitle'>Books</h1>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginTop: '10px', justifyContent: 'center' }}>
                        <input
                            type="text"
                            name="keyword"
                            placeholder="Keyword"
                            value={filters.keyword}
                            onChange={handleFilterChange}
                            style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                        <select name="ratings_average" value={filters.ratings_average} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}>
                            <option value="">All Ratings</option>
                            {options.ratings.map(rating => (
                                <option key={rating} value={rating}>{rating}</option>
                            ))}
                        </select>
                        <select name="language" value={filters.language} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}>
                            <option value="">All Languages</option>
                            {options.languages.map(language => (
                                <option key={language} value={language}>{language}</option>
                            ))}
                        </select>
                        <select name="first_publish_year" value={filters.first_publish_year} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}>
                            <option value="">All Years</option>
                            {options.firstPublishYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <button className='search' onClick={handleSearch} style={{ marginRight: '6px' }}>Search</button>
                        <br />
                        <button className='clear' onClick={clearFilters}>Clear</button>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '10px' }}>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageClick(index + 1)}
                            style={{
                                padding: '8px 16px',
                                margin: '0 4px',
                                background: currentPage === index + 1 ? '#705243' : '#ccc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    books.length > 0 ? (
                        <div className="books-list">
                            {currentBooks.map(book => (
                                <div key={book.id} className="book-item">
                                    <img src={`http://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`} alt={book.title} className="book-thumbnail" />
                                    <div className="book-details">
                                        <h2 className="book-title">{book.title}</h2>
                                        <hr />
                                        <p><span className="bold-title">Author: </span>{book.author}</p>
                                        <p><span className="bold-title">Published On: </span>{book.first_publish_year}</p>
                                        <p><span className="bold-title">Languages Available: </span>{Array.isArray(book.language) ? book.language.join(', ') : book.language}</p>
                                        <p><span className="bold-title">Average Rating: </span>{book.ratings_average}</p>
                                        <div className="book-buttons">
                                            <a href={`https://openlibrary.org${book.id}`} target="_blank" rel="noopener noreferrer">
                                                <button className="view">View Book</button>
                                            </a>
                                            <button className="save">Save to Collection</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No Search Result Found!</p>
                    )
                )}
            </div>
        </div>
    );
}

BooksPage.displayName = 'BooksPage';

const App = () => (
    <AppProvider>
        <BooksPage />
    </AppProvider>
);

App.displayName = 'App';

export default App;
