"""
Management command to seed the database with categories, menu sections, and products.
Usage:
    python manage.py seed_data          # Add data (skip existing)
    python manage.py seed_data --clear  # Clear existing data first, then add
"""

import os
import shutil
from django.core.management.base import BaseCommand
from django.core.files import File
from django.conf import settings
from inventory.models import Category, MenuSection, Product


# ---------- paths ----------
SEED_DIR = os.path.join(settings.MEDIA_ROOT, 'seed_images')
CAT_SEED  = os.path.join(SEED_DIR, 'categories')
PROD_SEED = os.path.join(SEED_DIR, 'products')


# ===================== DATA DEFINITIONS =====================

CATEGORIES = [
    {'name': 'Burgers',            'image': 'burgers.png'},
    {'name': 'Pizza',              'image': 'pizza.png'},
    {'name': 'Biryani',            'image': 'biryani.png'},
    {'name': 'Chinese',            'image': 'chinese.png'},
    {'name': 'Desserts',           'image': 'desserts.png'},
    {'name': 'Beverages',          'image': 'beverages.png'},
    {'name': 'South Indian',       'image': 'south_indian.png'},
    {'name': 'Rolls & Wraps',      'image': 'rolls_wraps.png'},
    # --- NEW CATEGORIES ---
    {'name': 'Tandoori',           'image': 'tandoori.png'},
    {'name': 'Thali',              'image': 'thali.png'},
    {'name': 'Snacks & Starters',  'image': 'snacks.png'},
    {'name': 'Curries',            'image': 'curries.png'},
    {'name': 'Breads',             'image': 'breads.png'},
    {'name': 'Salads',             'image': 'salads.png'},
]

MENU_SECTIONS = [
    'Today Special',
    'Combo Menu',
    'Best Sellers',
]

