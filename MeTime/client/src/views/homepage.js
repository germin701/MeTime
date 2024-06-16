import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div
      className="Homepage"
      style={{
        width: '100%',
        height: '100vh',
        background: '#FFF5F1',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        display: 'flex',
      }}
    >
      <div
        className="NavBar"
        style={{
          width: '100%',
          padding: '10px 40px',
          background: '#705243',
          justifyContent: 'space-between',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <div
          className="Metime"
          style={{
            color: '#FEFEFE',
            fontSize: 32,
            fontFamily: 'Montserrat',
            fontWeight: '800',
            lineHeight: '48px',
            wordWrap: 'break-word',
          }}
        >
          MeTime
        </div>
        <div className="List" style={{ display: 'flex', gap: 32 }}>
          <div
            className="Home"
            style={{
              color: 'white',
              fontSize: 20,
              fontFamily: 'Montserrat',
              fontWeight: '500',
              lineHeight: '30px',
              wordWrap: 'break-word',
            }}
          >
            Home
          </div>
          <div
            className="Radio"
            style={{
              color: 'white',
              fontSize: 20,
              fontFamily: 'Montserrat',
              fontWeight: '500',
              lineHeight: '30px',
              wordWrap: 'break-word',
            }}
          >
            Radio
          </div>
          <div
            className="News"
            style={{
              color: 'white',
              fontSize: 20,
              fontFamily: 'Montserrat',
              fontWeight: '500',
              lineHeight: '30px',
              wordWrap: 'break-word',
            }}
          >
            News
          </div>
          <div
            className="Books"
            style={{
              color: 'white',
              fontSize: 20,
              fontFamily: 'Montserrat',
              fontWeight: '500',
              lineHeight: '30px',
              wordWrap: 'break-word',
            }}
          >
            Books
          </div>
          <div
            className="Games"
            style={{
              color: 'white',
              fontSize: 20,
              fontFamily: 'Montserrat',
              fontWeight: '500',
              lineHeight: '30px',
              wordWrap: 'break-word',
            }}
          >
            Games
          </div>
        </div>
        <div className="Buttons" style={{ display: 'flex', gap: 20 }}>
          <div className="MyFavourites" style={{ display: 'flex', gap: 8 }}>
            <div className="Vector" style={{ width: 15.56, height: 20, background: 'white' }}></div>
            <div
              className="MyFavourites"
              style={{
                color: 'white',
                fontSize: 20,
                fontFamily: 'Montserrat',
                fontWeight: '500',
                lineHeight: '30px',
                wordWrap: 'break-word',
              }}
            >
              My Favourites
            </div>
          </div>
          <div className="MyProfile" style={{ display: 'flex', gap: 8 }}>
            <div
              className="PersonSvgrepoCom"
              style={{
                width: 30,
                height: 30,
                padding: '5.08px 4.69px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div className="Vector" style={{ width: 20.62, height: 19.84, background: 'white' }}></div>
            </div>
            <div
              className="MyProfile"
              style={{
                color: 'white',
                fontSize: 20,
                fontFamily: 'Montserrat',
                fontWeight: '500',
                lineHeight: '30px',
                wordWrap: 'break-word',
              }}
            >
              My Profile
            </div>
          </div>
          <div className="AccountButtons" style={{ display: 'flex', gap: 12 }}>
            <div
              className="Button"
              style={{
                width: 115,
                height: 40,
                padding: '0 16px',
                background: '#EA6767',
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                className="LogOut"
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontFamily: 'Montserrat',
                  fontWeight: '500',
                  lineHeight: '30px',
                  wordWrap: 'break-word',
                }}
              >
                Log Out
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="Content"
        style={{
          width: '100%',
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
      >
        <div
          className="Frame14"
          style={{
            width: '100%',
            maxWidth: 1157,
            padding: '42px',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            display: 'flex',
          }}
        >
          <div
            className="Frame15"
            style={{
              width: '100%',
              paddingTop: 32,
              padding: '0 42px',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: 8,
              display: 'flex',
            }}
          >
            <div
              className="WhatToExploreToday"
              style={{
                color: '#C39379',
                fontSize: 48,
                fontFamily: 'Montserrat',
                fontWeight: '800',
                lineHeight: '72px',
                wordWrap: 'break-word',
              }}
            >
              What to explore today?
            </div>
          </div>
          <div
            className="LeftContent"
            style={{
              width: '100%',
              flex: 1,
              padding: 42,
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: 32,
              display: 'flex',
            }}
          >
            <div
              className="TopContent"
              style={{
                width: '100%',
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: 42,
                display: 'flex',
              }}
            >
              <div
                className="Frame17"
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 8,
                  display: 'flex',
                }}
              >
                <Link to="/gamespage">
                <img
                  className="WinnerGamerSittingGamingChairDeskPlayingSpaceShooterVideoGamesWithRgbKeyboardMouse1"
                  style={{
                    width: '100%',
                    borderRadius: 32,
                  }}
                  src="https://via.placeholder.com/473x340"
                  alt="Gaming"
                /></Link>
                <div
                  className="Frame18"
                  style={{
                    width: '100%',
                    padding: '0 8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                    display: 'flex',
                  }}
                >
                  <div
                    className="Games"
                    style={{
                      color: '#7D6558',
                      fontSize: 32,
                      fontFamily: 'Montserrat',
                      fontWeight: '600',
                      lineHeight: '48px',
                      wordWrap: 'break-word',
                    }}
                  >
                    Games
                  </div>
                </div>
              </div>
              <div
                className="Frame19"
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 8,
                  display: 'flex',
                }}
              >
                <img
                  className="WorkerReadingNewsWithTablet1"
                  style={{
                    width: '100%',
                    borderRadius: 32,
                  }}
                  src="https://via.placeholder.com/473x340"
                  alt="Books"
                />
                <div
                  className="Frame18"
                  style={{
                    width: '100%',
                    padding: '0 8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                    display: 'flex',
                  }}
                >
                  <div
                    className="Books"
                    style={{
                      color: '#7D6558',
                      fontSize: 32,
                      fontFamily: 'Montserrat',
                      fontWeight: '600',
                      lineHeight: '48px',
                      wordWrap: 'break-word',
                    }}
                  >
                    Books
                  </div>
                </div>
              </div>
            </div>
            <div
              className="BottomContent"
              style={{
                width: '100%',
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: 42,
                display: 'flex',
              }}
            >
              <div
                className="Frame20"
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 8,
                  display: 'flex',
                }}
              >
                <img
                  className="ConceptFakeNews1"
                  style={{
                    width: '100%',
                    borderRadius: 32,
                  }}
                  src="https://via.placeholder.com/473x340"
                  alt="News"
                />
                <div
                  className="Frame18"
                  style={{
                    width: '100%',
                    padding: '0 8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                    display: 'flex',
                  }}
                >
                  <div
                    className="News"
                    style={{
                      color: '#7D6558',
                      fontSize: 32,
                      fontFamily: 'Montserrat',
                      fontWeight: '600',
                      lineHeight: '48px',
                      wordWrap: 'break-word',
                    }}
                  >
                    News
                  </div>
                </div>
              </div>
              <div
                className="Frame21"
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 8,
                  display: 'flex',
                }}
              >
                <Link to="/radiopage">
                  <img
                    className="HappyYoungWomanListeningMusicBed1"
                    style={{
                      width: '100%',
                      borderRadius: 32,
                    }}
                    src="https://via.placeholder.com/473x340"
                    alt="Happy Young Woman Listening to Music"
                  />
                </Link>
                <div
                  className="Frame18"
                  style={{
                    width: '100%',
                    padding: '0 8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                    display: 'flex',
                  }}
                >
                  <div
                    className="Music"
                    style={{
                      color: '#7D6558',
                      fontSize: 32,
                      fontFamily: 'Montserrat',
                      fontWeight: '600',
                      lineHeight: '48px',
                      wordWrap: 'break-word',
                    }}
                  >
                    Music
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
          }}
        >
          <img
            className="RightContent"
            style={{
              width: '100%',
              height: 'auto',
            }}
            src="https://via.placeholder.com/763x1012"
            alt="Relax"
          />
          <div
            className="SometimesTheMostProductiveThingYouCanDoIsRelaxMarkBlack"
            style={{ width: 426 }}
          >
            <span
              style={{
                color: 'white',
                fontSize: 29.95,
                fontFamily: 'Montserrat',
                fontStyle: 'italic',
                fontWeight: '800',
                lineHeight: '44.92px',
                wordWrap: 'break-word',
              }}
            >
              Sometimes, the most productive thing you can do is relax.
              <br />
            </span>
            <span
              style={{
                color: 'white',
                fontSize: 23.96,
                fontFamily: 'Montserrat',
                fontStyle: 'italic',
                fontWeight: '800',
                lineHeight: '35.94px',
                wordWrap: 'break-word',
              }}
            >
              Mark Black
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;