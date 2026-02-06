import React, { useEffect, useState } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Users, 
  IndianRupeeIcon, 
  ShoppingCart,
  Building2,
  UserPlus,
  PackagePlus,
  Plus,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Send,
  Mail,
  Inbox,
  CreditCard,
  X
} from "lucide-react"
import { Link } from 'react-router-dom';
import VoidVortexInbox from './Inbox'
import { useStaff } from "./StaffContext";
import { useInventory } from "./InventoryContext"
import { useCompany } from "./CompanyContext"
import { useSubAdminLogin } from "../../hooks/subadmin/useSubAdminLogin";
import { useSelector } from "react-redux";
import { useGetAllSubAdmins } from "../../hooks/subadmin/useGetAllSubAdmin";

// Simple UI Components
const Card = ({ children, className = "", onClick }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`} onClick={onClick}>
    {children}
  </div>
)

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-4 pb-2 ${className}`}>
    {children}
  </div>
)

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 pt-2 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`font-medium ${className}`}>
    {children}
  </h3>
)

const Button = ({ children, onClick, disabled, variant = "default", className = "" }) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
  }
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

const Badge = ({ children, variant = "default", className = "" }) => {
  const variantStyles = {
    default: "bg-blue-100 text-blue-800",
    destructive: "bg-red-100 text-red-800",
    secondary: "bg-gray-100 text-gray-800"
  }
  
  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => onOpenChange(false)} />
      <div className="bg-white rounded-lg shadow-lg z-10 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

const DialogContent = ({ children }) => (
  <div className="p-6">
    {children}
  </div>
)

const DialogHeader = ({ children }) => (
  <div className="mb-4">
    {children}
  </div>
)

const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold">
    {children}
  </h2>
)

const DialogDescription = ({ children }) => (
  <p className="text-sm text-gray-600 mt-2">
    {children}
  </p>
)

const Input = ({ placeholder, value, onChange, type = "text", className = "" }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
)

const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
)

