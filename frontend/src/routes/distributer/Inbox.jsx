import React, { useState } from "react"
import { 
  Inbox, 
  Mail, 
  MailOpen, 
  Star, 
  StarOff, 
  Trash2, 
  Download, 
  Search,
  Calendar,
  User,
  AlertTriangle,
  Info,
  Settings,
  Megaphone,
  Wrench,
  Shield,
  Headphones,
  ArrowLeft,
  Clock,
  X
} from "lucide-react"

// Mock Data
const mockMessages = [
  {
    id: "1",
    subject: "OrderFlow System Update v2.1.5 Available",
    content: `Dear OrderFlow Administrator,

We're excited to announce the release of OrderFlow v2.1.5, which includes several important improvements and new features:

New Features:
• Enhanced inventory tracking with low-stock alerts
• Improved staff management interface
• Advanced reporting capabilities
• Mobile-responsive dashboard improvements

Bug Fixes:
• Fixed issue with payment confirmations not updating properly
• Resolved client list sorting problems
• Improved system stability during peak usage

Security Updates:
• Enhanced data encryption protocols
• Updated authentication systems
• Improved session management

This update will be automatically deployed to your system within the next 24 hours. No action is required on your part.

If you experience any issues after the update, please contact our support team immediately.

Best regards,
VoidVortex Technologies Team`,
    sender: "VoidVortex Update Team",
    senderEmail: "updates@voidvortex.tech",
    timestamp: "2024-01-15T10:30:00Z",
    category: "update",
    priority: "medium",
    isRead: false,
    isStarred: true,
    attachments: [
      { name: "OrderFlow_v2.1.5_Release_Notes.pdf", size: "2.3 MB" },
      { name: "Update_Installation_Guide.pdf", size: "1.1 MB" }
    ]
  },
  {
    id: "2",
    subject: "New Feature: Advanced Analytics Dashboard",
    content: `Hello OrderFlow User,

We're thrilled to introduce our new Advanced Analytics Dashboard, now available in your OrderFlow system!

Key Features:
• Real-time sales performance metrics
• Staff productivity analytics
• Inventory turnover analysis
• Customer behavior insights
• Predictive forecasting tools

Getting Started:
1. Navigate to the Dashboard section
2. Click on "Advanced Analytics" tab
3. Explore the various report types available
4. Customize your view with filters and date ranges

Training Resources:
We've prepared comprehensive training materials to help you make the most of these new features. Check out our knowledge base for video tutorials and step-by-step guides.

We're confident these new analytics tools will help you make more informed business decisions and optimize your operations.

Happy analyzing!
VoidVortex Product Team`,
    sender: "VoidVortex Product Team",
    senderEmail: "product@voidvortex.tech",
    timestamp: "2024-01-12T14:45:00Z",
    category: "feature",
    priority: "high",
    isRead: true,
    isStarred: false,
    attachments: [
      { name: "Analytics_User_Guide.pdf", size: "3.7 MB" }
    ]
  },
  {
    id: "3",
    subject: "Scheduled Maintenance - January 20th, 2024",
    content: `Important: Scheduled System Maintenance

Dear OrderFlow Users,

We will be performing scheduled maintenance on our servers to improve system performance and security.

Maintenance Details:
• Date: January 20th, 2024
• Time: 2:00 AM - 4:00 AM EST
• Duration: Approximately 2 hours
• Impact: Brief service interruptions possible

During this maintenance window, you may experience:
- Temporary login delays
- Slow response times
- Brief service unavailability (less than 10 minutes total)

What We're Updating:
• Server infrastructure improvements
• Database optimization
• Security patches
• Performance enhancements

Preparation Tips:
- Save any ongoing work before 2:00 AM EST
- Avoid critical operations during maintenance window
- Clear your browser cache after maintenance completes

We apologize for any inconvenience and appreciate your patience as we work to improve your OrderFlow experience.

VoidVortex Operations Team`,
    sender: "VoidVortex Operations",
    senderEmail: "operations@voidvortex.tech",
    timestamp: "2024-01-10T09:15:00Z",
    category: "maintenance",
    priority: "urgent",
    isRead: false,
    isStarred: false,
    attachments: []
  },
  {
    id: "4",
    subject: "Security Enhancement: Two-Factor Authentication",
    content: `Important Security Update

Dear OrderFlow Administrator,

We're implementing enhanced security measures to better protect your business data and user accounts.

New Security Features:
• Two-Factor Authentication (2FA) for all admin accounts
• Enhanced password requirements
• Session timeout improvements
• Login attempt monitoring

Action Required:
All administrator accounts must set up 2FA within the next 14 days. Here's how:

1. Go to Settings > Security
2. Click "Enable Two-Factor Authentication"
3. Scan QR code with your authenticator app
4. Enter verification code to confirm setup

Recommended Authenticator Apps:
• Google Authenticator
• Microsoft Authenticator  
• Authy

Benefits of 2FA:
- Prevents unauthorized access even if password is compromised
- Meets industry security standards
- Protects sensitive business data
- Provides audit trail for access attempts

If you need assistance with setup, our support team is ready to help.

Stay secure,
VoidVortex Security Team`,
    sender: "VoidVortex Security Team",
    senderEmail: "security@voidvortex.tech",
    timestamp: "2024-01-08T16:20:00Z",
    category: "security",
    priority: "high",
    isRead: true,
    isStarred: true,
    attachments: [
      { name: "2FA_Setup_Guide.pdf", size: "1.8 MB" }
    ]
  },
  {
    id: "5",
    subject: "OrderFlow Community: Share Your Success Stories",
    content: `Join Our Community Success Program!

Dear Valued OrderFlow User,

We love hearing about how OrderFlow is helping businesses like yours succeed! We're launching our Community Success Program to showcase real customer achievements.

Share Your Story:
• How has OrderFlow improved your business operations?
• What challenges did you overcome?
• What results have you achieved?

Participation Benefits:
- Featured in our newsletter and social media
- Exclusive access to beta features
- Direct line to our product development team
- Recognition in our annual customer awards

How to Participate:
1. Email your story to community@voidvortex.tech
2. Include before/after metrics if available
3. Add photos of your team or workspace (optional)
4. Tell us what features you love most

Success Story Spotlight:
This month we're featuring "ABC Distribution Company" who increased their order processing efficiency by 40% using OrderFlow's automation features.

We can't wait to hear your success story and celebrate your achievements with our community!

Best regards,
VoidVortex Community Team`,
    sender: "VoidVortex Community",
    senderEmail: "community@voidvortex.tech",
    timestamp: "2024-01-05T11:00:00Z",
    category: "announcement",
    priority: "low",
    isRead: true,
    isStarred: false,
    attachments: []
  },
  {
    id: "6",
    subject: "Support Ticket #12345 - Resolved",
    content: `Support Ticket Resolution

Ticket #12345 has been resolved successfully.

Original Issue:
"Unable to generate monthly sales reports - getting timeout error"

Resolution Summary:
Our technical team identified the issue was caused by a database query timeout when processing large datasets. We've implemented the following fixes:

• Optimized database queries for report generation
• Increased timeout limits for complex reports
• Added progress indicators for long-running reports
• Implemented background processing for large datasets

Your monthly sales reports should now generate properly without timeout errors.

Next Steps:
1. Try generating your monthly report again
2. Contact us if you experience any further issues
3. Consider upgrading to our Premium plan for enhanced reporting features

We appreciate your patience while we resolved this issue. Your feedback helps us improve OrderFlow for all users.

If you have any questions about this resolution, please reply to this message.

Best regards,
VoidVortex Support Team
Ticket #12345`,
    sender: "VoidVortex Support",
    senderEmail: "support@voidvortex.tech",
    timestamp: "2024-01-03T13:30:00Z",
    category: "support",
    priority: "medium",
    isRead: false,
    isStarred: false,
    attachments: [
      { name: "Resolution_Details.pdf", size: "956 KB" }
    ]
  }
]

