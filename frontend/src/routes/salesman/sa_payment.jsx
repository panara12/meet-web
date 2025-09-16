import { useState } from 'react';
import dayjs from "dayjs";
import { CreditCard, Search, DollarSign, MessageSquare } from 'lucide-react';
import { useGetAllSeller } from '../../hooks/seller/useGetAllSeller';
import { useEffect } from 'react';
import { useAddPayment } from '../../hooks/payment/useAddPayment';
import { useSelector } from 'react-redux';
import { useGetSalesmanById } from '../../hooks/salesman/useGetSalesmanById';

export default function PaymentUpdate() {
  const [selectedClient, setSelectedClient] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const userInfo = useSelector((state) => state.app.userInfo);
  // console.log(userInfo)
  const id = userInfo.tenant_user_id
  const { data: getSellerList, isPending:sellerPending, isError:issellerError, error:sellerError } = useGetAllSeller();
  const {mutate:addPayment,isPending: isPaymentPending, isError : isPaymentError, error: paymentError} = useAddPayment()
  const {
  data: salesmanById,
  isPending: isSalesmanByIdPending,
  isError: isSalesmanByIdError,
  error: salesmanByIdError,} = useGetSalesmanById(id)
  const [seller, setSeller] = useState([]);

  useEffect(() => {
    if (getSellerList?.seller?.seller_data) {
      setSeller(getSellerList.seller.seller_data);
    }
  }, [getSellerList]);
  

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Filter clients based on search query
  const filteredClients = seller.filter(client =>
    client.company_name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    client.phone_number.toString().includes(clientSearchQuery) ||
    client.primary_email.toLowerCase().includes(clientSearchQuery)
  );

  const handleClientSearchChange = (value) => {
    setClientSearchQuery(value);
    setSelectedClient("");
    setShowClientDropdown(true);
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client._id);
    setClientSearchQuery(client.company_name);
    setShowClientDropdown(false);
  };

  // Generate payment ID
  const generatePaymentId = () => {
    return 'PAY-' + Date.now().toString().slice(-6);
  };

  const handleDone = () => {
    if (!selectedClient || !paymentAmount || !paymentType || !paymentDate) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount <= 0) {
      showToast("Please enter a valid payment amount", "error");
      return;
    }

    const client = seller.find(c => c._id === selectedClient);
    const payload = {
      payment_client:client._id,
      payment_amount:amount,
      payment_type:paymentType,
      payment_date:dayjs(paymentDate).format("DD-MM-YYYY"),
      order_with_payment:false
    }
    // console.log(payload);
    addPayment(payload)
    const paymentId = generatePaymentId();
    
    // Create comprehensive payment update message for WhatsApp
    const paymentDetails = `
✅ *PAYMENT CONFIRMATION RECEIPT*

📅 *Payment Date:* ${new Date(paymentDate).toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
🕐 *Confirmation Time:* ${new Date().toLocaleTimeString('en-US', { 
  hour: '2-digit', 
  minute: '2-digit',
  hour12: true 
})}

👤 *SALES REPRESENTATIVE*
• Name: ${salesmanById?.user.user_data.salesman_name}
• Phone: ${salesmanById?.user.user_data.salesman_mobile}

💰 *PAYMENT DETAILS*
• Amount Received: $${amount.toFixed(2)}
• Payment Method: ${paymentType}
• Payment Status: ✅ CONFIRMED

📋 *TRANSACTION STATUS*
Your payment has been successfully received and recorded in our system.  

--- 
For any queries regarding this transaction, please contact your distributor’s accounts department.
`.trim();


    // Success messages
    showToast(`Payment of $${amount.toFixed(2)} recorded for ${client?.company_name}`);
    showToast("Payment information sent to admin panel");
    
    // Send payment details to WhatsApp
    const whatsappUrl = `https://wa.me/${client?.phone_number}?text=${encodeURIComponent(paymentDetails)}`;
    window.open(whatsappUrl, '_blank');
    showToast(`Payment confirmation sent to ${client?.company_name} via WhatsApp`);

    // Reset form
    setSelectedClient("");
    setPaymentAmount("");
    setPaymentType("");
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setClientSearchQuery("");
  };

  const selectedClientData = seller.find(c => c._id === selectedClient);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-gray-600" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Payment Update</h1>
            <p className="text-sm text-gray-500">Record payment details and notify clients</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {/* Section Header */}
          <div className="flex items-center gap-2 mb-8">
            <DollarSign className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-medium text-gray-900">Record New Payment</h2>
          </div>

          <div className="space-y-6">
            {/* Select Client */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Client <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, or email..."
                    value={clientSearchQuery}
                    onChange={(e) => handleClientSearchChange(e.target.value)}
                    onFocus={() => setShowClientDropdown(true)}
                    className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1E3986] focus:border-transparent"
                  />
                </div>
                
                {/* Client Dropdown */}
                {showClientDropdown && clientSearchQuery && filteredClients.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                    {filteredClients.map((client) => (
                      <div
                        key={client._id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleClientSelect(client)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <div>
                            <p className="font-medium text-sm text-gray-900">{client.company_name}</p>
                            <p className="text-xs text-gray-500">{client.phone_number}</p>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{client.primary_email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* No results message */}
                {showClientDropdown && clientSearchQuery && filteredClients.length === 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-center">
                    <p className="text-sm text-gray-500">No clients found</p>
                  </div>
                )}
              </div>
              
              {/* Selected Client Display */}
              {selectedClientData && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                    <div className="h-10 w-10 rounded-full bg-[#1E3986]/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-[#1E3986]">
                        {selectedClientData.company_name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{selectedClientData.company_name}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-1 text-sm text-gray-500 truncate">
                        <p className="truncate">{selectedClientData.phone_number}</p>
                        <p className="truncate">{selectedClientData.primary_email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter payment amount"
                  className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1E3986] focus:border-transparent"
                />
              </div>
            </div>

            {/* Payment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Type <span className="text-red-500">*</span>
              </label>
              <select 
                value={paymentType} 
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full px-3 py-3 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1E3986] focus:border-transparent"
              >
                <option value="" className="text-gray-500">Select payment method</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
                <option value="online">Online</option>
              </select>
            </div>

            {/* Payment Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-3 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1E3986] focus:border-transparent"
              />
            </div>

            {/* Done Button */}
            <div className="flex justify-end pt-4">
              <button 
                onClick={handleDone}
                disabled={!selectedClient || !paymentAmount || !paymentType || !paymentDate}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1E3986] hover:bg-[#162d73] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1E3986] font-medium"
              >
                <MessageSquare className="h-4 w-4" />
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
