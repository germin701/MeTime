import React, { useState, useContext } from 'react';
import backgroundImg from '../assets/signup.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setAuthState } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                email,
                password
            });

            const { token } = response.data; 
            localStorage.setItem('token', token); // store token in localStorage

            console.log('Login successful:', response.data);
            const response2 = await axios.get('http://localhost:5000/api/getUsername', {
                headers: { Authorization: `Bearer ${token}` },
                params: { email }
            });
            const fetchedUsername = response2.data.username;
            setAuthState({ isAuthenticated: true, email, username: fetchedUsername });
            navigate('/homepage');

            alert('Login successful');

            // redirect to login page after token expiration time
            setTimeout(() => {
                alert('Your session has expired. Please log in again.');
                setAuthState({ isAuthenticated: false, email: '', username: '' });
                localStorage.removeItem('token'); // remove token from localStorage
                navigate('/login'); // redirect to login page 
            }, 864000000); // token expires in 24 hours
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data === 'Invalid email or password') {
                alert('Invalid email or password');
            } else {
                console.error('Error logging in:', error.message);
                alert('Failed to log in');
            }
        }
    };

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            backgroundImage: `url(${backgroundImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center'
        }}>
            <div style={{
                width: '100%',
                padding: '10px 40px',
                background: '#705243',
                justifyContent: 'space-between',
                alignItems: 'center',
                display: 'flex',
                boxSizing: 'border-box'
            }}>
                <div style={{
                    color: '#FEFEFE',
                    fontSize: '32px',
                    fontFamily: 'Montserrat',
                    fontWeight: '800',
                    paddingLeft: '20px',
                    lineHeight: '48px',
                    wordWrap: 'break-word'
                }}>
                    MeTime
                </div>
            </div>
            <div style={{
                flex: '1 1 0',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                display: 'flex',
                width: '100%',
                padding: '32px',
                boxSizing: 'border-box'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '500px',
                    background: 'white',
                    borderRadius: '32px',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    display: 'flex',
                    boxSizing: 'border-box',
                    padding: '32px',
                    opacity: '80%'
                }}>
                    <div style={{
                        color: '#4A3F39',
                        fontSize: '36px',
                        fontFamily: 'Montserrat',
                        fontWeight: '600',
                        wordWrap: 'break-word'
                    }}>
                        Login
                    </div>
                    <div style={{
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-end',
                        gap: '18px',
                        display: 'flex',
                        width: '100%'
                    }}>
                        <div style={{
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            gap: '23px',
                            display: 'flex',
                            width: '100%'
                        }}>
                            <div style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                gap: '4px',
                                display: 'flex',
                                width: '100%'
                            }}>
                                <div style={{
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    gap: '10.74px',
                                    display: 'inline-flex'
                                }}>
                                    <div style={{
                                        color: '#4A3F39',
                                        fontSize: '18px',
                                        fontFamily: 'Montserrat',
                                        fontWeight: '600',
                                        wordWrap: 'break-word',
                                        paddingTop: '10px'
                                    }}>
                                        Email
                                    </div>
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '50px',
                                    padding: '10px',
                                    background: 'white',
                                    borderRadius: '8px',
                                    border: '1px #D0AA8D solid',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    gap: '8px',
                                    display: 'inline-flex'
                                }}>
                                    <input 
                                        type="text" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        placeholder="Email"
                                        style={{
                                            width: '100%',
                                            border: 'none',
                                            outline: 'none',
                                            fontSize: '16px'
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                gap: '4px',
                                display: 'flex',
                                width: '100%'
                            }}>
                                <div style={{
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    gap: '10.74px',
                                    display: 'inline-flex'
                                }}>
                                    <div style={{
                                        color: '#4A3F39',
                                        fontSize: '18px',
                                        fontFamily: 'Montserrat',
                                        fontWeight: '600',
                                        wordWrap: 'break-word'
                                    }}>
                                        Password
                                    </div>
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '50px',
                                    padding: '10px',
                                    background: 'white',
                                    borderRadius: '8px',
                                    border: '1px #D0AA8D solid',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    gap: '8px',
                                    display: 'inline-flex'
                                }}>
                                    <input 
                                        type="password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        placeholder="Password"
                                        style={{
                                            width: '100%',
                                            border: 'none',
                                            outline: 'none',
                                            fontSize: '16px'
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                marginTop: '10px'
                            }}>
                                <div onClick={() => navigate('/resetpasswordOTP')} style={{
                                    color: '#4A3F39',
                                    fontSize: '14px',
                                    fontFamily: 'Montserrat',
                                    fontWeight: '500',
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                }}>
                                    Forgot Password?
                                </div>
                                <div onClick={() => navigate('/signup')} style={{
                                    color: '#4A3F39',
                                    fontSize: '14px',
                                    fontFamily: 'Montserrat',
                                    fontWeight: '500',
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                }}>
                                    Does not have an account? SIGN UP
                                </div>
                            </div>
                        </div>
                        <div style={{
                            width: '85%',
                            height: '60px',
                            padding: '5px 32px',
                            background: '#D0AA8D',
                            borderRadius: '32px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px',
                            display: 'flex',
                            marginTop: '20px',
                            cursor: 'pointer'
                        }}>
                            <button onClick={handleLogin} style={{
                                color: 'white',
                                fontSize: '20px',
                                fontFamily: 'Montserrat',
                                fontWeight: '600',
                                wordWrap: 'break-word',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                outline: 'none'
                            }}>
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
    
    export default LoginPage;
    