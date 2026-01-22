import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { toast } from "sonner"
import {
  CreditCard,
  Check,
  X,
  Eye,
  Clock,
  IndianRupeeIcon,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  History,
  MoreHorizontal,
  Filter,
  Calendar,
  User,
  Building,
  Hash,
  ArrowUpDown,
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useGetAllPayment } from "../../hooks/payment/useGetAllPayment"
import { useUpdatePaymentStatus } from "../../hooks/payment/useUpdatePaymentStatus"
import { useSelector } from "react-redux"

// const mockPaymentRequests = [
//   {
//     id: "PR-001",
//     salesmanId: "SM-001",
//     salesmanName: "John Smith",
//     salesmanEmail: "john.smith@company.com",
//     clientName: "Acme Corporation",
//     clientId: "CL-001",
//     amount: 2500.00,
//     currency: "USD",
//     payment_type: "Bank Transfer",
//     transactionId: "TXN-789123",
//     description: "Payment for Order #ORD-1234 - Office supplies bulk order",
//     requestDate: "2024-09-11T09:15:00Z",
//     dueDate: "2024-09-18T17:00:00Z",
//     status: "pending",
//     notes: "Client confirmed payment via phone. Bank receipt attached.",
//     statusHistory: [
//       {
//         status: "pending",
//         timestamp: "2024-09-11T09:15:00Z",
//         adminId: "ADM-001",
//         adminName: "System",
//         notes: "Payment request submitted"
//       }
//     ]
//   },
//   {
//     id: "PR-002",
//     salesmanId: "SM-002",
//     salesmanName: "Sarah Johnson",
//     salesmanEmail: "sarah.johnson@company.com",
//     clientName: "Tech Solutions Inc",
//     clientId: "CL-002",
//     amount: 1850.75,
//     currency: "USD",
//     payment_type: "Credit Card",
//     transactionId: "CC-456789",
//     description: "Monthly service payment - Technical consulting",
//     requestDate: "2024-09-11T11:30:00Z",
//     dueDate: "2024-09-15T12:00:00Z",
//     status: "approved",
//     notes: "Regular monthly payment. Card ending in 4567 was used.",
//     statusHistory: [
//       {
//         status: "pending",
//         timestamp: "2024-09-11T11:30:00Z",
//         adminId: "ADM-001",
//         adminName: "System",
//         notes: "Payment request submitted"
//       },
//       {
//         status: "approved",
//         timestamp: "2024-09-11T14:22:00Z",
//         adminId: "ADM-002",
//         adminName: "Admin User",
//         notes: "Verified payment details and approved"
//       }
//     ]
//   },
//   {
//     id: "PR-003",
//     salesmanId: "SM-003",
//     salesmanName: "Mike Wilson",
//     salesmanEmail: "mike.wilson@company.com",
//     clientName: "Global Enterprises",
//     clientId: "CL-003",
//     amount: 4200.00,
//     currency: "USD",
//     payment_type: "Wire Transfer",
//     description: "Equipment purchase - Industrial machinery",
//     requestDate: "2024-09-10T14:45:00Z",
//     dueDate: "2024-09-20T16:00:00Z",
//     status: "rejected",
//     notes: "Large equipment order. Requires additional verification.",
//     statusHistory: [
//       {
//         status: "pending",
//         timestamp: "2024-09-10T14:45:00Z",
//         adminId: "ADM-001",
//         adminName: "System",
//         notes: "Payment request submitted"
//       },
//       {
//         status: "approved",
//         timestamp: "2024-09-10T16:20:00Z",
//         adminId: "ADM-002",
//         adminName: "Admin User",
//         notes: "Initial approval pending verification"
//       },
//       {
//         status: "rejected",
//         timestamp: "2024-09-11T09:45:00Z",
//         adminId: "ADM-003",
//         adminName: "Senior Admin",
//         notes: "Insufficient documentation provided"
//       }
//     ]
//   },
//   {
//     id: "PR-004",
//     salesmanId: "SM-001",
//     salesmanName: "John Smith",
//     salesmanEmail: "john.smith@company.com",
//     clientName: "Retail Chain LLC",
//     clientId: "CL-004",
//     amount: 750.25,
//     currency: "USD",
//     payment_type: "Check",
//     description: "Product delivery payment - Retail inventory",
//     requestDate: "2024-09-09T16:20:00Z",
//     dueDate: "2024-09-16T15:00:00Z",
//     status: "approved",
//     notes: "Check deposited successfully. Payment confirmed.",
//     statusHistory: [
//       {
//         status: "pending",
//         timestamp: "2024-09-09T16:20:00Z",
//         adminId: "ADM-001",
//         adminName: "System",
//         notes: "Payment request submitted"
//       },
//       {
//         status: "approved",
//         timestamp: "2024-09-09T18:15:00Z",
//         adminId: "ADM-002",
//         adminName: "Admin User",
//         notes: "Check verified and approved"
//       }
//     ]
//   },
//   {
//     id: "PR-005",
//     salesmanId: "SM-004",
//     salesmanName: "Emily Davis",
//     salesmanEmail: "emily.davis@company.com",
//     clientName: "Manufacturing Corp",
//     clientId: "CL-005",
//     amount: 3200.50,
//     currency: "USD",
//     payment_type: "Bank Transfer",
//     transactionId: "TXN-456789",
//     description: "Raw materials payment - Q3 supply order",
//     requestDate: "2024-09-11T14:20:00Z",
//     dueDate: "2024-09-18T16:00:00Z",
//     status: "pending",
//     notes: "Urgent payment required for production schedule.",
//     statusHistory: [
//       {
//         status: "pending",
//         timestamp: "2024-09-11T14:20:00Z",
//         adminId: "ADM-001",
//         adminName: "System",
//         notes: "Payment request submitted"
//       }
//     ]
//   }
// ]

