import React from 'react';

const ProductCard = ({ product }) => {
  const { photo, name, company } = product;

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#e2e8f0] hover:border-[#3b82f6] overflow-hidden">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img 
          src={photo} 
          alt={name}
          className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200/f8fafc/64748b?text=Product+Image';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-[#1e293b] text-base sm:text-lg mb-1 group-hover:text-[#3b82f6] transition-colors duration-300 line-clamp-2 min-h-[3rem]">
          {name}
        </h3>
        
        <p className="text-[#64748b] text-xs sm:text-sm mb-3">
          {company}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb] text-white py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200">
            Add to Cart
          </button>
          <button className="flex-1 bg-[#1e40af] hover:bg-[#1e3a8a] text-white py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200">
            View Details
          </button>
        </div>
      </div>

      {/* Custom CSS for line-clamp */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
