import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import db, { initDb } from "./src/db/index.ts";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB
  initDb();

  app.use(express.json());

  // Page view tracking middleware
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.includes('.')) {
      try {
        db.prepare('INSERT INTO page_views (path, ip, user_agent) VALUES (?, ?, ?)').run(
          req.path,
          req.ip,
          req.get('user-agent')
        );
      } catch (e) {
        console.error('Failed to track page view:', e);
      }
    }
    next();
  });

  // --- Auth Middleware ---
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  const isAdmin = (req: any, res: any, next: any) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Admin access required' });
    }
  };

  // Supabase Connection Test
  app.get("/api/supabase-test", async (req, res) => {
    try {
      if (!supabase) {
        return res.status(400).json({ status: 'error', message: 'Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY.' });
      }
      const { data, error } = await supabase.from('products').select('count');
      if (error) throw error;
      res.json({ status: 'connected', message: 'Supabase is reachable', data });
    } catch (err: any) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  });

  // --- API Routes ---

  // Auth
  app.post("/api/auth/register", (req, res) => {
    const { email, password, name } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)').run(email, hashedPassword, name);
      res.json({ id: result.lastInsertRowid });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );
      res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Settings
  app.get("/api/settings", (req, res) => {
    const settings = db.prepare('SELECT * FROM settings').all();
    const settingsObj = settings.reduce((acc: any, s: any) => {
      acc[s.key] = s.value;
      return acc;
    }, {});
    res.json(settingsObj);
  });

  app.post("/api/admin/settings", authenticateToken, isAdmin, (req, res) => {
    const settings = req.body;
    const update = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    const transaction = db.transaction((data) => {
      for (const [key, value] of Object.entries(data)) {
        update.run(key, value);
      }
    });
    try {
      transaction(settings);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Profile Update
  app.post("/api/admin/profile", authenticateToken, isAdmin, (req, res) => {
    const { email, password, name } = req.body;
    const userId = (req as any).user.id;
    try {
      if (password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        db.prepare('UPDATE users SET email = ?, password = ?, name = ? WHERE id = ?').run(email, hashedPassword, name, userId);
      } else {
        db.prepare('UPDATE users SET email = ?, name = ? WHERE id = ?').run(email, name, userId);
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Sitemap
  app.get("/sitemap.xml", (req, res) => {
    const products = db.prepare('SELECT slug FROM products').all();
    const posts = db.prepare('SELECT slug FROM blog_posts').all();
    const baseUrl = process.env.APP_URL || 'https://growtifypro.com';

    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    
    // Static pages
    const staticPages = ['', '/shop', '/blog', '/about', '/contact', '/privacy', '/return-policy', '/terms', '/refund'];
    staticPages.forEach(page => {
      xml += `<url><loc>${baseUrl}${page}</loc><changefreq>daily</changefreq></url>`;
    });

    // Products
    products.forEach((p: any) => {
      xml += `<url><loc>${baseUrl}/product/${p.slug}</loc><changefreq>weekly</changefreq></url>`;
    });

    // Blog posts
    posts.forEach((p: any) => {
      xml += `<url><loc>${baseUrl}/blog/${p.slug}</loc><changefreq>weekly</changefreq></url>`;
    });

    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  // Contact Form
  app.post("/api/contact", (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
      db.prepare('INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)').run(name, email, subject, message);
      
      // Simulate notification
      const notificationEmail = db.prepare('SELECT value FROM settings WHERE key = ?').get('notification_email');
      console.log(`[CONTACT NOTIFICATION] New message from ${name} (${email})! Notification sent to: ${notificationEmail?.value || 'smmbuy2022@gmail.com'}`);
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/admin/messages", authenticateToken, isAdmin, (req, res) => {
    const messages = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
    res.json(messages);
  });

  app.get("/api/admin/users", authenticateToken, isAdmin, (req, res) => {
    const users = db.prepare('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC').all();
    res.json(users);
  });

  app.get("/api/admin/orders", authenticateToken, isAdmin, (req, res) => {
    const orders = db.prepare(`
      SELECT o.*, u.name as user_name, u.email as user_email 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `).all();
    res.json(orders);
  });

  app.post("/api/admin/orders/:id/status", authenticateToken, isAdmin, (req, res) => {
    const { status } = req.body;
    db.prepare('UPDATE orders SET order_status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  });

  // Categories
  app.get("/api/categories", (req, res) => {
    const categories = db.prepare('SELECT * FROM categories').all();
    res.json(categories);
  });

  // Products
  app.get("/api/products", (req, res) => {
    const { category } = req.query;
    let products;
    if (category) {
      products = db.prepare(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        JOIN categories c ON p.category_id = c.id 
        WHERE c.slug = ?
      `).all(category);
    } else {
      products = db.prepare(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id
      `).all();
    }
    
    // Attach variations to each product
    const productsWithVariations = products.map((p: any) => {
      const variations = db.prepare('SELECT * FROM product_variations WHERE product_id = ?').all(p.id);
      return { ...p, variations };
    });

    res.json(productsWithVariations);
  });

  app.get("/api/products/:slug", (req, res) => {
    const product: any = db.prepare(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.slug = ?
    `).get(req.params.slug);

    if (product) {
      const variations = db.prepare('SELECT * FROM product_variations WHERE product_id = ?').all(product.id);
      const reviews = db.prepare("SELECT * FROM reviews WHERE product_id = ? AND status = 'approved' ORDER BY created_at DESC").all(product.id);
      res.json({ ...product, variations, reviews });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  // Admin: Product Management
  app.post("/api/admin/products", authenticateToken, isAdmin, (req, res) => {
    const { name, slug, category_id, short_description, long_description, image_url, base_price, is_variable, faq, variations } = req.body;
    
    const transaction = db.transaction(() => {
      const result = db.prepare(`
        INSERT INTO products (name, slug, category_id, short_description, long_description, image_url, base_price, is_variable, faq)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(name, slug, category_id, short_description, long_description, image_url, base_price, is_variable ? 1 : 0, faq);

      const productId = result.lastInsertRowid;

      if (is_variable && variations && Array.isArray(variations)) {
        const insertVar = db.prepare('INSERT INTO product_variations (product_id, name, price) VALUES (?, ?, ?)');
        for (const v of variations) {
          insertVar.run(productId, v.name, v.price);
        }
      }
      return productId;
    });

    try {
      const id = transaction();
      res.json({ id });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Reviews
  app.post("/api/reviews", (req, res) => {
    const { product_id, user_name, rating, comment } = req.body;
    try {
      db.prepare('INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)').run(product_id, user_name, rating, comment);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/admin/reviews", authenticateToken, isAdmin, (req, res) => {
    const reviews = db.prepare(`
      SELECT r.*, p.name as product_name 
      FROM reviews r 
      JOIN products p ON r.product_id = p.id 
      ORDER BY r.created_at DESC
    `).all();
    res.json(reviews);
  });

  app.post("/api/admin/reviews/:id/approve", authenticateToken, isAdmin, (req, res) => {
    try {
      db.prepare("UPDATE reviews SET status = 'approved' WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/admin/reviews/:id", authenticateToken, isAdmin, (req, res) => {
    try {
      db.prepare("DELETE FROM reviews WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/admin/products/:id", authenticateToken, isAdmin, (req, res) => {
    try {
      db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Blog
  app.get("/api/blog", (req, res) => {
    const posts = db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all();
    res.json(posts);
  });

  app.get("/api/blog/:slug", (req, res) => {
    const post = db.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(req.params.slug);
    if (post) res.json(post);
    else res.status(404).json({ error: "Post not found" });
  });

  app.post("/api/admin/blog", authenticateToken, isAdmin, (req, res) => {
    const { title, slug, content, image_url } = req.body;
    try {
      const result = db.prepare('INSERT INTO blog_posts (title, slug, content, image_url) VALUES (?, ?, ?, ?)').run(title, slug, content, image_url);
      res.json({ id: result.lastInsertRowid });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Orders
  app.post("/api/orders", (req, res) => {
    const { items, total_amount, payment_method, guest_info, transaction_id } = req.body;
    
    // Auth check or Guest handle
    let userId: number | null = null;
    let autoToken: string | null = null;
    let autoUser: any = null;

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        userId = decoded.id;
      } catch (e) {}
    }

    const transaction = db.transaction(() => {
      // If not logged in, handle guest
      if (!userId && guest_info) {
        const { email, name } = guest_info;
        let user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        
        if (!user) {
          // Auto create account
          const randomPassword = Math.random().toString(36).slice(-8);
          const hashedPassword = bcrypt.hashSync(randomPassword, 10);
          const result = db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)').run(email, hashedPassword, name);
          userId = result.lastInsertRowid as number;
          user = { id: userId, email, name, role: 'user' };
          
          // Generate token for auto-login
          autoToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
          );
          autoUser = user;
        } else {
          userId = user.id;
        }
      }

      if (!userId) throw new Error("User identification failed");

      const orderResult = db.prepare('INSERT INTO orders (user_id, total_amount, payment_method, transaction_id) VALUES (?, ?, ?, ?)').run(userId, total_amount, payment_method, transaction_id || null);
      const orderId = orderResult.lastInsertRowid;

      // Simulate sending email
      const notificationEmail = db.prepare('SELECT value FROM settings WHERE key = ?').get('notification_email');
      console.log(`[EMAIL NOTIFICATION] New order #${orderId} received! Sending details to: ${notificationEmail?.value || 'smmbuy2022@gmail.com'}`);

      const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, variation_id, quantity, price) VALUES (?, ?, ?, ?, ?)');
      for (const item of items) {
        insertItem.run(orderId, item.product_id, item.variation_id || null, item.quantity, item.price);
      }
      return { orderId, autoToken, autoUser };
    });

    try {
      const result = transaction();
      res.json({ id: result.orderId, token: result.autoToken, user: result.autoUser });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/orders/my", authenticateToken, (req, res) => {
    const userId = (req as any).user.id;
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    res.json(orders);
  });

  app.get("/api/admin/stats", authenticateToken, isAdmin, (req, res) => {
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    const totalRevenue = db.prepare("SELECT SUM(total_amount) as total FROM orders WHERE order_status = 'completed'").get().total || 0;
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "user"').get().count;
    const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status = 'processing'").get().count;
    const totalVisitors = db.prepare('SELECT COUNT(*) as count FROM page_views').get().count;
    const uniqueVisitors = db.prepare('SELECT COUNT(DISTINCT ip) as count FROM page_views').get().count;
    
    // Recent sales (last 7 days)
    const recentSales = db.prepare(`
      SELECT DATE(created_at) as date, SUM(total_amount) as amount 
      FROM orders 
      WHERE created_at > date('now', '-7 days') AND order_status = 'completed'
      GROUP BY DATE(created_at)
    `).all();

    // Fill in missing dates for the last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const found = recentSales.find((s: any) => s.date === dateStr);
      last7Days.push({
        date: dateStr,
        amount: found ? found.amount : 0
      });
    }

    res.json({
      totalOrders,
      totalRevenue,
      totalUsers,
      pendingOrders,
      totalVisitors,
      uniqueVisitors,
      recentSales: last7Days
    });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