function Payments() {
  // const [paymentRequests, setPaymentRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSalesman, setFilterSalesman] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const dblimits = useSelector((state) => state.app.limits);
  console.log("db limits",dblimits);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);
  const { data: getAllPayment, isLoading: isPaymentLoading, isError: isPaymentError, error: paymentError } = useGetAllPayment({
    page: currentPage,
    limit: limit,
    search: debouncedSearch,
    status: filterStatus !== "all" ? filterStatus : undefined,
    salesman: filterSalesman !== "all" ? filterSalesman : undefined,
    sortField: sortBy,
    sortDirection: sortOrder
  });
  useEffect(() => {
    if (getAllPayment?.data?.payments) {
      setTotalPages(getAllPayment.data.payments.pagination?.totalPages || 1);
      setTotalPayments(getAllPayment.data.payments.pagination?.totalRecords || 0);
    }
  }, [getAllPayment]);
  const {mutate: updatePaymentStatus,isLoading:isUpdatePaymentLoading,isError:isUpdatePaymentError,error:updatePaymentError} = useUpdatePaymentStatus()

  const userInfo = useSelector(state => state.app.userInfo) 
  console.log("userInfo in payment page",userInfo)

  // ✅ Use data directly from React Query
  const paymentRequests = getAllPayment?.data?.payments?.data || []
  console.log("paymentRequests data",getAllPayment?.data?.payments)
  

  // ✅ Show loading state
  if (isPaymentLoading) {
    return <div>Loading payments...</div>
  }

  // ✅ Show error state
  if (isPaymentError) {
    return <div>Error loading payments: {paymentError?.message}</div>
  }

  const handleStatusChange = (requestId, newStatus, notes) => {

    const payload = {
      paymentId: requestId,
      status: {
        status: newStatus,
        date: Date.now(),
        adminId: userInfo.tenant_user_id,
        notes:notes || `Status changed to ${newStatus}`
      }
    }
    console.log("payload",payload)
    const statusMessages = {
      approved: "Payment request approved successfully!",
      rejected: "Payment request rejected",
      pending: "Payment request returned to pending status"
    }
    updatePaymentStatus(payload)
    toast.success(statusMessages[newStatus])
    setShowDetailsDialog(false)
    setAdminNotes("")
  }

  const handleBulkStatusChange = (newStatus) => {
    const eligibleRequests = paymentRequests.filter(req => req.status[req.status.length - 1].status !== newStatus)

    setPaymentRequests(prev =>
      prev.map(request => {
        if (request.status[request.status.length - 1].status !== newStatus) {
          const newHistoryEntry = {
            status: newStatus,
            timestamp: new Date().toISOString(),
            adminId: "ADM-002",
            adminName: "Current Admin",
            notes: `Bulk ${newStatus} operation`
          }

          return {
            ...request,
            status: newStatus,
            statusHistory: [...request.statusHistory, newHistoryEntry]
          }
        }
        return request
      })
    )

    toast.success(`${eligibleRequests.length} payment requests ${newStatus}!`)
  }

  // Get unique salesmen for filter dropdown
 
  const uniqueSalesmen = Array.from(
    new Map(paymentRequests.map(req => [req.payment_salesman._id, { id: req.payment_salesman._id, name: req.payment_salesman.firstName }])).values()
  )
  // console.log("uniqueSalesmen",uniqueSalesmen)

  const getStatusColor = (status) => {
    console.log("status icon",status)
    switch (status) {
      case "pending": return "bg-[#FE9A00] text-white"
      case "approved": return "bg-[#00A63E] text-white"
      case "rejected": return "bg-[#FB2C36] text-white"
      default: return "bg-gray-500 text-white"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock className="h-3 w-3" />
      case "approved": return <CheckCircle className="h-3 w-3" />
      case "rejected": return <XCircle className="h-3 w-3" />
      default: return <AlertCircle className="h-3 w-3" />
    }
  }

  const pendingCount = paymentRequests.filter(req => req.status[req.status.length - 1].status === "pending").length
  const approvedCount = paymentRequests.filter(req => req.status[req.status.length - 1].status === "approved").length
  const rejectedCount = paymentRequests.filter(req => req.status[req.status.length - 1].status === "rejected").length
  const totalAmount = paymentRequests
    .filter(req => req.status[req.status.length - 1].status === "pending")
    .reduce((sum, req) => sum + req.payment_amount, 0)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleStatusFilterChange = (value) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handleSalesmanFilterChange = (value) => {
    setFilterSalesman(value);
    setCurrentPage(1);
  };

  const handleSortChange = (field) => {
    setSortBy(field);
    setCurrentPage(1);
  };

  const handleSortOrderToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (value) => {
    setLimit(parseInt(value));
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="w-full">
      <div className="ml-8 lg:hidden">
        <h1 className="text-xl">Payments Confirmations</h1>
      </div>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-xl max-[1024px]:hidden">Payment Confirmations</h2>
            <p className="text-responsive-xs text-muted-foreground">
              Review and manage payment updates from sales team with reversible actions
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={pendingCount === 0}
                  className="w-full sm:w-auto bg-green-primary hover:bg-green-600"
                >
                  <CheckCircle className="icon-responsive-sm mr-2" />
                  Approve All ({pendingCount})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Approve All Pending Payments</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to approve all {pendingCount} pending payment requests? This action can be reversed later if needed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleBulkStatusChange("approved")}
                    className="bg-green-primary hover:bg-green-600"
                  >
                    Approve All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={paymentRequests.filter(req => req.status !== "rejected").length === 0}
                  className="w-full sm:w-auto"
                >
                  <XCircle className="icon-responsive-sm mr-2" />
                  Reject All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reject All Non-Rejected Payments</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reject all non-rejected payment requests? This action can be reversed later if needed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleBulkStatusChange("rejected")}
                    className="bg-red-primary hover:bg-red-600"
                  >
                    Reject All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid-responsive-1-2-4 gap-4">
          <Card>
            <CardContent className="responsive-padding">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-responsive-xs text-muted-foreground">Pending</p>
                  <p className="text-responsive-lg font-semibold">{pendingCount}</p>
                </div>
                <div className="p-2 bg-amber-light rounded-lg">
                  <Clock className="icon-responsive-base text-amber-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="responsive-padding">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-responsive-xs text-muted-foreground">Approved</p>
                  <p className="text-responsive-lg font-semibold">{approvedCount}</p>
                </div>
                <div className="p-2 bg-green-light rounded-lg">
                  <CheckCircle className="icon-responsive-base text-green-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="responsive-padding">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-responsive-xs text-muted-foreground">Rejected</p>
                  <p className="text-responsive-lg font-semibold">{rejectedCount}</p>
                </div>
                <div className="p-2 bg-red-light rounded-lg">
                  <XCircle className="icon-responsive-base text-red-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="responsive-padding">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-responsive-xs text-muted-foreground">Pending Amount</p>
                  <p className="text-responsive-lg font-semibold">{formatCurrency(totalAmount)}</p>
                </div>
                <div className="p-2 bg-blue-light rounded-lg">
                  <IndianRupeeIcon className="icon-responsive-base text-blue-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="responsive-padding">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 icon-responsive-sm text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-responsive-xs"
                />
              </div>

              {/* Filter Row */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
                {/* Status Filter */}
                <div className="flex items-center gap-2 min-w-0">
                  <Label className="text-responsive-xs whitespace-nowrap">Status:</Label>
                  <Select value={filterStatus} onValueChange={handleStatusFilterChange}>
                    <SelectTrigger className="w-40 sm:w-44 text-responsive-xs">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-amber-primary" />
                          Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="approved">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-primary" />
                          Approved
                        </div>
                      </SelectItem>
                      <SelectItem value="rejected">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-3 w-3 text-red-primary" />
                          Rejected
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Salesman Filter */}
                <div className="flex items-center gap-2 min-w-0">
                  <Label className="text-responsive-xs whitespace-nowrap">Salesman:</Label>
                  <Select value={filterSalesman} onValueChange={handleSalesmanFilterChange}>
                    <SelectTrigger className="w-44 sm:w-52 text-responsive-xs">
                      <SelectValue placeholder="All Salesmen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Salesmen</SelectItem>
                      {uniqueSalesmen.map((salesman) => (
                        <SelectItem key={salesman.id} value={salesman.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-4 w-4">
                              <AvatarFallback className="text-xs">
                                {salesman.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            {salesman.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-2 min-w-0">
                  <Label className="text-responsive-xs whitespace-nowrap">Sort:</Label>
                  <div className="flex items-center gap-1">
                    <Select value={sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-32 sm:w-36 text-responsive-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            Date
                          </div>
                        </SelectItem>
                        <SelectItem value="amount">
                          <div className="flex items-center gap-2">
                            <IndianRupeeIcon className="h-3 w-3" />
                            Amount
                          </div>
                        </SelectItem>
                        <SelectItem value="status">
                          <div className="flex items-center gap-2">
                            <Filter className="h-3 w-3" />
                            Status
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSortOrderToggle}
                      className="p-2 h-9"
                      title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
                    >
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Requests Table */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-responsive-lg">
                  <CreditCard className="icon-responsive-base" />
                  Payment Requests ({totalPayments})
                  {isPaymentLoading && <span className="ml-2 text-xs">(Loading...)</span>}
                </CardTitle>
                <CardDescription className="text-responsive-xs">
                  Manage payment confirmations with reversible status changes
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center gap-2 min-w-0">
                <Label className="text-responsive-xs whitespace-nowrap">Per Page:</Label>
                <Select value={limit.toString()} onValueChange={handleLimitChange}>
                  <SelectTrigger className="w-24 text-responsive-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-responsive-xs">Request</TableHead>
                    <TableHead className="text-responsive-xs hidden sm:table-cell">Salesman</TableHead>
                    <TableHead className="text-responsive-xs">Client</TableHead>
                    <TableHead className="text-responsive-xs">Amount</TableHead>
                    <TableHead className="text-responsive-xs">Status</TableHead>
                    <TableHead className="text-responsive-xs hidden lg:table-cell">Date</TableHead>
                    <TableHead className="text-responsive-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentRequests.map((request) => (
                    <TableRow key={request._id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-responsive-xs font-medium">{request._id}</p>
                          <p className="text-xs text-muted-foreground">{request.payment_type}</p>
                          <p className="text-xs text-muted-foreground sm:hidden">
                            {request.payment_salesman.firstName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback className="text-xs">
                              {request.payment_salesman.firstName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1 min-w-0">
                            <p className="text-responsive-xs font-medium truncate">{request.payment_salesman.firstName}</p>
                            <p className="text-xs text-muted-foreground truncate">{request.payment_salesman.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-responsive-xs font-medium">{request?.payment_client?.name}</p>
                          <p className="text-xs text-muted-foreground">{request?.payment_client?._id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-responsive-xs font-semibold">
                            {formatCurrency(request.payment_amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">INR</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs flex items-center gap-1 w-fit ${getStatusColor(request.status[request.status.length - 1].status)}`}>
                          {getStatusIcon(request.status[request.status.length - 1].status)}
                          {request.status[request.status.length - 1].status}
                          {console.log("request.status",getStatusColor(request.status[request.status.length - 1].status))}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <p className="text-responsive-xs">
                          {formatDate(request.status[request.status.length - 1].date)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {/* View Details */}
                          <Dialog
                            open={showDetailsDialog && selectedRequest?.id === request.id}
                            onOpenChange={(open) => {
                              setShowDetailsDialog(open)
                              if (open) setSelectedRequest(request)
                            }}
                          className="">
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="dialog-responsive-lg dialog-responsive-height">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <CreditCard className="icon-responsive-base" />
                                  Payment Request Details
                                </DialogTitle>
                                <DialogDescription>
                                  Review payment information and change status as needed
                                </DialogDescription>
                              </DialogHeader>

                              {selectedRequest && (
                                <div className="space-y-6 overflow-y-auto">
                                  {/* Basic Information */}
                                  <div className="grid-responsive-1-2 gap-4">
                                    <div className="space-y-3">
                                      <div>
                                        <Label className="text-responsive-xs flex items-center gap-1">
                                          <Hash className="h-3 w-3" />
                                          Request ID
                                        </Label>
                                        <p className="text-responsive-sm font-medium">{selectedRequest.id}</p>
                                      </div>
                                      <div>
                                        <Label className="text-responsive-xs flex items-center gap-1">
                                          <User className="h-3 w-3" />
                                          Salesman
                                        </Label>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-xs">
                                              {selectedRequest.payment_client.name[0]}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <p className="text-responsive-xs font-medium">{selectedRequest.payment_salesman.firstName}</p>
                                            <p className="text-xs text-muted-foreground">{selectedRequest.payment_salesman.email}</p>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-responsive-xs flex items-center gap-1">
                                          <Building className="h-3 w-3" />
                                          Client
                                        </Label>
                                        <p className="text-responsive-sm font-medium">{selectedRequest.payment_client.name}</p>
                                        <p className="text-xs text-muted-foreground">{selectedRequest.payment_client._id}</p>
                                      </div>
                                    </div>

                                    <div className="space-y-3">
                                      <div>
                                        <Label className="text-responsive-xs">Amount</Label>
                                        <p className="text-responsive-lg font-semibold text-green-primary">
                                          {formatCurrency(selectedRequest.payment_amount)}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-responsive-xs">Payment Method</Label>
                                        <p className="text-responsive-sm">{selectedRequest.payment_type}</p>
                                      </div>
                                      {selectedRequest.transactionId && (
                                        <div>
                                          <Label className="text-responsive-xs">Transaction ID</Label>
                                          <p className="text-responsive-sm font-mono">{selectedRequest?.transactionId}</p>
                                        </div>
                                      )}
                                      <div>
                                        <Label className="text-responsive-xs">Current Status</Label>
                                        <Badge className={`text-xs flex items-center gap-1 w-fit mt-1 ${getStatusColor(selectedRequest.status[selectedRequest.status.length - 1].status)}`}>
                                          {getStatusIcon(selectedRequest.status[selectedRequest.status.length - 1].status)}
                                          {selectedRequest.status[selectedRequest.status.length - 1].status}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Status History */}
                                  <div className="space-y-3">
                                    <Label className="text-responsive-xs flex items-center gap-1">
                                      <History className="h-3 w-3" />
                                      Status History
                                    </Label>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                      {selectedRequest.status.map((history, index) => (
                                        <div key={index} className="flex items-start gap-3 p-2 bg-muted rounded-lg">
                                          <Badge className={`text-xs flex items-center gap-1 ${getStatusColor(history.status)}`}>
                                            {getStatusIcon(history.status)}
                                            {history.status}
                                          </Badge>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-xs">
                                              <span className="font-medium">{history.adminName}</span> - {formatDate(history.date)}
                                            </p>
                                            {history.notes && (
                                              <p className="text-xs text-muted-foreground mt-1">{history.notes}</p>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Admin Notes */}
                                  <div className="space-y-2">
                                    <Label htmlFor="admin-notes" className="text-responsive-xs">Admin Notes</Label>
                                    <Textarea
                                      id="admin-notes"
                                      placeholder="Add notes for this status change..."
                                      value={adminNotes}
                                      onChange={(e) => setAdminNotes(e.target.value)}
                                      rows={3}
                                      className="text-responsive-xs"
                                    />
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                                    {selectedRequest.status !== "approved" && (
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button className="flex-1 bg-green-primary hover:bg-green-600">
                                            <Check className="icon-responsive-sm mr-2" />
                                            Approve Payment
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Approve Payment Request</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to approve this payment request for {formatCurrency(selectedRequest.payment_amount)}?
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => handleStatusChange(selectedRequest._id, "approved", adminNotes)}
                                              className="bg-green-primary hover:bg-green-600"
                                            >
                                              Approve
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    )}

                                    {selectedRequest.status !== "rejected" && (
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="destructive" className="flex-1">
                                            <X className="icon-responsive-sm mr-2" />
                                            Reject Payment
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Reject Payment Request</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to reject this payment request? This action can be reversed later.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => handleStatusChange(selectedRequest._id, "rejected", adminNotes)}
                                              className="bg-red-primary hover:bg-red-600"
                                            >
                                              Reject
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    )}

                                    {selectedRequest.status !== "pending" && (
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="outline" className="flex-1">
                                            <RotateCcw className="icon-responsive-sm mr-2" />
                                            Return to Pending
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Return to Pending</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to return this payment request to pending status?
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => handleStatusChange(selectedRequest._id, "pending", adminNotes)}
                                            >
                                              Return to Pending
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {/* Quick Actions */}
                          {request.status !== "approved" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Check className="h-3 w-3 text-green-primary" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Quick Approve</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Approve payment request {request.id} for {formatCurrency(request.payment_amount)}?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleStatusChange(request._id, "approved")}
                                    className="bg-green-primary hover:bg-green-600"
                                  >
                                    Approve
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}

                          {request.status !== "rejected" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <X className="h-3 w-3 text-red-primary" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Quick Reject</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Reject payment request {request.id} for {formatCurrency(request.payment_amount)}?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleStatusChange(request._id, "rejected")}
                                    className="bg-red-primary hover:bg-red-600"
                                  >
                                    Reject
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}

                          {request.status !== "pending" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <RotateCcw className="h-3 w-3 text-amber-primary" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Return to Pending</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Return payment request {request.id} to pending status?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleStatusChange(request._id, "pending")}
                                  >
                                    Return to Pending
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
                <div className="text-responsive-xs text-muted-foreground">
                  Showing {paymentRequests.length === 0 ? 0 : ((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalPayments)} of {totalPayments} payments
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1 || isPaymentLoading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        disabled={isPaymentLoading}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || isPaymentLoading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {paymentRequests.length === 0 && (
          <Card>
            <CardContent className="responsive-padding text-center">
              <div className="space-y-2">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-responsive-sm text-muted-foreground">No payment requests found</p>
                <p className="text-responsive-xs text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Payments