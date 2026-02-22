import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutDashboard, Package, FileText, Plus, List, LogOut, ChevronRight, Image as ImageIcon, DollarSign, Tag, HelpCircle, User as UserIcon, X, Mail, Star, CreditCard } from 'lucide-react';
import { User, Category, Product } from '../types';
import { CATEGORIES } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AdminSidebar = () => {
  const location = useLocation();
  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col h-full">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
      </div>
      <nav className="flex-grow p-4 space-y-1">
        {[
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
          { icon: CreditCard, label: 'Orders', path: '/admin/orders' },
          { icon: UserIcon, label: 'Customers', path: '/admin/users' },
          { icon: Package, label: 'Products', path: '/admin/products' },
          { icon: Plus, label: 'Add Product', path: '/admin/products/add' },
          { icon: FileText, label: 'Blog Posts', path: '/admin/blog' },
          { icon: Plus, label: 'Add Post', path: '/admin/blog/add' },
          { icon: Star, label: 'Reviews', path: '/admin/reviews' },
          { icon: Mail, label: 'Messages', path: '/admin/messages' },
          { icon: Tag, label: 'Settings', path: '/admin/settings' },
          { icon: UserIcon, label: 'Profile', path: '/admin/profile' },
        ].map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
              location.pathname === item.path ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <Link to="/" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-medium">
          <LogOut className="w-5 h-5" />
          <span>Back to Site</span>
        </Link>
      </div>
    </div>
  );
};

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [longDescription, setLongDescription] = useState('');
  const [faq, setFaq] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(setCategories);
  }, []);

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean'],
      [{ 'align': [] }]
    ],
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Handle variations
    const isVariable = formData.get('is_variable') === 'on';
    let variations = [];
    if (isVariable) {
      const varNames = formData.getAll('var_name');
      const varPrices = formData.getAll('var_price');
      variations = varNames.map((name, i) => ({ name, price: parseFloat(varPrices[i] as string) }));
    }

    const payload = {
      ...data,
      base_price: parseFloat(data.base_price as string),
      is_variable: isVariable,
      long_description: longDescription,
      faq: faq,
      variations
    };

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        navigate('/admin/products');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [varCount, setVarCount] = useState(0);

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
            <input name="name" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 1000 Instagram Followers" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Slug (URL)</label>
            <input name="slug" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 1000-instagram-followers" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
            <select name="category_id" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none">
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
            <input name="image_url" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Base Price ($)</label>
            <input name="base_price" type="number" step="0.01" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0.00" />
          </div>
          <div className="flex items-center space-x-3 pt-8">
            <input type="checkbox" name="is_variable" id="is_variable" className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <label htmlFor="is_variable" className="text-sm font-bold text-gray-700">Variable Product?</label>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <label className="block text-sm font-bold text-gray-700 mb-2">Short Description</label>
          <textarea name="short_description" required rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Briefly describe the service..." />
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <label className="block text-sm font-bold text-gray-700 mb-4">Long Description (WordPress Style Editor)</label>
          <div className="h-80 mb-12">
            <ReactQuill 
              theme="snow" 
              value={longDescription} 
              onChange={setLongDescription} 
              modules={quillModules}
              className="h-full"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <label className="block text-sm font-bold text-gray-700 mb-4">FAQ (WordPress Style Editor)</label>
          <div className="h-60 mb-12">
            <ReactQuill 
              theme="snow" 
              value={faq} 
              onChange={setFaq} 
              modules={quillModules}
              className="h-full"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Product Variants (Classic Editor)</h3>
            <button type="button" onClick={() => setVarCount(v => v + 1)} className="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-lg hover:bg-indigo-100 transition-all flex items-center">
              <Plus className="w-4 h-4 mr-2" /> Add Variant
            </button>
          </div>
          <div className="space-y-4">
            {[...Array(varCount)].map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 items-center">
                <div className="col-span-7">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Variant Name</label>
                  <input name="var_name" placeholder="e.g. 5000 Followers" className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm" />
                </div>
                <div className="col-span-4">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Price ($)</label>
                  <input name="var_price" type="number" step="0.01" placeholder="0.00" className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm" />
                </div>
                <div className="col-span-1 pt-4">
                  <button type="button" onClick={() => setVarCount(v => v - 1)} className="text-red-400 hover:text-red-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

const AddBlog = () => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean'],
      [{ 'align': [] }]
    ],
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const payload = { ...data, content };

    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        navigate('/admin/blog');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Add New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Post Title</label>
            <input name="title" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. How to Grow Your Instagram in 2026" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Slug (URL)</label>
            <input name="slug" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. grow-instagram-2026" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Featured Image URL</label>
            <input name="image_url" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-4">Content (WordPress Style Editor)</label>
            <div className="h-96 mb-12">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                modules={quillModules}
                className="h-full"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
};

