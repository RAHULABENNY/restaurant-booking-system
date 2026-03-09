import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    localStorage.clear(); // Clear old stale data to prevent token conflicts

    try {
      const response = await axios.post('http://127.0.0.1:8000/account/api/admin-login/', {
        email,
        password
      });

      // Extracting from the nested 'tokens' object returned by your Django backend
      const token = response.data.tokens?.access; 
      const refreshToken = response.data.tokens?.refresh; // Now securely saving the refresh token
      const role = response.data.role;

      if (token) {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('isAdmin', 'true');
        
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        
        if (role) {
          localStorage.setItem('adminRole', role);
        }

        // Derive a display name from the email (e.g. "admin@gmail.com" -> "Admin")
        const derivedName = email.split('@')[0];
        const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
        localStorage.setItem('adminName', formattedName);
        
        alert('Admin Authentication Successful');
        navigate('/admin/dashboard');
      } else {
        console.error("Token missing in response:", response.data);
        alert('Server error: Token not found in the "tokens" object. Check console.');
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data);
      alert(error.response?.data?.message || 'Invalid Admin Credentials');
    }
  };

  return (
    <div className="auth-wrapper" style={{ background: '#2c3e50', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card">
        <h2 className="auth-title">Admin Portal</h2>
        <p className="auth-subtitle">Authorized Personnel Only</p>
        
        <form className="auth-form" onSubmit={handleAdminLogin}>
          <input 
            type="email" 
            className="auth-input"
            placeholder="Admin Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            className="auth-input"
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="auth-btn" style={{ backgroundColor: '#2c3e50', color: 'white' }}>
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;