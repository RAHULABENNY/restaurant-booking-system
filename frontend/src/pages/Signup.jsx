import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import '../App.css';

const Signup = () => {

  // Step 1: User Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  // Step 2: OTP Modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');

  const navigate = useNavigate();

  // -------- Send OTP --------
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await api.post('/api/register/', {
        name: name,
        email: email,
        mobile_number: mobileNumber
      });

      // open OTP modal
      setShowOtpModal(true);

    } catch (error) {
      console.error(error);
      alert('Registration failed. Please check your details.');
    }
  };

  // -------- Verify OTP --------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      await api.post('/api/verify-otp/', {
        email: email,
        otp: otp
      });

      alert('Verification successful! You can now log in.');
      setShowOtpModal(false);
      navigate('/login');

    } catch (error) {
      console.error(error);
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="auth-wrapper">

      {/* Signup Card */}
      <div className="auth-card">

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">
          Join us and start ordering delicious food!
        </p>

        <form className="auth-form" onSubmit={handleSignup}>

          <input
            type="text"
            className="auth-input"
            placeholder="Full Name"
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
            placeholder="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />

          <button type="submit" className="auth-btn">
            Send OTP
          </button>

        </form>

        <div className="auth-footer">
          Already have an account?
          <Link to="/login" className="auth-link"> Login</Link>
        </div>

      </div>


      {/* OTP Modal */}
      {showOtpModal && (
        <div className="modal-overlay">

          <div className="modal-card">

            <h2 className="auth-title" style={{ fontSize: '24px' }}>
              Verify OTP
            </h2>

            <p className="auth-subtitle">
              We sent a code to {email}
            </p>

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

              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#747d8c',
                  cursor: 'pointer',
                  marginTop: '-10px'
                }}
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