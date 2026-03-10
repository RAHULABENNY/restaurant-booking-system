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

  // --- THEME CONSTANTS (Matching Home Page) ---
  const accentYellow = '#ffb703';
  const darkBg = '#1a1a1a';

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
      localStorage.setItem('userName', response.data.name || 'User'); 
      
      setShowOtpModal(false);
      navigate('/'); // Redirect to home
    } catch (error) {
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* MAIN LOGIN CARD */}
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px', boxSizing: 'border-box' }}>
        
        {/* Logo / Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: darkBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
            🍗
          </div>
        </div>

        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: '900', color: darkBg, margin: '0 0 10px 0' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', margin: '0 0 30px 0', fontSize: '15px' }}>Enter your mobile number to sign in</p>
        
        {/* Error Message */}
        {errorMessage && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '15px', borderRadius: '10px', marginBottom: '25px', textAlign: 'center', fontSize: '14px', border: '1px solid #fca5a5' }}>
            <strong>{errorMessage}</strong> <br/>
            <Link to="/signup" style={{ fontWeight: 'bold', color: '#b91c1c', marginTop: '10px', display: 'inline-block', textDecoration: 'underline' }}>Sign Up Here</Link>
          </div>
        )}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="tel" 
            placeholder="Mobile Number" 
            value={mobileNumber} 
            onChange={(e) => setMobileNumber(e.target.value)} 
            required 
            style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #e5e7eb', fontSize: '16px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
            onFocus={(e) => e.target.style.borderColor = accentYellow}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          <button 
            type="submit" 
            style={{ width: '100%', padding: '15px', backgroundColor: accentYellow, color: darkBg, border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', transition: 'transform 0.1s, background 0.2s' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e6a600'}
            onMouseOut={(e) => e.target.style.backgroundColor = accentYellow}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          >
            GET OTP
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: darkBg, fontWeight: 'bold', textDecoration: 'none' }} onMouseOver={(e) => e.target.style.color = accentYellow} onMouseOut={(e) => e.target.style.color = darkBg}>
            Sign up
          </Link>
        </div>
      </div>

      {/* OTP MODAL OVERLAY */}
      {showOtpModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', width: '90%', maxWidth: '400px', boxSizing: 'border-box', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: darkBg, margin: '0 0 10px 0' }}>Verify Identity</h2>
            <p style={{ color: '#6b7280', margin: '0 0 25px 0', fontSize: '14px' }}>Enter the 6-digit code sent to your phone.</p>
            
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="text" 
                placeholder="000000" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                maxLength="6" 
                required 
                style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #e5e7eb', fontSize: '24px', letterSpacing: '8px', textAlign: 'center', outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => e.target.style.borderColor = darkBg}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <button 
                type="submit" 
                style={{ width: '100%', padding: '15px', backgroundColor: darkBg, color: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#000'}
                onMouseOut={(e) => e.target.style.backgroundColor = darkBg}
              >
                VERIFY & LOGIN
              </button>
              <button 
                type="button" 
                onClick={() => setShowOtpModal(false)} 
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginTop: '10px' }}
                onMouseOver={(e) => e.target.style.color = '#dc2626'}
                onMouseOut={(e) => e.target.style.color = '#9ca3af'}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;