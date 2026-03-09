import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

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
            THE <span style={{ color: 'white' }}>CRUNCH</span>
          </h1>
        </div>

        {/* Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/admin-login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = accentYellow} onMouseOut={e => e.target.style.color = 'white'}>
            Admin Login
          </Link>
          <button style={{ backgroundColor: accentYellow, color: darkBg, border: 'none', padding: '10px 25px', borderRadius: '25px', fontWeight: '900', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🛒 CART (0)
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
              {filteredProducts.map(prod => (
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
                    
                    {/* Customer Action Button */}
                    <button style={{ width: '100%', padding: '15px', backgroundColor: darkBg, color: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '14px', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onMouseOver={e => e.target.style.backgroundColor = '#000'} onMouseOut={e => e.target.style.backgroundColor = darkBg}>
                      ADD TO CART <span>+</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;