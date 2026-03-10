import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import '../App.css';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  
  // Cart state
  const [cart, setCart] = useState([]);

  // Auth & Dropdown states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false); // NEW: Track dropdown visibility

  const navigate = useNavigate(); // NEW: Hook for redirecting if needed

  // Check if user is logged in on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedName = localStorage.getItem('userName');
    
    if (token) {
      setIsLoggedIn(true);
      setUserName(storedName || 'User');
    }
  }, []);

  // Fetch Categories and Products on page load
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/inventory/api/categories/'),
          axios.get('http://127.0.0.1:8000/inventory/api/products/')
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        console.error("Error fetching menu data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuData();
  }, []);

  // Filter products when a customer clicks a category bubble
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(prod => prod.category_name === activeCategory);

  // Function to handle adding items to the cart
  const handleAddToCart = (product) => {
    setCart(prevCart => [...prevCart, product]);
  };

  // NEW: Function to handle logging out
  const handleLogout = () => {
    // 1. Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    
    // 2. Reset state
    setIsLoggedIn(false);
    setUserName('');
    setShowDropdown(false);
    
    // 3. Optional: redirect to home (if you use this navbar on other pages)
    navigate('/');
  };

  // --- THEME CONSTANTS ---
  const accentYellow = '#ffb703';
  const darkBg = '#1a1a1a';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* --- CUSTOMER NAVBAR --- */}
      <header style={{ backgroundColor: darkBg, padding: '15px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '45px', height: '45px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            🍗
          </div>
          <h1 style={{ fontSize: '26px', margin: 0, color: accentYellow, fontWeight: '900', letterSpacing: '1px' }}>
            CURRY<span style={{ color: 'white' }}> PALACE</span>
          </h1>
        </div>

        {/* Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          
          {/* UPDATED: Profile Dropdown Container */}
          {isLoggedIn ? (
            <div style={{ position: 'relative' }}>
              {/* Profile Icon (Clickable) */}
              <div 
                onClick={() => setShowDropdown(!showDropdown)} 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <div style={{ width: '38px', height: '38px', backgroundColor: accentYellow, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                  👤
                </div>
                <span style={{ color: 'white', fontSize: '13px', marginTop: '4px', fontWeight: 'bold' }}>
                  Hi, {userName}
                </span>
              </div>

              {/* NEW: Dropdown Menu */}
              {showDropdown && (
                <div style={{ position: 'absolute', top: '65px', right: '50%', transform: 'translateX(50%)', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', width: '160px', overflow: 'hidden', zIndex: 200, display: 'flex', flexDirection: 'column', border: '1px solid #f3f4f6' }}>
                  
                  {/* Triangle Pointer */}
                  <div style={{ position: 'absolute', top: '-6px', right: '50%', transform: 'translateX(50%) rotate(45deg)', width: '12px', height: '12px', backgroundColor: 'white', borderLeft: '1px solid #f3f4f6', borderTop: '1px solid #f3f4f6' }}></div>

                  {/* Dropdown Links */}
                  <Link to="/profile" style={{ padding: '14px 20px', textDecoration: 'none', color: darkBg, fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid #f3f4f6', transition: 'background 0.2s', position: 'relative', zIndex: 2 }} onMouseOver={e => e.target.style.backgroundColor = '#f8f9fa'} onMouseOut={e => e.target.style.backgroundColor = 'white'}>
                    👤 My Profile
                  </Link>
                  <Link to="/orders" style={{ padding: '14px 20px', textDecoration: 'none', color: darkBg, fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid #f3f4f6', transition: 'background 0.2s', position: 'relative', zIndex: 2 }} onMouseOver={e => e.target.style.backgroundColor = '#f8f9fa'} onMouseOut={e => e.target.style.backgroundColor = 'white'}>
                    📦 My Orders
                  </Link>
                  <button onClick={handleLogout} style={{ padding: '14px 20px', border: 'none', backgroundColor: 'white', color: '#dc2626', fontWeight: 'bold', fontSize: '14px', textAlign: 'left', cursor: 'pointer', transition: 'background 0.2s', position: 'relative', zIndex: 2 }} onMouseOver={e => e.target.style.backgroundColor = '#fee2e2'} onMouseOut={e => e.target.style.backgroundColor = 'white'}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = accentYellow} onMouseOut={e => e.target.style.color = 'white'}>
              Login
            </Link>
          )}

          {/* Cart counter */}
          <button style={{ backgroundColor: accentYellow, color: darkBg, border: 'none', padding: '10px 25px', borderRadius: '25px', fontWeight: '900', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'transform 0.1s' }} onMouseDown={e => e.target.style.transform = 'scale(0.95)'} onMouseUp={e => e.target.style.transform = 'scale(1)'}>
            🛒 CART ({cart.length})
          </button>
        </div>
      </header>

      {/* --- HERO BANNER --- */}
      <div style={{ backgroundColor: darkBg, color: 'white', padding: '60px 50px', textAlign: 'center', backgroundImage: 'radial-gradient(circle at center, #2a2a2a 0%, #1a1a1a 100%)' }}>
        <h2 style={{ fontSize: '48px', margin: '0 0 15px 0', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Craving Something <span style={{ color: accentYellow }}>Delicious?</span>
        </h2>
        <p style={{ fontSize: '18px', color: '#9ca3af', margin: '0 0 30px 0', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          Order your favorite meals fresh and hot, directly to your door. Browse our menu below!
        </p>
      </div>

      <main style={{ padding: '50px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* --- CATEGORIES SECTION --- */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ fontSize: '24px', margin: 0, fontWeight: '900', color: darkBg, textTransform: 'uppercase' }}>
              Explore Our Menu
            </h3>
            {activeCategory !== 'All' && (
              <button onClick={() => setActiveCategory('All')} style={{ background: 'none', border: 'none', color: accentYellow, fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                Show All Items
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '35px', overflowX: 'auto', paddingBottom: '20px', scrollbarWidth: 'none' }}>
            {/* "All" Category Bubble */}
            <div onClick={() => setActiveCategory('All')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '100px' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: activeCategory === 'All' ? accentYellow : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', marginBottom: '15px', transition: 'all 0.2s', border: activeCategory === 'All' ? `4px solid ${darkBg}` : '4px solid transparent' }}>
                🍔
              </div>
              <span style={{ fontWeight: '900', fontSize: '14px', color: darkBg, textTransform: 'uppercase' }}>ALL</span>
            </div>

            {/* Dynamic Category Bubbles */}
            {categories.map(cat => (
              <div key={cat.id} onClick={() => setActiveCategory(cat.name)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '100px', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'white', padding: '4px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', marginBottom: '15px', border: activeCategory === cat.name ? `4px solid ${accentYellow}` : '4px solid transparent', transition: 'all 0.2s' }}>
                  <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
                <span style={{ fontWeight: '900', fontSize: '14px', color: darkBg, textTransform: 'uppercase' }}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- PRODUCTS GRID --- */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '24px', margin: '0 0 30px 0', fontWeight: '900', color: darkBg, textTransform: 'uppercase' }}>
            {activeCategory === 'All' ? 'Popular Items' : `${activeCategory} Items`}
          </h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px', fontWeight: 'bold', color: '#9ca3af' }}>Loading menu...</div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '15px', fontWeight: 'bold', color: '#9ca3af' }}>No items found in this category.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
              {filteredProducts.map(prod => {
                const isInCart = cart.some(item => item.id === prod.id);

                return (
                  <div key={prod.id} style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    
                    {/* Product Image */}
                    <div style={{ position: 'relative', height: '220px' }}>
                      <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'white', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', color: prod.dietary_type === 'Veg' ? '#10b981' : '#ef4444', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        ● {prod.dietary_type}
                      </span>
                    </div>
                    
                    {/* Product Details */}
                    <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <h4 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: darkBg }}>{prod.name}</h4>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: '900', color: accentYellow, fontSize: '22px', display: 'block' }}>₹{prod.mrp}</span>
                          {prod.offer_price && <span style={{ fontSize: '14px', textDecoration: 'line-through', color: '#9ca3af' }}>₹{prod.offer_price}</span>}
                        </div>
                      </div>
                      
                      <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6b7280', flex: 1, lineHeight: '1.5' }}>
                        {prod.short_description || "Deliciously prepared with the finest ingredients."}
                      </p>
                      
                      {/* Add to Cart Button */}
                      <button 
                        onClick={() => handleAddToCart(prod)}
                        disabled={isInCart}
                        style={{ 
                          width: '100%', 
                          padding: '15px', 
                          backgroundColor: isInCart ? '#9ca3af' : darkBg, 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '12px', 
                          fontWeight: '900', 
                          fontSize: '14px', 
                          cursor: isInCart ? 'not-allowed' : 'pointer', 
                          transition: 'background 0.2s', 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          gap: '8px' 
                        }} 
                        onMouseOver={e => { if (!isInCart) e.target.style.backgroundColor = '#000' }} 
                        onMouseOut={e => { if (!isInCart) e.target.style.backgroundColor = darkBg }}
                      >
                        {isInCart ? 'ADDED TO CART ✓' : <>ADD TO CART <span>+</span></>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;