import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ContactForm from '../components/ContactForm';
import ContactInfo from '../components/ContactInfo';
import ContactMap from '../components/ContactMap';
import ContactFAQ from '../components/ContactFAQ';
import ContactSuccessModal from '../components/ContactSuccessModal';
import { FiMail, FiMapPin, FiPhone, FiClock, FiMessageCircle, FiHelpCircle, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleFormSubmit = (data) => {
    setFormData(data);
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-red/20 via-accent-purple/20 to-accent-blue/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(229,9,20,0.1)_0%,transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="mb-4 text-left">
              <Link to="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white">
                <FiArrowLeft className="w-4 h-4" />
                Back
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">Get in</span>{' '}
              <span className="text-white">Touch</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Have questions about CineFlix? We'd love to hear from you. 
              Our team is here to help with any inquiries you might have.
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {[
                { label: 'Response Time', value: '< 24h', icon: FiClock },
                { label: 'Happy Users', value: '10K+', icon: FiMessageCircle },
                { label: 'FAQ Articles', value: '50+', icon: FiHelpCircle },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="glass-card p-4"
                >
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-netflix-red" />
                  <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <ContactInfo />
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <ContactForm onSubmit={handleFormSubmit} />
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <ContactMap />
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <ContactFAQ />
        </motion.div>
      </div>

      {/* Success Modal */}
      <ContactSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        formData={formData}
      />
    </div>
  );
};

export default Contact;
