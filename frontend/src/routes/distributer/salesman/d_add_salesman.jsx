import React, { useState } from 'react';
import { ArrowLeft, Upload, X, Save, User, Mail, Phone, MapPin, Camera, UserCheck } from 'lucide-react';
import { addSalesman } from '../../../hooks/distributer/addSalesman';
import LoadingGif from '../../../component/loading';

const AddSalesmanPage = () => {
  const [formData, setFormData] = useState({
    salesman_name: '',
    salesman_email: '',
    salesman_mobile: '',
    salesman_address: '',
    images:null,
    salesman_username: '',
    user_role: 'salesman'
  });

  const [idPhotos, setIdPhotos] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: addSalesmanMutation, isPending, isError, error } = addSalesman();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    
    setIdPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (index) => {
    setIdPhotos(prev => {
      const newPhotos = [...prev];
      URL.revokeObjectURL(newPhotos[index].preview);
      newPhotos.splice(index, 1);
      return newPhotos;
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.salesman_name.trim()) {
      newErrors.salesman_name = 'Salesman name is required';
    }

    // Email validation
    if (!formData.salesman_email.trim()) {
      newErrors.salesman_email = 'Email id is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.salesman_email)) {
      newErrors.salesman_email = 'Please use a valid email address';
    }

    //password validation
    if (!formData.salesman_password.trim()) {
      newErrors.salesman_password = 'password id is required';
    }

    // Mobile validation
    if (!formData.salesman_mobile.trim()) {
      newErrors.salesman_mobile = 'Must enter phone or mobile number';
    } else if (!/^\d{10}$/.test(formData.salesman_mobile)) {
      newErrors.salesman_mobile = 'Mobile number must be exactly 10 digits';
    }

    // Username validation
    if (!formData.salesman_username.trim()) {
      newErrors.salesman_username = 'Please enter username';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      setFormData(prev => ({
        ...prev,
        images: [idPhotos]
      }))
      addSalesmanMutation(formData);

      
      console.log('Form Data:', formData);
      console.log('ID Photos:', idPhotos);
      
      // Reset form after successful submission
      setFormData({
        salesman_name: '',
        salesman_email: '',
        salesman_password:'',
        salesman_mobile: '',
        salesman_address: '',
        images:null,
        salesman_username: '',
        user_role: 'salesman'
      });
      setIdPhotos([]);
      
      alert('Salesman added successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding salesman. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    // Navigate back to dashboard
    navigate('/distributer/salesman')
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Add New Salesman</h1>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
          <div className="space-y-6">
            
            {/* Personal Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Salesman Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salesman Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="salesman_name"
                    value={formData.salesman_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none ${
                      errors.salesman_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter salesman full name"
                  />
                  {errors.salesman_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.salesman_name}</p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="salesman_username"
                    value={formData.salesman_username}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none ${
                      errors.salesman_username ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter username"
                  />
                  {errors.salesman_username && (
                    <p className="mt-1 text-sm text-red-600">{errors.salesman_username}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-green-500" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="salesman_email"
                      value={formData.salesman_email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none ${
                        errors.salesman_email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.salesman_email && (
                    <p className="mt-1 text-sm text-red-600">{errors.salesman_email}</p>
                  )}
                </div>
                {/* salesman password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="salesman_password"
                      value={formData.salesman_password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none ${
                        errors.salesman_password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.salesman_password && (
                    <p className="mt-1 text-sm text-red-600">{errors.salesman_password}</p>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="salesman_mobile"
                      value={formData.salesman_mobile}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none ${
                        errors.salesman_mobile ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter 10-digit mobile number"
                      maxLength="10"
                    />
                  </div>
                  {errors.salesman_mobile && (
                    <p className="mt-1 text-sm text-red-600">{errors.salesman_mobile}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                Address Information
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="salesman_address"
                  value={formData.salesman_address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none outline-none"
                  placeholder="Enter complete address"
                />
              </div>
            </div>

            {/* Role Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-purple-500" />
                Role Information
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="user_role"
                  value={formData.user_role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                >
                  <option value="salesman">Salesman</option>
                  <option value="distributer">Distributer</option>
                  <option value="seller">Seller</option>
                </select>
              </div>
            </div>

            {/* ID Photo Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Camera className="w-5 h-5 mr-2 text-indigo-500" />
                ID Photos
              </h2>
              
              <div className="space-y-4">
                {/* Upload Button */}
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> ID photos
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG, WEBP or JPEG (MAX. 5MB each)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                {/* Photo Previews */}
                {idPhotos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {idPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo.preview}
                          alt={`ID Photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <p className="mt-1 text-xs text-gray-500 truncate">{photo.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center hover:shadow-lg hover:transform hover:scale-105 active:scale-95 disabled:transform-none disabled:shadow-none"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                    <LoadingGif />
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Add Salesman
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSalesmanPage;