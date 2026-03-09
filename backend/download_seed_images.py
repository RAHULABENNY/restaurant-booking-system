"""
Download seed images for categories and products from Unsplash (free, no API key needed).
Run this once: python download_seed_images.py
"""
import os
import urllib.request

BASE = os.path.join(os.path.dirname(__file__), 'media', 'seed_images')
CAT_DIR = os.path.join(BASE, 'categories')
PROD_DIR = os.path.join(BASE, 'products')

os.makedirs(CAT_DIR, exist_ok=True)
os.makedirs(PROD_DIR, exist_ok=True)

# Unsplash source URLs (free, no auth required, returns a random image for the query)
# Format: https://source.unsplash.com/400x400/?<query>
# We use picsum or specific unsplash photo IDs for consistency

CATEGORY_IMAGES = {
    # Existing categories (only download if missing)
    'burgers.png':      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    'pizza.png':        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
    'biryani.png':      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop',
    'chinese.png':      'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop',
    'desserts.png':     'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop',
    'beverages.png':    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop',
    'south_indian.png': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=400&fit=crop',
    'rolls_wraps.png':  'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop',
    # New categories
    'tandoori.png':     'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop',
    'thali.png':        'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop',
    'snacks.png':       'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop',
    'curries.png':      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop',
    'breads.png':       'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop',
    'salads.png':       'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
}

PRODUCT_IMAGES = {
    # Existing product images
    'classic_veg_burger.png':    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop',
    'chicken_zinger_burger.png': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    'paneer_tikka_burger.png':   'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=400&fit=crop',
    'margherita_pizza.png':      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop',
    'pepperoni_pizza.png':       'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop',
    'paneer_tikka_pizza.png':    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    'chicken_biryani.png':       'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop',
    'veg_biryani.png':           'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=400&fit=crop',
    'mutton_biryani.png':        'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=400&h=400&fit=crop',
    # New product images
    'tandoori_chicken.png':    'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop',
    'paneer_tikka.png':        'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop',
    'fish_tikka.png':          'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=400&fit=crop',
    'veg_thali.png':           'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop',
    'nonveg_thali.png':        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop',
    'rajasthani_thali.png':    'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=400&fit=crop',
    'samosa.png':              'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop',
    'pani_puri.png':           'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400&h=400&fit=crop',
    'spring_roll.png':         'https://images.unsplash.com/photo-1548507346-b3e44df09552?w=400&h=400&fit=crop',
    'butter_chicken.png':      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=400&fit=crop',
    'palak_paneer.png':        'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400&h=400&fit=crop',
    'dal_makhani.png':         'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop',
    'garlic_naan.png':         'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop',
    'butter_roti.png':         'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop',
    'lachha_paratha.png':      'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop',
    'caesar_salad.png':        'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=400&fit=crop',
    'greek_salad.png':         'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop',
    'kachumber_salad.png':     'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&h=400&fit=crop',
}


def download(url, dest_path):
    if os.path.exists(dest_path):
        print(f'  [exists] {os.path.basename(dest_path)}')
        return
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            with open(dest_path, 'wb') as f:
                f.write(resp.read())
        print(f'  [OK] Downloaded: {os.path.basename(dest_path)}')
    except Exception as e:
        print(f'  [FAIL] {os.path.basename(dest_path)} - {e}')


if __name__ == '__main__':
    print('[1/2] Downloading category images...')
    for filename, url in CATEGORY_IMAGES.items():
        download(url, os.path.join(CAT_DIR, filename))

    print('\n[2/2] Downloading product images...')
    for filename, url in PRODUCT_IMAGES.items():
        download(url, os.path.join(PROD_DIR, filename))

    print('\nDone!')