const Textarea = ({ placeholder, value, onChange, rows = 4, className = "" }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={rows}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${className}`}
  />
)

const Select = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {value || "Select option"}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {React.Children.map(children, (child) => 
            React.cloneElement(child, { 
              onSelect: (val) => {
                onValueChange(val)
                setIsOpen(false)
              }
            })
          )}
        </div>
      )}
    </div>
  )
}

const SelectItem = ({ value, children, onSelect }) => (
  <div
    onClick={() => onSelect(value)}
    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
  >
    {children}
  </div>
)

// Toast function (simplified)
const toast = {
  success: (message) => {
    alert("Success: " + message)
  },
  error: (message) => {
    alert("Error: " + message)
  }
}

export default function Dashboard({ onNavigate }) {

  // Using mock data
  const { staff,limits } = useStaff()
  const {products} = useInventory()
  const {companies} = useCompany()
  const unreadCount = 2 // Mock unread count

  // Calculate metrics from actual data
  const activeStaff = staff.filter(s => s.status === 'Active').length
  const totalProducts = products.length
  const activeCompanies = companies.filter(c => c.status === 'active').length
  const lowStockProducts = products.filter(p => p.stockQuantity <= p.lowStockThreshold).length
  const outOfStockProducts = products.filter(p => p.stockQuantity === 0).length
  const userInfo = useSelector((state) => state.app.userInfo)

  const [showSubAdminLogin, setShowSubAdminLogin] = useState(false)
  const [subAdminCredentials, setSubAdminCredentials] = useState({
    username: '',
    password: ''
  })
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const {data:listsubadmin} = useGetAllSubAdmins()
  console.log("list subadmin ",listsubadmin);
  const { mutate: subAdminLogin, isPending: isSubAdminLoginPending ,isError: isSubAdminLoginError, error: subAdminLoginError} = useSubAdminLogin({
    onSuccess: (response) => {
      console.log("seccess")
      toast.success('SubAdmin login successful!')
      setShowSubAdminLogin(false)
      setSubAdminCredentials({ username: '', password: '' })
      setIsLoggingIn(false)
      
      // Make sure your login hook updates userInfo in Redux/Context
      // with subadminusername field
    },
    onError: (error) => {
      console.log("error",error)
      toast.error(error?.response?.data?.message || 'Login failed. Please check your credentials.')
      setIsLoggingIn(false)
    }
  })
  

  useEffect(() => {
    const shouldShowSubAdminLogin = 
      limits?.data?.[0]?.isAdminMembers && 
      !userInfo?.subadminusername

    if (shouldShowSubAdminLogin) {
      const timer = setTimeout(() => {
        setShowSubAdminLogin(true)
      }, 500) // 500ms delay for better UX
      
      return () => clearTimeout(timer)
    }
  }, [limits, userInfo])
  
  // Staff distribution by role
  // console.log(limits?.data[0].adminlimit)
  const adminCount = limits?.data[0].adminlimit
  const packagerCount = limits?.data[0].packagelimit
  const billerCount = limits?.data[0].billinglimit
  const salesmanCount = limits?.data[0].salesmanlimit
  // Total inventory value
  const totalInventoryValue = products.reduce((sum, product) => {
    return sum + (product.price * product.stockQuantity)
  }, 0)

  // Contact form state
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    priority: 'medium'
  })
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [showInbox, setShowInbox] = useState(false)

  // Handle SubAdmin Login Submit
  const handleSubAdminLogin = () => {
    if (!subAdminCredentials.username || !subAdminCredentials.password) {
      toast.error('Please enter both username and password')
      return
    }

    setIsLoggingIn(true)
    subAdminLogin(subAdminCredentials)
  }

  // Optional: Handle Skip Login
  const handleSkipSubAdminLogin = () => {
    setShowSubAdminLogin(false)
    toast.success('You can login later from your profile settings')
  }

  // Handle contact form submission
  const handleContactSubmit = async () => {
    if (!contactFormData.name || !contactFormData.email || !contactFormData.subject || !contactFormData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmittingMessage(true)
    
    try {
      // Simulate API call to VoidVortex Tech
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Message sent successfully! VoidVortex Tech will respond within 24-48 hours.')
      setShowContactDialog(false)
      setContactFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: '',
        priority: 'medium'
      })
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmittingMessage(false)
    }
  }

  let quickActions = [
    {
      title: "Add Staff Member",
      description: "Create new staff account",
      icon: UserPlus,
      action: () => onNavigate && onNavigate('staff'),
      color: "bg-blue-500 hover:bg-blue-600",
      textColor: "text-white",
      to:"/distributer/staff"
    },
    {
      title: "Add Product",
      description: "Add new inventory item",
      icon: PackagePlus,
      action: () => onNavigate && onNavigate('inventory'),
      color: "bg-green-500 hover:bg-green-600",
      textColor: "text-white",
      to:"/distributer/inventory"
    },
    {
      title: "Add Company",
      description: "Register new company",
      icon: Building2,
      action: () => onNavigate && onNavigate('company'),
      color: "bg-purple-500 hover:bg-purple-600",
      textColor: "text-white",
      to:"/distributer/company"
    },
    {
      title: "Payment Confirmations",
      description: "Review salesman payments",
      icon: CreditCard,
      action: () => onNavigate && onNavigate('payments'),
      color: "bg-teal-500 hover:bg-teal-600",
      textColor: "text-white",
      hasNotification: false,
      to:"/distributer/payments"
    },
    // {
    //   title: "Contact VoidVortex",
    //   description: "Request features & updates",
    //   icon: MessageSquare,
    //   action: () => setShowContactDialog(true),
    //   color: "bg-orange-500 hover:bg-orange-600",
    //   textColor: "text-white"
    // },
    // {
    //   title: "VoidVortex Messages",
    //   description: `Company updates & news${unreadCount > 0 ? ` (${unreadCount} new)` : ''}`,
    //   icon: Inbox,
    //   action: () => setShowInbox(true),
    //   color: "bg-indigo-500 hover:bg-indigo-600",
    //   textColor: "text-white",
    //   hasNotification: unreadCount > 0
    // }
  ]

  if (!limits?.data[0].wantToUsePayment) {
    quickActions = quickActions.filter(action => action.title !== "Payment Confirmations")
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="w-full">
      <div className="ml-10 lg:hidden">
        <h1 className="text-xl">Dashboard</h1>
      </div>
      <div className="space-y-4 p-4">
        {/* Welcome Section */}
        {/* <div className="flex flex-col space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold">Welcome to OrderFlow</h1>
          <p className="text-gray-600">
            Here's an overview of your business operations and quick actions to get things done.
          </p>
        </div> */}

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              if(action.to){
                return (
                  <Link to={action.to}>
                    <Card 
                      key={index} 
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-2 hover:border-blue-200 relative"
                      onClick={action.action}
                    >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${action.color} relative flex-shrink-0`}>
                          <Icon className={`h-5 w-5 ${action.textColor}`} />
                          {action.hasNotification && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{action.title}</h3>
                          <p className="text-sm text-gray-600 truncate">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card> 
                </Link>)
              }
              return (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-2 hover:border-blue-200 relative"
                  onClick={action.action}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${action.color} relative flex-shrink-0`}>
                        <Icon className={`h-5 w-5 ${action.textColor}`} />
                        {action.hasNotification && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{action.title}</h3>
                        <p className="text-sm text-gray-600 truncate">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                <Users className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeStaff}</div>
                <p className="text-xs text-gray-600">
                  <span className="text-green-600">●</span> {staff.length} total members
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
                {/* <p className="text-xs text-gray-600">
                  {lowStockProducts > 0 ? (
                    <span className="text-amber-600">
                      <AlertTriangle className="inline h-3 w-3 mr-1" />
                      {lowStockProducts} low stock
                    </span>
                  ) : (
                    <span className="text-green-600">
                      <CheckCircle className="inline h-3 w-3 mr-1" />
                      Stock levels healthy
                    </span>
                  )}
                </p> */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
                <Building2 className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCompanies}</div>
                <p className="text-xs text-gray-600">
                  <span className="text-blue-600">●</span> {companies.length} total companies
                </p>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <IndianRupeeIcon className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalInventoryValue)}</div>
                <p className="text-xs text-gray-600">
                  {outOfStockProducts > 0 ? (
                    <span className="text-red-600">
                      {outOfStockProducts} out of stock
                    </span>
                  ) : (
                    <span className="text-green-600">All items in stock</span>
                  )}
                </p>
              </CardContent>
            </Card> */}
          </div>
        </div>

        {/* SubAdmin Distribution - Only show if isAdminMembers is true */}
        {limits?.data?.[0]?.isAdminMembers && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">SubAdmin Activity</h2>
            {listsubadmin?.subadmins && listsubadmin.subadmins.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listsubadmin.subadmins.map((subadmin) => {
                  // Get last 3 login entries, sorted by most recent first
                  const recentLogins = [...(subadmin.log_history || [])]
                    .sort((a, b) => new Date(b.login_time) - new Date(a.login_time))
                    .slice(0, 3);
                  
                  return (
                    <Card key={subadmin._id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-medium">{subadmin.name}</CardTitle>
                          <Badge variant="default" className="text-xs">
                            @{subadmin.username}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">Recent Login History</span>
                          </div>
                          
                          {recentLogins.length > 0 ? (
                            <div className="space-y-2">
                              {recentLogins.map((log, index) => {
                                const loginDate = new Date(log.login_time);
                                const logoutDate = log.logout_time ? new Date(log.logout_time) : null;
                                
                                return (
                                  <div 
                                    key={log._id} 
                                    className={`p-2 rounded-lg border bg-gray-50 border-gray-200`}
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs font-medium text-gray-700">
                                        Login #{recentLogins.length - index}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-600 space-y-0.5">
                                      <div className="flex items-center gap-1">
                                        <span className="font-medium">In:</span>
                                        <span>{loginDate.toLocaleDateString('en-US', { 
                                          month: 'short', 
                                          day: 'numeric',
                                          year: 'numeric'
                                        })}</span>
                                        <span className="text-gray-400">•</span>
                                        <span>{loginDate.toLocaleTimeString('en-US', { 
                                          hour: '2-digit', 
                                          minute: '2-digit'
                                        })}</span>
                                      </div>
                                      {logoutDate && (
                                        <div className="flex items-center gap-1">
                                          <span className="font-medium">Out:</span>
                                          <span>{logoutDate.toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric',
                                            year: 'numeric'
                                          })}</span>
                                          <span className="text-gray-400">•</span>
                                          <span>{logoutDate.toLocaleTimeString('en-US', { 
                                            hour: '2-digit', 
                                            minute: '2-digit'
                                          })}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="p-4 text-center bg-gray-50 rounded-lg border border-gray-200">
                              <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">No login history yet</p>
                            </div>
                          )}
                          
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No SubAdmins Yet</h3>
                  <p className="text-sm text-gray-600">
                    No SubAdmin accounts have been created yet. SubAdmins will appear here once they're added to the system.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* System Status */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Activity className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">All Systems Operational</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Sync</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Synchronized</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Last sync: {new Date().toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                <AlertTriangle className={`h-4 w-4 ${lowStockProducts > 0 ? 'text-amber-600' : 'text-green-600'}`} />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${lowStockProducts > 0 ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                  <span className="text-sm font-medium">
                    {lowStockProducts > 0 ? `${lowStockProducts} Alert${lowStockProducts > 1 ? 's' : ''}` : 'No Alerts'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {lowStockProducts > 0 ? 'Low stock items need attention' : 'All systems normal'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t">
          <p className="text-sm text-gray-600 text-center">
            The OMS Admin Panel - Streamlining your business operations
          </p>
        </div>

        {/* Contact VoidVortex Tech Dialog */}
        <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-500" />
                Contact VoidVortex Tech
              </DialogTitle>
              <DialogDescription>
                Have questions about features, updates, or need technical support? Send us a message and we'll get back to you within 24-48 hours.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Full Name *</Label>
                  <Input
                    id="contact-name"
                    placeholder="Your full name"
                    value={contactFormData.name}
                    onChange={(e) => setContactFormData({...contactFormData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email Address *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="your@email.com"
                    value={contactFormData.email}
                    onChange={(e) => setContactFormData({...contactFormData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-category">Category</Label>
                  <Select 
                    value={contactFormData.category} 
                    onValueChange={(value) => setContactFormData({...contactFormData, category: value})}
                  >
                    <SelectItem value="feature-request">Feature Request</SelectItem>
                    <SelectItem value="bug-report">Bug Report</SelectItem>
                    <SelectItem value="technical-support">Technical Support</SelectItem>
                    <SelectItem value="system-update">System Update Inquiry</SelectItem>
                    <SelectItem value="integration">Integration Request</SelectItem>
                    <SelectItem value="feedback">General Feedback</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-priority">Priority Level</Label>
                  <Select 
                    value={contactFormData.priority} 
                    onValueChange={(value) => setContactFormData({...contactFormData, priority: value})}
                  >
                    <SelectItem value="low">Low - General inquiry</SelectItem>
                    <SelectItem value="medium">Medium - Standard request</SelectItem>
                    <SelectItem value="high">High - Urgent issue</SelectItem>
                    <SelectItem value="critical">Critical - System down</SelectItem>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-subject">Subject *</Label>
                <Input
                  id="contact-subject"
                  placeholder="Brief summary of your inquiry"
                  value={contactFormData.subject}
                  onChange={(e) => setContactFormData({...contactFormData, subject: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-message">Message *</Label>
                <Textarea
                  id="contact-message"
                  placeholder="Please provide detailed information about your request, including any specific features you'd like to see, issues you're experiencing, or questions you have about upcoming updates..."
                  rows={6}
                  value={contactFormData.message}
                  onChange={(e) => setContactFormData({...contactFormData, message: e.target.value})}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800 mb-1">Contact Information</p>
                    <p className="text-blue-700">
                      <strong>Company:</strong> VoidVortex Technologies<br/>
                      <strong>Support Email:</strong> support@voidvortex.tech<br/>
                      <strong>Response Time:</strong> 24-48 hours<br/>
                      <strong>Business Hours:</strong> Mon-Fri 9AM-6PM EST
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={handleContactSubmit} 
                  disabled={isSubmittingMessage}
                  className="flex-1"
                >
                  {isSubmittingMessage ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowContactDialog(false)}
                  disabled={isSubmittingMessage}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* VoidVortex Inbox */}
        <VoidVortexInbox isOpen={showInbox} onClose={() => setShowInbox(false)} />
        {console.log("userinfo ",userInfo?.subadmin_username)}
        {/* SubAdmin Login Dialog */}
        {limits?.data?.[0]?.isAdminMembers && userInfo.subadmin_username==undefined && (
        <Dialog open={showSubAdminLogin} onOpenChange={(open) => {
          // Prevent closing without login
          if (!open && !userInfo?.subadminusername) {
            toast.error('SubAdmin login is required to continue')
            return
          }
          setShowSubAdminLogin(open)
        }}>
          <DialogContent>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                  SubAdmin Login Required
                </DialogTitle>
              </div>
              <DialogDescription>
                Please login with your SubAdmin credentials to access the dashboard.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="subadmin-username">Username *</Label>
                <Input
                  id="subadmin-username"
                  type="text"
                  placeholder="Enter your SubAdmin username"
                  value={subAdminCredentials.username}
                  onChange={(e) => setSubAdminCredentials({
                    ...subAdminCredentials, 
                    username: e.target.value
                  })}
                  disabled={isLoggingIn}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSubAdminLogin()
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subadmin-password">Password *</Label>
                <Input
                  id="subadmin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={subAdminCredentials.password}
                  onChange={(e) => setSubAdminCredentials({
                    ...subAdminCredentials, 
                    password: e.target.value
                  })}
                  disabled={isLoggingIn}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSubAdminLogin()
                  }}
                />
              </div>

              <div className="flex sm:flex-row gap-3">
                <Button 
                  onClick={handleSubAdminLogin} 
                  disabled={isLoggingIn}
                  className="flex justify-center p-2 flex-1 items-center"
                >
                  {isSubAdminLoginPending ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Login
                    </>
                  )}
                </Button>
              </div>

              {/* <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  Forgot your credentials?{' '}
                  <button 
                    onClick={() => {
                      setShowSubAdminLogin(false)
                      setShowContactDialog(true)
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Contact Support
                  </button>
                </p>
              </div> */}
            </div>
          </DialogContent>
        </Dialog>
      )}
      </div>
    </div>
  )
}

