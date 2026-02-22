import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Filter, Search, ChevronRight } from 'lucide-react';
import { Product, Category } from '../types';
import { CATEGORIES } from '../constants';

export default function Shop({ addToCart }: { addToCart: (p: Product) => void }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const activeCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    setLoading(true);
    const url = activeCategory === 'all' ? '/api/products' : `/api/products?category=${activeCategory}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, [activeCategory]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.short_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Shop Services</h1>
            <p className="text-gray-600">Find the perfect digital solution for your needs</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-indigo-600" />
                Categories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSearchParams({})}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    activeCategory === 'all' ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  All Services
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => setSearchParams({ category: cat.slug })}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      activeCategory === cat.slug ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-gray-100" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No services found</h3>
                <p className="text-gray-500">Try adjusting your search or category filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} addToCart={addToCart} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-using ProductCard from Home.tsx logic (I'll move it to a shared component if needed, but for now I'll just define it or import if I had a components folder)
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ProductCard = ({ product, addToCart }: { product: Product, addToCart: (p: Product) => void }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
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
