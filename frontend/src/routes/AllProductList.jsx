import React from 'react';
import { Search, Filter, Grid, List, Star, ShoppingCart, Package, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AllProductList = () => {
  const navigate = useNavigate();

  // Static product data for design
  const allProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      company: "TechAudio Pro",
      price: "₹2,499",
      rating: 4.8,
      image: "🎧",
      category: "Electronics",
      inStock: true,
      description: "High-quality wireless headphones with noise cancellation"
    },
    {
      id: 2,
      name: "Organic Cotton T-Shirt",
      company: "EcoFashion",
      price: "₹899",
      rating: 4.6,
      image: "👕",
      category: "Clothing",
      inStock: true,
      description: "Comfortable organic cotton t-shirt in various colors"
    },
    {
      id: 3,
      name: "Smart Fitness Watch",
      company: "HealthTech",
      price: "₹5,999",
      rating: 4.9,
      image: "⌚",
      category: "Electronics",
      inStock: false,
      description: "Advanced fitness tracking with heart rate monitoring"
    },
    {
      id: 4,
      name: "Natural Face Cream",
      company: "BeautyCare",
      price: "₹1,299",
      rating: 4.7,
      image: "🧴",
      category: "Beauty",
      inStock: true,
      description: "Organic face cream for all skin types"
    },
    {
      id: 5,
      name: "Stainless Steel Water Bottle",
      company: "EcoLife",
      price: "₹799",
      rating: 4.5,
      image: "🥤",
      category: "Home",
      inStock: true,
      description: "Eco-friendly water bottle with insulation"
    },
    {
      id: 6,
      name: "Wireless Bluetooth Speaker",
      company: "SoundMaster",
      price: "₹3,299",
      rating: 4.8,
      image: "🔊",
      category: "Electronics",
      inStock: true,
      description: "Portable Bluetooth speaker with deep bass"
    },
    {
      id: 7,
      name: "Handcrafted Wooden Bowl",
      company: "ArtisanCraft",
      price: "₹1,599",
      rating: 4.9,
      image: "🥣",
      category: "Home",
      inStock: true,
      description: "Beautiful handcrafted wooden serving bowl"
    },
    {
      id: 8,
      name: "Professional Camera Lens",
      company: "PhotoPro",
      price: "₹12,999",
      rating: 4.9,
      image: "📷",
      category: "Electronics",
      inStock: false,
      description: "Professional grade camera lens for DSLR cameras"
    },
    {
      id: 9,
      name: "Aromatherapy Essential Oils",
      company: "WellnessPlus",
      price: "₹899",
      rating: 4.6,
      image: "🌿",
      category: "Health",
      inStock: true,
      description: "Pure essential oils for aromatherapy and wellness"
    },
    {
      id: 10,
      name: "Smart Home Security Camera",
      company: "SecureTech",
      price: "₹4,999",
      rating: 4.7,
      image: "📹",
      category: "Electronics",
      inStock: true,
      description: "WiFi security camera with night vision"
    },
    {
      id: 11,
      name: "Yoga Mat Premium",
      company: "FitLife",
      price: "₹1,199",
      rating: 4.8,
      image: "🧘",
      category: "Fitness",
      inStock: true,
      description: "Non-slip yoga mat with carrying strap"
    },
    {
      id: 12,
      name: "Ceramic Coffee Mug Set",
      company: "HomeStyle",
      price: "₹699",
      rating: 4.5,
      image: "☕",
      category: "Home",
      inStock: true,
      description: "Set of 4 beautiful ceramic coffee mugs"
    }
  ];

  

  const categories = ["All", "Electronics", "Clothing", "Beauty", "Home", "Health", "Fitness"];
  const companies = ["All", "TechAudio Pro", "EcoFashion", "HealthTech", "BeautyCare", "EcoLife", "SoundMaster", "ArtisanCraft", "PhotoPro", "WellnessPlus", "SecureTech", "FitLife", "HomeStyle"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/dashboard/product')}
            className="p-2 text-[#64748b] hover:text-[#3b82f6] hover:bg-[#f1f5f9] rounded-md transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">All Products</h1>
            <p className="text-[#64748b] text-sm">Browse and manage your complete product catalog</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 text-[#64748b] hover:text-[#3b82f6] hover:bg-[#f1f5f9] rounded-md transition-colors duration-200">
            <Grid className="w-5 h-5" />
          </button>
          <button className="p-2 text-[#64748b] hover:text-[#3b82f6] hover:bg-[#f1f5f9] rounded-md transition-colors duration-200">
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748b] w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-[#d1d5db] rounded-lg focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]">
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Company Filter */}
          <div>
            <select className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]">
              {companies.map((company) => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-[#e2e8f0]">
          <span className="text-sm text-[#64748b]">Active filters:</span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#3b82f6] text-white">
            Electronics
            <button className="ml-1 hover:bg-[#2563eb] rounded-full w-4 h-4 flex items-center justify-center">×</button>
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#10b981] text-white">
            In Stock
            <button className="ml-1 hover:bg-[#059669] rounded-full w-4 h-4 flex items-center justify-center">×</button>
          </span>
          <button className="text-sm text-[#64748b] hover:text-[#3b82f6]">Clear all</button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#1e293b]">Products ({allProducts.length})</h2>
          <div className="flex items-center space-x-2 text-sm text-[#64748b]">
            <span>Sort by:</span>
            <select className="border-none text-[#3b82f6] font-medium focus:ring-0">
              <option>Name</option>
              <option>Price</option>
              <option>Rating</option>
              <option>Date Added</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allProducts.map((product) => (
            <div key={product.id} className="bg-[#f8fafc] rounded-lg p-4 border border-[#e2e8f0] hover:border-[#3b82f6] hover:shadow-md transition-all duration-200">
              {/* Product Image */}
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-white rounded-lg flex items-center justify-center text-3xl shadow-sm">
                  {product.image}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-[#1e293b] text-sm leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-[#64748b] text-xs mt-1">{product.company}</p>
                  <p className="text-[#64748b] text-xs mt-1 line-clamp-2">{product.description}</p>
                </div>

                {/* Rating and Category */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-[#1e293b]">{product.rating}</span>
                  </div>
                  <span className="text-xs text-[#64748b] bg-[#e2e8f0] px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>

                {/* Price and Stock */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#1e293b]">{product.price}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className={`text-xs ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 bg-[#3b82f6] text-white text-sm py-2 px-3 rounded-md hover:bg-[#2563eb] transition-colors duration-200 flex items-center justify-center space-x-1">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button className="px-3 py-2 text-[#64748b] hover:text-[#3b82f6] hover:bg-[#f1f5f9] rounded-md transition-colors duration-200">
                    <Package className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#e2e8f0]">
          <div className="text-sm text-[#64748b]">
            Showing 1-12 of {allProducts.length} products
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-[#64748b] hover:text-[#3b82f6] hover:bg-[#f1f5f9] rounded-md transition-colors duration-200">
              Previous
            </button>
            <button className="px-3 py-2 bg-[#3b82f6] text-white rounded-md">1</button>
            <button className="px-3 py-2 text-[#64748b] hover:text-[#3b82f6] hover:bg-[#f1f5f9] rounded-md transition-colors duration-200">
              2
            </button>
            <button className="px-3 py-2 text-[#64748b] hover:text-[#3b82f6] hover:bg-[#f1f5f9] rounded-md transition-colors duration-200">
              3
            </button>
            <button className="px-3 py-2 text-[#64748b] hover:text-[#3b82f6] hover:bg-[#f1f5f9] rounded-md transition-colors duration-200">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProductList;
