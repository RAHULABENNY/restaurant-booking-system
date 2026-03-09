import React, { useState, useEffect } from 'react';

const AdminNavbar = () => {
  const [adminRole, setAdminRole] = useState('Admin');
  const accentYellow = '#ffb703';

  useEffect(() => {
    // Fetch the role to display in the badge
    setAdminRole(localStorage.getItem('adminRole') || 'Administrator');
  }, []);

  return (
    <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '15px 40px', backgroundColor: '#1a1a1a', color: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* Notification Bell */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <span style={{ fontSize: '20px' }}>🔔</span>
          <span style={{ position: 'absolute', top: '-5px', right: '-8px', backgroundColor: accentYellow, color: 'black', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px' }}>5</span>
        </div>

        {/* Admin Badge */}
        <div style={{ backgroundColor: '#000', padding: '8px 15px', borderRadius: '20px', border: `1px solid ${accentYellow}`, display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.2' }}>
          <span style={{ fontSize: '10px', color: 'white', fontWeight: 'bold', letterSpacing: '1px' }}>ADMIN MODE</span>
          <span style={{ fontSize: '12px', color: accentYellow, fontWeight: '900' }}>{adminRole.toUpperCase()}</span>
        </div>

        {/* Avatar Profile */}
        <div style={{ width: '40px', height: '40px', backgroundColor: accentYellow, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: '2px solid #000' }}>
          😎
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;