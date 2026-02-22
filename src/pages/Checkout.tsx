import { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, ShieldCheck, Lock, ChevronRight, CheckCircle, AlertCircle, Bitcoin, X, User, Mail, Wallet } from 'lucide-react';
import { CartItem, User as UserType } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Checkout({ 
  isOpen, 
  onClose, 
  cart, 
  total, 
  user, 
  onLogin,
  clearCart 
}: { 
  isOpen: boolean,
  onClose: () => void,
  cart: CartItem[], 
  total: number, 
  user: UserType | null, 
  onLogin: (user: UserType, token: string) => void,
  clearCart: () => void 
}) {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card' | 'skrill'>('crypto');
  const [loading, setLoading] = useState(false);
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '' });
  const [settings, setSettings] = useState<any>({});
  const navigate = useNavigate();

  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/settings').then(res => res.json()).then(setSettings);
      setStep('details');
      setTransactionId('');
    }
  }, [isOpen]);

  if (!isOpen && step !== 'success') return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePlaceOrder = async () => {
    if ((paymentMethod === 'crypto' || paymentMethod === 'skrill' || paymentMethod === 'card') && !transactionId) {
      alert('Please enter your Transaction ID or Payment Reference.');
      return;
    }

    setLoading(true);
    try {
      const items = cart.map(item => ({
        product_id: item.product.id,
        variation_id: item.variation?.id,
        quantity: item.quantity,
        price: item.variation ? item.variation.price : item.product.base_price
      }));

      const payload: any = { 
        items, 
        total_amount: total, 
        payment_method: paymentMethod,
        transaction_id: transactionId
      };

      if (!user) {
        payload.guest_info = guestInfo;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(user ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token && data.user) {
          onLogin(data.user, data.token);
        }
        setStep('success');
        clearCart();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row"
          >
            {/* Left Side: Form */}
            <div className="flex-grow p-8 md:p-12 overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">Checkout</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {step === 'success' ? (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Order Placed!</h1>
                  <p className="text-gray-600 mb-10">Thank you for your purchase. Your order is being processed. An account has been created for you with your email.</p>
                  <button 
                    onClick={() => { onClose(); navigate('/dashboard'); }}
                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                  >
                    View Order History
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Progress */}
                  <div className="flex items-center space-x-4">
                    <div className={cn("flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm", step === 'details' ? "bg-indigo-600 text-white" : "bg-green-100 text-green-600")}>
                      {step === 'details' ? '1' : <CheckCircle className="w-5 h-5" />}
                    </div>
                    <div className="h-px bg-gray-200 flex-grow" />
                    <div className={cn("flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm", step === 'payment' ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500")}>
                      2
                    </div>
                  </div>

                  {step === 'details' ? (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-900">Customer Details</h3>
                      {user ? (
                        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                          <p className="text-xs text-indigo-400 uppercase font-bold tracking-wider mb-1">Logged in as</p>
                          <p className="font-bold text-indigo-900">{user.name} ({user.email})</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                              required
                              value={guestInfo.name}
                              onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                              placeholder="Full Name" 
                            />
                          </div>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                              required
                              type="email"
                              value={guestInfo.email}
                              onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                              placeholder="Email Address" 
                            />
                          </div>
                          <p className="text-xs text-gray-400 italic">* An account will be automatically created for you.</p>
                        </div>
                      )}
                      <button
                        onClick={() => setStep('payment')}
                        disabled={!user && (!guestInfo.name || !guestInfo.email)}
                        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center disabled:opacity-50"
                      >
                        Continue to Payment
                        <ChevronRight className="w-5 h-5 ml-1" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-900">Payment Method</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                          onClick={() => setPaymentMethod('crypto')}
                          className={cn(
                            "flex flex-col items-center justify-center p-4 border-2 rounded-2xl transition-all",
                            paymentMethod === 'crypto' ? "border-indigo-600 bg-indigo-50" : "border-gray-100 hover:border-gray-200"
                          )}
                        >
                          <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-2">
                            <Bitcoin className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-gray-900 text-xs">Crypto</h4>
                        </button>

                        <button
                          onClick={() => setPaymentMethod('skrill')}
                          className={cn(
                            "flex flex-col items-center justify-center p-4 border-2 rounded-2xl transition-all",
                            paymentMethod === 'skrill' ? "border-indigo-600 bg-indigo-50" : "border-gray-100 hover:border-gray-200"
                          )}
                        >
                          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-2">
                            <Wallet className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-gray-900 text-xs">Skrill</h4>
                        </button>

                        <button
                          onClick={() => setPaymentMethod('card')}
                          className={cn(
                            "flex flex-col items-center justify-center p-4 border-2 rounded-2xl transition-all",
                            paymentMethod === 'card' ? "border-indigo-600 bg-indigo-50" : "border-gray-100 hover:border-gray-200"
                          )}
                        >
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-2">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-gray-900 text-xs">Manual Card</h4>
                        </button>
                      </div>

                      {paymentMethod === 'crypto' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-3">
                            {[
                              { label: 'BTC (Bitcoin)', value: settings.crypto_btc_address, key: 'btc' },
                              { label: 'ETH (Ethereum)', value: settings.crypto_eth_address, key: 'eth' },
                              { label: 'USDT (TRC20)', value: settings.crypto_usdt_trc20_address, key: 'usdt_trc20' },
                              { label: 'USDT (ERC20)', value: settings.crypto_usdt_erc20_address, key: 'usdt_erc20' }
                            ].map((coin) => coin.value && (
                              <div key={coin.key} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{coin.label}</span>
                                  <button 
                                    onClick={() => copyToClipboard(coin.value, coin.key)}
                                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider"
                                  >
                                    {copied === coin.key ? 'Copied!' : 'Copy Address'}
                                  </button>
                                </div>
                                <p className="font-mono text-xs text-gray-900 break-all bg-white p-2 rounded-lg border border-gray-200">{coin.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'skrill' && (
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Skrill Email</span>
                            <button 
                              onClick={() => copyToClipboard(settings.skrill_email, 'skrill')}
                              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider"
                            >
                              {copied === 'skrill' ? 'Copied!' : 'Copy Email'}
                            </button>
                          </div>
                          <p className="font-mono text-sm text-gray-900 bg-white p-3 rounded-xl border border-gray-200">{settings.skrill_email}</p>
                        </div>
                      )}

                      {paymentMethod === 'card' && (
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                          <h4 className="font-bold text-gray-900 text-sm">Manual Card Payment Process:</h4>
                          <ol className="text-xs text-gray-600 space-y-2 list-decimal pl-4">
                            <li>Contact our support via WhatsApp or Telegram.</li>
                            <li>Request a secure payment link for your order total.</li>
                            <li>Complete the payment using the provided link.</li>
                            <li>Enter the Transaction ID or Reference below.</li>
                          </ol>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Transaction ID / Reference</label>
                        <input 
                          required
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                          placeholder="Enter your payment proof ID" 
                        />
                        <p className="text-[10px] text-gray-400 italic">* Required for manual verification.</p>
                      </div>

                      <div className="flex space-x-4 pt-4">
                        <button onClick={() => setStep('details')} className="px-6 py-4 text-gray-500 font-bold hover:text-gray-700">Back</button>
                        <button
                          onClick={handlePlaceOrder}
                          disabled={loading}
                          className="flex-grow py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center disabled:opacity-50"
                        >
                          {loading ? 'Processing...' : 'Confirm Order'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Side: Summary */}
            <div className="w-full md:w-80 bg-gray-50 p-8 md:p-12 border-l border-gray-100 overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Summary</h3>
              <div className="space-y-4 mb-8">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-gray-600 max-w-[150px] truncate">{item.quantity}x {item.product.name}</span>
                    <span className="font-bold text-gray-900">${((item.variation ? item.variation.price : item.product.base_price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-indigo-600">${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-12 space-y-4">
                <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span>Privacy Protected</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
