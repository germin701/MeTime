import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './resetPasswordOTP.css';

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
            alert(error.response.data.message); // show specific error message from server
          } else {
            alert('Failed to send OTP. Please try again.');
          }
          setOtpSent(false); 
        }
      };
      

    // verify the submitted OTP matched with the generated OTP
    const handleOTPSubmit = async (submittedOTP) => {
        console.log('Submitted OTP:', submittedOTP); // log submitted OTP
        try {
          const response = await axios.post('http://localhost:5000/api/verifyOTP', { email, submittedOTP });
          console.log(response.data.message);
      
          if (response.status === 200) {
            alert('OTP matched. Proceeding to reset your password.');
            setOtpVerified(true); // set OTP verification to true after successful verification
          } else {
            alert('Failed to verify OTP. Please try again.');
            setOtpVerified(false); // set OTP verification to false on failure
          }
        } catch (error) {
          console.error('Error handling OTP submission:', error);
          if (error.response && error.response.data && error.response.data.message) {
            alert(error.response.data.message); // Show specific error message from server
          } else {
            alert('Failed to verify OTP. Please try again.');
          }
          setOtpVerified(false); // set OTP verification to false on failure
        }
      };
      
    
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        try {
            // directly reset password here
            const resetResponse = await axios.put(`http://localhost:5000/api/resetPassword/${email}`, { password: newPassword });
            console.log(resetResponse.data); 
            
            alert('Password reset successful.');
            // clear form fields or reset state
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
        <div className="password-reset-container">
            <h2>Password Reset</h2>
            {!otpVerified ? (
                <div className="otp-container">
                    <label>Email Address:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <button onClick={sendOTP}>Send OTP</button>
                    <p>{message}</p>
                    {otpSent && (
                        <div>
                            <label>Enter OTP:</label>
                            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
                            <button onClick={() => handleOTPSubmit(otp)}>Submit OTP</button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="reset-container">
                    <form onSubmit={handleSubmit}>
                        <label>New Password:</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
    
                        <label>Confirm Password:</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
    
                        <button type="submit">Reset Password</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PasswordReset;