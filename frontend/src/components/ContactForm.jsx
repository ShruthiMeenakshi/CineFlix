import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiMail, FiMessageSquare, FiSend, 
  FiCheckCircle, FiAlertCircle, FiFileText 
} from 'react-icons/fi';

const ContactForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general',
    attachments: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  const categories = [
    { value: 'general', label: 'General Inquiry', icon: '📧' },
    { value: 'technical', label: 'Technical Support', icon: '🔧' },
    { value: 'billing', label: 'Billing Question', icon: '💰' },
    { value: 'feature', label: 'Feature Request', icon: '💡' },
    { value: 'partnership', label: 'Partnership', icon: '🤝' },
    { value: 'other', label: 'Other', icon: '❓' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    if (name === 'email' && formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Email is invalid' }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const allTouched = Object.keys(formData).reduce((acc, key) => { acc[key] = true; return acc; }, {});
      setTouched(allTouched);
      return;
    }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    onSubmit(formData);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '', category: 'general', attachments: [] });
  };

  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FiMessageSquare className="text-netflix-red" />
        Send us a Message
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {categories.map((cat) => (
            <button key={cat.value} type="button" onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))} className={`p-3 rounded-lg border transition-all ${formData.category === cat.value ? 'border-netflix-red bg-netflix-red/10' : 'border-white/10 hover:border-white/20 bg-white/5'}`}>
              <span className="text-2xl mb-1 block">{cat.icon}</span>
              <span className="text-xs">{cat.label}</span>
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Full Name <span className="text-netflix-red">*</span></label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg focus:outline-none focus:border-netflix-red transition-colors ${touched.name && errors.name ? 'border-red-500' : 'border-white/10'}`} placeholder="John Doe" />
          </div>
          <AnimatePresence>
            {touched.name && errors.name && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-1 text-sm text-red-500 flex items-center gap-1"><FiAlertCircle className="w-4 h-4" />{errors.name}</motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Email Address <span className="text-netflix-red">*</span></label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg focus:outline-none focus:border-netflix-red transition-colors ${touched.email && errors.email ? 'border-red-500' : 'border-white/10'}`} placeholder="john@example.com" />
          </div>
          <AnimatePresence>
            {touched.email && errors.email && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-1 text-sm text-red-500 flex items-center gap-1"><FiAlertCircle className="w-4 h-4" />{errors.email}</motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Subject <span className="text-netflix-red">*</span></label>
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:outline-none focus:border-netflix-red transition-colors ${touched.subject && errors.subject ? 'border-red-500' : 'border-white/10'}`} placeholder="Brief summary of your inquiry" />
          <AnimatePresence>
            {touched.subject && errors.subject && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-1 text-sm text-red-500 flex items-center gap-1"><FiAlertCircle className="w-4 h-4" />{errors.subject}</motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Message <span className="text-netflix-red">*</span></label>
          <textarea name="message" value={formData.message} onChange={handleChange} onBlur={handleBlur} rows="5" className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:outline-none focus:border-netflix-red transition-colors resize-none ${touched.message && errors.message ? 'border-red-500' : 'border-white/10'}`} placeholder="Tell us more about your inquiry..." />
          <div className="flex justify-between items-center mt-1">
            <AnimatePresence>
              {touched.message && errors.message && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-sm text-red-500 flex items-center gap-1"><FiAlertCircle className="w-4 h-4" />{errors.message}</motion.p>
              )}
            </AnimatePresence>
            <span className="text-xs text-gray-500">{formData.message.length}/500</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Attachments (Optional)</label>
          <div className="border-2 border-dashed border-white/10 rounded-lg p-4 hover:border-netflix-red/50 transition-colors">
            <input type="file" id="file-upload" multiple onChange={handleFileUpload} className="hidden" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" />
            <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer"><FiFileText className="w-8 h-8 text-gray-400 mb-2" /><span className="text-sm text-gray-400 mb-1">Click to upload or drag and drop</span><span className="text-xs text-gray-500">Max 10MB per file (JPG, PDF, DOC)</span></label>
          </div>

          {formData.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {formData.attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <button type="button" onClick={() => removeAttachment(index)} className="text-red-500 hover:text-red-400">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-netflix-red to-accent-purple text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 relative overflow-hidden group">
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
              Sending Message...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2"><FiSend className="group-hover:translate-x-1 transition-transform" />Send Message</div>
          )}
        </motion.button>

        <p className="text-xs text-center text-gray-500">By submitting this form, you agree to our <button className="text-netflix-red hover:underline">Privacy Policy</button> and <button className="text-netflix-red hover:underline">Terms of Service</button></p>
      </form>
    </div>
  );
};

export default ContactForm;
