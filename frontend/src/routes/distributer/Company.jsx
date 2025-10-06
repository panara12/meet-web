import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"
import { 
  Building2, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Package,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  RefreshCw,
  CreditCard,
  Landmark
} from "lucide-react"
import { useCompany } from "./CompanyContext"
import { useInventory } from "./InventoryContext"
import { toast } from "sonner"

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Retail",
  "Manufacturing",
  "Education",
  "Construction",
  "Transportation", 
  "Entertainment",
  "Food & Beverage",
  "Environmental",
  "Consulting",
  "Other"
]

function Company() {
  const { companies, addCompany, updateCompany, deleteCompany, resetProductsCount } = useCompany()
  const { deleteProductsByCompany, getProductsByCompany, addProduct } = useInventory()
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showActionsDialog, setShowActionsDialog] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAddProductDialog, setShowAddProductDialog] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industry: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    establishedDate: "",
    status: "active",
    gstNumber: "",
    panNumber: "",
    accountNumber: "",
    bankDetails: {
      bankName: "",
      branchName: "",
      ifscCode: "",
      accountHolderName: "",
      accountType: "current",
      swiftCode: ""
    }
  })

  const [productFormData, setProductFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    costPrice: "",
    stockQuantity: "",
    lowStockThreshold: ""
  })

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      industry: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      establishedDate: "",
      status: "active",
      gstNumber: "",
      panNumber: "",
      accountNumber: "",
      bankDetails: {
        bankName: "",
        branchName: "",
        ifscCode: "",
        accountHolderName: "",
        accountType: "current",
        swiftCode: ""
      }
    })
  }

  const resetProductForm = () => {
    setProductFormData({
      name: "",
      description: "",
      category: "",
      brand: "",
      price: "",
      costPrice: "",
      stockQuantity: "",
      lowStockThreshold: ""
    })
  }

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCompany = async () => {
    if (!formData.name.trim() || !formData.industry) {
      toast.error("Please fill in required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const companyId = addCompany(formData)
      toast.success(`${formData.name} added successfully`)
      resetForm()
      setShowAddDialog(false)
    } catch (error) {
      toast.error("Failed to add company")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCompany = async () => {
    if (!selectedCompany || !formData.name.trim()) {
      toast.error("Please fill in required fields")
      return
    }

    setIsSubmitting(true)
    try {
      updateCompany(selectedCompany._id, formData)
      toast.success(`${formData.name} updated successfully`)
      setShowEditDialog(false)
      setSelectedCompany(null)
      resetForm()
    } catch (error) {
      toast.error("Failed to update company")
    } finally {
      setIsSubmitting(false)
      setShowActionsDialog(false)
    }
  }

  const handleDeleteCompany = async () => {
    if (!selectedCompany) return

    setIsSubmitting(true)
    try {
      // Delete all products associated with this company
      const deletedProductsCount = deleteProductsByCompany(selectedCompany._id)
      
      // Delete the company
      deleteCompany(selectedCompany._id)
      
      toast.success(`${selectedCompany.name} and ${deletedProductsCount} associated products deleted`)
      setShowDeleteDialog(false)
      setSelectedCompany(null)
    } catch (error) {
      toast.error("Failed to delete company")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddProduct = async () => {
    if (!selectedCompany || !productFormData.name.trim() || !productFormData.category) {
      toast.error("Please fill in required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const productData = {
        sku: `${selectedCompany.name.substring(0, 3).toUpperCase()}-${Date.now()}`,
        name: productFormData.name,
        description: productFormData.description,
        category: productFormData.category,
        brand: productFormData.brand || selectedCompany.name,
        companyId: selectedCompany._id,
        companyName: selectedCompany.name,
        price: parseFloat(productFormData.price) || 0,
        costPrice: parseFloat(productFormData.costPrice) || 0,
        currency: "USD",
        stockQuantity: parseInt(productFormData.stockQuantity) || 0,
        lowStockThreshold: parseInt(productFormData.lowStockThreshold) || 10,
        status: "active",
        images: [],
        dimensions: {
          length: 0,
          width: 0,
          height: 0,
          weight: 0,
          unit: "cm",
          weightUnit: "kg"
        },
        tags: []
      }

      addProduct(productData)
      toast.success(`Product "${productFormData.name}" added to ${selectedCompany.name}`)
      resetProductForm()
      setShowAddProductDialog(false)
    } catch (error) {
      toast.error("Failed to add product")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (company) => {
    setSelectedCompany(company)
    setFormData({
      name: company.name,
      description: company.description || "",
      industry: company.industry,
      address: company.address,
      phone: company.phone,
      email: company.email,
      website: company.website || "",
      establishedDate: company.establishedDate,
      status: company.status,
      gstNumber: company.gstNumber || "",
      panNumber: company.panNumber || "",
      accountNumber: company.accountNumber || "",
      bankDetails: {
        bankName: company.bankDetails?.bankName || "",
        branchName: company.bankDetails?.branchName || "",
        ifscCode: company.bankDetails?.ifscCode || "",
        accountHolderName: company.bankDetails?.accountHolderName || "",
        accountType: company.bankDetails?.accountType || "current",
        swiftCode: company.bankDetails?.swiftCode || ""
      }
    })
    setShowEditDialog(true)
  }

  const openDeleteDialog = (company) => {
    setSelectedCompany(company)
    setShowDeleteDialog(true)
  }

  const openActionsDialog = (company) => {
    setSelectedCompany(company)
    setShowActionsDialog(true)
  }

  const openAddProductDialog = (company) => {
    setSelectedCompany(company)
    setShowActionsDialog(false)
    setShowAddProductDialog(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl lg:text-3xl">Company Management</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage companies and their product associations
          </p>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
              <DialogDescription>
                Create a new company profile with complete details
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map(industry => (
                          <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="established">Established Date</Label>
                    <Input
                      id="established"
                      type="date"
                      value={formData.establishedDate}
                      onChange={(e) => setFormData({...formData, establishedDate: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="contact@company.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      placeholder="https://company.com"
                    />
                  </div>

                  <div className="lg:col-span-3 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="123 Business Street, City, State 12345"
                    />
                  </div>

                  <div className="lg:col-span-3 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Brief description of the company"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Tax Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Tax Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <Input
                      id="gstNumber"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                      placeholder="29AABCT1332L2ZG"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="panNumber">PAN Number</Label>
                    <Input
                      id="panNumber"
                      value={formData.panNumber}
                      onChange={(e) => setFormData({...formData, panNumber: e.target.value})}
                      placeholder="AABCT1332L"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                      placeholder="1234567890123456"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Landmark className="h-5 w-5" />
                  Bank Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={formData.bankDetails.bankName}
                      onChange={(e) => setFormData({
                        ...formData, 
                        bankDetails: {...formData.bankDetails, bankName: e.target.value}
                      })}
                      placeholder="State Bank of India"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branchName">Branch Name</Label>
                    <Input
                      id="branchName"
                      value={formData.bankDetails.branchName}
                      onChange={(e) => setFormData({
                        ...formData, 
                        bankDetails: {...formData.bankDetails, branchName: e.target.value}
                      })}
                      placeholder="Main Branch"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      value={formData.bankDetails.ifscCode}
                      onChange={(e) => setFormData({
                        ...formData, 
                        bankDetails: {...formData.bankDetails, ifscCode: e.target.value}
                      })}
                      placeholder="SBIN0001234"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName">Account Holder Name</Label>
                    <Input
                      id="accountHolderName"
                      value={formData.bankDetails.accountHolderName}
                      onChange={(e) => setFormData({
                        ...formData, 
                        bankDetails: {...formData.bankDetails, accountHolderName: e.target.value}
                      })}
                      placeholder="Company Name Pvt Ltd"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountType">Account Type</Label>
                    <Select 
                      value={formData.bankDetails.accountType} 
                      onValueChange={(value) => 
                        setFormData({
                          ...formData, 
                          bankDetails: {...formData.bankDetails, accountType: value}
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="savings">Savings</SelectItem>
                        <SelectItem value="current">Current</SelectItem>
                        <SelectItem value="cc">Cash Credit</SelectItem>
                        <SelectItem value="od">Overdraft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="swiftCode">SWIFT Code</Label>
                    <Input
                      id="swiftCode"
                      value={formData.bankDetails.swiftCode}
                      onChange={(e) => setFormData({
                        ...formData, 
                        bankDetails: {...formData.bankDetails, swiftCode: e.target.value}
                      })}
                      placeholder="SBININBB123"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button onClick={handleAddCompany} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Company
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {companies.filter(c => c.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {companies.reduce((sum, c) => sum + c.productsCount|| 0, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Industries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(companies.map(c => c.industry)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredCompanies.map((company) => (
          <Card key={company._id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-12 w-12 bg-[#3B82F6]/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base lg:text-lg truncate">{company.name}</CardTitle>
                    <div className="mt-1">
                      <Badge variant={company.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {company.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openActionsDialog(company)}
                  className="flex-shrink-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{company.industry}</span>
                </div>
                {company.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{company.email}</span>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{company.phone}</span>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <span className="truncate">{company.website}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>{company.productsCount} products</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Est. {new Date(company.establishedDate).getFullYear()}</span>
                </div>
                {company.gstNumber && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">GST:</span>
                    <span className="font-mono">{company.gstNumber}</span>
                  </div>
                )}
                {company.panNumber && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">PAN:</span>
                    <span className="font-mono">{company.panNumber}</span>
                  </div>
                )}
                {company.bankDetails?.bankName && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Landmark className="h-4 w-4" />
                    <span className="truncate">{company.bankDetails.bankName}</span>
                  </div>
                )}
              </div>

              {company.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {company.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <Card className="p-8">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Companies Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "No companies match your search criteria." : "Get started by adding your first company."}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Company
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Company Actions Dialog */}
      <Dialog open={showActionsDialog} onOpenChange={setShowActionsDialog}>
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Company Actions</DialogTitle>
            <DialogDescription className="text-sm">
              Choose an action for {selectedCompany?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => openAddProductDialog(selectedCompany)}
            >
              <Package className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => openEditDialog(selectedCompany)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Company
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={() => openDeleteDialog(selectedCompany)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Company
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
        <DialogContent className="max-w-sm sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Product to {selectedCompany?.name}</DialogTitle>
            <DialogDescription>
              Create a new product for this company
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={productFormData.name}
                onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={productFormData.category}
                onChange={(e) => setProductFormData({...productFormData, category: e.target.value})}
                placeholder="e.g., Electronics, Clothing"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={productFormData.price}
                  onChange={(e) => setProductFormData({...productFormData, price: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={productFormData.stockQuantity}
                  onChange={(e) => setProductFormData({...productFormData, stockQuantity: e.target.value})}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productDescription">Description</Label>
              <Textarea
                id="productDescription"
                value={productFormData.description}
                onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                placeholder="Product description"
                rows={3}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button onClick={handleAddProduct} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setShowAddProductDialog(false)} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Company Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>
              Update company information and details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editName">Company Name *</Label>
                  <Input
                    id="editName"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editIndustry">Industry *</Label>
                  <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editEstablished">Established Date</Label>
                  <Input
                    id="editEstablished"
                    type="date"
                    value={formData.establishedDate}
                    onChange={(e) => setFormData({...formData, establishedDate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="contact@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editPhone">Phone</Label>
                  <Input
                    id="editPhone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editWebsite">Website</Label>
                  <Input
                    id="editWebsite"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="https://company.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editStatus">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="lg:col-span-3 space-y-2">
                  <Label htmlFor="editAddress">Address</Label>
                  <Input
                    id="editAddress"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="123 Business Street, City, State 12345"
                  />
                </div>

                <div className="lg:col-span-3 space-y-2">
                  <Label htmlFor="editDescription">Description</Label>
                  <Textarea
                    id="editDescription"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description of the company"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Tax Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Tax Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editGstNumber">GST Number</Label>
                  <Input
                    id="editGstNumber"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                    placeholder="29AABCT1332L2ZG"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editPanNumber">PAN Number</Label>
                  <Input
                    id="editPanNumber"
                    value={formData.panNumber}
                    onChange={(e) => setFormData({...formData, panNumber: e.target.value})}
                    placeholder="AABCT1332L"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editAccountNumber">Account Number</Label>
                  <Input
                    id="editAccountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                    placeholder="1234567890123456"
                  />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Landmark className="h-5 w-5" />
                Bank Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editBankName">Bank Name</Label>
                  <Input
                    id="editBankName"
                    value={formData.bankDetails.bankName}
                    onChange={(e) => setFormData({
                      ...formData, 
                      bankDetails: {...formData.bankDetails, bankName: e.target.value}
                    })}
                    placeholder="State Bank of India"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editBranchName">Branch Name</Label>
                  <Input
                    id="editBranchName"
                    value={formData.bankDetails.branchName}
                    onChange={(e) => setFormData({
                      ...formData, 
                      bankDetails: {...formData.bankDetails, branchName: e.target.value}
                    })}
                    placeholder="Main Branch"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editIfscCode">IFSC Code</Label>
                  <Input
                    id="editIfscCode"
                    value={formData.bankDetails.ifscCode}
                    onChange={(e) => setFormData({
                      ...formData, 
                      bankDetails: {...formData.bankDetails, ifscCode: e.target.value}
                    })}
                    placeholder="SBIN0001234"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editAccountHolderName">Account Holder Name</Label>
                  <Input
                    id="editAccountHolderName"
                    value={formData.bankDetails.accountHolderName}
                    onChange={(e) => setFormData({
                      ...formData, 
                      bankDetails: {...formData.bankDetails, accountHolderName: e.target.value}
                    })}
                    placeholder="Company Name Pvt Ltd"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editAccountType">Account Type</Label>
                  <Select 
                    value={formData.bankDetails.accountType} 
                    onValueChange={(value) => 
                      setFormData({
                        ...formData, 
                        bankDetails: {...formData.bankDetails, accountType: value}
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="cc">Cash Credit</SelectItem>
                      <SelectItem value="od">Overdraft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editSwiftCode">SWIFT Code</Label>
                  <Input
                    id="editSwiftCode"
                    value={formData.bankDetails.swiftCode}
                    onChange={(e) => setFormData({
                      ...formData, 
                      bankDetails: {...formData.bankDetails, swiftCode: e.target.value}
                    })}
                    placeholder="SBININBB123"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button onClick={handleEditCompany} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Update Company
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedCompany?.name}"? This will also delete all {selectedCompany?.productsCount || 0} associated products from the inventory. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCompany}
              disabled={isSubmitting}
              className="bg-[#d4183d] text-white hover:bg-[#d4183d]/90"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Company
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Company