const SettingsPage = () => {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(setSettings);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMessage('Settings updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Site Settings</h1>
      {message && <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-xl font-bold">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-4">Webmaster Verification</h3>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Google Search Console Tag</label>
            <input name="google_verification" defaultValue={settings.google_verification} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. google-site-verification=..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Bing Webmaster Tag</label>
            <input name="bing_verification" defaultValue={settings.bing_verification} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. msvalidate.01=..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Yandex Webmaster Tag</label>
            <input name="yandex_verification" defaultValue={settings.yandex_verification} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. yandex-verification=..." />
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 border-b pb-4 mt-12">Payment Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">BTC Wallet Address</label>
              <input name="crypto_btc_address" defaultValue={settings.crypto_btc_address} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ETH Wallet Address</label>
              <input name="crypto_eth_address" defaultValue={settings.crypto_eth_address} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">USDT (TRC20) Address</label>
              <input name="crypto_usdt_trc20_address" defaultValue={settings.crypto_usdt_trc20_address} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">USDT (ERC20) Address</label>
              <input name="crypto_usdt_erc20_address" defaultValue={settings.crypto_usdt_erc20_address} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Skrill Email</label>
              <input name="skrill_email" defaultValue={settings.skrill_email} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 border-b pb-4 mt-12">Notifications</h3>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Notification Email (Orders & Support)</label>
            <input name="notification_email" defaultValue={settings.notification_email} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="smmbuy2022@gmail.com" />
          </div>

          <div className="pt-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-4 mb-4">Sitemap</h3>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-600">Your dynamic sitemap is available at:</span>
              <a href="/sitemap.xml" target="_blank" className="text-indigo-600 font-bold hover:underline">/sitemap.xml</a>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

const ProfilePage = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Profile</h1>
      {message && <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-xl font-bold">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input name="name" defaultValue={user.name} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Admin Email</label>
            <input name="email" defaultValue={user.email} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">New Password (leave blank to keep current)</label>
            <input name="password" type="password" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(setProducts);
  }, []);

  const deleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (res.ok) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link to="/admin/products/add" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all">
          Add New Product
        </Link>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img src={p.image_url || 'https://picsum.photos/50'} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="font-bold text-gray-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.category_name}</td>
                <td className="px-6 py-4 text-sm font-bold text-indigo-600">${p.base_price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <button onClick={() => deleteProduct(p.id)} className="text-red-600 hover:text-red-800 font-bold text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BlogList = () => {
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/blog').then(res => res.json()).then(setPosts);
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
        <Link to="/admin/blog/add" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all">
          Add New Post
        </Link>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{p.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(p.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button className="text-indigo-600 hover:text-indigo-800 font-bold text-sm">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReviewManagement = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/admin/reviews', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()).then(setReviews);
  }, []);

  const approveReview = async (id: number) => {
    const res = await fetch(`/api/admin/reviews/${id}/approve`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (res.ok) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    }
  };

  const deleteReview = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (res.ok) {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Review Management</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Comment</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reviews.map(r => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-gray-900">{r.product_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{r.user_name}</td>
                <td className="px-6 py-4 text-sm text-yellow-500">{'★'.repeat(r.rating)}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{r.comment}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    r.status === 'approved' ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
                  )}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  {r.status === 'pending' && (
                    <button onClick={() => approveReview(r.id)} className="text-green-600 hover:text-green-800 font-bold text-sm">Approve</button>
                  )}
                  <button onClick={() => deleteReview(r.id)} className="text-red-600 hover:text-red-800 font-bold text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrderManagement = () => {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/admin/orders', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()).then(setOrders);
  }, []);

  const updateOrderStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/orders/${id}/status`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status })
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, order_status: status } : o));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Order Management</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Order</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-gray-900">#{o.id}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-900">{o.user_name || 'Guest'}</div>
                  <div className="text-xs text-gray-500">{o.user_email}</div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-indigo-600">${o.total_amount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-gray-500 uppercase">{o.payment_method}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{o.transaction_id || 'N/A'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    o.order_status === 'completed' ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
                  )}>
                    {o.order_status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={o.order_status}
                    onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                    className="text-xs border rounded p-1"
                  >
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ContactMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/admin/messages', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()).then(setMessages);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Contact Messages</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Sender</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Message</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {messages.map(m => (
              <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{m.name}</div>
                  <div className="text-xs text-gray-500">{m.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-medium">{m.subject}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{m.message}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{new Date(m.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading customers...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No customers found.</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{u.name || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                    u.role === 'admin' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {new Date(u.created_at || '').toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DashboardHome = () => {
  const [supabaseStatus, setSupabaseStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/supabase-test')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'connected') {
          setSupabaseStatus('connected');
        } else {
          setSupabaseStatus('error');
          setError(data.message);
        }
      })
      .catch(err => {
        setSupabaseStatus('error');
        setError(err.message);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, Admin</h1>
      <p className="text-gray-500 mb-8">Manage your shop and blog from here.</p>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-md">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${supabaseStatus === 'connected' ? 'bg-green-500' : supabaseStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`} />
          Supabase Status
        </h3>
        {supabaseStatus === 'loading' && <p className="text-gray-500 text-sm">Checking connection...</p>}
        {supabaseStatus === 'connected' && <p className="text-green-600 text-sm font-medium">Successfully connected to Supabase!</p>}
        {supabaseStatus === 'error' && (
          <div>
            <p className="text-red-600 text-sm font-medium">Connection failed</p>
            <p className="text-xs text-gray-400 mt-1">{error}</p>
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
              <p className="text-[10px] text-red-800 leading-relaxed">
                Make sure to set <code className="font-bold">SUPABASE_URL</code> and <code className="font-bold">SUPABASE_ANON_KEY</code> in your environment variables.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Admin({ user }: { user: User | null }) {
  if (!user || user.role !== 'admin') return <Navigate to="/login" />;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      <div className="flex-grow overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/add" element={<AddBlog />} />
          <Route path="/reviews" element={<ReviewManagement />} />
          <Route path="/messages" element={<ContactMessages />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
        </Routes>
      </div>
    </div>
  );
}