// Category Icons
const categoryIcons = {
  update: Settings,
  feature: Megaphone,
  maintenance: Wrench,
  security: Shield,
  announcement: Info,
  support: Headphones
}

const priorityColors = {
  low: 'text-gray-600 bg-gray-50 border-gray-200',
  medium: 'text-blue-600 bg-blue-50 border-blue-200', 
  high: 'text-orange-600 bg-orange-50 border-orange-200',
  urgent: 'text-red-600 bg-red-50 border-red-200'
}

// Simple UI Components
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => onOpenChange(false)} />
      <div className="bg-white rounded-lg shadow-lg z-10 w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  )
}

const DialogContent = ({ children }) => (
  <div className="flex flex-col h-full">
    {children}
  </div>
)

const DialogHeader = ({ children, className = "" }) => (
  <div className={`p-4 border-b flex-shrink-0 ${className}`}>
    {children}
  </div>
)

const DialogTitle = ({ children, className = "" }) => (
  <h2 className={`text-lg font-semibold ${className}`}>
    {children}
  </h2>
)

const DialogDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-600 mt-2 ${className}`}>
    {children}
  </p>
)

const Card = ({ children, className = "", onClick }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`} onClick={onClick}>
    {children}
  </div>
)

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
)

const Button = ({ children, onClick, disabled, variant = "default", size = "default", className = "" }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "hover:bg-gray-100 text-gray-700"
  }
  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base"
  }
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    destructive: "bg-red-100 text-red-800",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 text-gray-700"
  }
  
  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

