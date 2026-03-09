import { useState, useEffect } from 'react';
import axios from 'axios';

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/order/api/banners/');
        setBanners(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching banners:", err);
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading) return <div>Loading banners...</div>;
  if (banners.length === 0) return <div>No active banners available.</div>;

  return (
    <div style={{ display: 'flex', gap: '20px', overflowX: 'auto' }}>
      {banners.map((banner) => (
        <div key={banner.id} style={{ minWidth: '300px' }}>
          <img 
            src={banner.image} 
            alt={banner.text || "Promo Banner"} 
            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} 
          />
        </div>
      ))}
    </div>
  );
};

export default BannerSlider;