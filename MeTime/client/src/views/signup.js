import React, { useState } from 'react';
import backgroundImg from '../assets/signup.jpg';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // To manage the sign-up step
    const navigate = useNavigate();

    const handleSendOTP = async () => {
        if (email === '' || username === '' || password === '' || confirmPassword === '') {
            alert('Please enter all fields');
            return;
        }
    
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
    
        try {
            // Check if email or username already exists
            const checkResponse = await axios.post('http://localhost:5000/api/checkUserExistence', { email, username });
    
            if (checkResponse.status === 200) {
                // If email and username are available, send OTP
                const response = await axios.post('http://localhost:5000/api/sendOTPtoRegister', { email });
                setStep(2); // Move to the OTP verification step
                alert("Email is sent. Please check your inbox to enter the OTP.");
            }
        } catch (error) {
            console.error('Failed to send OTP:', error.message);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message); // Show specific error message
            } else {
                alert('Failed to send OTP');
            }
        }
    };
    

    const handleVerifyOTP = async (submittedOTP) => {
        console.log('Submitted OTP:', submittedOTP); // log submitted OTP
        try {
            const response = await axios.post('http://localhost:5000/api/verifyOTPtoRegister', { email, otp: submittedOTP });
            console.log(response.data.message);

            if (response.status === 200) {
                alert('OTP matched. Proceeding to sign up.');
                handleSignUp();
            } else {
                alert(response.data.message); // Show specific error message
            }
        } catch (error) {
            console.error('Error handling OTP submission:', error);
            if (error.response && error.response.data) {
                alert(error.response.data.message); // Show specific error message
            } else {
                alert('Failed to verify OTP. Please try again.');
            }
        }
    };


    const handleSignUp = async () => {
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
                        {step === 1 ? 'Sign Up' : 'Enter OTP'}
                    </div>
                    {step === 1 ? (
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
                                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ width: '100%', border: 'none', outline: 'none' }} />
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
                                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" style={{ width: '100%', border: 'none', outline: 'none' }} />
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
                                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', border: 'none', outline: 'none' }} />
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
                                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" style={{ width: '100%', border: 'none', outline: 'none' }} />
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <div style={{
                                    height: '48px',
                                    width: '80%',
                                    padding: '16px 32px',
                                    background: '#705243',
                                    borderRadius: '8px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '10px',
                                    display: 'flex',
                                    cursor: 'pointer'
                                }} onClick={handleSendOTP}>
                                    <div style={{
                                        color: 'white',
                                        fontSize: '18px',
                                        fontFamily: 'Montserrat',
                                        fontWeight: '600',
                                        wordWrap: 'break-word',
                                        textAlign: 'center',
                                        width: '100%'
                                    }}>
                                        Sign Up
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: '20px', textAlign: 'center', width: '100%' }}>
                                <Link to="/login" style={{ color: '#4A3F39', fontSize: '16px', fontFamily: 'Montserrat', fontWeight: '600', textDecoration: 'none' }}>
                                    Already have an account? LOGIN
                                </Link>
                            </div>
                        </div>
                    ) : (
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
                                            OTP
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
                                        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" style={{ width: '100%', border: 'none', outline: 'none' }} />
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                height: '48px',
                                padding: '16px 32px',
                                background: '#705243',
                                borderRadius: '8px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '10px',
                                display: 'inline-flex',
                                cursor: 'pointer'
                            }} onClick={() => handleVerifyOTP(otp)}>
                                <div style={{
                                    color: 'white',
                                    fontSize: '18px',
                                    fontFamily: 'Montserrat',
                                    fontWeight: '600',
                                    wordWrap: 'break-word'
                                }}>
                                    Verify OTP
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;