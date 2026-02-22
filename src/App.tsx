import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Menu, X, User, LogOut, ChevronRight, MessageCircle, Send, Search, Star, Package, Clock, ShieldCheck, CreditCard, ShoppingBag, Minus, Plus, Mail } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Types
import { User as UserType, Product, CartItem, Category } from './types';
import { APP_NAME, CONTACT_WHATSAPP, CONTACT_TELEGRAM, CONTACT_EMAIL, NAV_LINKS, FOOTER_LINKS } from './constants';

// Utility
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Header = ({ user, cartCount, onLogout, toggleCart }: { user: UserType | null, cartCount: number, onLogout: () => void, toggleCart: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-xl font-bold text-gray-900">{APP_NAME}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-indigo-600",
                  location.pathname === link.path ? "text-indigo-600" : "text-gray-600"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button onClick={toggleCart} className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={user.role === 'admin' ? "/admin" : "/dashboard"} className="text-gray-600 hover:text-indigo-600 transition-colors">
                  <User className="w-6 h-6" />
                </Link>
                <button onClick={onLogout} className="text-gray-600 hover:text-red-600 transition-colors">
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:block px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                Login
              </Link>
            )}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-indigo-600 hover:bg-gray-50 rounded-md"
                >
                  Login / Signup
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-xl font-bold text-white">{APP_NAME}</span>
          </Link>
          <p className="text-sm text-gray-400">
            Premium digital services and account marketplace. Grow your business and build credibility with our authentic solutions.
          </p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map(link => (
              <li key={link.path}><Link to={link.path} className="hover:text-indigo-400 transition-colors">{link.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            {FOOTER_LINKS.map(link => (
              <li key={link.path}><Link to={link.path} className="hover:text-indigo-400 transition-colors">{link.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <div className="space-y-4">
            <a href={`https://wa.me/${CONTACT_WHATSAPP.replace(/\D/g, '')}`} className="flex items-center space-x-2 text-sm hover:text-indigo-400 transition-colors">
              <MessageCircle className="w-5 h-5 text-green-500" />
              <span>WhatsApp: {CONTACT_WHATSAPP}</span>
            </a>
            <a href={`https://t.me/${CONTACT_TELEGRAM}`} className="flex items-center space-x-2 text-sm hover:text-indigo-400 transition-colors">
              <Send className="w-5 h-5 text-blue-400" />
              <span>Telegram: @{CONTACT_TELEGRAM}</span>
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center space-x-2 text-sm hover:text-indigo-400 transition-colors">
              <Mail className="w-5 h-5 text-indigo-400" />
              <span>Email: {CONTACT_EMAIL}</span>
            </a>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </div>
    </div>
  </footer>
);

// --- Pages ---
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import StaticPage from './pages/StaticPage';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  const [user, setUser] = useState<UserType | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleLogin = (userData: UserType, token: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const addToCart = (product: Product, variation?: any) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.product.id === product.id && 
        (!variation || item.variation?.id === variation.id)
      );
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id && 
          (!variation || item.variation?.id === variation.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, variation, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number, variationId?: number) => {
    setCart(prev => prev.filter(item => 
      !(item.product.id === productId && (!variationId || item.variation?.id === variationId))
    ));
  };

  const updateQuantity = (productId: number, variationId: number | undefined, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && (!variationId || item.variation?.id === variationId)) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => {
    const price = item.variation ? item.variation.price : item.product.base_price;
    return acc + (price * item.quantity);
  }, 0);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header user={user} cartCount={cart.length} onLogout={handleLogout} toggleCart={() => setIsCartOpen(true)} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/shop" element={<Shop addToCart={addToCart} />} />
            <Route path="/product/:slug" element={<ProductDetail addToCart={addToCart} />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostDetail />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/admin/*" element={<Admin user={user} />} />
            
            {/* Specific Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Static Pages */}
            <Route path="/privacy" element={<StaticPage type="privacy" />} />
            <Route path="/return-policy" element={<StaticPage type="returns" />} />
            <Route path="/terms" element={<StaticPage type="terms" />} />
            <Route path="/refund" element={<StaticPage type="refund" />} />
          </Routes>
        </main>

        <Footer />

        {/* Cart Drawer */}
        <AnimatePresence>
          {isCartOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCartOpen(false)}
                className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
              >
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-lg font-bold flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Your Cart
                  </h2>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                      <p>Your cart is empty</p>
                      <Link to="/shop" onClick={() => setIsCartOpen(false)} className="mt-4 text-indigo-600 font-medium">Start Shopping</Link>
                    </div>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={`${item.product.id}-${item.variation?.id || 'base'}`} className="flex space-x-4 border-b pb-4">
                        <img src={item.product.image_url || 'https://picsum.photos/200'} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-grow">
                          <h3 className="text-sm font-bold text-gray-900">{item.product.name}</h3>
                          {item.variation && <p className="text-xs text-gray-500">{item.variation.name}</p>}
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center border rounded-lg">
                              <button onClick={() => updateQuantity(item.product.id, item.variation?.id, -1)} className="px-2 py-1 hover:bg-gray-50">-</button>
                              <span className="px-3 text-sm">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.product.id, item.variation?.id, 1)} className="px-2 py-1 hover:bg-gray-50">+</button>
                            </div>
                            <span className="text-sm font-bold text-indigo-600">
                              ${((item.variation ? item.variation.price : item.product.base_price) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.product.id, item.variation?.id)} className="text-gray-400 hover:text-red-500">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-4 border-t bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">Total</span>
                      <span className="text-xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                      className="block w-full py-3 bg-indigo-600 text-white text-center font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                    >
                      Checkout Now
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Checkout Modal */}
        <Checkout 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)}
          cart={cart}
          total={cartTotal}
          user={user}
          onLogin={handleLogin}
          clearCart={() => setCart([])}
        />
      </div>
    </Router>
  );
}
