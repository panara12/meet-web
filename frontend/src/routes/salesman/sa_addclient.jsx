import React, { useState } from "react";
import { useAddSeller } from "../../hooks/seller/useAddSeller";
import ErrorMessage from "../../component/ui/errorMessage";
import SuccessMessage from "../../component/ui/successMessage";

export default function AddClient() {
  const [formData, setFormData] = useState({
    company_name: "",
    primary_contact_person: "",
    primary_email: "",
    phone_number: "",
    website: "",
    business_address: "",
    city: "",
    client_status: "",
    business_priority: "",
    payment_terms: "",
    industry: "",
    company_size: "",
    credit_limit: "",
    gst_number: "",
    business_note: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const {mutate:addSeller,isPending, isError, error} = useAddSeller({
    onSuccess: (res) => {
    setSuccessMessage(res.data.message);
  },
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    addSeller(formData);

    {isPending && 
      setFormData({
          company_name: "",
          primary_contact_person: "",
          primary_email: "",
          phone_number: "",
          website: "",
          business_address: "",
          city: "",
          client_status: "",
          business_priority: "",
          payment_terms: "",
          industry: "",
          company_size: "",
          credit_limit: "",
          gst_number: "",
          business_note: "",
        });
    }
  };

      

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Add New Client</h1>
        <p className="text-gray-500 text-sm">
          Add a new client to your customer database.
        </p>
      </div>

      <div
        className="bg-white shadow rounded-2xl p-4 sm:p-6 space-y-6"
      >
        {/* Company Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#1E3986]">
            Company Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
                placeholder="Enter company name"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                GST Number *
              </label>
              <input
                type="text"
                required
                value={formData.gst_number}
                onChange={(e) => handleChange("gst_number", e.target.value)}
                placeholder="Enter GST number"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                pattern="\d{10}"
                value={formData.phone_number}
                onChange={(e) => handleChange("phone_number", e.target.value)}
                placeholder="1234567890"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Primary Email
              </label>
              <input
                type="email"
                value={formData.primary_email}
                onChange={(e) => handleChange("primary_email", e.target.value)}
                placeholder="contact@example.com"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="https://example.com"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Person
              </label>
              <input
                type="text"
                value={formData.primary_contact_person}
                onChange={(e) =>
                  handleChange("primary_contact_person", e.target.value)
                }
                placeholder="Contact person"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#1E3986]">
            Business Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Address
              </label>
              <textarea
                rows={2}
                value={formData.business_address}
                onChange={(e) =>
                  handleChange("business_address", e.target.value)
                }
                placeholder="Enter business address"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Enter city"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Client Status
              </label>
              <select
                value={formData.client_status}
                onChange={(e) => handleChange("client_status", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              >
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="vip client">VIP Client</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Priority
              </label>
              <select
                value={formData.business_priority}
                onChange={(e) =>
                  handleChange("business_priority", e.target.value)
                }
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              >
                <option value="">Select priority</option>
                <option value="high priority">High</option>
                <option value="medium priority">Medium</option>
                <option value="low priority">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => handleChange("industry", e.target.value)}
                placeholder="e.g. Electronics"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Size
              </label>
              <input
                type="text"
                value={formData.company_size}
                onChange={(e) => handleChange("company_size", e.target.value)}
                placeholder="e.g. 10-50 employees"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Credit Limit ($)
              </label>
              <input
                type="number"
                value={formData.credit_limit}
                onChange={(e) => handleChange("credit_limit", e.target.value)}
                placeholder="10000"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Terms
              </label>
              <select
                value={formData.payment_terms}
                onChange={(e) => handleChange("payment_terms", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              >
                <option value="">Select terms</option>
                <option value="net15">Net 15</option>
                <option value="net30">Net 30</option>
                <option value="net45">Net 45</option>
                <option value="net60">Net 60</option>
                <option value="cod">Cash on Delivery</option>
                <option value="advance">Advance Payment</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-[#1E3986]">Notes</h2>
          <textarea
            rows={3}
            value={formData.business_note}
            onChange={(e) => handleChange("business_note", e.target.value)}
            placeholder="Any additional notes..."
            className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border text-gray-600 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="px-4 py-2 rounded-lg text-white text-sm"
            style={{
              backgroundColor: isPending ? '#888' : '#1E3986',
              cursor: isPending ? 'not-allowed' : 'pointer',
              opacity: isPending ? 0.7 : 1,
            }}
          >
            {isPending ? 'Adding client...' : 'Add client'}
          </button>
        </div>

        {isError && <ErrorMessage message={error?.response?.data?.message} />}
        {successMessage != "" && <SuccessMessage message={successMessage} />}
    </div>
  </div>
  );
}
