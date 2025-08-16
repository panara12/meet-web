import React from 'react';
import ProductCard from './ProductCard';

const ProductSection = ({ title, products, bgColor = "bg-white", textColor = "text-[#1e293b]", buttonColor = "bg-[#3b82f6]", buttonHoverColor = "hover:bg-[#2563eb]" }) => {
  return (
    <div className={`${bgColor} py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${textColor} mb-4`}>
            {title}
          </h2>
          <div className="w-24 h-1 bg-[#3b82f6] mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className={`${buttonColor} ${buttonHoverColor} text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md`}>
            View All {title} Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
