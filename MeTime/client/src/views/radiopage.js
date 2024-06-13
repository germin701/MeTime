import React from 'react';

function RadioPage() {
  return (
<div className="RadioPage" style={{width: 1920, height: 1053, background: '#FFF4F1', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 32, display: 'inline-flex'}}>
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
</div>
);
}

export default RadioPage;
