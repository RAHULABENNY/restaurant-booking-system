import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout'; // Import your new layout!

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simply verify auth on page load
    const token = localStorage.getItem('adminToken');
    if (!token || token === 'undefined') {
      navigate('/admin-login');
    }
  }, [navigate]);

  return (
    <AdminLayout>
      {/* EVERYTHING inside here is automatically injected into the main content area! */}
      <div style={{ padding: '40px' }}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#1a1a1a', fontWeight: '900' }}>
          DASHBOARD <span style={{ color: '#ffb703' }}>OVERVIEW</span>
        </h1>
        <p style={{ color: '#6b7280', margin: '0 0 30px 0', fontSize: '14px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>
          System Statistics
        </p>

        {/* Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div className="stat-card" style={statCardStyle}>
            <h3 style={statTitleStyle}>Total Orders</h3>
            <p style={statValueStyle}>128</p>
          </div>
          <div className="stat-card" style={statCardStyle}>
            <h3 style={statTitleStyle}>Active Banners</h3>
            <p style={statValueStyle}>5</p>
          </div>
          <div className="stat-card" style={statCardStyle}>
            <h3 style={statTitleStyle}>Total Customers</h3>
            <p style={statValueStyle}>1,042</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// --- STYLES FOR CONTENT AREA ---
const statCardStyle = {
  backgroundColor: 'white',
  padding: '25px',
  borderRadius: '12px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
  borderLeft: '5px solid #ffb703', 
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
};

const statTitleStyle = {
  margin: 0,
  fontSize: '13px',
  color: '#6b7280',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '1px'
};

const statValueStyle = {
  margin: '10px 0 0 0',
  fontSize: '36px',
  fontWeight: '900',
  color: '#1a1a1a'
};

export default AdminDashboard;