import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiHelpCircle, FiSearch } from 'react-icons/fi';

const ContactFAQ = () => {
  const [openItems, setOpenItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Questions', icon: '📋' },
    { id: 'account', name: 'Account', icon: '👤' },
    { id: 'billing', name: 'Billing', icon: '💰' },
    { id: 'technical', name: 'Technical', icon: '🔧' },
    { id: 'features', name: 'Features', icon: '🎬' }
  ];

  const faqs = [
    { id: 1, category: 'account', question: 'How do I create an account?', answer: 'Creating an account is free and easy! Click on the profile icon in the top right corner, select "Sign Up", and fill in your details. You can also sign up using your Google or Facebook account for faster access.' },
    { id: 2, category: 'account', question: 'Can I delete my account?', answer: 'Yes, you can delete your account anytime from your profile settings. Go to Settings > Account > Delete Account. Please note that this action is permanent and will remove all your data from our system.' },
    { id: 3, category: 'billing', question: 'Is CineFlix really free?', answer: 'Yes! CineFlix offers a completely free tier with access to thousands of movies. We also offer premium features for enhanced experience, but the basic search and discovery features are always free.' },
    { id: 4, category: 'billing', question: 'How do I cancel my premium subscription?', answer: 'You can cancel your premium subscription anytime from Settings > Billing. No questions asked, and you\'ll still have access to premium features until the end of your billing period.' },
    { id: 5, category: 'technical', question: 'Why are some movies not loading?', answer: 'This could be due to your internet connection or temporary server issues. Try refreshing the page, clearing your cache, or checking your internet connection. If the problem persists, contact our support team.' },
    { id: 6, category: 'technical', question: 'Which browsers are supported?', answer: 'CineFlix works best on the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.' },
    { id: 7, category: 'features', question: 'Can I create multiple watchlists?', answer: 'Currently, you can maintain one watchlist, but we\'re working on adding multiple watchlist functionality! You can organize your watchlist by using the "Favorites" feature for special collections.' },
    { id: 8, category: 'features', question: 'How do I get movie recommendations?', answer: 'Our recommendation engine analyzes your watch history and favorites to suggest movies you might like. The more you use CineFlix, the better the recommendations become!' }
  ];

  const toggleItem = (id) => setOpenItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6"><FiHelpCircle className="text-netflix-red text-xl" /><h2 className="text-2xl font-bold">Frequently Asked Questions</h2></div>

      <div className="relative mb-6"><FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search FAQ..." className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-netflix-red transition-colors" /></div>

      <div className="flex flex-wrap gap-2 mb-6">{categories.map((category) => (
        <motion.button key={category.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedCategory(category.id)} className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${selectedCategory === category.id ? 'bg-netflix-red text-white' : 'bg-white/5 hover:bg-white/10'}`}>{category.icon}{category.name}</motion.button>
      ))}</div>

      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => (
          <motion.div key={faq.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="border border-white/10 rounded-lg overflow-hidden">
            <button onClick={() => toggleItem(faq.id)} className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"><span className="font-medium">{faq.question}</span><motion.div animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }} transition={{ duration: 0.3 }}><FiChevronDown className="w-5 h-5 text-gray-400" /></motion.div></button>
            <AnimatePresence>{openItems.includes(faq.id) && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="px-6 pb-4 text-gray-400">{faq.answer}</motion.div>)}</AnimatePresence>
          </motion.div>
        ))}

        {filteredFaqs.length === 0 && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12"><p className="text-gray-400 mb-2">No matching questions found</p><p className="text-sm text-gray-500">Try different keywords or categories</p></motion.div>)}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8 p-6 bg-gradient-to-r from-netflix-red/10 to-accent-purple/10 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
        <p className="text-gray-400 mb-4">Can't find the answer you're looking for? Please contact our support team.</p>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-netflix-red text-white rounded-lg font-semibold hover:bg-netflix-darkred transition-colors">Contact Support</motion.button>
      </motion.div>
    </div>
  );
};

export default ContactFAQ;
