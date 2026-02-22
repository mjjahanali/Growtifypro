import { motion } from 'motion/react';
import { ShieldCheck, Zap, Clock, Star, Users, Target, Award } from 'lucide-react';
import SEO from '../components/SEO';

export default function About() {
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <SEO 
        title="About Us" 
        description="Learn more about GrowtifyPro, your trusted partner for premium digital services and business growth."
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6"
          >
            Empowering Your <span className="text-indigo-600">Digital Growth</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            GrowtifyPro is a leading provider of premium digital services, dedicated to helping businesses, influencers, and agencies build credibility and expand their online presence.
          </motion.p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100"
          >
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to provide high-quality, authentic digital solutions that deliver real results. We believe that every business deserves a strong online presence, and we're here to make that happen through secure, fast, and reliable services.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100"
          >
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              We envision a digital landscape where growth is accessible to everyone. By continuously innovating and maintaining the highest standards of service, we aim to be the most trusted name in the digital service industry globally.
            </p>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="bg-indigo-600 rounded-[3rem] p-12 mb-24 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-extrabold mb-2">10k+</div>
              <div className="text-indigo-100 text-sm uppercase tracking-wider font-bold">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold mb-2">50k+</div>
              <div className="text-indigo-100 text-sm uppercase tracking-wider font-bold">Orders Completed</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold mb-2">24/7</div>
              <div className="text-indigo-100 text-sm uppercase tracking-wider font-bold">Support Available</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold mb-2">100%</div>
              <div className="text-indigo-100 text-sm uppercase tracking-wider font-bold">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose GrowtifyPro?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Verified & Secure", desc: "All our accounts and services are thoroughly verified to ensure maximum security and longevity." },
              { icon: Zap, title: "Instant Delivery", desc: "We understand the value of time. Most of our services are delivered instantly or within a few hours." },
              { icon: Users, title: "Expert Support", desc: "Our dedicated support team is available around the clock to assist you with any queries or custom needs." }
            ].map((item, i) => (
              <div key={i} className="text-center p-8">
                <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
