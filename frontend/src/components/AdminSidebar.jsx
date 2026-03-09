import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin-login');
  };

  const accentYellow = '#ffb703';
  const sidebarDark = '#1a1a1a';
  const textMuted = '#9ca3af';

  const getNavStyle = (path) => {
    // .includes() ensures it stays highlighted even if you navigate to sub-pages like /admin/products/edit
    const isActive = location.pathname.includes(path); 
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '12px 20px',
      margin: '4px 15px',
      borderRadius: '25px', 
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      backgroundColor: isActive ? accentYellow : 'transparent',
      color: isActive ? '#000000' : textMuted,
    };
  };

  return (
    <aside style={{ width: '260px', backgroundColor: sidebarDark, color: 'white', display: 'flex', flexDirection: 'column', paddingBottom: '20px', flexShrink: 0 }}>
      <div style={{ padding: '30px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
          🍗
        </div>
        <h2 style={{ fontSize: '22px', margin: 0, color: accentYellow, fontWeight: '900', letterSpacing: '1px' }}>
          THE <span style={{ color: 'white' }}>CRUNCH</span>
        </h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, marginTop: '10px' }}>
        <Link to="/admin/dashboard" style={getNavStyle('/admin/dashboard')}>
          <span style={{ fontSize: '18px' }}>⊞</span> DASHBOARD
        </Link>
        <Link to="/admin/orders" style={getNavStyle('/admin/orders')}>
          <span style={{ fontSize: '18px' }}>🛍️</span> LIVE ORDERS
        </Link>
        <Link to="/admin/products" style={getNavStyle('/admin/products')}>
          <span style={{ fontSize: '18px' }}>🍴</span> MENU
        </Link>
        <Link to="/admin/categories" style={getNavStyle('/admin/categories')}>
          <span style={{ fontSize: '18px' }}>📁</span> CATEGORIES
        </Link>
        <Link to="/admin/banners" style={getNavStyle('/admin/banners')}>
          <span style={{ fontSize: '18px' }}>🖼️</span> BANNERS
        </Link>
      </nav>

      <div style={{ padding: '0 15px' }}>
        <button onClick={handleLogout} style={{ width: '100%', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'background 0.3s' }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <span>🚪</span> LOGOUT
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;