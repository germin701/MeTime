import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import news from '../assets/news.jpg';
import book from '../assets/book.jpg';
import game from '../assets/game.jpg';
import music from '../assets/music.jpg';
import home from '../assets/home.jpg';
import saveIcon from '../assets/favourite.png';
import profileIcon from '../assets/profilepic.png';
import { AuthContext } from '../AuthContext';

function HomePage() {
  const { authState, setAuthState } = useContext(AuthContext);
  const { username } = authState;
  const navigate = useNavigate();

  // log out
  const logout = () => {
    // clear token, session ended
    localStorage.removeItem('authToken');
    setAuthState({ isAuthenticated: false, email: '', username: '', password: '' });
    console.log("Log Out");
    navigate('/login');
  };

  return (
    <div className="WrapContainer" style={{ width: '100%', backgroundColor: '#FFF4F1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="NavBar" style={{ width: '100%', height: '68px', paddingLeft: '0px', paddingRight: '0px', paddingTop: '10px', paddingBottom: '10px', background: '#705243', justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
        <div style={{ color: '#FEFEFE', fontSize: '32px', paddingLeft: '20px', fontFamily: 'Montserrat', fontWeight: '800', lineHeight: '48px', wordWrap: 'break-word' }}>MeTime</div>
        <div style={{ justifyContent: 'flex-start', alignItems: 'flex-start', gap: '32px', display: 'flex' }}>
          <Link to="/homepage" style={{ color: 'lightgray', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Home</Link>
          <Link to="/latest" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Latest</Link>
          <Link to="/radiopage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Radio</Link>
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
            <div style={{
              color: 'white',
              fontSize: '20px',
              fontFamily: 'Montserrat',
              fontWeight: '500',
              lineHeight: '30px',
              wordWrap: 'break-word'
            }}>
              <Link to="/profile" style={{ color: 'inherit', textDecoration: 'none' }}>My Profile</Link>
            </div>
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
      <div className="Content" style={{ width: '100%', maxWidth: 1157, flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <div className="Frame14" style={{ width: '100%', padding: '42px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex' }}>
          <div className="Frame15" style={{ width: '100%', paddingTop: 32, padding: '0 42px', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex' }}>
            <div className="WhatToExploreToday" style={{ color: '#C39379', fontSize: 48, fontFamily: 'Montserrat', fontWeight: '800', lineHeight: '72px', wordWrap: 'break-word' }}> What to explore today, {username}?</div>
          </div>
          <div className="LeftContent" style={{ width: '100%', flex: 1, padding: 42, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 32, display: 'flex', marginRight: 50 }}>
            
            <div className="TopContent" style={{ width: '100%', flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 42, display: 'flex' }}>
              <div className="Frame17" style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex' }}>
                <Link to="/gamespage">
                  <img className="WinnerGamerSittingGamingChairDeskPlayingSpaceShooterVideoGamesWithRgbKeyboardMouse1" style={{ width: '100%', borderRadius: 32 }} src={game} alt="Gaming" />
                </Link>
                <div className="Frame18" style={{ width: '100%', padding: '0 8px', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'flex' }}>
                  <div className="Games" style={{ color: '#7D6558', fontSize: 32, fontFamily: 'Montserrat', fontWeight: '600', lineHeight: '48px', wordWrap: 'break-word' }}>Games</div>
                </div>
              </div>
              
              <div className="Frame19" style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex' }}>
                <Link to='/bookspage'>
                  <img className="WorkerReadingNewsWithTablet1" style={{ width: '100%', borderRadius: 32 }} src={book} alt="Books" /></Link>
                <div className="Frame18" style={{ width: '100%', padding: '0 8px', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'flex' }}>
                  <div className="Books" style={{ color: '#7D6558', fontSize: 32, fontFamily: 'Montserrat', fontWeight: '600', lineHeight: '48px', wordWrap: 'break-word' }}>Books</div>
                </div>
              </div>
            </div>

            <div className="BottomContent" style={{ width: '100%', flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 42, display: 'flex' }}>
              
              <div className="Frame20" style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex' }}>
                <Link to= "/newspage">
                  <img className="ConceptFakeNews1" style={{ width: '100%', borderRadius: 32 }} src={news} alt="News" />
                </Link>
                <div className="Frame18" style={{ width: '100%', padding: '0 8px', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'flex' }}>
                  <div className="News" style={{ color: '#7D6558', fontSize: 32, fontFamily: 'Montserrat', fontWeight: '600', lineHeight: '48px', wordWrap: 'break-word' }}>News</div>
                </div>
              </div>
              
              <div className="Frame21" style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex' }}>
                <Link to="/radiopage">
                  <img className="HappyYoungWomanListeningMusicBed1" style={{ width: '100%', borderRadius: 32 }} src={music} alt="Happy Young Woman Listening to Music" />
                </Link>
                <div className="Frame18" style={{ width: '100%', padding: '0 8px', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'flex' }}>
                  <div
                    className="Radio"
                    style={{
                      color: '#7D6558',
                      fontSize: 32,
                      fontFamily: 'Montserrat',
                      fontWeight: '600',
                      lineHeight: '48px',
                      wordWrap: 'break-word',
                    }}
                  >
                    Radio
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div
          className="Frame22"
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 8,
            display: 'flex',
            position: 'relative',
          }}
        >
          <img
            className="RightContent"
            style={{
              width: '450px',
              height: '700px',
              alignSelf: 'flex-start',
              borderRadius: '32px',
              marginLeft: '100px',
              marginTop: '20px'
            }}
            src={home}
            alt="Relax"
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;