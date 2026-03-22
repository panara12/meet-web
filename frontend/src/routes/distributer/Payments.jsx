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
import { showSuccess, showError } from '../../utils/toast'
import {
  CreditCard, Check, X, Eye, Clock, IndianRupeeIcon, Search,
  CheckCircle, XCircle, AlertCircle, History, Filter, Calendar,
  User, Building, Hash, ArrowUpDown, RotateCcw, ChevronLeft, ChevronRight
} from "lucide-react"
import { useGetAllPayment } from "../../hooks/payment/useGetAllPayment"
import { useUpdatePaymentStatus } from "../../hooks/payment/useUpdatePaymentStatus"
import { useSelector } from "react-redux"

function Payments() {
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSalesman, setFilterSalesman] = useState("all")  // stores salesman _id or "all"
  const [searchTerm, setSearchTerm] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPayments, setTotalPayments] = useState(0)

  // ─── Debounce search ───────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // ─── Fetch payments ────────────────────────────────────────────────────────
  const {
    data: getAllPayment,
    isLoading: isPaymentLoading,
    isError: isPaymentError,
    error: paymentError
  } = useGetAllPayment({
    page: currentPage,
    limit,
    search: debouncedSearch,
    status: filterStatus !== "all" ? filterStatus : undefined,
    // ✅ Pass salesman _id to backend; undefined when "all" so param is omitted
    salesman: filterSalesman !== "all" ? filterSalesman : undefined,
    sortField: sortBy,
    sortDirection: sortOrder
  })

  useEffect(() => {
    if (getAllPayment?.payments) {
      setTotalPages(getAllPayment.payments.pagination?.totalPages || 1)
      setTotalPayments(getAllPayment.payments.pagination?.totalRecords || 0)
    }
  }, [getAllPayment])

  const {
    mutate: updatePaymentStatus,
    isError: isUpdatePaymentError
  } = useUpdatePaymentStatus()

  const userInfo = useSelector(state => state.app.userInfo)
  const paymentRequests = getAllPayment?.payments?.data || []
  // ✅ Salesman list comes directly from backend — always complete, not page-limited
  const salesmanList = getAllPayment?.salesmen || []

  // ─── Loading / Error states ────────────────────────────────────────────────
  if (isPaymentLoading) return <div>Loading payments...</div>
  if (isPaymentError) return <div>Error loading payments: {paymentError?.message}</div>

  // ─── Helpers ───────────────────────────────────────────────────────────────

  /** Get the latest status string from a payment's status array */
  const getLatestStatus = (statusArr) =>
    Array.isArray(statusArr) && statusArr.length > 0
      ? statusArr[statusArr.length - 1].status
      : "pending"

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":  return "bg-[#FE9A00] text-white"
      case "approved": return "bg-[#00A63E] text-white"
      case "rejected": return "bg-[#FB2C36] text-white"
      default:         return "bg-gray-500 text-white"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":  return <Clock className="h-3 w-3" />
      case "approved": return <CheckCircle className="h-3 w-3" />
      case "rejected": return <XCircle className="h-3 w-3" />
      default:         return <AlertCircle className="h-3 w-3" />
    }
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount)

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })

  // ─── Stats: from backend (full dataset, not just current page) ────────────
  const pendingCount  = getAllPayment?.stats?.totalPendingCount  || 0
  const approvedCount = getAllPayment?.stats?.totalApprovedCount || 0
  const rejectedCount = getAllPayment?.stats?.totalRejectedCount || 0
  const totalAmount   = getAllPayment?.stats?.totalPendingAmount || 0

  // ✅ Salesman dropdown list — from backend, full list not limited to current page
  const uniqueSalesmen = salesmanList.map(s => ({
    id: s._id,
    name: `${s.firstName}${s.lastName ? ' ' + s.lastName : ''}`.trim(),
    email: s.email
  }))

  // ─── Status change ─────────────────────────────────────────────────────────
  const handleStatusChange = (requestId, newStatus, notes) => {
    const payload = {
      paymentId: requestId,
      status: {
        status: newStatus,
        date: Date.now(),
        adminId: userInfo.tenant_user_id,
        notes: notes || `Status changed to ${newStatus}`
      }
    }

    const statusMessages = {
      approved: "Payment request approved successfully!",
      rejected: "Payment request rejected",
      pending:  "Payment request returned to pending status"
    }

    updatePaymentStatus(payload, {
      onSuccess: () => showSuccess(statusMessages[newStatus]),
      onError: () => showError("Something went wrong")
    })

    setShowDetailsDialog(false)
    setAdminNotes("")
  }

  // ─── Filter / sort handlers (all reset to page 1) ──────────────────────────
  const handleStatusFilterChange  = (v) => { setFilterStatus(v);   setCurrentPage(1) }
  // ✅ Stores the salesman _id string (or "all") — passed directly to API
  const handleSalesmanFilterChange = (v) => { setFilterSalesman(v); setCurrentPage(1) }
  const handleSortChange          = (v) => { setSortBy(v);         setCurrentPage(1) }
  const handleSortOrderToggle     = ()  => { setSortOrder(o => o === "asc" ? "desc" : "asc"); setCurrentPage(1) }
  const handleLimitChange         = (v) => { setLimit(parseInt(v)); setCurrentPage(1) }
  const handlePreviousPage        = ()  => setCurrentPage(p => Math.max(p - 1, 1))
  const handleNextPage            = ()  => setCurrentPage(p => Math.min(p + 1, totalPages))
  const handlePageChange          = (p) => setCurrentPage(p)

  const getPageNumbers = () => {
    const maxPagesToShow = 5
    let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    let end   = Math.min(totalPages, start + maxPagesToShow - 1)
    if (end - start < maxPagesToShow - 1) start = Math.max(1, end - maxPagesToShow + 1)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      <div className="ml-10 lg:hidden">
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
        </div>

        {/* Stats */}
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

        {/* Filters */}
        <Card>
          <CardContent className="responsive-padding">
            <div className="space-y-4">
              <div className="relative mt-5 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 icon-responsive-sm text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-responsive-xs"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
                {/* Status filter */}
                <div className="flex items-center gap-2">
                  <Label className="text-responsive-xs whitespace-nowrap">Status:</Label>
                  <Select value={filterStatus} onValueChange={handleStatusFilterChange}>
                    <SelectTrigger className="w-40 sm:w-44 text-responsive-xs">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">
                        <div className="flex items-center gap-2"><Clock className="h-3 w-3 text-amber-primary" />Pending</div>
                      </SelectItem>
                      <SelectItem value="approved">
                        <div className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-green-primary" />Approved</div>
                      </SelectItem>
                      <SelectItem value="rejected">
                        <div className="flex items-center gap-2"><XCircle className="h-3 w-3 text-red-primary" />Rejected</div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* ✅ Salesman filter — value is salesman._id */}
                <div className="flex items-center gap-2">
                  <Label className="text-responsive-xs whitespace-nowrap">Salesman:</Label>
                  <Select value={filterSalesman} onValueChange={handleSalesmanFilterChange}>
                    <SelectTrigger className="w-44 sm:w-52 text-responsive-xs">
                      <SelectValue placeholder="All Salesmen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Salesmen</SelectItem>
                      {uniqueSalesmen.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-4 w-4">
                              <AvatarFallback className="text-xs">{s.name[0]}</AvatarFallback>
                            </Avatar>
                            {s.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <Label className="text-responsive-xs whitespace-nowrap">Sort:</Label>
                  <div className="flex items-center gap-1">
                    <Select value={sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-32 sm:w-36 text-responsive-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="date">
                          <div className="flex items-center gap-2"><Calendar className="h-3 w-3" />Date</div>
                        </SelectItem>
                        <SelectItem value="amount">
                          <div className="flex items-center gap-2"><IndianRupeeIcon className="h-3 w-3" />Amount</div>
                        </SelectItem>
                        <SelectItem value="status">
                          <div className="flex items-center gap-2"><Filter className="h-3 w-3" />Status</div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline" size="sm"
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

        {/* Table */}
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
            <div className="overflow-x-auto mx-5">
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
                  {paymentRequests.map((request) => {
                    // ✅ Derive latest status once per row — avoids repeated inline logic
                    const latestStatus = getLatestStatus(request.status)

                    return (
                      <TableRow key={request._id} className="hover:bg-black/20">
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
                            <p className="text-responsive-xs font-semibold">{formatCurrency(request.payment_amount)}</p>
                            <p className="text-xs text-muted-foreground">INR</p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge className={`text-xs flex items-center gap-1 w-fit ${getStatusColor(latestStatus)}`}>
                            {getStatusIcon(latestStatus)}
                            {latestStatus}
                          </Badge>
                        </TableCell>

                        <TableCell className="hidden lg:table-cell">
                          <p className="text-responsive-xs">
                            {formatDate(request.status[request.status.length - 1].date)}
                          </p>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1">

                            {/* ── View Details Dialog ── */}
                            <Dialog
                              open={showDetailsDialog && selectedRequest?._id === request._id}
                              onOpenChange={(open) => {
                                setShowDetailsDialog(open)
                                if (open) setSelectedRequest(request)
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="dialog-responsive-lg overflow-auto h-3/4 dialog-responsive-height">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <CreditCard className="icon-responsive-base" />
                                    Payment Request Details
                                  </DialogTitle>
                                  <DialogDescription>
                                    Review payment information and change status as needed
                                  </DialogDescription>
                                </DialogHeader>

                                {selectedRequest && (() => {
                                  const selLatestStatus = getLatestStatus(selectedRequest.status)
                                  return (
                                    <div className="space-y-6 overflow-y-auto">
                                      <div className="grid-responsive-1-2 gap-4">
                                        <div className="space-y-3">
                                          <div>
                                            <Label className="text-responsive-xs flex items-center gap-1">
                                              <Hash className="h-3 w-3" />Request ID
                                            </Label>
                                            <p className="text-responsive-sm font-medium">{selectedRequest._id}</p>
                                          </div>
                                          <div>
                                            <Label className="text-responsive-xs flex items-center gap-1">
                                              <User className="h-3 w-3" />Salesman
                                            </Label>
                                            <div className="flex items-center gap-2 mt-1">
                                              <Avatar className="h-6 w-6">
                                                <AvatarFallback className="text-xs">
                                                  {selectedRequest.payment_salesman.firstName[0]}
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
                                              <Building className="h-3 w-3" />Client
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
                                              <p className="text-responsive-sm font-mono">{selectedRequest.transactionId}</p>
                                            </div>
                                          )}
                                          <div>
                                            <Label className="text-responsive-xs">Current Status</Label>
                                            <Badge className={`text-xs flex items-center gap-1 w-fit mt-1 ${getStatusColor(selLatestStatus)}`}>
                                              {getStatusIcon(selLatestStatus)}
                                              {selLatestStatus}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Status History */}
                                      <div className="space-y-3">
                                        <Label className="text-responsive-xs flex items-center gap-1">
                                          <History className="h-3 w-3" />Status History
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
                                                  <span className="font-medium">{history.adminName}</span> — {formatDate(history.date)}
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
                                      <div className="flex flex-col justify-between sm:flex-row gap-2 pt-4 border-t">
                                        {selLatestStatus !== "approved" && (
                                          <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <Button className="flex bg-primary hover:bg-green-600">
                                                <Check className="icon-responsive-sm mr-1" />Approve
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
                                                >Approve</AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                        )}

                                        {selLatestStatus !== "rejected" && (
                                          <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <Button variant="destructive" className="flex">
                                                <X className="icon-responsive-sm mr-1" />Reject
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
                                                >Reject</AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                        )}

                                        {selLatestStatus !== "pending" && (
                                          <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <Button variant="outline" className="flex">
                                                <RotateCcw className="icon-responsive-sm mr-1" />Return to Pending
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
                                                <AlertDialogAction onClick={() => handleStatusChange(selectedRequest._id, "pending", adminNotes)}>
                                                  Return to Pending
                                                </AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })()}
                              </DialogContent>
                            </Dialog>

                            {/* ── Quick Approve ── */}
                            {latestStatus !== "approved" && (
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
                                      Approve payment {request._id} for {formatCurrency(request.payment_amount)}?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleStatusChange(request._id, "approved")}
                                      className="bg-primary hover:bg-green-600"
                                    >Approve</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}

                            {/* ── Quick Reject ── */}
                            {latestStatus !== "rejected" && (
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
                                      Reject payment {request._id} for {formatCurrency(request.payment_amount)}?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleStatusChange(request._id, "rejected")}
                                      className="bg-red-primary hover:bg-red-600"
                                    >Reject</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}

                            {/* ── Return to Pending ── */}
                            {latestStatus !== "pending" && (
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
                                      Return payment {request._id} to pending status?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleStatusChange(request._id, "pending")}>
                                      Return to Pending
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 mt-4 pt-4 border-t">
              <div className="text-responsive-xs text-muted-foreground">
                Showing {paymentRequests.length === 0 ? 0 : ((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalPayments)} of {totalPayments} payments
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1 || isPaymentLoading}>
                  <ChevronLeft className="h-4 w-4 mr-1" />Previous
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
                    >{pageNum}</Button>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages || isPaymentLoading}>
                  Next<ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-responsive-xs whitespace-nowrap">Per Page:</Label>
                <Select value={limit.toString()} onValueChange={handleLimitChange}>
                  <SelectTrigger className="w-24 text-responsive-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
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
                <p className="text-responsive-xs text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Payments