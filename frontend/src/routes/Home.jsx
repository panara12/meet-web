import React from 'react';
import ProductSection from '../component/ProductSection';
import Footer from '../component/Footer';

function Home() {
  const companies = [
    { name: 'Amul', logo: '🥛' },
    { name: 'Good Day', logo: '🍪' },
    { name: 'Britannia', logo: '🍞' },
    { name: 'Nestle', logo: '☕' },
    { name: 'Cadbury', logo: '🍫' },
    { name: 'Parle', logo: '🍪' },
  ];

  const latestProducts = [
    {
      id: 1,
      photo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
      name: 'Premium Dairy Milk Chocolate',
      company: 'Cadbury'
    },
    {
      id: 2,
      photo: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=200&fit=crop',
      name: 'Organic Whole Milk',
      company: 'Amul'
    },
    {
      id: 3,
      photo: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=300&h=200&fit=crop',
      name: 'Butter Cookies Assortment',
      company: 'Good Day'
    },
    {
      id: 4,
      photo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop',
      name: 'Whole Wheat Bread',
      company: 'Britannia'
    },
    {
      id: 5,
      photo: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop',
      name: 'Premium Coffee Beans',
      company: 'Nestle'
    },
    {
      id: 6,
      photo: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=300&h=200&fit=crop',
      name: 'Chocolate Chip Cookies',
      company: 'Parle'
    }
  ];

  const bhavyaProducts = [
    {
      id: 7,
      photo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      name: 'Bhavya Premium Rice',
      company: 'Bhavya Marketing'
    },
    {
      id: 8,
      photo: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
      name: 'Bhavya Organic Pulses',
      company: 'Bhavya Marketing'
    },
    {
      id: 9,
      photo: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=200&fit=crop',
      name: 'Bhavya Spice Collection',
      company: 'Bhavya Marketing'
    },
    {
      id: 10,
      photo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
      name: 'Bhavya Chocolate Bars',
      company: 'Bhavya Marketing'
    },
    {
      id: 11,
      photo: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=200&fit=crop',
      name: 'Bhavya Dairy Products',
      company: 'Bhavya Marketing'
    },
    {
      id: 12,
      photo: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=300&h=200&fit=crop',
      name: 'Bhavya Snack Pack',
      company: 'Bhavya Marketing'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#dbeafe] rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#f0f9ff] rounded-full opacity-20"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#1e293b] mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-[#3b82f6] to-[#1e40af] bg-clip-text text-transparent">
              Bhavya Marketing
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-[#64748b] max-w-3xl mx-auto leading-relaxed px-4">
            Your trusted partner in order management and distribution solutions. 
            Streamlining business operations with cutting-edge technology and exceptional service.
          </p>

          <div className="mt-8">
            <button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md">
              Get Started
            </button>
          </div>
        </div>

        {/* Company Logos Section */}
        <div className="text-center mb-20">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#1e293b] mb-8 sm:mb-12">
            Trusted by Leading Brands
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
            {companies.map((company, index) => (
              <div
                key={company.name}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#e2e8f0] hover:border-[#3b82f6] hover:bg-gradient-to-br hover:from-[#f8fafc] hover:to-[#f0f9ff]">
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {company.logo}
                  </div>
                  <h3 className="text-xs sm:text-sm md:text-base font-medium text-[#1e293b] group-hover:text-[#3b82f6] transition-colors duration-300">
                    {company.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Products Section - using context colors */}
      <ProductSection 
        title="Latest Products"
        products={latestProducts}
        bgColor="bg-[#f8fafc]"
        textColor="text-[#1e293b]"
        buttonColor="bg-[#10b981]"
        buttonHoverColor="hover:bg-[#059669]"
      />

      {/* Bhavya Products Section - using context colors */}
      <ProductSection 
        title="Bhavya"
        products={bhavyaProducts}
        bgColor="bg-[#ffffff]"
        textColor="text-[#1e293b]"
        buttonColor="bg-[#3b82f6]"
        buttonHoverColor="hover:bg-[#2563eb]"
      />

      {/* Floating particles - subtle and professional */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#3b82f6] rounded-full opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;