import React from 'react';
import { CreditCard, User, Store, Calendar, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Payment = () => {
  // Static payment data for design
  const payments = [
    {
      id: 1,
      salesmanName: "Rajesh Kumar",
      sellerName: "Amit Patel",
      shopName: "Patel Electronics Store",
      amountCollected: "₹15,750",
      date: "2024-01-15",
      status: "completed",
      time: "2:30 PM",
      paymentMethod: "Cash",
      notes: "All products delivered and payment received"
    },
    {
      id: 2,
      salesmanName: "Priya Sharma",
      sellerName: "Suresh Verma",
      shopName: "Verma Fashion Boutique",
      amountCollected: "₹8,900",
      date: "2024-01-15",
      status: "pending",
      time: "11:45 AM",
      paymentMethod: "UPI",
      notes: "Payment pending - customer requested invoice first"
    },
    {
      id: 3,
      salesmanName: "Vikram Singh",
      sellerName: "Meera Reddy",
      shopName: "Reddy Home Decor",
      amountCollected: "₹22,500",
      date: "2024-01-15",
      status: "completed",
      time: "4:15 PM",
      paymentMethod: "Card",
      notes: "Payment completed via credit card"
    },
    {
      id: 4,
      salesmanName: "Anjali Desai",
      sellerName: "Rahul Gupta",
      shopName: "Gupta Sports Equipment",
      amountCollected: "₹12,300",
      date: "2024-01-15",
      status: "pending",
      time: "1:20 PM",
      paymentMethod: "Cash",
      notes: "Partial payment received, balance pending"
    },
    {
      id: 5,
      salesmanName: "Karan Malhotra",
      sellerName: "Neha Kapoor",
      shopName: "Kapoor Beauty Salon",
      amountCollected: "₹18,600",
      date: "2024-01-15",
      status: "completed",
      time: "3:45 PM",
      paymentMethod: "UPI",
      notes: "Full payment received via UPI"
    },
    {
      id: 6,
      salesmanName: "Divya Iyer",
      sellerName: "Arjun Menon",
      shopName: "Menon Book Store",
      amountCollected: "₹6,800",
      date: "2024-01-15",
      status: "pending",
      time: "10:30 AM",
      paymentMethod: "Cash",
      notes: "Customer will pay tomorrow"
    },
    {
      id: 7,
      salesmanName: "Rahul Sharma",
      sellerName: "Kavita Singh",
      shopName: "Singh Kitchen Appliances",
      amountCollected: "₹31,200",
      date: "2024-01-15",
      status: "completed",
      time: "5:00 PM",
      paymentMethod: "Card",
      notes: "Premium appliances - payment completed"
    },
    {
      id: 8,
      salesmanName: "Sneha Reddy",
      sellerName: "Vikrant Mehta",
      shopName: "Mehta Mobile Store",
      amountCollected: "₹14,750",
      date: "2024-01-15",
      status: "completed",
      time: "2:00 PM",
      paymentMethod: "UPI",
      notes: "Mobile accessories - payment received"
    }
  ];

  const getStatusConfig = (status) => {
    if (status === 'completed') {
      return {
        bgColor: 'bg-success/20',
        borderColor: 'border-success',
        textColor: 'text-success',
        icon: <CheckCircle className="w-5 h-5" />,
        label: 'Completed',
        cardBg: 'bg-success/15',
        headerBg: 'bg-success/20',
        accentBg: 'bg-success/25',
        hoverBg: 'hover:bg-success/20'
      };
    } else {
      return {
        bgColor: 'bg-danger/20',
        borderColor: 'border-danger',
        textColor: 'text-danger',
        icon: <Clock className="w-5 h-5" />,
        label: 'Pending',
        cardBg: 'bg-danger/15',
        headerBg: 'bg-danger/20',
        accentBg: 'bg-danger/25',
        hoverBg: 'hover:bg-danger/20'
      };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPaymentMethodIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'cash':
        return <DollarSign className="w-4 h-4" />;
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'upi':
        return <div className="w-4 h-4 bg-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">U</div>;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const totalCollected = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + parseInt(p.amountCollected.replace('₹', '').replace(',', '')), 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + parseInt(p.amountCollected.replace('₹', '').replace(',', '')), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">Payment Management</h1>
          <p className="text-body mt-2">Track all payment collections and pending amounts</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="btn btn-primary flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Add Payment</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-light rounded-xl p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body text-sm font-medium">Total Collected Today</p>
              <p className="text-2xl font-bold text-heading">₹{totalCollected.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-light rounded-xl p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body text-sm font-medium">Pending Amount</p>
              <p className="text-2xl font-bold text-heading">₹{pendingAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-danger" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-light rounded-xl p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body text-sm font-medium">Total Transactions</p>
              <p className="text-2xl font-bold text-heading">{payments.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-heading">Today's Payments</h2>
          <div className="flex items-center space-x-2">
            <select className="px-3 py-2 border border-light rounded-lg text-body focus:border-primary focus:ring-primary">
              <option>All Status</option>
              <option>Completed</option>
              <option>Pending</option>
            </select>
            <select className="px-3 py-2 border border-light rounded-lg text-body focus:border-primary focus:ring-primary">
              <option>All Salesmen</option>
              <option>Rajesh Kumar</option>
              <option>Priya Sharma</option>
              <option>Vikram Singh</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {payments.map((payment) => {
            const statusConfig = getStatusConfig(payment.status);
            
            return (
              <div 
                key={payment.id} 
                className={`${statusConfig.cardBg} ${statusConfig.hoverBg} border-2 ${statusConfig.borderColor} rounded-xl p-6 shadow-soft transition-all duration-300 hover:shadow-medium`}
              >
                {/* Header with Status */}
                <div className={`${statusConfig.headerBg} rounded-lg p-3 mb-4 border border-white/30`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {statusConfig.icon}
                      <span className={`font-semibold ${statusConfig.textColor}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-body">{payment.time}</p>
                      <p className="text-xs text-body">{formatDate(payment.date)}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="space-y-4">
                  {/* Salesman Info */}
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${statusConfig.accentBg} rounded-full flex items-center justify-center`}>
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-body">Salesman</p>
                      <p className="font-semibold text-heading">{payment.salesmanName}</p>
                    </div>
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${statusConfig.accentBg} rounded-full flex items-center justify-center`}>
                      <Store className="w-5 h-5 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-body">Seller & Shop</p>
                      <p className="font-semibold text-heading">{payment.sellerName}</p>
                      <p className="text-sm text-body">{payment.shopName}</p>
                    </div>
                  </div>

                  {/* Amount and Payment Method */}
                  <div className={`flex items-center justify-between pt-3 border-t ${statusConfig.accentBg} border-opacity-40`}>
                    <div>
                      <p className="text-sm text-body">Amount Collected</p>
                      <p className="text-2xl font-bold text-heading">{payment.amountCollected}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-body">Payment Method</p>
                      <div className="flex items-center space-x-2">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        <span className="font-medium text-heading">{payment.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {payment.notes && (
                    <div className={`pt-3 border-t ${statusConfig.accentBg} border-opacity-40`}>
                      <p className="text-sm text-body">Notes</p>
                      <p className="text-sm text-heading italic">{payment.notes}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className={`flex space-x-3 mt-4 pt-4 border-t ${statusConfig.accentBg} border-opacity-40`}>
                  {payment.status === 'pending' ? (
                    <>
                      <button className="flex-1 bg-success text-white py-2 px-4 rounded-lg font-medium hover:bg-success-dark transition-colors duration-200 flex items-center justify-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark Complete</span>
                      </button>
                      <button className={`px-4 py-2 text-danger hover:${statusConfig.accentBg} rounded-lg transition-colors duration-200`}>
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button className="flex-1 bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200">
                      View Details
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Payment;
