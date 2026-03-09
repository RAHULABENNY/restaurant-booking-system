import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout'; 
import '../App.css';

const ManageProducts = () => {
  const navigate = useNavigate();
  
  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  
  // Modal Toggles
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // --- PRODUCT FORM STATES ---
  const [name, setName] = useState('');
  const [mrp, setMrp] = useState('');
  const [offerPrice, setOfferPrice] = useState(''); 
  const [stock, setStock] = useState('');
  const [dietaryType, setDietaryType] = useState('Veg');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sectionId, setSectionId] = useState(''); 
  const [image, setImage] = useState(null);
  const [productLoading, setProductLoading] = useState(false);

  // --- CATEGORY FORM STATES ---
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState(null);
  const [catLoading, setCatLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token || token === 'undefined') {
      navigate('/admin-login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [prodRes, catRes, secRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/inventory/api/products/'),
        axios.get('http://127.0.0.1:8000/inventory/api/categories/'),
        axios.get('http://127.0.0.1:8000/inventory/api/menu-sections/')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setSections(secRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // --- SUBMIT PRODUCT ---
  const handleProductSave = async (e, shouldContinue) => {
    if (e) e.preventDefault();
    const token = localStorage.getItem('adminToken'); 
    
    if (!token) return navigate('/admin-login');

    setProductLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('mrp', mrp);
    if (offerPrice) formData.append('offer_price', offerPrice);
    formData.append('stock', stock);
    formData.append('dietary_type', dietaryType);
    formData.append('short_description', description);
    formData.append('category', categoryId);
    formData.append('menu_section', sectionId); 
    if (image) formData.append('image', image);

    try {
      await axios.post('http://127.0.0.1:8000/inventory/api/products/add/', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      fetchData(); 
      resetProductForm();
      
      if (!shouldContinue) {
        setShowProductModal(false); // Close modal if "Save & Close" is clicked
      } else {
        alert("Product saved! You can now add another."); // Keep open if "Save & Continue" is clicked
      }
      
    } catch (err) {
      alert("Error: " + JSON.stringify(err.response?.data || "Check fields"));
    } finally {
      setProductLoading(false);
    }
  };

// --- SUBMIT CATEGORY ---
  const handleCategorySave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken'); 
    
    if (!token) {
      alert("Session expired. Please login again.");
      return navigate('/admin-login');
    }

    setCatLoading(true);
    const formData = new FormData();
    formData.append('name', catName);
    if (catImage) formData.append('image', catImage);

    try {
      // Updated to match the '/add/' endpoint from your logs
      await axios.post('http://127.0.0.1:8000/inventory/api/categories/add/', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        }
      });
      
      fetchData(); // Refresh the list
      setCatName('');
      setCatImage(null);
      setShowCategoryModal(false); // Close modal after saving
      
    } catch (err) {
      // If the token is expired (401), force a logout
      if (err.response?.status === 401) {
        localStorage.clear();
        alert("Your session has expired. Please log in again.");
        navigate('/admin-login');
      } else {
        console.error("Category Save Error:", err.response?.data);
        alert("Error saving category. Check your console.");
      }
    } finally {
      setCatLoading(false);
    }
  };

  const resetProductForm = () => {
    setName(''); setMrp(''); setOfferPrice(''); setStock(''); setDescription(''); 
    setCategoryId(''); setSectionId(''); setImage(null);
  };

  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || prod.category_name === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      {/* Centered Modal CSS */}
      <style>
        {`
          .modal-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background-color: rgba(0,0,0,0.7); z-index: 1000;
            display: flex; justify-content: center; align-items: center;
          }
          .modal-card {
            background-color: white; border-radius: 20px;
            width: 650px; max-width: 90%;
            max-height: 90vh; overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            display: flex; flex-direction: column;
            animation: fadeIn 0.2s ease-out;
          }
          .modal-header {
            padding: 25px 30px; border-bottom: 1px solid #e5e7eb;
            display: flex; justify-content: space-between; align-items: center;
            background-color: #fafafa; position: sticky; top: 0; z-index: 10;
          }
          .modal-body { padding: 30px; }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>

      <div style={{ padding: '40px' }}>
        
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '32px', color: '#1a1a1a', fontWeight: '900', textTransform: 'uppercase' }}>
            MENU <span style={{ color: '#ffb703' }}>MANAGER</span>
          </h1>
          <p style={{ margin: 0, color: '#9ca3af', fontWeight: 'bold', letterSpacing: '2px', fontSize: '12px' }}>
            INVENTORY CONTROL
          </p>
        </div>

        {/* Categories Strip */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#1a1a1a', fontWeight: '900' }}>CATEGORIES</h2>
            <button onClick={() => setShowCategoryModal(true)} style={{ background: 'none', color: '#1a1a1a', fontWeight: 'bold', border: '2px solid #1a1a1a', padding: '8px 20px', borderRadius: '25px', fontSize: '14px', cursor: 'pointer' }}>
              + ADD CATEGORY
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '30px', overflowX: 'auto', paddingBottom: '15px' }}>
            {categories.map(cat => (
              <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'white', padding: '5px', boxShadow: '0 4px 10px rgba(0,0,0,0.08)', marginBottom: '10px' }}>
                  <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
                <span style={{ fontWeight: '900', fontSize: '13px', color: '#1a1a1a', textTransform: 'uppercase' }}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h2 style={{ margin: '0', fontSize: '20px', color: '#1a1a1a', fontWeight: '900' }}>MENU ITEMS</h2>
            <span style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
              {filteredProducts.length} Items
            </span>
          </div>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="🔍 Search items..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '12px 20px', borderRadius: '25px', border: '1px solid #e5e7eb', width: '250px', outline: 'none' }}
            />
            
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ padding: '12px 20px', borderRadius: '25px', border: '1px solid #e5e7eb', backgroundColor: 'white', outline: 'none', cursor: 'pointer' }}
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            <button onClick={() => setShowProductModal(true)} style={{ backgroundColor: '#1a1a1a', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}>
              + ADD NEW ITEM
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {filteredProducts.map(prod => (
            <div key={prod.id} style={{ backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#1a1a1a', fontWeight: '800' }}>{prod.name}</h3>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: '900', color: '#ffb703', fontSize: '18px', display: 'block' }}>₹{prod.mrp}</span>
                    {prod.offer_price && <span style={{ fontSize: '12px', textDecoration: 'line-through', color: '#9ca3af' }}>₹{prod.offer_price}</span>}
                  </div>
                </div>
                <p style={{ margin: '0 0 15px 0', fontSize: '13px', color: '#6b7280', flex: 1 }}>{prod.short_description || "No description provided."}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '15px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '12px' }}>
                    {prod.category_name}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: prod.dietary_type === 'Veg' ? '#10b981' : '#ef4444' }}>
                    ● {prod.dietary_type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* -------------------------------------------
          CENTERED MODAL: ADD PRODUCT
      --------------------------------------------- */}
      {showProductModal && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ margin: 0, fontWeight: '900', color: '#1a1a1a', fontSize: '20px' }}>NEW MENU ITEM</h2>
              <button onClick={() => setShowProductModal(false)} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#9ca3af' }}>&times;</button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div>
                  <label style={labelStyle}>Product Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <select value={categoryId} onChange={e => setCategoryId(e.target.value)} style={inputStyle} required>
                      <option value="">Select...</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Menu Section</label>
                    <select value={sectionId} onChange={e => setSectionId(e.target.value)} style={inputStyle} required>
                      <option value="">Select...</option>
                      {sections.map(sec => <option key={sec.id} value={sec.id}>{sec.name}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={labelStyle}>MRP (₹)</label>
                    <input type="number" value={mrp} onChange={e => setMrp(e.target.value)} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={labelStyle}>Offer Price (₹) <span style={{color: '#9ca3af', fontWeight: 'normal'}}>(Optional)</span></label>
                    <input type="number" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={labelStyle}>Stock Level</label>
                    <input type="number" value={stock} onChange={e => setStock(e.target.value)} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={labelStyle}>Dietary Type</label>
                    <select value={dietaryType} onChange={e => setDietaryType(e.target.value)} style={inputStyle}>
                      <option value="Veg">Veg</option>
                      <option value="Non-Veg">Non-Veg</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Product Image</label>
                  <input type="file" onChange={e => setImage(e.target.files[0])} style={{...inputStyle, padding: '10px', backgroundColor: 'white'}} required />
                </div>
                
                <div>
                  <label style={labelStyle}>Short Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, height: '80px', resize: 'vertical' }} />
                </div>

                {/* MODAL SAVE BUTTONS */}
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  <button type="button" onClick={e => handleProductSave(e, true)} disabled={productLoading} style={{ flex: 1, backgroundColor: '#10b981', color: 'white', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                    {productLoading ? '...' : 'SAVE & CONTINUE'}
                  </button>
                  <button type="button" onClick={e => handleProductSave(e, false)} disabled={productLoading} style={{ flex: 1, backgroundColor: '#1a1a1a', color: 'white', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                    {productLoading ? '...' : 'SAVE & CLOSE'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------
          CENTERED MODAL: ADD CATEGORY
      --------------------------------------------- */}
      {showCategoryModal && (
        <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ width: '450px' }}>
            <div className="modal-header">
              <h2 style={{ margin: 0, fontWeight: '900', color: '#1a1a1a', fontSize: '20px' }}>NEW CATEGORY</h2>
              <button onClick={() => setShowCategoryModal(false)} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#9ca3af' }}>&times;</button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleCategorySave} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                
                <div>
                  <label style={labelStyle}>Category Name</label>
                  <input type="text" placeholder="e.g. Desserts" value={catName} onChange={e => setCatName(e.target.value)} style={inputStyle} required />
                </div>

                <div>
                  <label style={labelStyle}>Category Image</label>
                  <input type="file" onChange={e => setCatImage(e.target.files[0])} style={{...inputStyle, padding: '10px', backgroundColor: 'white'}} required />
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  {/* Category only needs Save & Close currently */}
                  <button type="submit" disabled={catLoading} style={{ flex: 1, backgroundColor: '#1a1a1a', color: 'white', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                    {catLoading ? 'SAVING...' : 'SAVE & CLOSE'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

// --- STYLES FOR MODAL INPUTS ---
const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '800',
  color: '#4b5563',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const inputStyle = {
  padding: '14px 15px',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb',
  width: '100%',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  fontSize: '14px'
};

export default ManageProducts;