# image key: filename in seed_images/products/ — if missing, falls back to category image
PRODUCTS = [
    # -------- Burgers --------
    {
        'name': 'Classic Veg Burger',
        'category': 'Burgers',
        'menu_section': 'Best Sellers',
        'mrp': 149, 'offer_price': 119, 'stock': 50,
        'dietary_type': 'Veg',
        'short_description': 'Crispy veggie patty with fresh lettuce, tomato, cheese & our secret sauce.',
        'image': 'classic_veg_burger.png',
    },
    {
        'name': 'Chicken Zinger Burger',
        'category': 'Burgers',
        'menu_section': 'Best Sellers',
        'mrp': 199, 'offer_price': 169, 'stock': 40,
        'dietary_type': 'Non-Veg',
        'short_description': 'Spicy crispy chicken fillet with creamy mayo, lettuce & cheese on a brioche bun.',
        'image': 'chicken_zinger_burger.png',
    },
    {
        'name': 'Paneer Tikka Burger',
        'category': 'Burgers',
        'menu_section': 'Today Special',
        'mrp': 179, 'offer_price': 149, 'stock': 35,
        'dietary_type': 'Veg',
        'short_description': 'Grilled paneer tikka patty with mint chutney, onion rings & fresh greens.',
        'image': 'paneer_tikka_burger.png',
    },

    # -------- Pizza --------
    {
        'name': 'Margherita Pizza',
        'category': 'Pizza',
        'menu_section': 'Best Sellers',
        'mrp': 249, 'offer_price': 199, 'stock': 45,
        'dietary_type': 'Veg',
        'short_description': 'Classic wood-fired pizza with fresh mozzarella, tomato sauce & basil leaves.',
        'image': 'margherita_pizza.png',
    },
    {
        'name': 'Pepperoni Pizza',
        'category': 'Pizza',
        'menu_section': 'Best Sellers',
        'mrp': 349, 'offer_price': 299, 'stock': 30,
        'dietary_type': 'Non-Veg',
        'short_description': 'Loaded with spicy pepperoni slices, melted mozzarella on a golden crust.',
        'image': 'pepperoni_pizza.png',
    },
    {
        'name': 'Paneer Tikka Pizza',
        'category': 'Pizza',
        'menu_section': 'Today Special',
        'mrp': 299, 'offer_price': 249, 'stock': 35,
        'dietary_type': 'Veg',
        'short_description': 'Indian fusion — grilled paneer, bell peppers, onions & tandoori sauce on cheesy pizza.',
        'image': 'paneer_tikka_pizza.png',
    },

    # -------- Biryani --------
    {
        'name': 'Chicken Biryani',
        'category': 'Biryani',
        'menu_section': 'Best Sellers',
        'mrp': 299, 'offer_price': 249, 'stock': 60,
        'dietary_type': 'Non-Veg',
        'short_description': 'Hyderabadi dum biryani with tender chicken, saffron rice, fried onions & raita.',
        'image': 'chicken_biryani.png',
    },
    {
        'name': 'Veg Biryani',
        'category': 'Biryani',
        'menu_section': 'Combo Menu',
        'mrp': 199, 'offer_price': 169, 'stock': 55,
        'dietary_type': 'Veg',
        'short_description': 'Aromatic basmati rice layered with seasonal vegetables, cashews & saffron.',
        'image': 'veg_biryani.png',
    },
    {
        'name': 'Mutton Biryani',
        'category': 'Biryani',
        'menu_section': 'Today Special',
        'mrp': 399, 'offer_price': 349, 'stock': 25,
        'dietary_type': 'Non-Veg',
        'short_description': 'Lucknowi style slow-cooked mutton biryani with fragrant spices & crispy fried onions.',
        'image': 'mutton_biryani.png',
    },

    # -------- Chinese --------
    {
        'name': 'Veg Hakka Noodles',
        'category': 'Chinese',
        'menu_section': 'Best Sellers',
        'mrp': 179, 'offer_price': 149, 'stock': 50,
        'dietary_type': 'Veg',
        'short_description': 'Wok-tossed noodles with crunchy vegetables, spring onions & soy sauce.',
        'image': None,
    },
    {
        'name': 'Chicken Fried Rice',
        'category': 'Chinese',
        'menu_section': 'Combo Menu',
        'mrp': 199, 'offer_price': 169, 'stock': 45,
        'dietary_type': 'Non-Veg',
        'short_description': 'Flavorful fried rice with tender chicken, eggs, veggies & Indo-Chinese seasoning.',
        'image': None,
    },
    {
        'name': 'Manchurian Gravy',
        'category': 'Chinese',
        'menu_section': 'Best Sellers',
        'mrp': 169, 'offer_price': 139, 'stock': 40,
        'dietary_type': 'Veg',
        'short_description': 'Crispy vegetable balls in a tangy, spicy brown sauce garnished with spring onions.',
        'image': None,
    },

    # -------- Desserts --------
    {
        'name': 'Gulab Jamun',
        'category': 'Desserts',
        'menu_section': 'Best Sellers',
        'mrp': 99, 'offer_price': 79, 'stock': 100,
        'dietary_type': 'Veg',
        'short_description': 'Soft golden milk dumplings soaked in rose-flavored sugar syrup with pistachios.',
        'image': None,
    },
    {
        'name': 'Chocolate Brownie',
        'category': 'Desserts',
        'menu_section': 'Today Special',
        'mrp': 149, 'offer_price': 119, 'stock': 35,
        'dietary_type': 'Veg',
        'short_description': 'Rich fudgy brownie topped with vanilla ice cream & chocolate sauce drizzle.',
        'image': None,
    },
    {
        'name': 'Rasmalai',
        'category': 'Desserts',
        'menu_section': 'Best Sellers',
        'mrp': 129, 'offer_price': 99, 'stock': 50,
        'dietary_type': 'Veg',
        'short_description': 'Soft paneer discs soaked in creamy saffron milk with crushed pistachios & almonds.',
        'image': None,
    },

    # -------- Beverages --------
    {
        'name': 'Mango Lassi',
        'category': 'Beverages',
        'menu_section': 'Best Sellers',
        'mrp': 99, 'offer_price': 79, 'stock': 80,
        'dietary_type': 'Veg',
        'short_description': 'Thick creamy mango yogurt drink with a hint of cardamom & saffron.',
        'image': None,
    },
    {
        'name': 'Cold Coffee',
        'category': 'Beverages',
        'menu_section': 'Best Sellers',
        'mrp': 129, 'offer_price': 99, 'stock': 70,
        'dietary_type': 'Veg',
        'short_description': 'Chilled coffee blended with milk, cream & ice — perfect pick-me-up.',
        'image': None,
    },
    {
        'name': 'Fresh Lime Soda',
        'category': 'Beverages',
        'menu_section': 'Combo Menu',
        'mrp': 79, 'offer_price': 59, 'stock': 100,
        'dietary_type': 'Veg',
        'short_description': 'Sparkling soda with fresh lime juice, a pinch of salt & mint. Sweet or salty!',
        'image': None,
    },

    # -------- South Indian --------
    {
        'name': 'Masala Dosa',
        'category': 'South Indian',
        'menu_section': 'Best Sellers',
        'mrp': 129, 'offer_price': 99, 'stock': 60,
        'dietary_type': 'Veg',
        'short_description': 'Crispy golden dosa filled with spiced potato masala, served with chutney & sambar.',
        'image': None,
    },
    {
        'name': 'Idli Sambar',
        'category': 'South Indian',
        'menu_section': 'Combo Menu',
        'mrp': 99, 'offer_price': 79, 'stock': 70,
        'dietary_type': 'Veg',
        'short_description': 'Soft steamed rice cakes served with aromatic lentil sambar & coconut chutney.',
        'image': None,
    },
    {
        'name': 'Medu Vada',
        'category': 'South Indian',
        'menu_section': 'Best Sellers',
        'mrp': 89, 'offer_price': 69, 'stock': 55,
        'dietary_type': 'Veg',
        'short_description': 'Crispy urad dal fritters, golden-fried to perfection, with coconut chutney & sambar.',
        'image': None,
    },

    # -------- Rolls & Wraps --------
    {
        'name': 'Paneer Tikka Roll',
        'category': 'Rolls & Wraps',
        'menu_section': 'Best Sellers',
        'mrp': 149, 'offer_price': 119, 'stock': 45,
        'dietary_type': 'Veg',
        'short_description': 'Grilled paneer tikka wrapped in a flaky paratha with green chutney & onions.',
        'image': None,
    },
    {
        'name': 'Chicken Seekh Roll',
        'category': 'Rolls & Wraps',
        'menu_section': 'Today Special',
        'mrp': 179, 'offer_price': 149, 'stock': 35,
        'dietary_type': 'Non-Veg',
        'short_description': 'Juicy chicken seekh kebab wrapped in rumali roti with mint chutney & pickled onions.',
        'image': None,
    },
    {
        'name': 'Egg Roll',
        'category': 'Rolls & Wraps',
        'menu_section': 'Combo Menu',
        'mrp': 119, 'offer_price': 99, 'stock': 50,
        'dietary_type': 'Non-Veg',
        'short_description': 'Kolkata-style egg roll — crispy paratha wrapped around spiced egg omelette with onions.',
        'image': None,
    },

    # ======== NEW PRODUCTS ========

    # -------- Tandoori --------
    {
        'name': 'Tandoori Chicken',
        'category': 'Tandoori',
        'menu_section': 'Best Sellers',
        'mrp': 349, 'offer_price': 299, 'stock': 40,
        'dietary_type': 'Non-Veg',
        'short_description': 'Smoky charcoal-grilled chicken marinated overnight in yogurt, red chilli & aromatic spices.',
        'image': 'tandoori_chicken.png',
    },
    {
        'name': 'Paneer Tikka',
        'category': 'Tandoori',
        'menu_section': 'Best Sellers',
        'mrp': 279, 'offer_price': 229, 'stock': 45,
        'dietary_type': 'Veg',
        'short_description': 'Cubes of paneer marinated in spiced yogurt, grilled in a tandoor until charred & smoky.',
        'image': 'paneer_tikka.png',
    },
    {
        'name': 'Fish Tikka',
        'category': 'Tandoori',
        'menu_section': 'Today Special',
        'mrp': 399, 'offer_price': 349, 'stock': 20,
        'dietary_type': 'Non-Veg',
        'short_description': 'Tender fish fillets marinated in mustard, turmeric & lemon, grilled to perfection.',
        'image': 'fish_tikka.png',
    },

    # -------- Thali --------
    {
        'name': 'Veg Thali',
        'category': 'Thali',
        'menu_section': 'Best Sellers',
        'mrp': 249, 'offer_price': 199, 'stock': 30,
        'dietary_type': 'Veg',
        'short_description': 'Complete meal — dal, paneer curry, seasonal sabzi, rice, roti, raita, papad & dessert.',
        'image': 'veg_thali.png',
    },
    {
        'name': 'Non-Veg Thali',
        'category': 'Thali',
        'menu_section': 'Best Sellers',
        'mrp': 349, 'offer_price': 299, 'stock': 25,
        'dietary_type': 'Non-Veg',
        'short_description': 'Feast platter — butter chicken, dal fry, rice, naan, salad, raita & gulab jamun.',
        'image': 'nonveg_thali.png',
    },
    {
        'name': 'Rajasthani Thali',
        'category': 'Thali',
        'menu_section': 'Today Special',
        'mrp': 299, 'offer_price': 249, 'stock': 20,
        'dietary_type': 'Veg',
        'short_description': 'Authentic Rajasthani spread — dal baati churma, gatte ki sabzi, bajra roti & more.',
        'image': 'rajasthani_thali.png',
    },

    # -------- Snacks & Starters --------
    {
        'name': 'Samosa (2 pcs)',
        'category': 'Snacks & Starters',
        'menu_section': 'Best Sellers',
        'mrp': 69, 'offer_price': 49, 'stock': 100,
        'dietary_type': 'Veg',
        'short_description': 'Golden crispy pastry stuffed with spiced potato & peas, served with mint & tamarind chutney.',
        'image': 'samosa.png',
    },
    {
        'name': 'Pani Puri (6 pcs)',
        'category': 'Snacks & Starters',
        'menu_section': 'Best Sellers',
        'mrp': 79, 'offer_price': 59, 'stock': 80,
        'dietary_type': 'Veg',
        'short_description': 'Crispy hollow puris filled with spiced potato, chickpeas & tangy mint water.',
        'image': 'pani_puri.png',
    },
    {
        'name': 'Veg Spring Roll (4 pcs)',
        'category': 'Snacks & Starters',
        'menu_section': 'Combo Menu',
        'mrp': 129, 'offer_price': 99, 'stock': 60,
        'dietary_type': 'Veg',
        'short_description': 'Crispy fried rolls stuffed with mixed vegetables, cabbage, carrots & bean sprouts.',
        'image': 'spring_roll.png',
    },

    # -------- Curries --------
    {
        'name': 'Butter Chicken',
        'category': 'Curries',
        'menu_section': 'Best Sellers',
        'mrp': 299, 'offer_price': 249, 'stock': 50,
        'dietary_type': 'Non-Veg',
        'short_description': 'Tender chicken in a rich, creamy tomato-butter gravy with kasuri methi & a hint of sweetness.',
        'image': 'butter_chicken.png',
    },
    {
        'name': 'Palak Paneer',
        'category': 'Curries',
        'menu_section': 'Best Sellers',
        'mrp': 229, 'offer_price': 189, 'stock': 45,
        'dietary_type': 'Veg',
        'short_description': 'Soft paneer cubes in a silky smooth spinach gravy seasoned with garlic & cumin.',
        'image': 'palak_paneer.png',
    },
    {
        'name': 'Dal Makhani',
        'category': 'Curries',
        'menu_section': 'Combo Menu',
        'mrp': 199, 'offer_price': 169, 'stock': 55,
        'dietary_type': 'Veg',
        'short_description': 'Black lentils slow-cooked overnight with butter, cream & a blend of aromatic spices.',
        'image': 'dal_makhani.png',
    },

    # -------- Breads --------
    {
        'name': 'Garlic Naan',
        'category': 'Breads',
        'menu_section': 'Best Sellers',
        'mrp': 69, 'offer_price': 49, 'stock': 100,
        'dietary_type': 'Veg',
        'short_description': 'Soft tandoor-baked naan brushed with garlic butter & sprinkled with fresh coriander.',
        'image': 'garlic_naan.png',
    },
    {
        'name': 'Butter Roti',
        'category': 'Breads',
        'menu_section': 'Combo Menu',
        'mrp': 39, 'offer_price': 29, 'stock': 150,
        'dietary_type': 'Veg',
        'short_description': 'Soft whole wheat roti made on tawa, generously brushed with melted butter.',
        'image': 'butter_roti.png',
    },
    {
        'name': 'Lachha Paratha',
        'category': 'Breads',
        'menu_section': 'Best Sellers',
        'mrp': 59, 'offer_price': 45, 'stock': 80,
        'dietary_type': 'Veg',
        'short_description': 'Flaky, layered paratha cooked on a hot tawa with ghee — crispy outside, soft inside.',
        'image': 'lachha_paratha.png',
    },

    # -------- Salads --------
    {
        'name': 'Caesar Salad',
        'category': 'Salads',
        'menu_section': 'Today Special',
        'mrp': 179, 'offer_price': 149, 'stock': 30,
        'dietary_type': 'Veg',
        'short_description': 'Crisp romaine lettuce, garlic croutons, parmesan shavings & creamy Caesar dressing.',
        'image': 'caesar_salad.png',
    },
    {
        'name': 'Greek Salad',
        'category': 'Salads',
        'menu_section': 'Best Sellers',
        'mrp': 169, 'offer_price': 139, 'stock': 35,
        'dietary_type': 'Veg',
        'short_description': 'Juicy tomatoes, cucumber, olives, red onion & feta cheese with olive oil vinaigrette.',
        'image': 'greek_salad.png',
    },
    {
        'name': 'Kachumber Salad',
        'category': 'Salads',
        'menu_section': 'Combo Menu',
        'mrp': 79, 'offer_price': 59, 'stock': 60,
        'dietary_type': 'Veg',
        'short_description': 'Fresh diced onion, tomato, cucumber & green chilli tossed with lemon juice & chaat masala.',
        'image': 'kachumber_salad.png',
    },
]