const Input = ({ placeholder, value, onChange, className = "" }) => (
  <input
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
)

const Select = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        {value === 'all' ? 'All Categories' : value || "Select option"}
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
    onClick={() => onSelect && onSelect(value)}
    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
  >
    {children}
  </div>
)

const ScrollArea = ({ children, className = "" }) => (
  <div className={`overflow-auto ${className}`}>
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

// Main VoidVortexInbox Component
function VoidVortexInbox({ isOpen, onClose }) {
  // Mock context functions
  const messages = mockMessages
  const unreadCount = messages.filter(m => !m.isRead).length
  
  const [messagesState, setMessagesState] = useState(messages)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterRead, setFilterRead] = useState('all')
  const [showStarredOnly, setShowStarredOnly] = useState(false)

  // Mock functions
  const markAsRead = (messageId) => {
    setMessagesState(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ))
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage(prev => ({ ...prev, isRead: true }))
    }
  }

  const markAsUnread = (messageId) => {
    setMessagesState(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: false } : msg
    ))
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage(prev => ({ ...prev, isRead: false }))
    }
  }

  const toggleStar = (messageId) => {
    setMessagesState(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ))
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage(prev => ({ ...prev, isStarred: !prev.isStarred }))
    }
  }

  const deleteMessage = (messageId) => {
    setMessagesState(prev => prev.filter(msg => msg.id !== messageId))
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage(null)
    }
  }

  const markAllAsRead = () => {
    setMessagesState(prev => prev.map(msg => ({ ...msg, isRead: true })))
    if (selectedMessage) {
      setSelectedMessage(prev => ({ ...prev, isRead: true }))
    }
  }

  // Filter messages based on search and filters
  const filteredMessages = messagesState.filter(message => {
    const matchesSearch = searchQuery === '' || 
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.sender.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = filterCategory === 'all' || message.category === filterCategory
    const matchesRead = filterRead === 'all' || 
      (filterRead === 'read' && message.isRead) ||
      (filterRead === 'unread' && !message.isRead)
    const matchesStarred = !showStarredOnly || message.isStarred

    return matchesSearch && matchesCategory && matchesRead && matchesStarred
  })

  const handleMessageClick = (message) => {
    setSelectedMessage(message)
    if (!message.isRead) {
      markAsRead(message.id)
    }
  }

  const handleStarToggle = (messageId, event) => {
    event.stopPropagation()
    toggleStar(messageId)
  }

  const handleDelete = (messageId, event) => {
    event.stopPropagation()
    deleteMessage(messageId)
    toast.success('Message deleted')
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null)
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />
      default:
        return null
    }
  }

  const currentUnreadCount = messagesState.filter(m => !m.isRead).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="flex flex-col lg:flex-row h-[80vh] min-h-0">
          {/* Message List Sidebar */}
          <div className="w-full lg:w-1/3 border-b lg:border-r lg:border-b-0 flex flex-col min-h-0 h-[45vh] lg:h-full">
            <DialogHeader className="p-4 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-blue-600" />
                  VoidVortex Messages
                  {currentUnreadCount > 0 && (
                    <Badge variant="destructive">
                      {currentUnreadCount}
                    </Badge>
                  )}
                </DialogTitle>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <DialogDescription>
                Updates and messages from VoidVortex Technologies
              </DialogDescription>
            </DialogHeader>

            {/* Search and Filters */}
            <div className="p-4 border-b space-y-3 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="update">Updates</SelectItem>
                    <SelectItem value="feature">Features</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="announcement">Announcements</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </Select>
                  <Select value={filterRead} onValueChange={setFilterRead}>
                    <SelectItem value="all">All Messages</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={showStarredOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowStarredOnly(!showStarredOnly)}
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Starred
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={markAllAsRead}
                  >
                    Mark All Read
                  </Button>
                </div>
              </div>
            </div>

            {/* Message List */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-2 space-y-2">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No messages found</p>
                    </div>
                  ) : (
                    filteredMessages.map((message) => {
                      const CategoryIcon = categoryIcons[message.category]
                      const isSelected = selectedMessage?.id === message.id
                      
                      return (
                        <Card
                          key={message.id}
                          className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${
                            isSelected ? 'ring-2 ring-blue-500 border-l-blue-500' : 'border-l-transparent'
                          } ${!message.isRead ? 'bg-blue-50 border-l-blue-600' : ''}`}
                          onClick={() => handleMessageClick(message)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                <CategoryIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-600" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    {!message.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />}
                                    {getPriorityIcon(message.priority)}
                                    <p className={`text-sm truncate ${!message.isRead ? 'font-semibold' : ''}`}>
                                      {message.subject}
                                    </p>
                                  </div>
                                  <p className="text-xs text-gray-600 truncate mb-1">
                                    {message.sender}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                      {message.category}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {formatDate(message.timestamp)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 hover:bg-yellow-100"
                                  onClick={(e) => handleStarToggle(message.id, e)}
                                >
                                  {message.isStarred ? (
                                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                  ) : (
                                    <StarOff className="h-3.5 w-3.5 text-gray-400" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-100"
                                  onClick={(e) => handleDelete(message.id, e)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Message Content */}
          <div className="flex-1 flex flex-col min-h-0 h-[55vh] lg:h-full">
            {selectedMessage ? (
              <>
                {/* Message Header */}
                <div className="p-4 border-b flex-shrink-0">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedMessage(null)}
                            className="p-1.5 h-auto lg:hidden hover:bg-gray-100"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </Button>
                          <h3 className="text-lg font-semibold truncate">{selectedMessage.subject}</h3>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{selectedMessage.sender}</span>
                            <span className="text-xs hidden sm:inline">({selectedMessage.senderEmail})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span className="text-xs">{new Date(selectedMessage.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <Badge variant="outline" className={`text-xs ${priorityColors[selectedMessage.priority]}`}>
                            {selectedMessage.priority} priority
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {selectedMessage.category}
                          </Badge>
                          {selectedMessage.isStarred && (
                            <Badge variant="outline" className="text-yellow-600 text-xs">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              Starred
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => selectedMessage.isRead ? markAsUnread(selectedMessage.id) : markAsRead(selectedMessage.id)}
                      >
                        {selectedMessage.isRead ? (
                          <>
                            <Mail className="w-4 h-4 mr-2" />
                            <span>Mark Unread</span>
                          </>
                        ) : (
                          <>
                            <MailOpen className="w-4 h-4 mr-2" />
                            <span>Mark Read</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStar(selectedMessage.id)}
                      >
                        {selectedMessage.isStarred ? (
                          <>
                            <StarOff className="w-4 h-4 mr-2" />
                            <span>Unstar</span>
                          </>
                        ) : (
                          <>
                            <Star className="w-4 h-4 mr-2" />
                            <span>Star</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          deleteMessage(selectedMessage.id)
                          setSelectedMessage(null)
                          toast.success('Message deleted')
                        }}
                        className="text-responsive-xs btn-responsive-sm text-red-primary hover:text-red-700 hover:bg-red-light"
                      >
                        <Trash2 className="icon-responsive-sm mr-2" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 min-h-0 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="responsive-padding">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <div className="whitespace-pre-wrap text-responsive-sm leading-relaxed">
                          {selectedMessage.content}
                        </div>
                      </div>

                      {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                        <div className="mt-6 pt-4 border-t">
                          <h4 className="text-responsive-sm font-medium mb-3">
                            Attachments ({selectedMessage.attachments.length})
                          </h4>
                          <div className="space-y-3">
                            {selectedMessage.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <div className="w-8 h-8 bg-blue-light rounded flex items-center justify-center flex-shrink-0">
                                    <Download className="icon-responsive-sm text-blue-primary" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-responsive-xs font-medium truncate">{attachment.name}</p>
                                    <p className="text-xs text-muted-foreground">{attachment.size}</p>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" className="text-responsive-xs btn-responsive-sm ml-3">
                                  <Download className="icon-responsive-sm mr-2" />
                                  Download
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center responsive-padding">
                  <Inbox className="icon-responsive-lg mx-auto mb-4 opacity-50" />
                  <h3 className="text-responsive-lg font-medium mb-2">No message selected</h3>
                  <p className="text-responsive-xs opacity-75">Select a message from the list to view its contents</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default VoidVortexInbox