import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { photo, name, company, id } = product;
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#e2e8f0] hover:border-[#3b82f6] overflow-hidden mx-2 sm:mx-0">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img 
          src={photo} 
          alt={name}
          className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200/f8fafc/64748b?text=Product+Image';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-2 sm:p-3 md:p-4">
        <h3 className="font-semibold text-[#1e293b] text-sm sm:text-base md:text-lg mb-1 group-hover:text-[#3b82f6] transition-colors duration-300 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {name}
        </h3>
        
        <p className="text-[#64748b] text-xs sm:text-sm mb-2 sm:mb-3">
          {company}
        </p>

        {/* Action Button */}
        <button 
          onClick={handleViewDetails}
          className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          View Details
        </button>
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
