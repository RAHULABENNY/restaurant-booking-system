import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

// The 'children' prop represents whatever page content is placed inside this wrapper
const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'system-ui, -apple-system, sans-serif', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      
      {/* 1. The Persistent Sidebar */}
      <AdminSidebar />

      {/* 2. The Main Content Column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* The Persistent Navbar */}
        <AdminNavbar />

        {/* The Dynamic Page Content goes here */}
        <main style={{ flex: 1 }}>
          {children}
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;