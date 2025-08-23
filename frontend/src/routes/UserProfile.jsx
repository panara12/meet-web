import React from 'react';
import { User, Building, Calendar, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const UserProfile = () => {
  // Static data for design purposes
  const planData = {
    planName: "Business Pro",
    planType: "Annual",
    startDate: "2024-01-15",
    expiryDate: "2025-01-15",
    price: "₹24,999",
    features: [
      {
        id: "oms",
        name: "OMS (Order Management System)",
        included: true,
        description: "Complete order processing and management",
        icon: "📦"
      },
      {
        id: "tracker",
        name: "Tracker",
        included: true,
        description: "Real-time tracking and analytics",
        icon: "📊"
      },
      {
        id: "payment",
        name: "Payment Gateway",
        included: true,
        description: "Integrated payment processing",
        icon: "💳"
      },
      {
        id: "analytics",
        name: "Advanced Analytics",
        included: false,
        description: "Advanced reporting and insights",
        icon: "📈"
      },
      {
        id: "api",
        name: "API Access",
        included: false,
        description: "REST API for integrations",
        icon: "🔌"
      },
      {
        id: "support",
        name: "Priority Support",
        included: false,
        description: "24/7 priority customer support",
        icon: "🎧"
      }
    ],
    billing: {
      nextBillingDate: "2025-01-15",
      autoRenew: true,
      paymentMethod: "Credit Card ending in 1234"
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button className="p-2 text-[#64748b] hover:text-[#3b82f6] hover:bg-[#f1f5f9] rounded-md transition-colors duration-200">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-[#1e293b]">User Profile</h1>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-[#3b82f6] text-white rounded-md hover:bg-[#2563eb] transition-colors duration-200">
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] p-6">
            <h2 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-[#3b82f6]" />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#64748b] mb-1">First Name</label>
                <input
                  type="text"
                  value="John"
                  disabled
                  className="w-full px-3 py-2 border border-[#e5e7eb] bg-[#f9fafb] text-[#6b7280] rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#64748b] mb-1">Last Name</label>
                <input
                  type="text"
                  value="Doe"
                  disabled
                  className="w-full px-3 py-2 border border-[#e5e7eb] bg-[#f9fafb] text-[#6b7280] rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#64748b] mb-1">Email</label>
                <input
                  type="email"
                  value="john.doe@example.com"
                  disabled
                  className="w-full px-3 py-2 border border-[#e5e7eb] bg-[#f9fafb] text-[#6b7280] rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#64748b] mb-1">Phone</label>
                <input
                  type="tel"
                  value="+91 98765 43210"
                  disabled
                  className="w-full px-3 py-2 border border-[#e5e7eb] bg-[#f9fafb] text-[#6b7280] rounded-md"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#64748b] mb-1">Company</label>
                <input
                  type="text"
                  value="Tech Solutions Ltd"
                  disabled
                  className="w-full px-3 py-2 border border-[#e5e7eb] bg-[#f9fafb] text-[#6b7280] rounded-md"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#64748b] mb-1">Address</label>
                <input
                  type="text"
                  value="123 Business Park, Tech Street"
                  disabled
                  className="w-full px-3 py-2 border border-[#e5e7eb] bg-[#f9fafb] text-[#6b7280] rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#64748b] mb-1">City</label>
                <input
                  type="text"
                  value="Mumbai"
                  disabled
                  className="w-full px-3 py-2 border border-[#e5e7eb] bg-[#f9fafb] text-[#6b7280] rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#64748b] mb-1">State</label>
                <input
                  type="text"
                  value="Maharashtra"
                  disabled
                  className="w-full px-3 py-2 border border-[#e5e7eb] bg-[#f9fafb] text-[#6b7280] rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#64748b] mb-1">Pincode</label>
                <input
                  type="text"
                  value="400001"
                  disabled
                  className="w-full px-3 py-2 border border-[#e5e7eb] bg-[#f9fafb] text-[#6b7280] rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Plan Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] p-6">
            <h2 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2 text-[#10b981]" />
              Plan Details
            </h2>
            
            <div className="space-y-4">
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-[#166534]">{planData.planName}</h3>
                  <span className="text-sm font-medium text-[#166534] bg-[#bbf7d0] px-2 py-1 rounded-full">
                    {planData.planType}
                  </span>
                </div>
                <p className="text-2xl font-bold text-[#166534] mb-2">{planData.price}</p>
                <div className="flex items-center space-x-4 text-sm text-[#166534]">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Started: {formatDate(planData.startDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Expires: {formatDate(planData.expiryDate)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-[#1e293b] mb-3">Plan Features</h4>
                <div className="space-y-2">
                  {planData.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                      <span className="text-lg">{feature.icon}</span>
                      {feature.included ? (
                        <CheckCircle className="w-5 h-5 text-[#10b981] mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-[#ef4444] mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className={`font-medium ${feature.included ? 'text-[#1e293b]' : 'text-[#6b7280]'}`}>
                          {feature.name}
                        </p>
                        <p className="text-sm text-[#64748b]">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4">
                <h4 className="font-medium text-[#1e293b] mb-3">Billing Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#64748b]">Next Billing:</span>
                    <span className="font-medium">{formatDate(planData.billing.nextBillingDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748b]">Auto Renew:</span>
                    <span className="font-medium">{planData.billing.autoRenew ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748b]">Payment Method:</span>
                    <span className="font-medium">{planData.billing.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
