import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImg from '../assets/signup.jpg';

// Reset Password Page
const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  // send OTP to email address
  const sendOTP = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/sendOTP', { email });
      console.log(response.data.message);
      setOtpSent(true);
      setMessage(response.data.message);
      alert("Email is sent. Please check your inbox!");
    } catch (error) {
      console.error('Error sending OTP:', error);
      if (error.response && error.response.data && error.response.data.message) {
        // show specific error message from server
        alert(error.response.data.message);
      } else {
        alert('Failed to send OTP. Please try again.');
      }
      setOtpSent(false);
    }
  };

  // verify the submitted OTP matched with the generated OTP
  const handleOTPSubmit = async (submittedOTP) => {
    // log submitted OTP
    console.log('Submitted OTP:', submittedOTP);
    try {
      const response = await axios.post('http://localhost:5000/api/verifyOTP', { email, submittedOTP });
      console.log(response.data.message);

      if (response.status === 200) {
        alert('OTP matched. Proceeding to reset your password.');
        // set OTP verification to true after successful verification
        setOtpVerified(true);
      } else {
        alert('Failed to verify OTP. Please try again.');
        // set OTP verification to false on failure
        setOtpVerified(false);
      }
    } catch (error) {
      console.error('Error handling OTP submission:', error);
      if (error.response && error.response.data && error.response.data.message) {
         // show specific error message from server
        alert(error.response.data.message);
      } else {
        alert('Failed to verify OTP. Please try again.');
      }
      // set OTP verification to false on failure
      setOtpVerified(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    try {
      // reset password here
      const resetResponse = await axios.put(`http://localhost:5000/api/resetPassword/${email}`, { password: newPassword });
      console.log(resetResponse.data);

      alert('Password reset successful.');
      // clear form fields
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      navigate('/login');

    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Failed to reset password. Please try again.');
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
            Password Reset
          </div>
          {!otpVerified ? (
            <div style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
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
                      Email Address
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
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
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
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  width: '100%',
                  marginTop: '10px'
                }}>
                  <button onClick={sendOTP} style={{
                    width: '85%',
                    height: '60px',
                    padding: '5px 32px',
                    background: '#D0AA8D',
                    borderRadius: '32px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    display: 'flex',
                    color: 'white',
                    fontSize: '20px',
                    fontFamily: 'Montserrat',
                    fontWeight: '600',
                    wordWrap: 'break-word',
                    border: 'none',
                    cursor: 'pointer',
                    outline: 'none'
                  }}>
                    Send OTP
                  </button>
                </div>
                <p style={{ width: '100%', textAlign: 'center', fontWeight: '500' }}>{message}</p>
                {otpSent && (
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
                        Enter OTP
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
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="OTP"
                        style={{
                          width: '100%',
                          border: 'none',
                          outline: 'none',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                    <div style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex',
                      width: '100%',
                      marginTop: '10px'
                    }}>
                      <button onClick={() => handleOTPSubmit(otp)} style={{
                        width: '85%',
                        height: '60px',
                        padding: '5px 32px',
                        background: '#D0AA8D',
                        borderRadius: '32px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                        display: 'flex',
                        color: 'white',
                        fontSize: '20px',
                        fontFamily: 'Montserrat',
                        fontWeight: '600',
                        wordWrap: 'break-word',
                        border: 'none',
                        cursor: 'pointer',
                        outline: 'none'
                      }}>
                        Submit OTP
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '18px',
              display: 'flex',
              width: '100%'
            }}>
              <form onSubmit={handleSubmit} style={{
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
                      New Password
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
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password"
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
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
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
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  width: '100%',
                  marginTop: '10px'
                }}>
                  <button type="submit" style={{
                    width: '85%',
                    height: '60px',
                    padding: '5px 32px',
                    background: '#D0AA8D',
                    borderRadius: '32px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    display: 'flex',
                    color: 'white',
                    fontSize: '20px',
                    fontFamily: 'Montserrat',
                    fontWeight: '600',
                    wordWrap: 'break-word',
                    border: 'none',
                    cursor: 'pointer',
                    outline: 'none'
                  }}>
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default PasswordReset;