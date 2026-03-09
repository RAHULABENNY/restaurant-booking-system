import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const Signup = () => {
  // Step 1 States: User Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  
  // Step 2 States: OTP Modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  
  const navigate = useNavigate();

  // --- ACTION 1: Submit Details & Request OTP ---
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // NOTE: Replace this with your exact Django register URL from Postman
      await axios.post('http://127.0.0.1:8000/api/register/', {
        name: name,
        email: email,
        mobile_number: mobileNumber
      });
      
      // If successful, open the OTP Modal
      setShowOtpModal(true);
      
    } catch (error) {
      console.error(error);
      alert('Registration failed. Please check your details.');
    }
  };

  // --- ACTION 2: Verify OTP ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      // NOTE: I saw "user verify otp" in your Postman screenshot
      // Replace this URL with that exact endpoint!
      await axios.post('http://127.0.0.1:8000/api/verify-otp/', {
        email: email, // Sending email so backend knows WHO is verifying
        otp: otp
      });
      
      alert('Verification successful! You can now log in.');
      setShowOtpModal(false); // Close modal
      navigate('/login');     // Send to login page
      
    } catch (error) {
      console.error(error);
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="auth-wrapper">
      
      {/* --- THE SIGNUP CARD --- */}
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join us and start ordering delicious food!</p>
        
        <form className="auth-form" onSubmit={handleSignup}>
          <input 
            type="text" 
            className="auth-input"
            placeholder="Full Name (e.g., rahul)" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            className="auth-input"
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="tel" 
            className="auth-input"
            placeholder="Mobile Number (e.g., 623825538)" 
            value={mobileNumber} 
            onChange={(e) => setMobileNumber(e.target.value)} 
            required 
          />
          <button type="submit" className="auth-btn">
            Send OTP
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </div>
      </div>

      {/* --- THE OTP MODAL --- */}
      {showOtpModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 className="auth-title" style={{ fontSize: '24px' }}>Verify OTP</h2>
            <p className="auth-subtitle">We sent a code to {email}</p>
            
            <form className="auth-form" onSubmit={handleVerifyOtp}>
              <input 
                type="text" 
                className="auth-input otp-input"
                placeholder="Enter OTP" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                maxLength="6"
                required 
              />
              <button type="submit" className="auth-btn">
                Verify & Create Account
              </button>
              
              {/* Optional Cancel Button */}
              <button 
                type="button" 
                onClick={() => setShowOtpModal(false)} 
                style={{ background: 'none', border: 'none', color: '#747d8c', cursor: 'pointer', marginTop: '-10px' }}
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

export default Signup;