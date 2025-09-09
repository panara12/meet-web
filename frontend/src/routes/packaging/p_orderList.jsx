import { useState } from 'react';
import { Package, ArrowLeft, Clock, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

function OrdersList() {
  const [orders] = useState([
    {
      id: "ORD-2024-001",
      items: 15,
      amount: "$2450",
      date: "2024-01-15",
      status: "pending",
      statusColor: "bg-orange-100 text-orange-800"
    },
    {
      id: "ORD-2024-002",
      items: 8,
      amount: "$1200",
      date: "2024-01-12",
      status: "processing",
      statusColor: "bg-blue-100 text-blue-800"
    },
    {
      id: "ORD-2024-003",
      items: 22,
      amount: "$3150",
      date: "2024-01-10",
      status: "shipped",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      id: "ORD-2024-004",
      items: 5,
      amount: "$890",
      date: "2024-01-08",
      status: "delivered",
      statusColor: "bg-gray-100 text-gray-800"
    },
    {
      id: "ORD-2024-005",
      items: 12,
      amount: "$1780",
      date: "2024-01-05",
      status: "cancelled",
      statusColor: "bg-red-100 text-red-800"
    },
    {
      id: "ORD-2024-006",
      items: 18,
      amount: "$2340",
      date: "2024-01-03",
      status: "pending",
      statusColor: "bg-orange-100 text-orange-800"
    },
    {
      id: "ORD-2024-007",
      items: 9,
      amount: "$1450",
      date: "2024-01-01",
      status: "processing",
      statusColor: "bg-blue-100 text-blue-800"
    }
  ]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Settings className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Main Content */}
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
        {/* Company Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Link to="/packaging/dashboard" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="w-10 h-10 bg-[#1E3986] text-white rounded-full flex items-center justify-center font-semibold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Acme Corporation</h1>
              <p className="text-sm text-gray-600">Office supplies and equipment</p>
            </div>
          </div>
        </div>

        {/* Orders List Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
            
            {orders.map((order, index) => (
                <Link to="/packaging/orderdetails">
                    <div 
                        key={order.id} 
                        className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                        index !== orders.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                    >
                        {/* Left section with icon and order details */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Order Icon */}
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1E3986] text-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        
                        {/* Order details */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                            Order {order.id}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            {order.items} Items • {order.amount}
                            </p>
                        </div>
                        </div>

                        {/* Right section with status and date */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        {/* Status Badge */}
                        <div className="flex items-center gap-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                            </span>
                        </div>
                        
                        {/* Date */}
                        <span className="text-xs text-gray-500">
                            {order.date}
                        </span>
                        </div>
                    </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-[#1E3986]">{orders.length}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600">
              ${orders.reduce((sum, order) => sum + parseInt(order.amount.replace('$', '').replace(',', '')), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {orders.filter(order => order.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter(order => order.status === 'processing').length}
            </div>
            <div className="text-sm text-gray-600">Processing</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersList