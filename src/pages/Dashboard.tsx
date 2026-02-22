import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Package, Clock, CheckCircle, AlertCircle, ChevronRight, User as UserIcon, Mail } from 'lucide-react';
import { User, Order } from '../types';

export default function Dashboard({ user }: { user: User | null }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/orders/my', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => {
          setOrders(data);
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl">
                  {user.name[0]}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{user.name}</h2>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-600">
                  My Orders
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Account Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Order History</h1>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white h-24 rounded-2xl border border-gray-100" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
                <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                <Link to="/shop" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Order #{order.id}</h3>
                        <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-8">
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block uppercase tracking-wider font-bold">Total</span>
                        <span className="font-bold text-gray-900">${order.total_amount.toFixed(2)}</span>
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-400 block uppercase tracking-wider font-bold mb-1">Status</span>
                        <div className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center",
                          order.order_status === 'completed' ? "bg-green-50 text-green-600" : 
                          order.order_status === 'processing' ? "bg-blue-50 text-blue-600" : "bg-yellow-50 text-yellow-600"
                        )}>
                          {order.order_status === 'completed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                          {order.order_status}
                        </div>
                      </div>

                      <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
