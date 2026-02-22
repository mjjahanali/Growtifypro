import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, MessageCircle, Send, ShoppingCart, ChevronRight, ShieldCheck, Clock, Zap, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Product, Variation, Review } from '../types';
import { CONTACT_WHATSAPP, CONTACT_TELEGRAM } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ProductDetail({ addToCart }: { addToCart: (p: Product, v?: Variation) => void }) {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'faq' | 'reviews'>('description');

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        if (data.variations && data.variations.length > 0) {
          setSelectedVariation(data.variations[0]);
        }
        
        // Fetch related products from same category
        if (data.category_id) {
          fetch(`/api/products?category=${data.category_name.toLowerCase().replace(/\s+/g, '-')}`)
            .then(res => res.json())
            .then(related => {
              setRelatedProducts(related.filter((p: Product) => p.id !== data.id).slice(0, 4));
            });
        }
        
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  const currentPrice = selectedVariation ? selectedVariation.price : product.base_price;

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/shop" className="hover:text-indigo-600">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100"
          >
            <img
              src={product.image_url || `https://picsum.photos/seed/${product.id}/800/600`}
              alt={product.name}
              className="w-full aspect-square object-cover rounded-2xl"
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-6">
              <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded uppercase tracking-wider mb-4 inline-block">
                {product.category_name}
              </span>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-sm text-gray-500">(24 Reviews)</span>
              </div>
              <p className="text-gray-600 leading-relaxed">{product.short_description}</p>
            </div>

            {/* Variations */}
            {product.is_variable && product.variations && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Select Option</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.variations.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariation(v)}
                      className={cn(
                        "p-4 border-2 rounded-xl text-left transition-all",
                        selectedVariation?.id === v.id 
                          ? "border-indigo-600 bg-indigo-50" 
                          : "border-gray-100 hover:border-gray-200"
                      )}
                    >
                      <span className="block text-sm font-bold text-gray-900">{v.name}</span>
                      <span className="block text-lg font-extrabold text-indigo-600">${v.price.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-sm text-gray-500 block">Total Price</span>
                  <span className="text-3xl font-extrabold text-gray-900">${currentPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => addToCart(product, selectedVariation || undefined)}
                  className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <a href={`https://wa.me/${CONTACT_WHATSAPP.replace(/\D/g, '')}`} className="flex items-center justify-center space-x-2 p-3 bg-green-50 text-green-600 font-bold rounded-xl hover:bg-green-100 transition-all">
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </a>
                <a href={`https://t.me/${CONTACT_TELEGRAM}`} className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-all">
                  <Send className="w-5 h-5" />
                  <span>Telegram</span>
                </a>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-t pt-8">
              <div className="text-center">
                <ShieldCheck className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <span className="text-[10px] font-bold text-gray-500 uppercase">Secure Payment</span>
              </div>
              <div className="text-center">
                <Clock className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <span className="text-[10px] font-bold text-gray-500 uppercase">Fast Delivery</span>
              </div>
              <div className="text-center">
                <Zap className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <span className="text-[10px] font-bold text-gray-500 uppercase">24/7 Support</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-16">
          <div className="flex border-b">
            {[
              { id: 'description', label: 'Description' },
              { id: 'faq', label: 'FAQ' },
              { id: 'reviews', label: 'Reviews' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-8 py-4 text-sm font-bold transition-all border-b-2",
                  activeTab === tab.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose prose-indigo max-w-none">
                <ReactMarkdown>{product.long_description}</ReactMarkdown>
              </div>
            )}
            {activeTab === 'faq' && (
              <div className="space-y-6">
                {product.faq ? (
                  <div className="prose prose-indigo max-w-none">
                    <ReactMarkdown>{product.faq}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No FAQs available for this product.</p>
                )}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Review Form */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-10">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const payload = {
                      product_id: product.id,
                      user_name: formData.get('user_name'),
                      rating: parseInt(formData.get('rating') as string),
                      comment: formData.get('comment')
                    };
                    const res = await fetch('/api/reviews', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload)
                    });
                    if (res.ok) {
                      alert('Review submitted for approval!');
                      (e.target as HTMLFormElement).reset();
                    }
                  }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input name="user_name" required placeholder="Your Name" className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500" />
                      <select name="rating" required className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>
                    <textarea name="comment" required placeholder="Your Review" rows={3} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500" />
                    <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">Submit Review</button>
                  </form>
                </div>

                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map(review => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-900">{review.user_name}</span>
                        <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-yellow-400 mb-3">
                        {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Star className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} addToCart={addToCart} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
