import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { TrendingUp, DollarSign, MapPin, Plus } from 'lucide-react';

const SalesmanDashboard = () => {
  const [activeSalesman, setActiveSalesman] = useState(0);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Sample salesmen data - you can make this dynamic
  const salesmenData = [
    {
      id: 1,
      name: "Rajesh Kumar",
      status: "active",
      totalOrders: 45,
      collectedPayment: 125000,
    },
    {
      id: 2,
      name: "Amit Patel",
      status: "active",
      totalOrders: 32,
      collectedPayment: 89500,
    },
    {
      id: 3,
      name: "Vikram Shah",
      status: "inactive",
      totalOrders: 28,
      collectedPayment: 67800,
    },
    {
      id: 4,
      name: "Kiran Joshi",
      status: "active",
      totalOrders: 38,
      collectedPayment: 102300,
    }
  ];

  const handleSalesmanClick = (index) => {
    setActiveSalesman(index);
    setIsMapLoaded(false); // Reset map when switching salesman
  };

  const handleLoadMap = () => {
    setIsMapLoaded(true);
  };


  const SalesmanCard = ({ salesman, index, isActive, onClick }) => (
    <div
      className={`
        relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
        ${isActive 
          ? 'bg-blue-50 border-blue-500 shadow-lg shadow-blue-100' 
          : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md'
        }
      `}
      onClick={() => onClick(index)}
    >
      <div className="flex items-center mb-3">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
          {salesman.name.charAt(0)}
        </div>
        <div className="ml-3">
          <h3 className="font-semibold text-gray-800">{salesman.name}</h3>
          <p className={`text-sm capitalize ${
            salesman.status === 'active' ? 'text-green-600' : 'text-gray-500'
          }`}>
            {salesman.status}
          </p>
        </div>
      </div>

      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-b-lg"></div>
      )}
    </div>
  );

  const MapPlaceholder = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 h-96">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-500" />
          Live Location - {salesmenData[activeSalesman].name}
        </h3>
      </div>
      
      {!isMapLoaded ? (
        <div className="bg-gray-100 rounded-lg h-full flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">Load Live Location</h4>
            <p className="text-sm text-gray-500 mb-4">Click below to view {salesmenData[activeSalesman].name}'s current location</p>
            <button
              onClick={handleLoadMap}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center mx-auto"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Get Live Location
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg h-full flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-gray-300"></div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10 text-center">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg animate-pulse">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white px-3 py-2 rounded-lg shadow-md">
              <p className="text-sm font-medium text-gray-800">{salesmenData[activeSalesman].name}</p>
              <p className="text-xs text-gray-500">Live Location Active</p>
            </div>
          </div>
          
          {/* Loading animation rings */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 bg-red-400 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Salesman Dashboard</h1>
          <div className="flex justify-end">
            <Link to='/distributer/salesman/addsalesman'
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center hover:shadow-lg hover:transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              <span className="text-sm lg:text-base">Add Salesman</span>
            </Link>
          </div>
        </div>
        
        {/* Salesman Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {salesmenData.map((salesman, index) => (
            <SalesmanCard
              key={salesman.id}
              salesman={salesman}
              index={index}
              isActive={activeSalesman === index}
              onClick={handleSalesmanClick}
            />
          ))}
        </div>

        {/* Stats and Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Stats Cards */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-800">{salesmenData[activeSalesman].totalOrders}</p>
                </div>
                <div className="bg-blue-500 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">Collected Payment</p>
                  <p className="text-2xl font-bold text-gray-800">₹{salesmenData[activeSalesman].collectedPayment.toLocaleString()}</p>
                </div>
                <div className="bg-green-500 p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-2">
            <MapPlaceholder />
          </div>
        </div>

      </div>
    </div>
  );
};

export default SalesmanDashboard;