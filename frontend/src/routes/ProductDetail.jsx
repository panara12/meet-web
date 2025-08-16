import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState('Red');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data - in real app, fetch from API based on id
  const product = {
    id: id,
    name: 'Premium Cotton T-Shirt',
    company: 'Bhavya Marketing',
    description: 'High-quality premium cotton t-shirt with excellent comfort and durability. Perfect for everyday wear and casual occasions.',
    colors: ['Red', 'Blue', 'Black', 'White', 'Green'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    photos: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop'
    ]
  };

  const handleGetProduct = () => {
    // Navigate to contact form with product info
    navigate('/contact', { 
      state: { 
        productName: product.name,
        productId: product.id 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-[#64748b] hover:text-[#3b82f6] transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Photos */}
          <div className="space-y-4">
            {/* Main Photo */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
              <img 
                src={product.photos[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Photos */}
            <div className="grid grid-cols-6 gap-2">
              {product.photos.map((photo, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200 ${
                    selectedImage === index ? 'ring-2 ring-[#3b82f6]' : ''
                  }`}
                >
                  <img 
                    src={photo} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1e293b] mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-[#64748b] mb-4">
                {product.company}
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-[#1e293b] mb-2">Description</h3>
              <p className="text-[#64748b] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Color Options */}
            <div>
              <h3 className="text-lg font-semibold text-[#1e293b] mb-3">Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                      selectedColor === color
                        ? 'border-[#3b82f6] bg-[#3b82f6] text-white'
                        : 'border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#3b82f6]'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Options */}
            <div>
              <h3 className="text-lg font-semibold text-[#1e293b] mb-3">Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-[#3b82f6] bg-[#3b82f6] text-white'
                        : 'border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#3b82f6]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Get Product Button */}
            <div className="pt-4">
              <button
                onClick={handleGetProduct}
                className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md"
              >
                Get This Product
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-[#f1f5f9] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#1e293b] mb-3">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#64748b]">Material:</span>
                  <span className="ml-2 text-[#1e293b] font-medium">100% Cotton</span>
                </div>
                <div>
                  <span className="text-[#64748b]">Care:</span>
                  <span className="ml-2 text-[#1e293b] font-medium">Machine Wash</span>
                </div>
                <div>
                  <span className="text-[#64748b]">Fit:</span>
                  <span className="ml-2 text-[#1e293b] font-medium">Regular</span>
                </div>
                <div>
                  <span className="text-[#64748b]">Style:</span>
                  <span className="ml-2 text-[#1e293b] font-medium">Casual</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
