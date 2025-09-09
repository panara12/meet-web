import { 
  UserPlus, 
  Plus,
  Calendar,
  DollarSign,
  Package,
  Zap
} from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-4 lg:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 mb-4 sm:mb-0">Here's an overview of your sales performance.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => setActiveSection('add-client')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1E3986] text-white rounded-lg hover:bg-[#162d73] transition-colors font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Add Client
          </button>
          <button 
            onClick={() => setActiveSection('add-order')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-[#1E3986] text-[#1E3986] rounded-lg hover:bg-[#1E3986] hover:text-white transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Order
          </button>
        </div>
      </div>

      {/* Current Period */}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
        <span>Current Period: September 2025</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Sales Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Sales</h3>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">$0</div>
            <div className="flex items-center gap-1">
              <span className="text-green-600 font-medium">+0%</span>
              <span className="text-sm text-gray-600">from last month</span>
            </div>
            <div className="text-xs text-gray-500">Resets on 1st of each month</div>
          </div>
        </div>

        {/* Monthly Orders Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Orders</h3>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="flex items-center gap-1">
              <span className="text-blue-600 font-medium">+0%</span>
              <span className="text-sm text-gray-600">from last month</span>
            </div>
            <div className="text-xs text-gray-500">Resets on 1st of each month</div>
          </div>
        </div>
      </div>

      {/* Quick Notes Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-900">Quick Notes</h3>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-[#1E3986] hover:text-[#162d73] transition-colors">
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        <div className="space-y-4">
          {/* Monthly Target */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-blue-900 mb-1">Monthly Target</div>
                <div className="text-sm text-blue-700">
                  <span className="font-medium">Target:</span> Reach $75k sales this month
                </div>
              </div>
            </div>
          </div>

          {/* Client Follow-Up */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-green-900 mb-1">Client Follow-Up</div>
                <div className="text-sm text-green-700">
                  <span className="font-medium">Follow-Up:</span> Call premium clients this week
                </div>
              </div>
            </div>
          </div>

          {/* Proposal Update */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-yellow-900 mb-1">Proposal Update</div>
                <div className="text-sm text-yellow-700">
                  <span className="font-medium">Reminder:</span> Update client proposals by Friday
                </div>
              </div>
            </div>
          </div>

          {/* Team Meeting */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-purple-900 mb-1">Team Meeting</div>
                <div className="text-sm text-purple-700">
                  <span className="font-medium">Meeting:</span> Team review next Monday 10 AM
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
