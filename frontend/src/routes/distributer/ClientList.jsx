import { useState, useCallback, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Search, Plus, Eye, Edit, Trash2, Mail, Phone, MapPin, Building2, Calendar, IndianRupeeIcon, Package, ArrowUpDown, Star, Clock, TrendingUp, FileText, Users, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { useGetAllSeller } from "../../hooks/seller/useGetAllSeller"
import { useUpdateSeller } from "../../hooks/seller/useUpdateSeller"
import { useDeleteSeller } from "../../hooks/seller/useDeleteSeller"
import { useAddSeller } from "../../hooks/seller/useAddSeller"


const defaultFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  status: "Active",
  industry: "",
  contactPerson: "",
  notes: "",
  website: "",
  companySize: "",
  priority: "Medium",
  paymentTerms: "Net 30",
  creditLimit: "",
  gstNumber: ""
};

const companySizes = [
  "Startup (1-10 employees)",
  "Small (10-50 employees)",
  "Medium (100-500 employees)",
  "Large (500-1000 employees)",
  "Enterprise (1000+ employees)"
];

const industries = [
  "Technology",
  "Software Development",
  "Manufacturing",
  "Retail",
  "Healthcare",
  "Finance",
  "Education",
  "Real Estate",
  "Consulting",
  "Import/Export",
  "Venture Capital",
  "Other"
];

