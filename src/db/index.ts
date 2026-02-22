import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = process.env.DB_PATH || 'database.sqlite';
const db = new Database(dbPath);

export function initDb() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT
    )
  `);

  // Products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      short_description TEXT,
      long_description TEXT,
      image_url TEXT,
      base_price REAL NOT NULL,
      is_variable BOOLEAN DEFAULT 0,
      faq TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id)
    )
  `);

  // Product Variations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_variations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
    )
  `);

  // Orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total_amount REAL NOT NULL,
      payment_method TEXT,
      payment_status TEXT DEFAULT 'pending',
      order_status TEXT DEFAULT 'processing',
      transaction_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Order Items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      variation_id INTEGER,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `);

  // Blog Posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Product Reviews table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `);

  // Contact Messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);

  // Page Views table
  db.exec(`
    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      ip TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed initial settings
  const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  insertSetting.run('google_verification', '');
  insertSetting.run('bing_verification', '');
  insertSetting.run('yandex_verification', '');
  insertSetting.run('notification_email', 'smmbuy2022@gmail.com');
  insertSetting.run('crypto_btc_address', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh');
  insertSetting.run('crypto_eth_address', '0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
  insertSetting.run('crypto_usdt_trc20_address', 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t');
  insertSetting.run('crypto_usdt_erc20_address', '0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
  insertSetting.run('skrill_email', 'payment@growtifypro.com');

  // Seed Admin if not exists (Force update password and role)
  const adminEmail = 'smmbuy2022@gmail.com';
  const adminPassword = 'admin123'; // Hardcoded to ensure user can login
  const hashedPassword = bcrypt.hashSync(adminPassword, 10);
  
  const existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);
  if (!existingAdmin) {
    db.prepare('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)').run(
      adminEmail,
      hashedPassword,
      'Admin',
      'admin'
    );
    console.log('Admin user seeded.');
  } else {
    // Force update password and role to ensure access
    db.prepare('UPDATE users SET password = ?, role = ? WHERE email = ?').run(
      hashedPassword,
      'admin',
      adminEmail
    );
    console.log('Admin user credentials verified and updated.');
  }

  // Seed initial categories
  const categories = [
    ['SMM Promotion', 'smm-promotion'],
    ['SSM Accounts', 'ssm-accounts'],
    ['Business Account', 'business-account'],
    ['E-mail Accounts', 'email-accounts'],
    ['Number Accounts', 'number-accounts'],
    ['Review Services', 'review-services'],
    ['Bank Account', 'bank-account'],
    ['Crypto Account', 'crypto-account']
  ];

  const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name, slug) VALUES (?, ?)');
  categories.forEach(cat => insertCategory.run(cat[0], cat[1]));

  // Seed initial products
  const checkProducts = db.prepare('SELECT count(*) as count FROM products').get() as { count: number };
  if (checkProducts.count === 0) {
    const products = [
      {
        name: 'Instagram High Quality Followers',
        slug: 'instagram-followers',
        category_slug: 'smm-promotion',
        short: 'Boost your Instagram presence with high-quality, non-drop followers.',
        long: '### Why Choose Our Instagram Followers?\n\n*   **High Quality:** Real-looking accounts with profile pictures.\n*   **Non-Drop:** We provide a 30-day refill guarantee.\n*   **Fast Delivery:** Starts within 1-2 hours.\n*   **Safe:** No password required, 100% safe for your account.',
        price: 5.00,
        is_var: 1,
        variations: [
          { name: '1,000 Followers', price: 5.00 },
          { name: '5,000 Followers', price: 22.00 },
          { name: '10,000 Followers', price: 40.00 }
        ]
      },
      {
        name: 'Verified Binance Account (Global)',
        slug: 'verified-binance-account',
        category_slug: 'crypto-account',
        short: 'Fully verified Binance account with KYC completed for secure trading.',
        long: '### Verified Binance Account Features\n\n*   **Fully KYC Verified:** Identity and address verification completed.\n*   **Global Access:** Can be used from any supported country.\n*   **Security:** Comes with original email and recovery details.\n*   **Ready to Use:** Instant access to trading and withdrawals.',
        price: 120.00,
        is_var: 0,
        variations: []
      },
      {
        name: 'Google Play Console Developer Account',
        slug: 'google-play-console',
        category_slug: 'business-account',
        short: 'Original Google Play Console account for app developers.',
        long: '### Google Play Console Account Details\n\n*   **Fresh Account:** Never used, ready for your first app upload.\n*   **Verified:** Payment and identity verified by our team.\n*   **Full Access:** You get the primary Gmail account and recovery info.\n*   **Support:** 24/7 assistance for account setup.',
        price: 85.00,
        is_var: 0,
        variations: []
      },
      {
        name: 'Aged Gmail Accounts (2021-2022)',
        slug: 'aged-gmail-accounts',
        category_slug: 'email-accounts',
        short: 'High-trust aged Gmail accounts for marketing and personal use.',
        long: '### Benefits of Aged Gmail Accounts\n\n*   **High Trust:** Less likely to be flagged by Google systems.\n*   **PVA:** Phone verified accounts.\n*   **Clean History:** No spam history, used for normal activities.\n*   **Bulk Options:** Available in various quantities.',
        price: 2.50,
        is_var: 1,
        variations: [
          { name: '1 Account', price: 2.50 },
          { name: '10 Accounts', price: 20.00 },
          { name: '50 Accounts', price: 85.00 }
        ]
      },
      {
        name: 'Google 5-Star Business Reviews',
        slug: 'google-business-reviews',
        category_slug: 'review-services',
        short: 'Improve your business reputation with authentic 5-star Google reviews.',
        long: '### Boost Your Local SEO\n\n*   **Authentic Profiles:** Reviews from real-looking, active Google accounts.\n*   **Custom Text:** You can provide the text or let us write it.\n*   **Drip Feed:** Reviews are posted naturally over several days.\n*   **Safe:** Compliant with safety standards to avoid flagging.',
        price: 15.00,
        is_var: 1,
        variations: [
          { name: '5 Reviews', price: 15.00 },
          { name: '10 Reviews', price: 28.00 },
          { name: '25 Reviews', price: 65.00 }
        ]
      }
    ];

    const insertProduct = db.prepare(`
      INSERT INTO products (name, slug, category_id, short_description, long_description, base_price, is_variable)
      VALUES (?, ?, (SELECT id FROM categories WHERE slug = ?), ?, ?, ?, ?)
    `);
    const insertVar = db.prepare('INSERT INTO product_variations (product_id, name, price) VALUES (?, ?, ?)');

    products.forEach(p => {
      const result = insertProduct.run(p.name, p.slug, p.category_slug, p.short, p.long, p.price, p.is_var);
      const productId = result.lastInsertRowid;
      if (p.is_var) {
        p.variations.forEach(v => insertVar.run(productId, v.name, v.price));
      }
    });
    console.log('Initial products seeded.');
  }
}

export default db;
