import React, { useState } from 'react';
import backgroundImg from '../assets/signup.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async () => {
        // Check if password and confirm password match
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/signup', {
                email,
                username,
                password,
                confirmPassword
            });

            alert('User registered successfully');
            console.log('User registered successfully:', response.data);
            navigate('/login');
            // Redirect or handle success as needed
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data === 'Email already exists') {
                alert('User already exists!');
            } else {
                console.error('Error registering user:', error.message);
                alert('Failed to register user');
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
                        wordWrap: 'break-word',
                        paddingBottom: '5px'
                    }}>
                        Sign Up
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
                                        wordWrap: 'break-word'
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
                                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
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
                                        Username
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
                                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
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
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
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
                                        Confirm Password
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
                                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
                                </div>
                            </div>
                            <div style={{
                                width: '80%',
                                height: '60px',
                                padding: '8px 32px',
                                background: '#D0AA8D',
                                borderRadius: '32px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '8px',
                                display: 'flex',
                                marginTop: '20px',
                                marginLeft: '15px',
                                cursor: 'pointer',
                            }}>
                                <button onClick={handleSignUp} style={{
                                    color: 'white',
                                    fontSize: '20px',
                                    fontFamily: 'Montserrat',
                                    fontWeight: '600',
                                    wordWrap: 'break-word',
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                }}>
                                    SIGN UP
                                </button>
                            </div>
                            <div onClick={() => navigate('/login')} style={{
                                color: '#4A3F39',
                                fontSize: '16px',
                                fontFamily: 'Montserrat',
                                fontWeight: '500',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                marginTop: '10px',
                                marginLeft: '15px',
                            }}>
                                Already have an account? LOGIN
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;