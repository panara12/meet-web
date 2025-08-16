import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { emailService } from '../utils/emailService';

const Contact = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    productInterest: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  // Get product info from navigation state
  const productInfo = location.state;

  useEffect(() => {
    if (productInfo) {
      setFormData(prev => ({
        ...prev,
        productInterest: productInfo.productName || '',
        message: `I'm interested in ${productInfo.productName || 'your products'}. Please provide more information.`
      }));
    }
  }, [productInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await emailService.sendContactEmail(formData);
      
      if (result.success) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: '',
          productInterest: ''
        });
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      } else {
        setSubmitStatus('error');
        console.error('Email sending failed:', result.message);
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
      productInterest: ''
    });
    setSubmitStatus(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-[#64748b] hover:text-[#3b82f6] transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1e293b] mb-4">
                Get in Touch
              </h1>
              <p className="text-lg text-[#64748b] leading-relaxed">
                Ready to streamline your business operations? Contact us today to learn how Bhavya Marketing can help you with our order management and distribution solutions.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#3b82f6] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1e293b] mb-1">Phone</h3>
                  <p className="text-[#64748b]">+91 98765 43210</p>
                  <p className="text-[#64748b]">+91 87654 32109</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#10b981] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1e293b] mb-1">Email</h3>
                  <p className="text-[#64748b]">info@bhavyamarketing.com</p>
                  <p className="text-[#64748b]">support@bhavyamarketing.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#f59e0b] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1e293b] mb-1">Address</h3>
                  <p className="text-[#64748b]">123 Business Park, Sector 15</p>
                  <p className="text-[#64748b]">Gurugram, Haryana 122001</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-[#1e293b] mb-4">Business Hours</h3>
              <div className="space-y-2 text-[#64748b]">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-[#1e293b] mb-6">Send us a Message</h2>
            
            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="bg-[#f0fdf4] border border-[#10b981] rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#10b981]" />
                  <div>
                    <p className="text-[#065f46] font-medium">Message sent successfully!</p>
                    <p className="text-[#047857] text-sm">We'll get back to you within 24 hours.</p>
                  </div>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-[#fef2f2] border border-[#ef4444] rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-[#ef4444]" />
                  <div>
                    <p className="text-[#991b1b] font-medium">Failed to send message</p>
                    <p className="text-[#b91c1c] text-sm">Please try again or contact us directly.</p>
                  </div>
                </div>
              </div>
            )}
            
            {productInfo && (
              <div className="bg-[#f0f9ff] border border-[#3b82f6] rounded-lg p-4 mb-6">
                <p className="text-[#1e293b] font-medium">
                  Product Interest: <span className="text-[#3b82f6]">{productInfo.productName}</span>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1e293b] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#3b82f6] transition-colors duration-200 disabled:bg-[#f1f5f9] disabled:cursor-not-allowed"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1e293b] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#3b82f6] transition-colors duration-200 disabled:bg-[#f1f5f9] disabled:cursor-not-allowed"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1e293b] mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#3b82f6] transition-colors duration-200 disabled:bg-[#f1f5f9] disabled:cursor-not-allowed"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1e293b] mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#3b82f6] transition-colors duration-200 disabled:bg-[#f1f5f9] disabled:cursor-not-allowed"
                    placeholder="Enter your company name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1e293b] mb-2">
                  Product Interest
                </label>
                <input
                  type="text"
                  name="productInterest"
                  value={formData.productInterest}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#3b82f6] transition-colors duration-200 disabled:bg-[#f1f5f9] disabled:cursor-not-allowed"
                  placeholder="What product are you interested in?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1e293b] mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#3b82f6] transition-colors duration-200 resize-none disabled:bg-[#f1f5f9] disabled:cursor-not-allowed"
                  placeholder="Tell us about your requirements..."
                ></textarea>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb] disabled:bg-[#94a3b8] text-white py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-4 border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    Send Another
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
