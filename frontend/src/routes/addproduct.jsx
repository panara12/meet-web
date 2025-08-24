import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const ProductAddScreen = () => {
  const [images, setImages] = useState([]);
  const [imageSlots, setImageSlots] = useState(1); // Start with 1 slot
  const [productName, setProductName] = useState('');
  const [sizes, setSizes] = useState(['']); // Array of sizes
  const [colors, setColors] = useState(['']); // Array of colors
  const [sku, setSku] = useState('');

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length <= 6) {
      const newImages = files.map(file => ({
        id: Date.now() + Math.random(),
        url: URL.createObjectURL(file),
        file
      }));
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (imageId) => {
    setImages(images.filter(img => img.id !== imageId));
  };

  const addImageSlot = () => {
    if (imageSlots < 6) {
      setImageSlots(imageSlots + 1);
    }
  };

  const addSizeField = () => {
    setSizes([...sizes, '']);
  };

  const removeSizeField = (index) => {
    if (sizes.length > 1) {
      setSizes(sizes.filter((_, i) => i !== index));
    }
  };

  const updateSize = (index, value) => {
    const newSizes = [...sizes];
    newSizes[index] = value;
    setSizes(newSizes);
  };

  const addColorField = () => {
    setColors([...colors, '']);
  };

  const removeColorField = (index) => {
    if (colors.length > 1) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const updateColor = (index, value) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };

  const handleAddProduct = () => {
    const productData = {
      images: images.map(img => img.file),
      productName,
      sizes: sizes.filter(size => size.trim() !== ''),
      colors: colors.filter(color => color.trim() !== ''),
      sku
    };
    console.log('Product Data:', productData);
    // Add your product creation logic here
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white min-h-screen">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Add New Product</h1>
        <p className="text-sm sm:text-base text-gray-600">Fill in the details below to add a new product</p>
      </div>

      {/* Image Upload Section */}
      <div className="mb-6 sm:mb-8">
        <label className="block text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">
          Product Images (Max 6)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Image Upload Boxes */}
          {Array.from({ length: imageSlots }).map((_, index) => (
            <div key={index} className="aspect-square">
              {images[index] ? (
                <div className="relative w-full h-full group">
                  <img
                    src={images[index].url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    onClick={() => removeImage(images[index].id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={images.length >= 6}
                  />
                  <Plus size={20} className="text-gray-400" />
                </label>
              )}
            </div>
          ))}
          
          {/* Add More Image Slot Button */}
          {imageSlots < 6 && (
            <div className="aspect-square">
              <button
                onClick={addImageSlot}
                className="w-full h-full border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <Plus size={20} className="text-blue-400" />
              </button>
            </div>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          {images.length}/6 images uploaded • {imageSlots} slots available
        </p>
      </div>

      {/* Product Details Form */}
      <div className="space-y-4 sm:space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-base sm:text-lg font-medium text-gray-700 mb-2">
            Product Name
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
            placeholder="Enter product name"
          />
        </div>

        {/* Sizes */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <label className="block text-base sm:text-lg font-medium text-gray-700">
              Sizes
            </label>
            <button
              onClick={addSizeField}
              className="flex items-center justify-center sm:justify-start text-blue-600 hover:text-blue-700 font-medium text-sm bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
            >
              <Plus size={16} className="mr-1" />
              Add Size
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {sizes.map((size, index) => (
              <div key={index} className="relative">
                <input
                  type="text"
                  value={size}
                  onChange={(e) => updateSize(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-center"
                  placeholder={`Size ${index + 1}`}
                />
                {sizes.length > 1 && (
                  <button
                    onClick={() => removeSizeField(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <label className="block text-base sm:text-lg font-medium text-gray-700">
              Colors
            </label>
            <button
              onClick={addColorField}
              className="flex items-center justify-center sm:justify-start text-blue-600 hover:text-blue-700 font-medium text-sm bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
            >
              <Plus size={16} className="mr-1" />
              Add Color
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {colors.map((color, index) => (
              <div key={index} className="relative">
                <input
                  type="text"
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-center"
                  placeholder={`Color ${index + 1}`}
                />
                {colors.length > 1 && (
                  <button
                    onClick={() => removeColorField(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product SKU */}
        <div>
          <label className="block text-base sm:text-lg font-medium text-gray-700 mb-2">
            Product SKU
          </label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
            placeholder="Enter product SKU"
          />
        </div>

        {/* Add Product Button */}
        <div className="pt-4">
          <button
            onClick={handleAddProduct}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm sm:text-base"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductAddScreen;