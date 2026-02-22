import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Clock, Star, ChevronRight, MessageCircle, Send } from 'lucide-react';
import { Product } from '../types';
import { CONTACT_WHATSAPP, CONTACT_TELEGRAM } from '../constants';

const Hero = () => (
  <section className="relative py-20 overflow-hidden bg-white">
    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px]" />
    </div>
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-6 tracking-wider uppercase"
        >
          <Zap className="w-3 h-3 mr-1" />
          Fast Delivery & 24/7 Support
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6"
        >
          Grow Your Business with <span className="text-indigo-600">Premium</span> Digital Services
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 mb-10 leading-relaxed"
        >
          GrowtifyPro provides verified accounts, SMM promotion, and business solutions to build your brand credibility and increase online presence instantly.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <Link to="/shop" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center">
            Shop Services
            <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
          <a href={`https://wa.me/${CONTACT_WHATSAPP.replace(/\D/g, '')}`} className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center">
            Contact Support
          </a>
        </motion.div>
      </div>
    </div>
  </section>
);

const Features = () => (
  <section className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: ShieldCheck, title: "Secure Payments", desc: "We support multiple secure payment methods including Crypto for your privacy.", color: "text-green-600", bg: "bg-green-50" },
          { icon: Clock, title: "Fast Delivery", desc: "Most of our services are delivered within minutes or a few hours of ordering.", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Star, title: "100% Authentic", desc: "We provide high-quality, verified accounts and authentic social media promotion.", color: "text-yellow-600", bg: "bg-yellow-50" }
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className={`w-12 h-12 ${f.bg} ${f.color} rounded-xl flex items-center justify-center mb-6`}>
              <f.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
            <p className="text-gray-600 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ProductCard = ({ product, addToCart }: { product: Product, addToCart: (p: Product) => void }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group"
  >
    <Link to={`/product/${product.slug}`} className="block relative aspect-video overflow-hidden">
      <img
        src={product.image_url || `https://picsum.photos/seed/${product.id}/600/400`}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute top-3 left-3">
        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-indigo-600 rounded uppercase tracking-wider">
          {product.category_name}
        </span>
      </div>
    </Link>
    <div className="p-5">
      <Link to={`/product/${product.slug}`}>
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
      </Link>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.short_description}</p>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-400 block">Starting from</span>
          <span className="text-xl font-bold text-indigo-600">${product.base_price.toFixed(2)}</span>
        </div>
        <button
          onClick={() => addToCart(product)}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </motion.div>
);

import SEO from '../components/SEO';

export default function Home({ addToCart }: { addToCart: (p: Product) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.slice(0, 8)); // Show first 8 products
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <SEO 
        title="Grow Your Business with Premium Digital Services" 
        description="GrowtifyPro provides verified accounts, SMM promotion, and business solutions to build your brand credibility."
      />
      <Hero />
      <Features />
      
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Services</h2>
              <p className="text-gray-600">Explore our most popular digital solutions</p>
            </div>
            <Link to="/shop" className="text-indigo-600 font-bold flex items-center hover:underline">
              View All Shop
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-gray-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} addToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Grow</h2>
            <p className="text-indigo-100 max-w-2xl mx-auto">We offer a wide range of services tailored for e-commerce, startups, and digital agencies.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "SMM Promotion", "SSM Accounts", "Business Account", "E-mail Accounts",
              "Number Accounts", "Review Services", "Bank Account", "Crypto Account"
            ].map((cat, i) => (
              <Link
                key={i}
                to={`/shop?category=${cat.toLowerCase().replace(/\s+/g, '-')}`}
                className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all text-center font-bold"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-indigo-100 border border-indigo-50">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Need a Custom Solution?</h2>
            <p className="text-gray-600 mb-10">Our team is available 24/7 to help you with any specific requirements or bulk orders.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a href={`https://wa.me/${CONTACT_WHATSAPP.replace(/\D/g, '')}`} className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all">
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp Support</span>
              </a>
              <a href={`https://t.me/${CONTACT_TELEGRAM}`} className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all">
                <Send className="w-5 h-5" />
                <span>Telegram Channel</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
