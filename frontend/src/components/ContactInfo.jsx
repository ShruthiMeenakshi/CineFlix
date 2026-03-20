import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiMapPin, FiPhone, FiMail, FiClock, 
  FiTwitter, FiFacebook, FiInstagram, FiYoutube,
  FiMessageCircle, FiHeadphones, FiGlobe
} from 'react-icons/fi';

const ContactInfo = () => {
  const contactMethods = [
    { icon: FiMapPin, title: 'Visit Us', details: ['CineFlix Entertainment', '123 Cinema Boulevard', 'Los Angeles, CA 90210', 'United States'], color: 'from-blue-500 to-cyan-500' },
    { icon: FiPhone, title: 'Call Us', details: ['+1 (555) 123-4567', '+1 (555) 987-6543', 'Mon-Fri: 9AM - 6PM PST'], color: 'from-green-500 to-emerald-500' },
    { icon: FiMail, title: 'Email Us', details: ['support@cineflix.com', 'press@cineflix.com', 'partners@cineflix.com'], color: 'from-red-500 to-pink-500' },
    { icon: FiClock, title: 'Support Hours', details: ['Monday - Friday: 24/7', 'Saturday: 9AM - 9PM PST', 'Sunday: 10AM - 6PM PST'], color: 'from-purple-500 to-pink-500' }
  ];

  const socialLinks = [
    { icon: FiTwitter, label: 'Twitter', href: '#', color: 'hover:text-blue-400' },
    { icon: FiFacebook, label: 'Facebook', href: '#', color: 'hover:text-blue-600' },
    { icon: FiInstagram, label: 'Instagram', href: '#', color: 'hover:text-pink-600' },
    { icon: FiYoutube, label: 'YouTube', href: '#', color: 'hover:text-red-600' }
  ];

  const quickResponses = [
    { label: 'Technical Support', response: '< 2 hours' },
    { label: 'Billing Questions', response: '< 4 hours' },
    { label: 'General Inquiries', response: '< 24 hours' },
    { label: 'Partnership Proposals', response: '< 48 hours' }
  ];

  return (
    <div className="space-y-6">
      {contactMethods.map((method, index) => (
        <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="glass-card p-6 group hover:border-netflix-red/30 transition-colors">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${method.color} bg-opacity-10`}>
              <method.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">{method.title}</h3>
              {method.details.map((detail, i) => (<p key={i} className="text-gray-400 text-sm">{detail}</p>))}
            </div>
          </div>
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
        <h3 className="font-bold text-lg mb-4">Follow Us</h3>
        <div className="flex gap-4">
          {socialLinks.map((social, index) => (
            <motion.a key={index} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href={social.href} className={`p-3 bg-white/5 rounded-full ${social.color} transition-colors`}>
              <social.icon className="w-5 h-5" />
            </motion.a>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4"><FiHeadphones className="text-netflix-red" /><h3 className="font-bold text-lg">Response Times</h3></div>
        <div className="space-y-3">{quickResponses.map((item, index) => (<div key={index} className="flex justify-between items-center"><span className="text-sm text-gray-400">{item.label}</span><span className="text-sm font-medium text-gradient">{item.response}</span></div>))}</div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6 bg-gradient-to-br from-netflix-red/20 to-accent-purple/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-netflix-red/20 rounded-full"><FiMessageCircle className="w-6 h-6 text-netflix-red" /></div>
          <div className="flex-1">
            <h3 className="font-bold mb-1">Need instant help?</h3>
            <p className="text-sm text-gray-400 mb-3">Our support team is online</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-4 py-2 bg-netflix-red text-white rounded-lg text-sm font-medium hover:bg-netflix-darkred transition-colors">Start Live Chat</motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card p-4">
        <div className="flex items-center gap-2 text-sm text-gray-400"><FiGlobe className="text-netflix-red" /><span>Support available in:</span></div>
        <div className="flex flex-wrap gap-2 mt-2">{['English','Spanish','French','German','Japanese'].map((lang, index) => (<span key={index} className="px-2 py-1 bg-white/5 rounded-full text-xs">{lang}</span>))}</div>
      </motion.div>
    </div>
  );
};

export default ContactInfo;
