import { useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Send, Mail, MapPin, Phone, CheckCircle, AlertCircle, Loader2, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import { CONTACT_WHATSAPP, CONTACT_TELEGRAM, CONTACT_EMAIL } from '../constants';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <SEO 
        title="Contact Us" 
        description="Get in touch with GrowtifyPro support. We are available 24/7 via WhatsApp, Telegram, and Email."
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
          >
            Get in <span className="text-indigo-600">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Have questions? Our support team is available 24/7 to help you with your orders and custom requirements.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Direct Support</h2>
              
              <div className="space-y-6">
                <a 
                  href={`https://wa.me/${CONTACT_WHATSAPP.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-green-50 rounded-2xl border border-green-100 group hover:bg-green-100 transition-all"
                >
                  <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-green-200">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-green-600 uppercase tracking-wider">WhatsApp</span>
                    <span className="block font-bold text-gray-900">{CONTACT_WHATSAPP}</span>
                  </div>
                </a>

                <a 
                  href={`https://t.me/${CONTACT_TELEGRAM}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-blue-50 rounded-2xl border border-blue-100 group hover:bg-blue-100 transition-all"
                >
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-200">
                    <Send className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-blue-600 uppercase tracking-wider">Telegram</span>
                    <span className="block font-bold text-gray-900">@{CONTACT_TELEGRAM}</span>
                  </div>
                </a>

                <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Email</span>
                    <span className="block font-bold text-gray-900">{CONTACT_EMAIL}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white">
              <h3 className="text-xl font-bold mb-4">Business Hours</h3>
              <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                Our automated delivery system works 24/7. Support agents are available around the clock to assist you.
              </p>
              <div className="flex items-center space-x-2 text-sm font-bold">
                <Clock className="w-4 h-4" />
                <span>Available 24/7/365</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h2>
              
              {status === 'success' ? (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-8">Thank you for reaching out. We will get back to you shortly.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                    <input 
                      type="text" 
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                    <textarea 
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                      placeholder="Describe your inquiry in detail..."
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Something went wrong. Please try again later.
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
