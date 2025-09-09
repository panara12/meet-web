
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetSeller } from '../../hooks/packaging/useGetSeller';
import ErrorMessage from '../../component/ui/errorMessage';

function Dashboard() {

  const { data: getSellerList, isPending, isError, error } = useGetSeller();
  const [seller, setSeller] = useState([]);

  useEffect(() => {
    if (getSellerList?.seller?.seller_data) {
      setSeller(getSellerList.seller.seller_data);
    }
  }, [getSellerList]);



  return (
    <div className="bg-gray-50 ">
      {isError && <ErrorMessage message={error.message}/>}
      {isPending && <div>loading data...</div>}
      <div className="w-full px-4 py-4 sm:px-6 lg:px-8">
        {/* seller List Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
            {seller.map((singleSeller, index) => (
                <Link to="/packaging/orderslist" key={index}>
                    <div 
                         
                        className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                        index !== seller.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                    >
                        {/* Left section with avatar and details */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Avatar */}
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1E3986] text-white rounded-full flex items-center justify-center font-semibold text-sm sm:text-base flex-shrink-0">
                            {singleSeller.avatar || 'U'}
                        </div>
                        
                        {/* singleSeller details */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                            {singleSeller.seller_name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 truncate mt-1">
                            {singleSeller.seller_address}
                            </p>
                        </div>
                        </div>

                        {/* Right section with time and notification */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Time ago */}
                        <span className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                            {singleSeller.createdAt}
                        </span>
                        
                        {/* Notification badge */}
                        {singleSeller.notificationCount|| 4 > 0 && (
                            <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                            {singleSeller.notificationCount || 4}
                            </div>
                        )}
                        </div>
                    </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Empty state - uncomment if needed when list is empty */}
        {/* 
        {companies.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600">Start by adding your first company to the system.</p>
          </div>
        )}
        */}
      </div>
    </div>
  );
}

export default Dashboard