function ClientList() {
  const [clients, setClients] = useState([]);
  const [handleError,setHandleError] = useState(false);
  const [errorMsg,setErrorMsg] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClients, setTotalClients] = useState(0);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [formData, setFormData] = useState(defaultFormData);
  const [debouncedSearch, setDebouncedSearch] = useState("");const { data: getSellerList, isPending: SellerisPending, isError: SellerisError, error: SellerError } = useGetAllSeller({
    page: currentPage,
    limit: limit,
    search: debouncedSearch,
    status: statusFilter !== "all" ? statusFilter : undefined,
    priority: priorityFilter !== "all" ? priorityFilter : undefined,
    sortField: sortField,
    sortDirection: sortDirection
  });
  
  const {mutate:addSeller, isPending:addSellerisPending, isError:addSellerisError, error:addSellerError} = useAddSeller({
    onSuccess: () => {
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError:(error)=>{
      console.error("Add Seller Error:", error);
      setHandleError(true);
      const message = error.response?.data?.message || "Something went wrong";
      setErrorMsg(message);
    }
  });
  const {mutate:updateSeller, isPending:updateSellerisPending, isError:updateSellerisError, error:updateSellerError} = useUpdateSeller({
    onSuccess: ()=>{
      setIsEditDialogOpen(false);
      setEditingClient(null);
      resetForm();
    }
  });
  const {mutate:deleteSellerList, isPending:deleteSellerisPending, isError:deleteSellerisError, error:deleteSellerError} = useDeleteSeller();


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
    }, [searchTerm]);


  useEffect(() => {
    console.log("Seller List Updated", getSellerList);
    if (getSellerList?.seller) {
      setClients(getSellerList.seller.data || []);
      setTotalPages(getSellerList.seller.pagination?.totalPages || 1);
      setTotalClients(getSellerList.seller.pagination?.totalRecords || 0);
    }
  }, [getSellerList]);

  


    const handleStatusFilterChange = (value) => {
      setStatusFilter(value);
      setCurrentPage(1); // Reset to first page
    };

    const handlePriorityFilterChange = (value) => {
      setPriorityFilter(value);
      setCurrentPage(1); // Reset to first page
    };

  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page
  }, [sortField, sortDirection]);

  // Add these new functions before the return statement
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

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
  }, []);

  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);


  const handleAddClient = useCallback(() => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Please fill in required fields (Name and Email)");
      return;
    }

    if (clients.some(client => client.email.toLowerCase() === formData.email.toLowerCase())) {
      toast.error("A client with this email already exists");
      return;
    }

    const newClient = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      status: formData.status,
      industry: formData.industry.trim() || undefined,
      contactPerson: formData.contactPerson.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      website: formData.website.trim() || undefined,
      companySize: formData.companySize.trim() || undefined,
      priority: formData.priority,
      paymentTerms: formData.paymentTerms.trim() || undefined,
      creditLimit: formData.creditLimit ? parseInt(formData.creditLimit) : undefined,
      gstNumber: formData.gstNumber.trim() || undefined,
      totalOrders: 0,
      totalSpent: 0,
      lastOrder: "Never",
      joinDate: new Date().toISOString().split('T')[0],
      tags: []
    };

    addSeller(newClient);    
    // if(!addSellerisPending){
    //   setIsAddDialogOpen(false);
    //   resetForm();
    // }
    setIsAddDialogOpen(false);
    toast.success("Client added successfully");
  }, [formData, clients, resetForm]);

  const handleEditClient = useCallback(() => {
    console.log("called upate function")
    if (!editingClient || !formData.name.trim() || !formData.email.trim()) {
      toast.error("Please fill in required fields (Name and Email)");
      return;
    }

    if (clients.some(client =>
      client._id !== editingClient._id &&
      client.email.toLowerCase() === formData.email.toLowerCase()
    )) {
      toast.error("A client with this email already exists");
      return;
    }

    const updatedClients = {
            id:editingClient._id,
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            status: formData.status,
            industry: formData.industry.trim() || undefined,
            contactPerson: formData.contactPerson.trim() || undefined,
            notes: formData.notes.trim() || undefined,
            website: formData.website.trim() || undefined,
            companySize: formData.companySize.trim() || undefined,
            priority: formData.priority,
            paymentTerms: formData.paymentTerms.trim() || undefined,
            creditLimit: formData.creditLimit ? parseInt(formData.creditLimit) : undefined,
            gstNumber: formData.gstNumber.trim() || undefined
          }
    console.log(editingClient._id);
    updateSeller(updatedClients)
    toast.success("Client updated successfully");
  }, [editingClient, formData, clients, resetForm]);

  const handleDeleteClient = useCallback((clientId) => {
    deleteSellerList({id:clientId});
    toast.success("Client deleted successfully");
  }, []);

  const openEditDialog = useCallback((client) => {
    setEditingClient(client);
    console.log(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      status: client.status,
      industry: client.industry || "",
      contactPerson: client.contactPerson || "",
      notes: client.notes || "",
      website: client.website || "",
      companySize: client.companySize || "",
      priority: client.priority || "Medium",
      paymentTerms: client.paymentTerms || "",
      creditLimit: client.creditLimit?.toString() || "",
      gstNumber: client.gstNumber || ""
    });
    setIsEditDialogOpen(true);
  }, []);

  const openAddDialog = useCallback(() => {
    resetForm();
    setIsAddDialogOpen(true);
  }, [resetForm]);

  const closeAddDialog = useCallback(() => {
    setIsAddDialogOpen(false);
    resetForm();
  }, [resetForm]);

  const closeEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
    setEditingClient(null);
    resetForm();
  }, [resetForm]);

  const getStatusVariant = useCallback((status) => {
    switch (status) {
      case "Active": return "default";
      case "VIP": return "default";
      case "Pending": return "secondary";
      case "Inactive": return "outline";
      default: return "secondary";
    }
  }, []);

  const getPriorityVariant = useCallback((priority) => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "outline";
    }
  }, []);

  // Calculated stats
  const activeClients = clients.filter(c => c.status === "Active" || c.status === "VIP").length;
  const vipClients = clients.filter(c => c.status === "VIP").length;
  const totalRevenue = clients.reduce((sum, client) => sum + (client.totalSpent || 0), 0);
  const totalOrders = clients.reduce((sum, client) => sum + (client.totalOrders || 0), 0);
  const highPriorityClients = clients.filter(c => c.priority === "High").length;

  const topClients = [...clients]
    .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
    .slice(0, 5);

  const recentClients = [...clients]
    .sort((a, b) => new Date(b.joinDate || 0).getTime() - new Date(a.joinDate || 0).getTime())
    .slice(0, 5);

  return (
    <div className="w-full">
      <div className="ml-8 lg:hidden">
        <h1 className="text-xl">Client Management</h1>
      </div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="max-[1024px]:hidden text-xl">Client Management</h2>
            <p className="text-muted-foreground">Manage your client relationships, contacts, and business partnerships</p>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Building2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
              <p className="text-xs text-muted-foreground">
                {activeClients} active • {vipClients} VIP
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <IndianRupeeIcon className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center"><IndianRupeeIcon className="h-4 w-4 text-black" />{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Lifetime client value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <Star className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{highPriorityClients}</div>
              <p className="text-xs text-muted-foreground">Requiring attention</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Client Directory</TabsTrigger>
            <TabsTrigger value="analytics">Business Analytics</TabsTrigger>
            <TabsTrigger value="reports">Client Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients, contacts, or industries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="VIP">VIP Clients</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={handlePriorityFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="High">High Priority</SelectItem>
                  <SelectItem value="Medium">Medium Priority</SelectItem>
                  <SelectItem value="Low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clients Table */}
            <Card>
              <CardHeader>
                <CardTitle>Client Directory ({totalClients})</CardTitle>
                <CardDescription>
                  Complete overview of your business relationships and partnerships
                  {SellerisPending && <span className="ml-2">(Loading...)</span>}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {SellerisPending ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                      <TableRow>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center gap-2">
                            Client
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Contact & Industry</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('priority')}
                        >
                          <div className="flex items-center gap-2">
                            Priority
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('totalOrders')}
                        >
                          <div className="flex items-center gap-2">
                            Orders
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('totalSpent')}
                        >
                          <div className="flex items-center gap-2">
                            Revenue
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('lastOrder')}
                        >
                          <div className="flex items-center gap-2">
                            Last Order
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                        <TableBody>
                          {clients.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                No clients found
                              </TableCell>
                            </TableRow>
                          ) : (
                            clients.map((client) => (
                              <TableRow key={client._id}>
                                <TableCell>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium">{client.name}</p>
                                      {client.status === "VIP" && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{client._id}</p>
                                    {client.companySize && (
                                      <p className="text-xs text-muted-foreground">{client.companySize}</p>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-sm">{client.email}</span>
                                    </div>
                                    {client.phone && (
                                      <div className="flex items-center gap-2">
                                        <Phone className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-sm">{client.phone}</span>
                                      </div>
                                    )}
                                    {client.industry && (
                                      <p className="text-xs text-muted-foreground">{client.industry}</p>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={getStatusVariant(client.status)}>
                                    {client.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {client.priority && (
                                    <Badge variant={getPriorityVariant(client.priority)}>
                                      {client.priority}
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>{client.totalOrders}</TableCell>
                                <TableCell className="flex items-center"><IndianRupeeIcon className="h-4 w-4 text-black" />{client.totalSpent.toLocaleString()}</TableCell>
                                <TableCell>
                                  <span className={client.lastOrder === "Never" ? "text-muted-foreground" : ""}>
                                    {client?.lastOrder}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setSelectedClient(client)}
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                          <DialogTitle className="flex items-center gap-2">
                                            {selectedClient?.name}
                                            {selectedClient?.status === "VIP" && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
                                          </DialogTitle>
                                          <DialogDescription>Complete client profile and business relationship details</DialogDescription>
                                        </DialogHeader>
                                        {selectedClient && (
                                          <div className="grid gap-6 py-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                              <div className="space-y-4">
                                                <div>
                                                  <Label>Client Information</Label>
                                                  <div className="space-y-2 mt-2">
                                                    <p><span className="text-sm text-muted-foreground">ID:</span> {selectedClient._id}</p>
                                                    <div className="flex items-center gap-2">
                                                      <span className="text-sm text-muted-foreground">Status:</span>
                                                      <Badge variant={getStatusVariant(selectedClient.status)}>
                                                        {selectedClient.status}
                                                      </Badge>
                                                    </div>
                                                    {selectedClient.priority && (
                                                      <div className="flex items-center gap-2">
                                                        <span className="text-sm text-muted-foreground">Priority:</span>
                                                        <Badge variant={getPriorityVariant(selectedClient.priority)}>
                                                          {selectedClient.priority}
                                                        </Badge>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>

                                                <div>
                                                  <Label>Contact Details</Label>
                                                  <div className="space-y-2 mt-2">
                                                    <div className="flex items-center gap-2">
                                                      <Mail className="h-4 w-4 text-muted-foreground" />
                                                      <span className="text-sm">{selectedClient.email}</span>
                                                    </div>
                                                    {selectedClient.phone && (
                                                      <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">{selectedClient.phone}</span>
                                                      </div>
                                                    )}
                                                    {selectedClient.address && (
                                                      <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">{selectedClient.address}</span>
                                                      </div>
                                                    )}
                                                    {selectedClient.website && (
                                                      <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                                        <a href={selectedClient.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                                          {selectedClient.website}
                                                        </a>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="space-y-4">
                                                <div>
                                                  <Label>Business Details</Label>
                                                  <div className="space-y-2 mt-2">
                                                    {selectedClient.industry && (
                                                      <p><span className="text-sm text-muted-foreground">Industry:</span> {selectedClient.industry}</p>
                                                    )}
                                                    {selectedClient.companySize && (
                                                      <p><span className="text-sm text-muted-foreground">Company Size:</span> {selectedClient.companySize}</p>
                                                    )}
                                                    {selectedClient.contactPerson && (
                                                      <p><span className="text-sm text-muted-foreground">Contact Person:</span> {selectedClient.contactPerson}</p>
                                                    )}
                                                  </div>
                                                </div>

                                                <div>
                                                  <Label>Financial Terms</Label>
                                                  <div className="space-y-2 mt-2">
                                                    {selectedClient.paymentTerms && (
                                                      <p><span className="text-sm text-muted-foreground">Payment Terms:</span> {selectedClient.paymentTerms}</p>
                                                    )}
                                                    {selectedClient.creditLimit && (
                                                      <p><span className="text-sm text-muted-foreground">Credit Limit:</span> ${selectedClient.creditLimit.toLocaleString()}</p>
                                                    )}
                                                    {selectedClient.gstNumber && (
                                                      <p><span className="text-sm text-muted-foreground">GST Number:</span> {selectedClient.gstNumber}</p>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="space-y-4">
                                                <div>
                                                  <Label>Business Metrics</Label>
                                                  <div className="space-y-3 mt-2">
                                                    <div>
                                                      <p className="text-sm text-muted-foreground">Total Orders</p>
                                                      <p className="text-2xl font-bold">{selectedClient.totalOrders}</p>
                                                    </div>
                                                    <div>
                                                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                                                      <p className="text-2xl font-bold"><IndianRupeeIcon className="h-4 w-4 text-black" />{selectedClient.totalSpent.toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                      <p className="text-sm text-muted-foreground">Last Order</p>
                                                      <p className="font-medium">{selectedClient.lastOrder}</p>
                                                    </div>
                                                    <div>
                                                      <p className="text-sm text-muted-foreground">Client Since</p>
                                                      <p className="font-medium">{selectedClient.joinDate}</p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            {selectedClient.tags && selectedClient.tags.length > 0 && (
                                              <div>
                                                <Label>Tags</Label>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                  {selectedClient.tags.map((tag, index) => (
                                                    <Badge key={index} variant="outline">{tag}</Badge>
                                                  ))}
                                                </div>
                                              </div>
                                            )}

                                            {selectedClient.notes && (
                                              <div>
                                                <Label>Business Notes</Label>
                                                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{selectedClient.notes}</p>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </DialogContent>
                                    </Dialog>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openEditDialog(client)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>

                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Client</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete {client.name}? This will permanently remove all client data, order history, and business relationship information. This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteClient(client._id)}
                                            className="bg-danger text-destructive-foreground hover:bg-danger/90"
                                          >
                                            Delete Client
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* ADD PAGINATION CONTROLS HERE - after the table */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm flex space-x-3 items-center text-muted-foreground">
                        <p>Showing {clients.length === 0 ? 0 : ((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalClients)} of {totalClients} clients</p>
                        <Select value={limit.toString()} onValueChange={handleLimitChange}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 per page</SelectItem>
                            <SelectItem value="10">10 per page</SelectItem>
                            <SelectItem value="25">25 per page</SelectItem>
                            <SelectItem value="50">50 per page</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePreviousPage}
                          disabled={currentPage === 1 || SellerisPending}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          {getPageNumbers().map((pageNum) => (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              disabled={SellerisPending}
                              className="w-8 h-8"
                            >
                              {pageNum}
                            </Button>
                          ))}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages || SellerisPending}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Distribution</CardTitle>
                  <CardDescription>Breakdown by status and priority</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>By Status</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between">
                          <span>Active</span>
                          <span>{clients.filter(c => c.status === "Active").length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>VIP</span>
                          <span>{clients.filter(c => c.status === "VIP").length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Inactive</span>
                          <span>{clients.filter(c => c.status === "Inactive").length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pending</span>
                          <span>{clients.filter(c => c.status === "Pending").length}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>By Priority</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between">
                          <span>High Priority</span>
                          <span>{clients.filter(c => c.priority === "High").length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Medium Priority</span>
                          <span>{clients.filter(c => c.priority === "Medium").length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Low Priority</span>
                          <span>{clients.filter(c => c.priority === "Low").length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Clients by Revenue</CardTitle>
                  <CardDescription>Highest value business relationships</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topClients.map((client, index) => (
                      <div key={client._id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">#{index + 1}</span>
                          <span className="font-medium">{client.name}</span>
                          {client.status === "VIP" && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                        </div>
                        <span className="font-medium">${client.totalSpent.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Clients</CardTitle>
                  <CardDescription>Newest business relationships</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentClients.map(client => (
                      <div key={client._id} className="flex justify-between text-sm">
                        <span className="font-medium">{client.name}</span>
                        <span className="text-muted-foreground">{client.joinDate}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Growth</CardTitle>
                  <CardDescription>Total client lifetime value</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">
                      Across {totalOrders} total orders
                    </p>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>Growing client portfolio</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Insights</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Rate</p>
                      <p className="text-lg font-bold">
                        {((activeClients / totalClients) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">VIP Clients</p>
                      <p className="text-lg font-bold">{vipClients}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Revenue/Client</p>
                      <p className="text-lg font-bold">
                        ${Math.round(totalRevenue / totalClients).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Client Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Business Client</DialogTitle>
              <DialogDescription>Create a comprehensive client profile for business relationship management</DialogDescription>
            </DialogHeader>
            
            
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="add-name">Company Name *</Label>
                  <Input
                    id="add-name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="Company or organization name"
                  />
                </div>
                <div>
                  <Label htmlFor="add-email">Primary Email *</Label>
                  <Input
                    id="add-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="primary@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="add-phone">Phone Number</Label>
                  <Input
                    id="add-phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="add-website">Website</Label>
                  <Input
                    id="add-website"
                    value={formData.website}
                    onChange={(e) => updateFormData('website', e.target.value)}
                    placeholder="https://company.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="add-address">Business Address</Label>
                <Input
                  id="add-address"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="Complete business address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="add-status">Client Status</Label>
                  <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
                    <SelectTrigger id="add-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="VIP">VIP Client</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="add-priority">Business Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => updateFormData('priority', value)}>
                    <SelectTrigger id="add-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High Priority</SelectItem>
                      <SelectItem value="Medium">Medium Priority</SelectItem>
                      <SelectItem value="Low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="add-paymentTerms">Payment Terms</Label>
                  <Select value={formData.paymentTerms} onValueChange={(value) => updateFormData('paymentTerms', value)}>
                    <SelectTrigger id="add-paymentTerms">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Net 15">Net 15</SelectItem>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 45">Net 45</SelectItem>
                      <SelectItem value="Net 60">Net 60</SelectItem>
                      <SelectItem value="COD">Cash on Delivery</SelectItem>
                      <SelectItem value="Prepaid">Prepaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="add-industry">Industry</Label>
                  <Select value={formData.industry} onValueChange={(value) => updateFormData('industry', value)}>
                    <SelectTrigger id="add-industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="add-companySize">Company Size</Label>
                  <Select value={formData.companySize} onValueChange={(value) => updateFormData('companySize', value)}>
                    <SelectTrigger id="add-companySize">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {companySizes.map(size => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="add-creditLimit">Credit Limit ($)</Label>
                  <Input
                    id="add-creditLimit"
                    type="number"
                    value={formData.creditLimit}
                    onChange={(e) => updateFormData('creditLimit', e.target.value)}
                    placeholder="25000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="add-contactPerson">Primary Contact Person</Label>
                  <Input
                    id="add-contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => updateFormData('contactPerson', e.target.value)}
                    placeholder="Full name of primary contact"
                  />
                </div>
                <div>
                  <Label htmlFor="add-gstNumber">GST Number</Label>
                  <Input
                    id="add-gstNumber"
                    value={formData.gstNumber}
                    onChange={(e) => updateFormData('gstNumber', e.target.value)}
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="add-notes">Business Notes & Relationship Details</Label>
                <Textarea
                  id="add-notes"
                  value={formData.notes}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  placeholder="Important details about this client, their business needs, preferences, and relationship history..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              {
              addSellerisError && 
              <div className='bg-red-200 border border-2 border-red-800 rounded-lg p-2'>
                  {addSellerError.data.error.errors}
              </div>
            }
              <Button variant="outline" onClick={closeAddDialog}>
                Cancel
              </Button>
              <Button onClick={handleAddClient}>
                {
                  addSellerisPending ? (
                    'creating...'
                  ) : (
                    'Create Client Profile'
                  )
                }
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Client Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Client Profile</DialogTitle>
              <DialogDescription>Update client information and business relationship details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Company Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="Company or organization name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Primary Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="primary@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-website">Website</Label>
                  <Input
                    id="edit-website"
                    value={formData.website}
                    onChange={(e) => updateFormData('website', e.target.value)}
                    placeholder="https://company.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-address">Business Address</Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="Complete business address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-status">Client Status</Label>
                  <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
                    <SelectTrigger id="edit-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="VIP">VIP Client</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-priority">Business Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => updateFormData('priority', value)}>
                    <SelectTrigger id="edit-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High Priority</SelectItem>
                      <SelectItem value="Medium">Medium Priority</SelectItem>
                      <SelectItem value="Low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-paymentTerms">Payment Terms</Label>
                  <Select value={formData.paymentTerms} onValueChange={(value) => updateFormData('paymentTerms', value)}>
                    <SelectTrigger id="edit-paymentTerms">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Net 15">Net 15</SelectItem>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 45">Net 45</SelectItem>
                      <SelectItem value="Net 60">Net 60</SelectItem>
                      <SelectItem value="COD">Cash on Delivery</SelectItem>
                      <SelectItem value="Prepaid">Prepaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-industry">Industry</Label>
                  <Select value={formData.industry} onValueChange={(value) => updateFormData('industry', value)}>
                    <SelectTrigger id="edit-industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-companySize">Company Size</Label>
                  <Select value={formData.companySize} onValueChange={(value) => updateFormData('companySize', value)}>
                    <SelectTrigger id="edit-companySize">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {companySizes.map(size => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-creditLimit">Credit Limit ($)</Label>
                  <Input
                    id="edit-creditLimit"
                    type="number"
                    value={formData.creditLimit}
                    onChange={(e) => updateFormData('creditLimit', e.target.value)}
                    placeholder="25000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-contactPerson">Primary Contact Person</Label>
                  <Input
                    id="edit-contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => updateFormData('contactPerson', e.target.value)}
                    placeholder="Full name of primary contact"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-gstNumber">GST Number</Label>
                  <Input
                    id="edit-gstNumber"
                    value={formData.gstNumber}
                    onChange={(e) => updateFormData('gstNumber', e.target.value)}
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-notes">Business Notes & Relationship Details</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  placeholder="Important details about this client, their business needs, preferences, and relationship history..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeEditDialog}>
                Cancel
              </Button>
              <Button onClick={handleEditClient}>
                Update Client Profile
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
export default ClientList