class Command(BaseCommand):
    help = 'Seed the database with categories, menu sections, and products.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Delete ALL existing categories, menu sections, and products before seeding.',
        )

    # --------- helpers ---------
    def _get_image_file(self, folder, filename):
        """Return an opened File object for the given seed image, or None."""
        if not filename:
            return None
        path = os.path.join(folder, filename)
        if os.path.exists(path):
            return open(path, 'rb')
        return None

    def _category_image_path(self, cat_name):
        """Derive the category seed-image filename from the category name."""
        mapping = {c['name']: c['image'] for c in CATEGORIES}
        return mapping.get(cat_name)

    # --------- main ---------
    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write(self.style.WARNING('[CLEAR] Clearing existing data...'))
            Product.objects.all().delete()
            MenuSection.objects.all().delete()
            Category.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('   Done.\n'))

        # ---------- 1. Categories ----------
        self.stdout.write(self.style.HTTP_INFO('[1/3] Seeding categories...'))
        cat_map = {}  # name -> Category instance
        for cat_data in CATEGORIES:
            cat, created = Category.objects.get_or_create(name=cat_data['name'])
            if created:
                f = self._get_image_file(CAT_SEED, cat_data['image'])
                if f:
                    cat.image.save(cat_data['image'], File(f), save=True)
                    f.close()
                tag = self.style.SUCCESS('  [+] Created')
            else:
                tag = self.style.NOTICE('  [-] Exists ')
            cat_map[cat_data['name']] = cat
            self.stdout.write(f"{tag}: {cat_data['name']}")

        # ---------- 2. Menu Sections ----------
        self.stdout.write(self.style.HTTP_INFO('\n[2/3] Seeding menu sections...'))
        sec_map = {}
        for sec_name in MENU_SECTIONS:
            sec, created = MenuSection.objects.get_or_create(name=sec_name)
            sec_map[sec_name] = sec
            tag = self.style.SUCCESS('  [+] Created') if created else self.style.NOTICE('  [-] Exists ')
            self.stdout.write(f"{tag}: {sec_name}")

        # ---------- 3. Products ----------
        self.stdout.write(self.style.HTTP_INFO('\n[3/3] Seeding products...'))
        created_count = 0
        skipped_count = 0
        for prod_data in PRODUCTS:
            cat = cat_map[prod_data['category']]
            sec = sec_map[prod_data['menu_section']]

            if Product.objects.filter(name=prod_data['name'], category=cat).exists():
                skipped_count += 1
                self.stdout.write(self.style.NOTICE(f"  [-] Exists : {prod_data['name']}"))
                continue

            product = Product(
                name=prod_data['name'],
                category=cat,
                menu_section=sec,
                mrp=prod_data['mrp'],
                offer_price=prod_data['offer_price'],
                stock=prod_data['stock'],
                dietary_type=prod_data['dietary_type'],
                short_description=prod_data['short_description'],
            )

            # Try to find the product-specific image first, fall back to category image
            img_filename = prod_data.get('image')
            f = self._get_image_file(PROD_SEED, img_filename) if img_filename else None

            if not f:
                # Fall back: use the category image
                cat_img = self._category_image_path(prod_data['category'])
                f = self._get_image_file(CAT_SEED, cat_img)

            if f:
                save_name = img_filename or self._category_image_path(prod_data['category']) or 'default.png'
                product.image.save(save_name, File(f), save=True)
                f.close()
            else:
                product.save()

            created_count += 1
            self.stdout.write(self.style.SUCCESS(f"  [+] Created: {prod_data['name']}"))

        # ---------- Summary ----------
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(
            f'Seeding complete!  Categories: {len(CATEGORIES)} | '
            f'Sections: {len(MENU_SECTIONS)} | '
            f'Products created: {created_count} | Skipped: {skipped_count}'
        ))

