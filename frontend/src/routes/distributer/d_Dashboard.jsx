import { Icon } from "@iconify/react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.app.userInfo);
  // setuserinfo(loggedUser.data.user);
  // console.log(loggedUser);


  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] p-6">
        <h1 className="text-2xl font-bold text-[#1e293b] mb-2">
          Welcome to {userInfo.username} Dashboard
        </h1>
        <p className="text-[#64748b]">
          Hello, {userInfo?.user_email || 'User'}! Manage your business operations from here.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-3">
        {/* Sellers */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] p-6 
                        hover:shadow-lg hover:border-[#3b82f6] hover:-translate-y-1 
                        transition-all duration-300 cursor-pointer">
          <a className="flex items-center " href="/distributer/seller">
            <div className="w-12 h-12 bg-[#3b82f6] rounded-lg flex items-center justify-center 
                            group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-xl">
                <Icon icon="iconoir:user-cart" width="24" height="24" />
              </span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#64748b]">Sellers</p>
              <p className="text-2xl font-bold text-[#1e293b]">24</p>
            </div>
          </a>
        </div>

        {/* Salesman */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] p-6 
                        hover:shadow-lg hover:border-[#10b981] hover:-translate-y-1 
                        transition-all duration-300 cursor-pointer">
          <a className="flex items-center" href="/distributer/salesman">
            <div className="w-12 h-12 bg-[#10b981] rounded-lg flex items-center justify-center 
                            transition-transform duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-xl">
                <Icon icon="fa7-solid:user-tie" width="24" height="24" />
              </span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#64748b]">Salesman</p>
              <p className="text-2xl font-bold text-[#1e293b]">156</p>
            </div>
          </a>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] p-6 
                        hover:shadow-lg hover:border-[#f59e0b] hover:-translate-y-1 
                        transition-all duration-300 cursor-pointer">
          <a className="flex items-center" href="/distributer/packaging">
            <div className="w-12 h-12 bg-[#f59e0b] rounded-lg flex items-center justify-center 
                            transition-transform duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-xl">
                <Icon icon="tabler:packge-export" width="24" height="24" />
              </span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#64748b]">Packaging</p>
              <p className="text-2xl font-bold text-[#1e293b]">12</p>
            </div>
          </a>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] p-6 
                        hover:shadow-lg hover:border-[#ef4444] hover:-translate-y-1 
                        transition-all duration-300 cursor-pointer">
          <a className="flex items-center" href="/distributer/payment">
            <div className="w-12 h-12 bg-[#ef4444] rounded-lg flex items-center justify-center 
                            transition-transform duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-xl">$</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#64748b]">Payment</p>
              <p className="text-2xl font-bold text-[#1e293b]">₹45.2K</p>
            </div>
          </a>
        </div>
      </div>


      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] p-6">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-[#f8fafc] rounded-lg">
            <div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div>
            <span className="text-[#64748b]">New product "Premium Widget" added by Seller ABC</span>
            <span className="text-xs text-[#94a3b8] ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-[#f8fafc] rounded-lg">
            <div className="w-2 h-2 bg-[#10b981] rounded-full"></div>
            <span className="text-[#64748b]">Order #12345 completed successfully</span>
            <span className="text-xs text-[#94a3b8] ml-auto">4 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-[#f8fafc] rounded-lg">
            <div className="w-2 h-2 bg-[#f59e0b] rounded-full"></div>
            <span className="text-[#64748b]">New salesman "John Doe" registered</span>
            <span className="text-xs text-[#94a3b8] ml-auto">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
