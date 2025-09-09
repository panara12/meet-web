import React, { useState } from 'react';
import { Search, Phone, Mail, MapPin, Edit3, Eye, ChevronDown } from 'lucide-react';

const Dashboard = () => {
  const [selectedClient, setSelectedClient] = useState('John Smith');
  const [selectedOrder, setSelectedOrder] = useState('#ORD-2024-001');
  const [showOrderItems, setShowOrderItems] = useState(true);
  const [showOrderNotes, setShowOrderNotes] = useState(false);

  const clients = [
    {
      name: 'John Smith',
      company: 'Tech Solutions Inc.',
      initials: 'JS',
      pendingBills: 1,
      totalAmount: 10454,
      orders: [
        {
          id: '#ORD-2024-001',
          status: 'PENDING',
          ordered: '1/15/2024',
          expected: '1/22/2024',
          items: [
            { name: 'Premium Packaging Box', quantity: 500, price: 12.5, total: 6250 },
            { name: 'Bubble Wrap Roll', quantity: 10, price: 25, total: 250 }
          ],
          totalAmount: 6500,
          billingDetails: null
        },
        {
          id: '#ORD-2024-002',
          status: 'COMPLETED',
          ordered: '1/10/2024',
          expected: '1/18/2024',
          items: [],
          totalAmount: 3954,
          billingDetails: {
            billNumbers: ['BILL-001', 'BILL-002'],
            transportBilly: 'FTL-789456',
            transportName: 'FastTrack Logistics',
            billedDate: '1/16/2024'
          }
        }
      ],
      address: '123 Business Ave, Tech City, TC 12345'
    },
    {
      name: 'Sarah Johnson',
      company: 'Global Manufacturing Corp',
      initials: 'SJ',
      pendingBills: 1,
      totalAmount: 900,
      orders: [],
      address: '456 Industrial Blvd, Metro City, MC 54321'
    },
    {
      name: 'Michael Brown',
      company: 'Retail Plus Ltd.',
      initials: 'MB',
      pendingBills: 0,
      totalAmount: 3250,
      orders: [],
      address: '789 Commerce St, Trade Town, TT 98765'
    },
    {
      name: 'Emily Davis',
      company: 'Healthcare Innovations',
      initials: 'ED',
      pendingBills: 1,
      totalAmount: 9600,
      orders: [],
      address: '321 Medical Dr, Health City, HC 11223'
    },
    {
      name: 'Robert Wilson',
      company: 'Construction Materials Co.',
      initials: 'RW',
      pendingBills: 1,
      totalAmount: 5550,
      orders: [],
      address: '654 Builder Ave, Construct City, CC 44556'
    }
  ];

  const currentClient = clients.find(client => client.name === selectedClient);
  const currentOrder = currentClient?.orders.find(order => order.id === selectedOrder);

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            {clients.map((client) => (
              <div
                key={client.name}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedClient === client.name
                    ? 'bg-gray-100 border-l-4 border-blue-600'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  setSelectedClient(client.name);
                  setSelectedOrder(client.orders[0]?.id || '');
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                      {client.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{client.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{client.company}</p>
                      <p className="text-sm text-gray-400">{client.pendingBills} pending</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">${client.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {currentClient && (
            <div className="p-6">
              {/* Client Header */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-medium">
                      {currentClient.initials}
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">{currentClient.name}</h2>
                      <p className="text-gray-600">{currentClient.company}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{currentClient.pendingBills}</div>
                    <div className="text-gray-500">Pending Bills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">${currentClient.totalAmount.toLocaleString()}</div>
                    <div className="text-gray-500">Total Amount</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{currentClient.orders.length}</div>
                    <div className="text-gray-500">Total Bills</div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Shipping Address</span>
                      <span className="text-sm text-gray-500">(Click to view/edit)</span>
                    </div>
                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                      <Edit3 className="w-4 h-4" />
                      Fix Address
                    </button>
                  </div>
                  <p className="text-gray-700 mt-2">{currentClient.address}</p>
                </div>
              </div>

              {/* Orders */}
              {currentClient.orders.length > 0 && (
                <div className="space-y-6">
                  {currentClient.orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <h3 className="text-xl font-semibold">Order {order.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'PENDING' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                        <div className="flex items-center gap-1">
                          <span>📅 Ordered: {order.ordered}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>⏰ Expected: {order.expected}</span>
                        </div>
                      </div>

                      {/* Billing Details for Completed Orders */}
                      {order.billingDetails && (
                        <div className="bg-green-50 rounded-lg p-4 mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="font-medium text-green-900">📋 Billing Details</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-green-800">Bill Numbers:</span>
                              <div className="text-green-600">{order.billingDetails.billNumbers.join(', ')}</div>
                            </div>
                            <div>
                              <span className="font-medium text-green-800">Transport Name:</span>
                              <div className="text-green-600">{order.billingDetails.transportName}</div>
                            </div>
                            <div>
                              <span className="font-medium text-green-800">Transport Billy:</span>
                              <div className="text-green-600">{order.billingDetails.transportBilly}</div>
                            </div>
                            <div>
                              <span className="font-medium text-green-800">Billed Date:</span>
                              <div className="text-green-600">{order.billingDetails.billedDate}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Order Items */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Order Items</h4>
                          {order.items.length > 0 && (
                            <button 
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                              onClick={() => setShowOrderItems(!showOrderItems)}
                            >
                              <Eye className="w-4 h-4" />
                              {showOrderItems ? 'Hide' : 'Show'} Items
                            </button>
                          )}
                        </div>

                        {order.items.length > 0 && showOrderItems ? (
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-sm text-gray-600">
                                    Quantity: {item.quantity} • Price per unit: ${item.price}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">${item.total.toLocaleString()}</div>
                                  <div className="text-sm text-gray-500">Total</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : order.items.length === 0 && (
                          <p className="text-gray-500 text-sm">No items to display</p>
                        )}
                      </div>

                      {/* Total Amount */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">💰 Total Amount</span>
                          <span className="text-2xl font-bold">${order.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Add Bill Button for Pending Orders */}
                      {order.status === 'PENDING' && (
                        <button className="w-full mt-4 bg-slate-800 text-white py-3 rounded-lg hover:bg-slate-700 transition-colors font-medium">
                          📄 Add Bill
                        </button>
                      )}

                      {/* Order Notes */}
                      <div className="mt-6 border-t pt-4">
                        <button 
                          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                          onClick={() => setShowOrderNotes(!showOrderNotes)}
                        >
                          <span>📝 Order Notes</span>
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">Has Notes</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${showOrderNotes ? 'rotate-180' : ''}`} />
                        </button>
                        {showOrderNotes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-gray-700 text-sm">Order notes would be displayed here...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;