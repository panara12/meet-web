import React, { useState } from 'react';
import { Plus, Minus, Package, User, Store, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const Packaging = () => {
  const [orders, setOrders] = useState([
    {
      orderId: "ORD-2024-001",
      salesman: "John Smith",
      seller: "Tech Store Premium",
      status: "pending",
      timestamp: "2024-01-15 10:30 AM",
      isExpanded: false,
      products: [
        {
          id: 1,
          name: "Premium T-Shirt",
          sku: "TSH-001",
          variants: [
            { id: 1, color: "Blue", size: "XL", count: 2 },
            { id: 2, color: "Blue", size: "S", count: 1 },
            { id: 3, color: "Red", size: "M", count: 3 }
          ]
        },
        {
          id: 2,
          name: "Sport Shoes",
          sku: "SH-002",
          variants: [
            { id: 4, color: "Black", size: "42", count: 1 },
            { id: 5, color: "White", size: "44", count: 2 }
          ]
        }
      ]
    },
    {
      orderId: "ORD-2024-002",
      salesman: "Sarah Johnson",
      seller: "Fashion Hub",
      status: "pending",
      timestamp: "2024-01-15 11:15 AM",
      isExpanded: false,
      products: [
        {
          id: 3,
          name: "Wireless Headphones",
          sku: "HP-003",
          variants: [
            { id: 6, color: "Black", size: "Standard", count: 1 },
            { id: 7, color: "White", size: "Standard", count: 2 }
          ]
        },
        {
          id: 4,
          name: "Smart Watch",
          sku: "SW-004",
          variants: [
            { id: 8, color: "Silver", size: "42mm", count: 1 },
            { id: 9, color: "Black", size: "44mm", count: 1 }
          ]
        }
      ]
    },
    {
      orderId: "ORD-2024-003",
      salesman: "Mike Wilson",
      seller: "Electronics Plus",
      status: "pending",
      timestamp: "2024-01-15 12:45 PM",
      isExpanded: false,
      products: [
        {
          id: 5,
          name: "Gaming Mouse",
          sku: "GM-005",
          variants: [
            { id: 10, color: "Black", size: "Standard", count: 3 },
            { id: 11, color: "White", size: "Standard", count: 1 }
          ]
        }
      ]
    }
  ]);

  const updateVariantCount = (orderId, productId, variantId, newCount) => {
    if (newCount < 0) return;
    
    setOrders(prev => 
      prev.map(order => 
        order.orderId === orderId 
          ? {
              ...order,
              products: order.products.map(product => 
                product.id === productId 
                  ? {
                      ...product,
                      variants: product.variants.map(variant =>
                        variant.id === variantId 
                          ? { ...variant, count: newCount }
                          : variant
                      )
                    }
                  : product
              )
            }
          : order
      )
    );
  };

  const toggleOrderExpansion = (orderId) => {
    setOrders(prev => 
      prev.map(order => 
        order.orderId === orderId 
          ? { ...order, isExpanded: !order.isExpanded }
          : order
      )
    );
  };

  const getTotalItems = (order) => {
    return order.products.reduce((total, product) => 
      total + product.variants.reduce((productTotal, variant) => 
        productTotal + variant.count, 0), 0);
  };

  const handleConfirmOrder = (orderId) => {
    const order = orders.find(o => o.orderId === orderId);
    console.log('Order Confirmed:', order);
    
    setOrders(prev => 
      prev.map(o => 
        o.orderId === orderId 
          ? { ...o, status: 'confirmed' }
          : o
      )
    );
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setOrders(prev => 
        prev.map(o => 
          o.orderId === orderId 
            ? { ...o, status: 'cancelled' }
            : o
        )
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getColorStyle = (color) => {
    switch (color.toLowerCase()) {
      case 'black': return 'bg-black border-gray-300';
      case 'white': return 'bg-white border-gray-400';
      case 'blue': return 'bg-blue-500 border-blue-300';
      case 'red': return 'bg-red-500 border-red-300';
      case 'silver': return 'bg-gray-300 border-gray-400';
      default: return 'bg-gray-400 border-gray-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          Packaging Department
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage and process multiple orders • {orders.filter(o => o.status === 'pending').length} pending orders
        </p>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
              order.status === 'confirmed' ? 'ring-2 ring-green-200' : 
              order.status === 'cancelled' ? 'opacity-75' : ''
            }`}
          >
            {/* Order Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold truncate">{order.orderId}</h3>
                  <div className="flex items-center mt-1 text-blue-100">
                    <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="text-xs sm:text-sm truncate">{order.timestamp}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {order.status.toUpperCase()}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                  <Package className="w-4 h-4 mr-2" />
                  <span className="text-sm font-semibold">{getTotalItems(order)} Items</span>
                </div>
                <button
                  onClick={() => toggleOrderExpansion(order.orderId)}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                  disabled={order.status !== 'pending'}
                >
                  {order.isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>

            {/* Order Info */}
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Salesman */}
                <div className="flex items-center">
                  <User className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Salesman</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{order.salesman}</p>
                  </div>
                </div>

                {/* Seller */}
                <div className="flex items-center">
                  <Store className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Seller</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{order.seller}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expandable Products Section */}
            {order.isExpanded && order.status === 'pending' && (
              <div className="max-h-96 overflow-y-auto">
                {order.products.map((product) => (
                  <div key={product.id} className="border-b border-gray-100 last:border-b-0">
                    {/* Product Header */}
                    <div className="bg-gray-50 px-4 sm:px-6 py-3">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-semibold text-gray-800 truncate">{product.name}</h4>
                          <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full ml-2">
                          {product.variants.reduce((sum, v) => sum + v.count, 0)}
                        </span>
                      </div>
                    </div>

                    {/* Product Variants */}
                    <div className="px-4 sm:px-6 py-4 space-y-3">
                      {product.variants.map((variant) => (
                        <div key={variant.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          {/* Variant Info */}
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className={`w-3 h-3 rounded-full border ${getColorStyle(variant.color)} flex-shrink-0`} />
                            <span className="text-xs font-medium text-gray-700 truncate">
                              {variant.color} • {variant.size}
                            </span>
                          </div>

                          {/* Count Controls */}
                          <div className="flex items-center gap-2 ml-2">
                            <button
                              onClick={() => updateVariantCount(order.orderId, product.id, variant.id, variant.count - 1)}
                              className="w-7 h-7 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                              disabled={variant.count === 0}
                            >
                              <Minus size={12} />
                            </button>
                            
                            <span className="w-8 text-center text-sm font-bold text-gray-800">
                              {variant.count}
                            </span>
                            
                            <button
                              onClick={() => updateVariantCount(order.orderId, product.id, variant.id, variant.count + 1)}
                              className="w-7 h-7 bg-green-100 hover:bg-green-200 text-green-600 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            {order.status === 'pending' && (
              <div className="p-4 sm:p-6 bg-gray-50">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleCancelOrder(order.orderId)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleConfirmOrder(order.orderId)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {/* Status Message for Completed Orders */}
            {order.status !== 'pending' && (
              <div className="p-4 sm:p-6 bg-gray-50">
                <div className={`text-center py-2 px-4 rounded-lg font-semibold text-sm ${getStatusColor(order.status)}`}>
                  {order.status === 'confirmed' ? '✓ Order Confirmed' : '✗ Order Cancelled'}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No orders found</h3>
          <p className="text-gray-500">Orders will appear here when they're ready for packaging.</p>
        </div>
      )}
    </div>
  );
};

export default Packaging;