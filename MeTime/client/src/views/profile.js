import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import saveIcon from '../assets/favourite.png';
import profileIcon from '../assets/profilepic.png';
import axios from 'axios'; // Import axios for making HTTP requests

function ProfilePage() {
    const { authState, setAuthState } = useContext(AuthContext);
    const { email: initialEmail, username: initialUsername, password: initialPassword } = authState;
    const [email, setEmail] = useState(initialEmail);
    const [username] = useState(initialUsername);
    const [password, setPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            console.log('Username:', { username }, { email }, { password });

            const updateData = {};
            if (email !== initialEmail) updateData.email = email;
            if (password) updateData.password = password;

            if (Object.keys(updateData).length > 0) {
                // Make a PUT request to the server to update the user details
                const response = await axios.put(`http://localhost:5000/api/updateUser/${username}`, updateData);

                // Update the auth state with the new email if it was changed
                if (response.data.email) setAuthState({ ...authState, email: response.data.email });

                setPassword(''); // Clear password field
            }
            alert('User information updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const handleDiscard = () => {
        // Discard changes
        setEmail(initialEmail);
        setPassword('');
        setIsEditing(false);
    };

    // log out
    const logout = () => {
        // clear token, session ended
        localStorage.removeItem('authToken');
        setAuthState({ isAuthenticated: false, email: '', username: '', password: '' });
        console.log("Log Out");
        navigate('/login');
    };

    return (
        <div className="WrapContainer" style={{ width: '100%', backgroundColor: '#FFF4F1', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
            <div className="NavBar" style={{ width: '100%', height: '68px', padding: '10px 0', background: '#705243', justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
                <div style={{ color: '#FEFEFE', fontSize: '32px', paddingLeft: '20px', fontFamily: 'Montserrat', fontWeight: '800', lineHeight: '48px', wordWrap: 'break-word' }}>MeTime</div>
                <div style={{ justifyContent: 'flex-start', alignItems: 'flex-start', gap: '32px', display: 'flex' }}>
                    <Link to="/homepage" style={{ color: 'white', fontSize: '20px', fontFamily: 'Montserrat', fontWeight: '500', textDecoration: 'none' }}>Home</Link>
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
                            <Link to="/profile" style={{ color: 'lightgray', textDecoration: 'none' }}>My Profile</Link>
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
            <div style={{
                width: '100%',
                maxWidth: '600px',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                padding: '32px',
                textAlign: 'center',
                marginTop: '80px'
            }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '600',
                    color: '#4A3F39',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    User Profile
                </h1>
                <div style={{
                    margin: '20px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <div style={{
                        fontSize: '18px',
                        fontWeight: '500',
                        color: '#4A3F39',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <strong style={{ minWidth: '150px', textAlign: 'left' }}>Username:</strong>
                        <span style={{ marginLeft: '20px' }}>{username}</span>
                    </div>
                    <div style={{
                        fontSize: '18px',
                        fontWeight: '500',
                        color: '#4A3F39',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <strong style={{ minWidth: '150px', textAlign: 'left' }}>Email Address:</strong>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} readOnly={!isEditing} style={{ marginLeft: '20px', border: 'none', outline: 'none', fontSize: '16px', width: '300px', backgroundColor: isEditing ? '#f1f1f1' : 'transparent', textAlign: 'right' }} />
                    </div>
                    <div style={{
                        fontSize: '18px',
                        fontWeight: '500',
                        color: '#4A3F39',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <strong style={{ minWidth: '150px', textAlign: 'left' }}>Password:</strong>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} readOnly={!isEditing} style={{ marginLeft: '20px', border: 'none', outline: 'none', fontSize: '16px', width: '200px', backgroundColor: isEditing ? '#f1f1f1' : 'transparent', textAlign: 'right' }} />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        {!isEditing ? (
                            <button onClick={handleEdit} style={{ padding: '10px 20px', fontSize: '18px', borderRadius: '5px', background: '#3C8DAD', color: 'white', border: 'none', cursor: 'pointer', marginRight: '10px' }}>Edit</button>
                        ) : (<>
                            <button onClick={handleSave} style={{ padding: '10px 20px', fontSize: '18px', borderRadius: '5px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', marginRight: '10px' }}>Save</button>
                            <button onClick={handleDiscard} style={{ padding: '10px 20px', fontSize: '18px', borderRadius: '5px', background: '#E57373', color: 'white', border: 'none', cursor: 'pointer' }}>Discard</button>
                        </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
