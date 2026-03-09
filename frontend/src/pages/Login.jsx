import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/account/api/check-user/', {
        mobile_number: mobileNumber
      });

      // Verification: Only show modal if user is in the database table
      if (response.data.exists === false || response.data.error) {
        setErrorMessage('This mobile number is not registered. Please create an account.');
        return; 
      }
      setShowOtpModal(true);
    } catch (error) {
      setErrorMessage('This mobile number is not registered. Please create an account.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/account/api/verify-otp/', {
        mobile_number: mobileNumber, 
        otp: otp
      });
      
      // SAVE DATA: This is the critical part for the Home page
      localStorage.setItem('token', response.data.access || response.data.token);
      // Ensure 'response.data.name' matches your Django return key
      localStorage.setItem('userName', response.data.name || 'User'); 
      
      setShowOtpModal(false);
      navigate('/'); // Redirect to home
    } catch (error) {
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Enter your mobile number to sign in</p>
        
        {errorMessage && (
          <div style={{ backgroundColor: '#ffefef', color: '#e74c3c', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '14px', border: '1px solid #ffb8b8' }}>
            <strong>{errorMessage}</strong> <br/>
            <Link to="/signup" style={{ fontWeight: 'bold', color: '#c0392b', marginTop: '8px', display: 'block' }}>Sign Up Here</Link>
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleLogin}>
          <input type="tel" className="auth-input" placeholder="Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required />
          <button type="submit" className="auth-btn">Get OTP</button>
        </form>
        <div className="auth-footer">Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link></div>
      </div>

      {showOtpModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 className="auth-title" style={{ fontSize: '24px' }}>Verify Identity</h2>
            <form className="auth-form" onSubmit={handleVerifyOtp}>
              <input type="text" className="auth-input otp-input" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" required />
              <button type="submit" className="auth-btn">Verify & Login</button>
              <button type="button" onClick={() => setShowOtpModal(false)} style={{ background: 'none', border: 'none', color: '#747d8c', cursor: 'pointer' }}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;