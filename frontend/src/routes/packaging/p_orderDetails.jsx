import React, { useState } from 'react';
import { Minus, Plus, Check, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Sample data structure based on your screenshot
const sampleOrder = {
  id: '1',
  orderNumber: 'ORD-2024-001',
  date: '2024-01-15',
  status: 'pending',
  totalItems: 15,
  items: [
    {
      id: '1',
      name: 'Executive Office Chairs',
      description: 'Ergonomic leather chairs with adjustable height',
      price: 299.99,
      quantity: 5,
      instructions: 'Assemble before delivery. Place in conference room.',
      sentToBilling: false,
      cartoonCount: null
    },
    {
      id: '2',
      name: 'Standing Desks',
      description: 'Electric height-adjustable desks',
      price: 599.99,
      quantity: 3,
      instructions: 'Position near windows for natural light',
      sentToBilling: true,
      cartoonCount: 2
    },
    {
      id: '3',
      name: 'Leo bottle',
      description: 'Ergonomic leather chairs with adjustable height',
      price: 299.99,
      quantity: 10,
      instructions: 'Assemble before delivery. Place in conference room.',
      sentToBilling: false,
      cartoonCount: null
    },
    {
      id: '4',
      name: 'goodday bottle',
      description: 'Ergonomic leather chairs with adjustable height',
      price: 399.99,
      quantity: 3,
      instructions: 'Assemble before delivery. Place in conference room.',
      sentToBilling: false,
      cartoonCount: null
    }
  ]
};

const OrderDetails = () => {
  const [order, setOrder] = useState(sampleOrder);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showCartoonDialog, setShowCartoonDialog] = useState(false);
  const [cartoonCount, setCartoonCount] = useState(1);

  const handleItemToggle = (itemId) => {
    const item = order.items.find(item => item.id === itemId);
    if (item?.sentToBilling) return;
    
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleQuantityChange = (itemId, delta) => {
    const item = order.items.find(item => item.id === itemId);
    if (!item || item.sentToBilling) return;
    
    const newQuantity = Math.max(1, item.quantity + delta);
    const updatedItems = order.items.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setOrder({ ...order, items: updatedItems });
  };

  const handleSelectAll = () => {
    const availableItemIds = order.items
      .filter(item => !item.sentToBilling)
      .map(item => item.id);
    setSelectedItems(new Set([...selectedItems, ...availableItemIds]));
  };

  const handleSelectNone = () => {
    const sentToBillingIds = order.items
      .filter(item => item.sentToBilling)
      .map(item => item.id);
    setSelectedItems(new Set(sentToBillingIds));
  };

  const handleSendToBilling = () => {
    const newlySelectedCount = Array.from(selectedItems).filter(itemId => {
      const item = order.items.find(i => i.id === itemId);
      return item && !item.sentToBilling;
    }).length;

    if (newlySelectedCount > 0) {
      setShowCartoonDialog(true);
    }
  };

  const handleCartoonConfirm = () => {
    const updatedItems = order.items.map(item => ({
      ...item,
      sentToBilling: item.sentToBilling || selectedItems.has(item.id),
      cartoonCount: (selectedItems.has(item.id) && !item.sentToBilling) ? cartoonCount : item.cartoonCount
    }));

    setOrder({ ...order, items: updatedItems });
    setShowCartoonDialog(false);
    setSelectedItems(new Set());
  };

  const availableItemsCount = order.items.filter(item => !item.sentToBilling).length;
  const newlySelectedCount = Array.from(selectedItems).filter(itemId => {
    const item = order.items.find(i => i.id === itemId);
    return item && !item.sentToBilling;
  }).length;

  const selectedAmount = order.items
    .filter(item => selectedItems.has(item.id) && !item.sentToBilling)
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className='flex items-center'>
            <Link to="/packaging/orderslist" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Order #{order.orderNumber}
                </h2>
                <p className="text-sm text-gray-500">
                {order.date} • {order.totalItems} Items
                </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="flex gap-2 mb-4">
          <button 
            onClick={handleSelectAll}
            disabled={availableItemsCount === 0}
            className="flex-1 md:flex-none px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Select All
          </button>
          <button 
            onClick={handleSelectNone}
            disabled={newlySelectedCount === 0}
            className="flex-1 md:flex-none px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Select None
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Selected: {newlySelectedCount} Items ({availableItemsCount} available) • ${selectedAmount.toFixed(2)}
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="space-y-4">
          {order.items.map((item) => (
            <div 
              key={item.id}
              className={`bg-white rounded-lg border border-gray-200 p-4 transition-opacity ${
                item.sentToBilling ? 'opacity-60 bg-gray-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center mt-1">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => handleItemToggle(item.id)}
                    disabled={item.sentToBilling}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-base md:text-lg font-medium ${
                        item.sentToBilling ? 'text-gray-400 line-through' : 'text-gray-900'
                      }`}>
                        {item.name}
                      </h4>
                      {item.description && (
                        <p className={`text-sm mt-1 ${
                          item.sentToBilling ? 'text-gray-400 line-through' : 'text-gray-600'
                        }`}>
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <div className={`text-base md:text-lg font-medium ${
                        item.sentToBilling ? 'text-gray-400' : 'text-gray-900'
                      }`}>
                        ${item.price}
                      </div>
                      
                      {!item.sentToBilling ? (
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 mt-2">
                          Qty: {item.quantity}
                        </div>
                      )}
                    </div>
                  </div>

                  {item.instructions && (
                    <div className={`mt-3 p-3 bg-gray-100 rounded-lg ${
                      item.sentToBilling ? 'opacity-60' : ''
                    }`}>
                      <p className={`text-sm ${
                        item.sentToBilling ? 'line-through text-gray-400' : 'text-gray-700'
                      }`}>
                        <span className="font-medium">Instructions: </span>
                        {item.instructions}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className={`px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium ${
                      item.sentToBilling ? 'opacity-60' : ''
                    }`}>
                      ${(item.price * item.quantity).toFixed(2)} total
                    </span>
                    {item.sentToBilling && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        Sent to Billing
                      </span>
                    )}
                    {item.cartoonCount && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {item.cartoonCount} cartoons
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 p-4 md:p-6">
        <div className="border-t border-gray-200 pt-4 justify-between flex">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-base font-medium text-gray-900">
                Selected Items: {newlySelectedCount}
              </div>
              <div className="text-base font-medium text-gray-900">
                Total Amount: ${selectedAmount.toFixed(2)}
              </div>
            </div>
          </div>
          <div className=''>
            <button 
                onClick={handleSendToBilling}
                disabled={newlySelectedCount === 0}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Send to Billing {newlySelectedCount > 0 ? `(${newlySelectedCount})` : ''}
            </button>
          </div>
        </div>
      </div>

      {/* Cartoon Count Dialog */}
      {showCartoonDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Set Cartoon Count</h3>
            <p className="text-sm text-gray-600 mb-4">
              How many cartoons should be included with the {newlySelectedCount} selected item{newlySelectedCount !== 1 ? 's' : ''}?
            </p>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setCartoonCount(Math.max(1, cartoonCount - 1))}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xl font-medium w-12 text-center">
                {cartoonCount}
              </span>
              <button
                onClick={() => setCartoonCount(cartoonCount + 1)}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCartoonDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCartoonConfirm}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;