import React from 'react';
import { Plus, Building2, Package, ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Product = () => {
  const navigate = useNavigate();

  // Static product data for design
  const products = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      company: "TechAudio Pro",
      price: "₹2,499",
      rating: 4.8,
      image: "🎧",
      category: "Electronics",
      inStock: true
    },
    {
      id: 2,
      name: "Organic Cotton T-Shirt",
      company: "EcoFashion",
      price: "₹899",
      rating: 4.6,
      image: "👕",
      category: "Clothing",
      inStock: true
    },
    {
      id: 3,
      name: "Smart Fitness Watch",
      company: "HealthTech",
      price: "₹5,999",
      rating: 4.9,
      image: "⌚",
      category: "Electronics",
      inStock: false
    },
    {
      id: 4,
      name: "Natural Face Cream",
      company: "BeautyCare",
      price: "₹1,299",
      rating: 4.7,
      image: "🧴",
      category: "Beauty",
      inStock: true
    },
    {
      id: 5,
      name: "Stainless Steel Water Bottle",
      company: "EcoLife",
      price: "₹799",
      rating: 4.5,
      image: "🥤",
      category: "Home",
      inStock: true
    },
    {
      id: 6,
      name: "Wireless Bluetooth Speaker",
      company: "SoundMaster",
      price: "₹3,299",
      rating: 4.8,
      image: "🔊",
      category: "Electronics",
      inStock: true
    },
    {
      id: 7,
      name: "Handcrafted Wooden Bowl",
      company: "ArtisanCraft",
      price: "₹1,599",
      rating: 4.9,
      image: "🥣",
      category: "Home",
      inStock: true
    },
    {
      id: 8,
      name: "Professional Camera Lens",
      company: "PhotoPro",
      price: "₹12,999",
      rating: 4.9,
      image: "📷",
      category: "Electronics",
      inStock: false
    },
    {
      id: 9,
      name: "Aromatherapy Essential Oils",
      company: "WellnessPlus",
      price: "₹899",
      rating: 4.6,
      image: "🌿",
      category: "Health",
      inStock: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">Product Management</h1>
          <p className="text-body mt-2">Manage your products and companies efficiently</p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Product Card */}
        <div className="gradient-primary rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Add Product</h3>
              </div>
              <p className="text-blue-100 mb-4">
                Create new products with detailed information, pricing, and inventory tracking
              </p>
              <button className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-2">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="text-right">
              <Package className="w-16 h-16 text-white text-opacity-30" />
            </div>
          </div>
        </div>

        {/* Add Company Card */}
        <div className="gradient-success rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Add Company</h3>
              </div>
              <p className="text-green-100 mb-4">
                Register new companies and manage their product catalogs and partnerships
              </p>
              <button className="bg-white text-success px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors duration-200 flex items-center space-x-2">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="text-right">
              <Building2 className="w-16 h-16 text-white text-opacity-30" />
            </div>
          </div>
        </div>
      </div>

      {/* Product List Section */}
      <div className="bg-card rounded-xl shadow-soft border border-light p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-heading">Recent Products</h2>
          <span className="text-sm text-body">{products.length} products</span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product) => (
            <div key={product.id} className="bg-container rounded-lg p-4 border border-light hover:border-primary hover:shadow-md transition-all duration-200">
              {/* Product Image */}
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-card rounded-lg flex items-center justify-center text-3xl shadow-soft">
                  {product.image}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-heading text-sm leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-body text-xs mt-1">{product.company}</p>
                </div>

                {/* Rating and Category */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-heading">{product.rating}</span>
                  </div>
                  <span className="text-xs text-body bg-gray-200 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>

                {/* Price and Stock */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-heading">{product.price}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-success' : 'bg-danger'}`}></span>
                    <span className={`text-xs ${product.inStock ? 'text-success' : 'text-danger'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 bg-primary text-white text-sm py-2 px-3 rounded-md hover:bg-primary-dark transition-colors duration-200 flex items-center justify-center space-x-1">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button className="px-3 py-2 text-body hover:text-primary hover:bg-container transition-colors duration-200">
                    <Package className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-8 pt-6 border-t border-light">
          <button 
            onClick={() => navigate('/dashboard/product/all')}
            className="inline-flex items-center space-x-2 bg-card text-primary border border-primary px-6 py-3 rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-200"
          >
            <span>View All Products</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-sm text-body mt-2">
            Explore our complete product catalog with advanced filtering and search
          </p>
        </div>
      </div>
    </div>
  );
};

export default Product;
