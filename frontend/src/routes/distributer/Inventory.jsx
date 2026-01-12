import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { 
  Package, 
  Plus, 
  Search, 
  Filter,
  Edit, 
  Trash2, 
  Eye,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  IndianRupeeIcon,
  BarChart3,
  Grid3X3,
  List,
  RefreshCw,
  Building2,
  Tag,
  Calendar,
  Truck,
  ImagePlus,
  X as XIcon,
  Upload
} from "lucide-react"
import { useInventory, categories } from "./InventoryContext"
import { useCompany } from "./CompanyContext"
import { toast } from "./ui/sonner"

//ENV CONFIG
const digital_ocean_url = import.meta.env.VITE_DIGITAL_OCEAN_URL;

function Inventory() {
  const { 
    products, 
    addCategory,
    udpateCategory,
    deleteCategory,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    getInventoryStats,
    searchProducts,
    getLowStockProducts,
    getOutOfStockProducts
  } = useInventory()
  // console.log("products", products)
  const { companies, incrementProductsCount, decrementProductsCount } = useCompany()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCompany, setSelectedCompany] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [viewMode, setViewMode] = useState("table")
  const [sortField, setSortField] = useState("created")
  const [sortOrder, setSortOrder] = useState("desc")
  const [commonColors, setCommonColors] = useState("")
  const [isCommonColorSelected, setIsCommonColorSelected] = useState(false)
  
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showProductDialog, setShowProductDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrls,setPreviewUrls] = useState([])

  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false)
  const [showEditCategoryDialog, setShowEditCategoryDialog] = useState(false)
  const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] = useState(false)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [selectedDiaCategory, setSelectedDiaCategory] = useState(null)
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    name: "",
  description: "",
  category: "",
  brand: "",
  companyId: "",
  sizes: [],        // still useful for generating SKUs
  colors: [],       // still useful for generating SKUs
  lowStockThreshold: "",
  status: "active",
  tags: '',
  supplier: "",
  barcode: "",      // optional: global barcode (SKUs have their own barcode too)
  innerPack:'',
  masterPack:'',
  images: [],
  dimensions: {
    length: "",
    width: "",
    height: "",
    weight: "",
    unit: "cm",
    weightUnit: "kg"
  },

  // ✅ new field for variants
  skus: [
    // Example structure:
    {
      sku: "WAT-BLUE-1L-1234",
      color: "Blue",
      size: "1L",
      price: 500,
      costPrice: 400,
      stockQuantity: 100,
      barcode: "ABC123"
    }
  ]
  })

  const [categoryFormData, setCategoryFormData] = useState({
    name:"",
    lgst:"",
    sgst:"",
    cgst:"",
    other:""
  })
  
  const [dragActive, setDragActive] = useState(false)

  const stats = getInventoryStats()
  const lowStockProducts = getLowStockProducts()
  const outOfStockProducts = getOutOfStockProducts()

  //preview url for the inputed imgs
  const handleImageChange = (e) => {
    const files = e.target.files;

    if (!files) return;

    const urls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewUrls((prevUrls) => {
      if (prevUrls && prevUrls.length > 0) {
        return [...prevUrls, ...urls];
      } else {
        return urls;
      }
    });
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products

    // Apply search
    if (searchTerm) {
      filtered = searchProducts(searchTerm)
    }

    // Apply filters
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }
    if (selectedCompany !== "all") {
      filtered = filtered.filter(p => p.companyId === selectedCompany)
    }
    if (selectedStatus !== "all") {
      filtered = filtered.filter(p => p.status === selectedStatus)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      if (sortField === "created" || sortField === "updated") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (sortField === "price") {
        aValue = a.price
        bValue = b.price
      } else if (sortField === "stock") {
        aValue = a.stockQuantity
        bValue = b.stockQuantity
      } else {
        aValue = aValue?.toString().toLowerCase() || ""
        bValue = bValue?.toString().toLowerCase() || ""
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [products, searchTerm, selectedCategory, selectedCompany, selectedStatus, sortField, sortOrder])

  const resetCategoryForm = ()=>{
    setCategoryFormData({
      name:"",
      lgst:"",
      sgst:"",
      cgst:"",
      other:""
    })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      brand: "",
      companyId: "",
      price:'',
      color:'',
      size:'',
      costPrice: "",
      stockQuantity: "",
      lowStockThreshold: "",
      status: "active",
      tags: "",
      supplier: "",
      barcode: "",
      innerPack:'',
      masterPack:'',
      images: [],
      dimensions: {
        length: "",
        width: "",
        height: "",
        weight: "",
        unit: "cm",
        weightUnit: "kg"
      },
      skus:[]
    })
  }

  const handleAddCategory = async () =>{
    if(!categoryFormData.name.trim()) {
      toast.error("Please fill in required fields")
      return
    }
    setIsSubmitting(true)
     try {

      const categoryFormDataToSend = new FormData();
      categoryFormDataToSend.append("name", categoryFormData.name);
      categoryFormDataToSend.append("lgst", categoryFormData.lgst);
      categoryFormDataToSend.append("sgst", categoryFormData.sgst);
      categoryFormDataToSend.append("cgst", categoryFormData.cgst);
      categoryFormDataToSend.append("other", categoryFormData.other);

      // console.log('adding category', categoryFormDataToSend)

      addCategory(categoryFormDataToSend)
      resetCategoryForm()
      setShowAddCategoryDialog(false)
    } catch (error) {
      toast.error("Failed to add category")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddProduct = async () => {
    if (!formData.name.trim() || !formData.category || !formData.companyId) {
      toast.error("Please fill in required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const company = companies.find(c => c._id === formData.companyId)
      if (!company) {
        toast.error("Invalid company selected")
        return
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("brand", formData.brand || company.name);
      formDataToSend.append("companyId", formData.companyId);
      formDataToSend.append("companyName", company.name);
      formDataToSend.append("color", formData.color || "");
      formDataToSend.append("price", formData.price?.toString() || "0");
      formDataToSend.append("costPrice", formData.costPrice?.toString() || "0");
      formDataToSend.append("stockQuantity", formData.stockQuantity?.toString() || "0");
      formDataToSend.append("lowStockThreshold", formData.lowStockThreshold?.toString() || "10");
      formDataToSend.append("status", formData.status || "active");
      formDataToSend.append("tags", formData.tags || "");
      formDataToSend.append("supplier", formData.supplier || "");
      formDataToSend.append("barcode", formData.barcode || "");
      formDataToSend.append("innerPack", formData.innerPack || "");
      formDataToSend.append("masterPack", formData.masterPack || "");

      // ✅ Dimensions and SKUs should be JSON-stringified
      formDataToSend.append("dimensions", JSON.stringify(formData.dimensions));
      formDataToSend.append("skus", JSON.stringify(formData.skus || []));

      // ✅ Append each image file — key must be `images`
      formData.images.forEach((file) => {
        if (file instanceof File) {
          formDataToSend.append("images", file);
        } else if (file.url) {
          // keep existing images if they’re already uploaded
          formDataToSend.append("existingImages", file.url);
        }
      });

      const productData = {
        sku: `${company.name.substring(0, 3).toUpperCase()}-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        brand: formData.brand || company.name,
        size:formData.size||'',
        color:formData.color||'',
        companyId: formData.companyId,
        companyName: company.name,
        price: formData.price || '0',
        costPrice: parseFloat(formData.costPrice) || 0,
        currency: "INR",
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 10,
        status: formData.status,
        images: formData.images,
        dimensions: {
          length: parseFloat(formData.dimensions.length) || 0,
          width: parseFloat(formData.dimensions.width) || 0,
          height: parseFloat(formData.dimensions.height) || 0,
          weight: parseFloat(formData.dimensions.weight) || 0,
          unit: formData.dimensions.unit,
          weightUnit: formData.dimensions.weightUnit
        },
        skus:formData.skus,
        tags: formData.tags,
        supplier: formData.supplier,
        barcode: formData.barcode,
        innerPack: formData.innerPack || '',
        masterPack: formData.masterPack || '',
      }

      console.log('adding product', productData)

      addProduct(productData)
      incrementProductsCount(formData.companyId)
      toast.success(`Product "${formData.name}" added successfully`)
      resetForm()
      setShowAddDialog(false)
    } catch (error) {
      toast.error("Failed to add product")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCategory = async () =>{
    if(!categoryFormData.name.trim()) {
      toast.error("Please enter a category name")
      return
    }

    setIsSubmitting(true)
    try {
      const categoryData = {
        name: categoryFormData.name,
        lgst: categoryFormData.lgst,
        sgst: categoryFormData.sgst,
        cgst: categoryFormData.cgst,
        other: categoryFormData.other
      }

      // console.log("Updating category:", categoryData)
      updateCategory({id: selectedCategory._id, categoryData})
      toast.success(`Category "${categoryFormData.name}" updated successfully`)
      setShowEditCategoryDialog(false)
      setSelectedCategory(null)
      resetCategoryForm()
    } catch (error) {
      toast.error("Failed to update category")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditProduct = async () => {
    if (!selectedProduct || !formData.name.trim() || !formData.category) {
      toast.error("Please fill in required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const company = companies.find(c => c._id === formData.companyId)
      if (!company) {
        toast.error("Invalid company selected")
        return
      }
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("brand", formData.brand || company.name);
      formDataToSend.append("companyId", formData.companyId);
      formDataToSend.append("companyName", company.name);
      formDataToSend.append("color", formData.color || "");
      formDataToSend.append("price", formData.price?.toString() || "0");
      formDataToSend.append("costPrice", formData.costPrice?.toString() || "0");
      formDataToSend.append("stockQuantity", formData.stockQuantity?.toString() || "0");
      formDataToSend.append("lowStockThreshold", formData.lowStockThreshold?.toString() || "10");
      formDataToSend.append("status", formData.status || "active");
      formDataToSend.append("tags", formData.tags || "");
      formDataToSend.append("supplier", formData.supplier || "");
      formDataToSend.append("barcode", formData.barcode || "");
      formDataToSend.append("innerPack", formData.innerPack || "");
      formDataToSend.append("masterPack", formData.masterPack || "");

      // ✅ Dimensions and SKUs should be JSON-stringified
      formDataToSend.append("dimensions", JSON.stringify(formData.dimensions));
      formDataToSend.append("skus", JSON.stringify(formData.skus || []));

      // ✅ Append each image file — key must be `images`
      formData.images.forEach((file) => {
        if (file instanceof File) {
          formDataToSend.append("images", file);
        } else if (file.url) {
          // keep existing images if they’re already uploaded
          formDataToSend.append("existingImages", file.url);
        }
      });

      // console.log("Updating product:", formDataToSend)
      updateProduct({id: selectedProduct._id, formDataToSend})
      toast.success(`Product "${formData.name}" updated successfully`)
      setShowEditDialog(false)
      setSelectedProduct(null)
      resetForm()
    } catch (error) {
      toast.error("Failed to update product")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async ()=>{
    if (!selectedCategory) return

    setIsSubmitting(true)
    try {
      deleteCategory(selectedCategory._id)
      toast.success(`Category "${selectedCategory.name}" deleted successfully`)
      setShowDeleteCategoryDialog(false)
      setSelectedCategory(null)
    } catch (error) {
      toast.error("Failed to delete category")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return
    console.log('deleting product',selectedProduct)

    setIsSubmitting(true)
    try {
      await deleteProduct(selectedProduct._id)
      await decrementProductsCount(selectedProduct.companyId)
      toast.success(`Product "${selectedProduct.name}" deleted successfully`)
      setShowDeleteDialog(false)
      setSelectedProduct(null)
    } catch (error) {
      toast.error("Failed to delete product")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openCategoryEditDialog = (category)=>{
    setSelectedCategory(category)
    setCategoryFormData({
      name:category.name,
      lgst:category.lgst,
      sgst:category.sgst,
      cgst:category.cgst,
      other:category.other
    })
    setShowEditCategoryDialog(true)
  }

  const openEditDialog = (product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      brand: product.brand,
      companyId: product.companyId,
      color:product.color||'',
      price: product.price,
      costPrice: product.costPrice,
      stockQuantity: product.stockQuantity,
      lowStockThreshold: product.lowStockThreshold,
      status: product.status,
      tags: product.tags,
      supplier: product.supplier || "",
      barcode: product.barcode || "",
      innerPack:product.innerPack||'',
      masterPack:product.masterPack||'',
      images: [...product.images],
      dimensions: {
        length: product.dimensions.length.toString(),
        width: product.dimensions.width.toString(),
        height: product.dimensions.height.toString(),
        weight: product.dimensions.weight.toString(),
        unit: product.dimensions.unit,
        weightUnit: product.dimensions.weightUnit
      },
      skus:product.skus
    })
    setShowEditDialog(true)
  }

  const openDeleteDialog = (product) => {
    setSelectedProduct(product)
    setShowDeleteDialog(true)
  }

  const openCategoryDeleteDialog = (category) => {
    setSelectedCategory(category)
    setShowDeleteCategoryDialog(true)
  }
  const openCategoryDialog = (category) => {
    setSelectedCategory(category)
    setShowCategoryDialog(true)
  }

  const openProductDialog = (product) => {
    setSelectedProduct(product)
    setShowProductDialog(true)
  }

  const getStockStatus = (product) => {
    if (product.stockQuantity === 0) return { label: "Out of Stock", variant: "destructive" }
    if (product.stockQuantity <= product.lowStockThreshold) return { label: "Low Stock", variant: "secondary" }
    return { label: "In Stock", variant: "default" }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  // Photo upload handlers
  const handleFileSelect = (event) => {
    const files = event.target.files

    if (!files) return;

    const urls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewUrls((prevUrls) => {
      if (prevUrls && prevUrls.length > 0) {
        return [...prevUrls, ...urls];
      } else {
        return urls;
      }
    });
    
    if (files) {
      handleFiles(Array.from(files))
    }
  }


  const handleFiles = (files) => {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast.error(`Image ${file.name} is too large. Maximum size is 5MB.`)
          return
        }
        // console.log('file data', file)
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, file]
        }));
      } else {
        toast.error(`File ${file.name} is not a valid image format.`)
      }
    })
        // console.log('form img data',formData.images)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragIn = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragOut = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="w-full">
      <div className="ml-8 lg:hidden">
        <h1 className="text-xl">Inventory</h1>
      </div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1>Inventory Management</h1>
            <p className="text-muted-foreground">
              Manage your product catalog with Amazon-style inventory tracking
            </p>
          </div>

          <Dialog open={showAddCategoryDialog} onOpenChange={setShowAddCategoryDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetCategoryForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new category in your inventory
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Category Name *</Label>
                      <Input
                        id="name"
                        value={categoryFormData.name}
                        onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                        placeholder="Enter category name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="localGST">Category Local GST</Label>
                      <Input
                        id="localGST"
                        value={categoryFormData.lgst}
                        onChange={(e) => setCategoryFormData({...categoryFormData, lgst: e.target.value})}
                        placeholder="Enter category local GST"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stateGST">Category State GST</Label>
                      <Input
                        id="stateGST"
                        value={categoryFormData.sgst}
                        onChange={(e) => setCategoryFormData({...categoryFormData, sgst: e.target.value})}
                        placeholder="Enter category state GST"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="centerGST">Category Central GST</Label>
                      <Input
                        id="centerGST"
                        value={categoryFormData.cgst}
                        onChange={(e) => setCategoryFormData({...categoryFormData, cgst: e.target.value})}
                        placeholder="Enter category central GST"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otherDetails">Other details</Label>
                      <Input
                        id="otherDetails"
                        value={categoryFormData.other}
                        onChange={(e) => setCategoryFormData({...categoryFormData, other: e.target.value})}
                        placeholder="Enter other details"
                      />
                    </div>
            </div>
            <div className="flex gap-2 pt-4">
                <Button onClick={handleAddCategory} disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowAddCategoryDialog(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Create a new product in your inventory
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="variants">Variants/SKUs</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter product name"
                      />
                    </div>

                    <div className="space-y-2 bg-white">
                      <Label htmlFor="companyId">Company *</Label>
                      <Select value={formData.companyId} onValueChange={(value) => setFormData({...formData, companyId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.filter(c => c.status === 'active').map(company => (
                            <SelectItem key={company._id} value={company._id}>{company.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 bg-white">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category._id} value={category.name}>{category.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        placeholder="Product brand"
                      />
                    </div>

                    <div className="space-y-2 bg-white">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="discontinued">Discontinued</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supplier">Supplier</Label>
                      <Input
                        id="supplier"
                        value={formData.supplier}
                        onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                        placeholder="Supplier name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold</Label>
                      <Input
                        id="lowStockThreshold"
                        type="number"
                        value={formData.lowStockThreshold}
                        onChange={(e) => setFormData({...formData, lowStockThreshold: e.target.value})}
                        placeholder="10"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Product description"
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="variants" className="space-y-4">

                  {/* SKU Management */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-medium">Enter Common Colors</Label>
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <Input
                          value={commonColors}
                          onChange={(e) => {
                            setCommonColors(e.target.value)
                          }}
                          placeholder="Red, Blue, etc."
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-medium">Product SKUs & Pricing</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const validSizes = formData.sizes?.filter(s => s.trim()) || [''];
                          const validColors = formData.colors?.filter(c => c.trim()) || [''];
                          const newSkus = [];
                          
                          if (validColors.length > 0 && validColors[0] !== '' && validSizes.length > 0 && validSizes[0] !== '') {
                            validColors.forEach(color => {
                              validSizes.forEach(size => {
                                newSkus.push({
                                  sku: `${formData.name?.substring(0,3).toUpperCase() || 'PRD'}-${color.substring(0,2).toUpperCase()}-${size.substring(0,2).toUpperCase()}-${Date.now().toString().slice(-4)}`,
                                  color: color,
                                  size: size,
                                  price: '',
                                  costPrice: '',
                                  stockQuantity: '',
                                  barcode: ''
                                });
                              });
                            });
                          } else if (validColors.length > 0 && validColors[0] !== '') {
                            validColors.forEach(color => {
                              newSkus.push({
                                sku: `${formData.name?.substring(0,3).toUpperCase() || 'PRD'}-${color.substring(0,2).toUpperCase()}-${Date.now().toString().slice(-4)}`,
                                color: color,
                                size: '',
                                price: '',
                                costPrice: '',
                                stockQuantity: '',
                                barcode: ''
                              });
                            });
                          } else if (validSizes.length > 0 && validSizes[0] !== '') {
                            validSizes.forEach(size => {
                              newSkus.push({
                                sku: `${formData.name?.substring(0,3).toUpperCase() || 'PRD'}-${size.substring(0,2).toUpperCase()}-${Date.now().toString().slice(-4)}`,
                                color: '',
                                size: size,
                                price: '',
                                costPrice: '',
                                stockQuantity: '',
                                barcode: ''
                              });
                            });
                          } else {
                            newSkus.push({
                              sku: `${formData.name?.substring(0,3).toUpperCase() || 'PRD'}-${Date.now().toString().slice(-4)}`,
                              color: '',
                              size: '',
                              price: '',
                              costPrice: '',
                              stockQuantity: '',
                              barcode: ''
                            });
                          }
                          
                          setFormData({...formData, skus: newSkus});
                        }}
                      >
                        Generate SKUs
                      </Button>
                    </div>

                    {/* Manual SKU Addition */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newSku = {
                          sku: `${formData.name?.substring(0,3).toUpperCase() || 'PRD'}-${Date.now().toString().slice(-4)}`,
                          color: '',
                          size: '',
                          price: '',
                          costPrice: '',
                          stockQuantity: '',
                          barcode: ''
                        };
                        setFormData({
                          ...formData, 
                          skus: [...(formData.skus || []), newSku]
                        });
                      }}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Manual SKU
                    </Button>

                    {/* SKU List */}
                    {formData.skus && formData.skus.length > 0 && (
                      <div className="space-y-4">
                        {formData.skus.map((sku, index) => (
                          <div key={index} className="p-4 border rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium">SKU #{index + 1}</Label>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  const newSkus = formData.skus.filter((_, i) => i !== index);
                                  setFormData({...formData, skus: newSkus});
                                }}
                              >
                                <XIcon className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              <div className="space-y-2">
                                <Label>SKU Code *</Label>
                                <Input
                                  value={sku.sku}
                                  onChange={(e) => {
                                    const newSkus = [...formData.skus];
                                    newSkus[index].sku = e.target.value;
                                    setFormData({...formData, skus: newSkus});
                                  }}
                                  placeholder="SKU-001"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Color <button className="border border-gray-300 rounded-md px-2 py-1" onClick={() => {setIsCommonColorSelected((prev) => !prev); setCommonColors(sku.color)}}>common</button></Label>
                                <Input
                                  value={sku.color}
                                  disabled={isCommonColorSelected}
                                  onChange={(e) => {
                                    const newSkus = [...formData.skus];
                                    newSkus[index].color = e.target.value;
                                    setFormData({...formData, skus: newSkus});
                                  }}
                                  placeholder="Red, Blue, etc."
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Size</Label>
                                <Input
                                  value={sku.size}
                                  onChange={(e) => {
                                    const newSkus = [...formData.skus];
                                    newSkus[index].size = e.target.value;
                                    setFormData({...formData, skus: newSkus});
                                  }}
                                  placeholder="S, M, L, etc."
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Price *</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={sku.price}
                                  onChange={(e) => {
                                    const newSkus = [...formData.skus];
                                    newSkus[index].price = e.target.value;
                                    setFormData({...formData, skus: newSkus});
                                  }}
                                  placeholder="0.00"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Cost Price</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={sku.costPrice}
                                  onChange={(e) => {
                                    const newSkus = [...formData.skus];
                                    newSkus[index].costPrice = e.target.value;
                                    setFormData({...formData, skus: newSkus});
                                  }}
                                  placeholder="0.00"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Stock Quantity</Label>
                                <Input
                                  type="number"
                                  value={sku.stockQuantity}
                                  onChange={(e) => {
                                    const newSkus = [...formData.skus];
                                    newSkus[index].stockQuantity = e.target.value;
                                    setFormData({...formData, skus: newSkus});
                                  }}
                                  placeholder="0"
                                />
                              </div>
                              
                              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                                <Label>Barcode</Label>
                                <Input
                                  value={sku.barcode}
                                  onChange={(e) => {
                                    const newSkus = [...formData.skus];
                                    newSkus[index].barcode = e.target.value;
                                    setFormData({...formData, skus: newSkus});
                                  }}
                                  placeholder="Barcode for this specific SKU"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        placeholder="premium, bestseller, new"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="barcode">General Barcode</Label>
                      <Input
                        id="barcode"
                        value={formData.barcode}
                        onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                        placeholder="General product barcode"
                      />
                      <p className="text-xs text-muted-foreground">Individual SKUs can have their own barcodes</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="dimensionsSection">Product Price and Color</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salePrice">Color</Label>
                        <Input
                          id="salePrice"
                          type="text"
                          value={formData.color}
                          onChange={(e) => setFormData({...formData, color: e.target.value})}
                          placeholder="Color"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Dimensions</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="length">Length</Label>
                        <Input
                          id="length"
                          type="number"
                          step="0.01"
                          value={formData.dimensions.length}
                          onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, length: e.target.value}})}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="width">Width</Label>
                        <Input
                          id="width"
                          type="number"
                          step="0.01"
                          value={formData.dimensions.width}
                          onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, width: e.target.value}})}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height</Label>
                        <Input
                          id="height"
                          type="number"
                          step="0.01"
                          value={formData.dimensions.height}
                          onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, height: e.target.value}})}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit">Unit</Label>
                        <Select value={formData.dimensions.unit} onValueChange={(value) => setFormData({...formData, dimensions: {...formData.dimensions, unit: value}})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cm">cm</SelectItem>
                            <SelectItem value="inch">inch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.01"
                          value={formData.dimensions.weight}
                          onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, weight: e.target.value}})}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weightUnit">Weight Unit</Label>
                        <Select value={formData.dimensions.weightUnit} onValueChange={(value) => setFormData({...formData, dimensions: {...formData.dimensions, weightUnit: value}})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="lb">lb</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Package</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="innerPack">Inner Pack</Label>
                        <Input
                          id="innerPack"
                          type="text"
                          value={formData.innerPack}
                          onChange={(e) => setFormData({...formData, innerPack: e.target.value})}
                          placeholder="Enter inner pack"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="masterPack">Master Pack</Label>
                        <Input
                          id="masterPack"
                          type="text"
                          value={formData.masterPack}
                          onChange={(e) => setFormData({...formData, masterPack: e.target.value})}
                          placeholder="Enter master pack"
                        />
                      </div>
                    </div>
                  </div>

                </TabsContent>

                <TabsContent value="images" className="space-y-4">
                  {/* Photo Upload Section */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-responsive-sm flex items-center gap-2">
                        <ImagePlus className="icon-responsive-sm" />
                        Product Photos *
                      </Label>
                      <p className="text-responsive-xs text-muted-foreground">
                        Upload up to 5 photos (max 5MB each). Drag and drop or click to browse.
                      </p>
                    </div>

                    {/* Image Upload Area */}
                    <div
                      className={`relative border-2 border-dashed rounded-lg responsive-padding transition-all ${
                        dragActive
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      } ${formData.images.length >= 5 ? 'opacity-50 pointer-events-none' : ''}`}
                      onDragEnter={handleDragIn}
                      onDragLeave={handleDragOut}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={formData.images.length >= 5}
                      />
                      <div className="flex flex-col items-center justify-center space-y-3 text-center">
                        <div className="p-3 bg-muted rounded-full">
                          <Upload className="icon-responsive-base text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-responsive-sm font-medium">
                            {formData.images.length >= 5 
                              ? 'Maximum photos reached' 
                              : 'Drop your images here, or click to browse'
                            }
                          </p>
                          <p className="text-responsive-xs text-muted-foreground">
                            JPG, PNG, GIF up to 5MB each
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Image Preview Grid */}
                    {formData.images.length > 0 && (
                      <div className="space-y-3">
                        <Label className="text-responsive-sm">Uploaded Photos ({formData.images.length}/5)</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {console.log(formData.images)}
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group aspect-square">
                              <img
                                src={previewUrls[index]}
                                name="images"
                                alt={`Product photo ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg border bg-muted"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all rounded-lg flex items-center justify-center">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => removeImage(index)}
                                >
                                  <XIcon className="h-4 w-4" />
                                </Button>
                              </div>
                              {index === 0 && (
                                <div className="absolute -top-2 -left-2">
                                  <Badge variant="secondary" className="text-xs px-2 py-1">
                                    Main
                                  </Badge>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-responsive-xs text-muted-foreground">
                          First image will be used as the main product photo.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 pt-4">
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
                <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeProducts} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <IndianRupeeIcon className="h-4 w-4" />
                Total Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
              <p className="text-xs text-muted-foreground">
                Inventory value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Low Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">
                Need restocking
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                Out of Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.outOfStockProducts}</div>
              <p className="text-xs text-muted-foreground">
                Urgent restock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Product categories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products by name, SKU, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.length>0 && categories.map(category => (
                  <SelectItem key={category._id} value={category.name}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map(company => (
                  <SelectItem key={company._id} value={company._id}>{company.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex bg-muted rounded-md p-1">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Display */}
        {viewMode === "table" ? (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => {
                      if (sortField === "name") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      } else {
                        setSortField("name")
                        setSortOrder("asc")
                      }
                    }}
                  >
                    Product {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => {
                      if (sortField === "price") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      } else {
                        setSortField("price")
                        setSortOrder("desc")
                      }
                    }}
                  >
                    Price {sortField === "price" && (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => {
                      if (sortField === "stock") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      } else {
                        setSortField("stock")
                        setSortOrder("desc")
                      }
                    }}
                  >
                    Stock {sortField === "stock" && (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProducts.map((product) => {
                  const stockStatus = getStockStatus(product)
                  return (
                    <TableRow key={product._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {product.companyName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(product.price)}</TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant}>
                          {product.stockQuantity} units
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.status === "active" ? "default" : 
                                  product.status === "inactive" ? "secondary" : "destructive"}
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openProductDialog(product)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => {
              const stockStatus = getStockStatus(product)
              return (
                <Card key={product._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{product.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{product.sku}</p>
                      </div>
                      <Badge 
                        variant={product.status === "active" ? "default" : 
                                product.status === "inactive" ? "secondary" : "destructive"}
                        className="ml-2"
                      >
                        {product.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span className="truncate">{product.companyName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">{product.category}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold">{formatCurrency(product.price)}</div>
                      <Badge variant={stockStatus.variant}>
                        {product.stockQuantity} units
                      </Badge>
                    </div>

                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openProductDialog(product)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {filteredAndSortedProducts.length === 0 && (
          <Card className="p-8">
            <div className="text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory !== "all" || selectedCompany !== "all" || selectedStatus !== "all" ? 
                  "No products match your current filters." : 
                  "Get started by adding your first product."}
              </p>
              {!searchTerm && selectedCategory === "all" && selectedCompany === "all" && selectedStatus === "all" && (
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Product Details Dialog */}
        <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedProduct?.name}</DialogTitle>
              <DialogDescription>
                Product details and information
              </DialogDescription>
            </DialogHeader>
            
            {selectedProduct && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>SKU</Label>
                    <p className="text-sm">{selectedProduct.sku}</p>
                  </div>
                  <div>
                    <Label>Company</Label>
                    <p className="text-sm">{selectedProduct.companyName}</p>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <p className="text-sm">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <Label>Brand</Label>
                    <p className="text-sm">{selectedProduct.brand}</p>
                  </div>
                  <div>
                    <Label>Price</Label>
                    <p className="text-sm">{formatCurrency(selectedProduct.price)}</p>
                  </div>
                  <div>
                    <Label>Stock</Label>
                    <p className="text-sm">{selectedProduct.stockQuantity} units</p>
                  </div>
                </div>

                {selectedProduct.description && (
                  <div>
                    <Label>Description</Label>
                    <p className="text-sm mt-1">{selectedProduct.description}</p>
                  </div>
                )}

                {selectedProduct.tags.length > 0 && (
                  <div>
                    <Label>Tags</Label>
                    <div className="flex gap-1 mt-1">
                      {selectedProduct.tags.split(',').map(tag => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {console.log(selectedProduct.images)}
                {selectedProduct.images.length > 0 && (
                  <div>
                    <Label>Images</Label>
                    <div className="flex gap-1 mt-1">
                      {selectedProduct.images.map(image => (
                        <img key={image} src={digital_ocean_url+image.url} alt={selectedProduct.name} className="h-16 w-16 object-cover" />
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <Label>Created</Label>
                    <p>{new Date(selectedProduct.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Last Updated</Label>
                    <p>{new Date(selectedProduct.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog - Similar to Add Dialog but with pre-filled data */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update product information
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="variants">Variants/SKUs</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editName">Product Name *</Label>
                    <Input
                      id="editName"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter product name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="editCompanyId">Company *</Label>
                    <Select value={formData.companyId} onValueChange={(value) => setFormData({...formData, companyId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.filter(c => c.status === 'active').map(company => (
                          <SelectItem key={company._id} value={company._id}>{company.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="editCategory">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category._id} value={category.name}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>


                    <div className="space-y-2">
                      <Label htmlFor="editBrand">Brand</Label>
                      <Input
                        id="editBrand"
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        placeholder="Product brand"
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
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                      <Label htmlFor="supplier">Supplier</Label>
                      <Input
                        id="supplier"
                        value={formData.supplier}
                        onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                        placeholder="Supplier name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold</Label>
                      <Input
                        id="lowStockThreshold"
                        type="number"
                        value={formData.lowStockThreshold}
                        onChange={(e) => setFormData({...formData, lowStockThreshold: e.target.value})}
                        placeholder="10"
                      />
                    </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="editDescription">Description</Label>
                    <Textarea
                      id="editDescription"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Product description"
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="variants" className="space-y-4">

                  {/* SKU Management */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-medium">Enter Common Colors</Label>
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <Input
                          value={commonColors}
                          onChange={(e) => {
                            setCommonColors(e.target.value)
                          }}
                          placeholder="Red, Blue, etc."
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-medium">Product SKUs & Pricing</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const validSizes = formData.sizes?.filter(s => s.trim()) || [''];
                          const validColors = formData.colors?.filter(c => c.trim()) || [''];
                          const newSkus = [];
                          
                          if (validColors.length > 0 && validColors[0] !== '' && validSizes.length > 0 && validSizes[0] !== '') {
                            validColors.forEach(color => {
                              validSizes.forEach(size => {
                                newSkus.push({
                                  sku: `${formData.name?.substring(0,3).toUpperCase() || 'PRD'}-${color.substring(0,2).toUpperCase()}-${size.substring(0,2).toUpperCase()}-${Date.now().toString().slice(-4)}`,
                                  color: color,
                                  size: size,
                                  price: '',
                                  costPrice: '',
                                  stockQuantity: '',
                                  barcode: ''
                                });
                              });
                            });
                          } else if (validColors.length > 0 && validColors[0] !== '') {
                            validColors.forEach(color => {
                              newSkus.push({
                                sku: `${formData.name?.substring(0,3).toUpperCase() || 'PRD'}-${color.substring(0,2).toUpperCase()}-${Date.now().toString().slice(-4)}`,
                                color: color,
                                size: '',
                                price: '',
                                costPrice: '',
                                stockQuantity: '',
                                barcode: ''
                              });
                            });
                          } else if (validSizes.length > 0 && validSizes[0] !== '') {
                            validSizes.forEach(size => {
                              newSkus.push({
                                sku: `${formData.name?.substring(0,3).toUpperCase() || 'PRD'}-${size.substring(0,2).toUpperCase()}-${Date.now().toString().slice(-4)}`,
                                color: '',
                                size: size,
                                price: '',
                                costPrice: '',
                                stockQuantity: '',
                                barcode: ''
                              });
                            });
                          } else {
                            newSkus.push({
                              sku: `${formData.name?.substring(0,3).toUpperCase() || 'PRD'}-${Date.now().toString().slice(-4)}`,
                              color: '',
                              size: '',
                              price: '',
                              costPrice: '',
                              stockQuantity: '',
                              barcode: ''
                            });
                          }
                          
                          setFormData({...formData, skus: newSkus});
                        }}
                      >
                        Generate SKUs
                      </Button>
                    </div>

                    {/* Manual SKU Addition */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newSku = {
                          sku: `${formData.name?.substring(0,3).toUpperCase() || 'PRD'}-${Date.now().toString().slice(-4)}`,
                          color: '',
                          size: '',
                          price: '',
                          costPrice: '',
                          stockQuantity: '',
                          barcode: ''
                        };
                        setFormData({
                          ...formData, 
                          skus: [...(formData.skus || []), newSku]
                        });
                      }}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Manual SKU
                    </Button>

                    {/* SKU List */}
                    {formData.skus && formData.skus.length > 0 && (
                      <div className="space-y-4">
                        {formData.skus.map((sku, index) => (
                          <div key={index} className="p-4 border rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium">SKU #{index + 1}</Label>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  const newSkus = formData.skus.filter((_, i) => i !== index);
                                  setFormData({...formData, skus: newSkus});
                                }}
                              >
                                <XIcon className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              <div className="space-y-2">
                                <Label>SKU Code *</Label>
                                <Input
                                  value={sku.sku}
                                  onChange={(e) => {
                                    const newSkus = [...formData.skus];
                                    newSkus[index].sku = e.target.value;
                                    setFormData({...formData, skus: newSkus});
                                  }}
                                  placeholder="SKU-001"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Color <button className="border border-gray-300 rounded-md px-2 py-1" onClick={() => {setIsCommonColorSelected((prev) => !prev); setCommonColors(sku.color)}}>common</button></Label>
                                <Input
                                  value={sku.color}
                                  disabled={isCommonColorSelected}
                                  onChange={(e) => {
                                    const newSkus = [...formData.skus];
                                    newSkus[index].color = e.target.value;
                                    setFormData({...formData, skus: newSkus});
                                  }}
                                  placeholder="Red, Blue, etc."
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Size</Label>
                                <Input
                                  value={sku.size}
                                  onChange={(e) => {
                                    const newSkus = [...formData.skus];
                                    newSkus[index].size = e.target.value;
                                    setFormData({...formData, skus: newSkus});
                                  }}
                                  placeholder="S, M, L, etc."
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Price *</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={sku.price}
                                  onChange={(e) => {
                                    const newSkus = [...formData.skus];
                                    newSkus[index].price = e.target.value;
                                    setFormData({...formData, skus: newSkus});
                                  }}
                                  placeholder="0.00"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Cost Price</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={sku.costPrice}
                                  onChange={(e) => {
                                    const newSkus = [...formData.skus];
                                    newSkus[index].costPrice = e.target.value;
                                    setFormData({...formData, skus: newSkus});
                                  }}
                                  placeholder="0.00"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Stock Quantity</Label>
                                <Input
                                  type="number"
                                  value={sku.stockQuantity}
                                  onChange={(e) => {
                                    const newSkus = [...formData.skus];
                                    newSkus[index].stockQuantity = e.target.value;
                                    setFormData({...formData, skus: newSkus});
                                  }}
                                  placeholder="0"
                                />
                              </div>
                              
                              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                                <Label>Barcode</Label>
                                <Input
                                  value={sku.barcode}
                                  onChange={(e) => {
                                    const newSkus = [...formData.skus];
                                    newSkus[index].barcode = e.target.value;
                                    setFormData({...formData, skus: newSkus});
                                  }}
                                  placeholder="Barcode for this specific SKU"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        placeholder="premium, bestseller, new"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="barcode">General Barcode</Label>
                      <Input
                        id="barcode"
                        value={formData.barcode}
                        onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                        placeholder="General product barcode"
                      />
                      <p className="text-xs text-muted-foreground">Individual SKUs can have their own barcodes</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="dimensionsSection">Product Price and Color</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salePrice">Color</Label>
                        <Input
                          id="salePrice"
                          type="text"
                          value={formData.color}
                          onChange={(e) => setFormData({...formData, color: e.target.value})}
                          placeholder="Color"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Dimensions</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="length">Length</Label>
                        <Input
                          id="length"
                          type="number"
                          step="0.01"
                          value={formData.dimensions.length}
                          onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, length: e.target.value}})}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="width">Width</Label>
                        <Input
                          id="width"
                          type="number"
                          step="0.01"
                          value={formData.dimensions.width}
                          onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, width: e.target.value}})}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height</Label>
                        <Input
                          id="height"
                          type="number"
                          step="0.01"
                          value={formData.dimensions.height}
                          onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, height: e.target.value}})}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit">Unit</Label>
                        <Select value={formData.dimensions.unit} onValueChange={(value) => setFormData({...formData, dimensions: {...formData.dimensions, unit: value}})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cm">cm</SelectItem>
                            <SelectItem value="inch">inch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.01"
                          value={formData.dimensions.weight}
                          onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, weight: e.target.value}})}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weightUnit">Weight Unit</Label>
                        <Select value={formData.dimensions.weightUnit} onValueChange={(value) => setFormData({...formData, dimensions: {...formData.dimensions, weightUnit: value}})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="lb">lb</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Package</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="innerPack">Inner Pack</Label>
                        <Input
                          id="innerPack"
                          type="text"
                          value={formData.innerPack}
                          onChange={(e) => setFormData({...formData, innerPack: e.target.value})}
                          placeholder="Enter inner pack"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="masterPack">Master Pack</Label>
                        <Input
                          id="masterPack"
                          type="text"
                          value={formData.masterPack}
                          onChange={(e) => setFormData({...formData, masterPack: e.target.value})}
                          placeholder="Enter master pack"
                        />
                      </div>
                    </div>
                  </div>
              </TabsContent>

              <TabsContent value="images" className="space-y-4">
                {/* Photo Upload Section for Edit */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-responsive-sm flex items-center gap-2">
                      <ImagePlus className="icon-responsive-sm" />
                      Product Photos
                    </Label>
                    <p className="text-responsive-xs text-muted-foreground">
                      Upload up to 5 photos (max 5MB each). Drag and drop or click to browse.
                    </p>
                  </div>

                  {/* Image Upload Area */}
                  <div
                    className={`relative border-2 border-dashed rounded-lg responsive-padding transition-all ${
                      dragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    } ${formData.images.length >= 5 ? 'opacity-50 pointer-events-none' : ''}`}
                    onDragEnter={handleDragIn}
                    onDragLeave={handleDragOut}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={formData.images.length >= 5}
                    />
                    <div className="flex flex-col items-center justify-center space-y-3 text-center">
                      <div className="p-3 bg-muted rounded-full">
                        <Upload className="icon-responsive-base text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-responsive-sm font-medium">
                          {formData.images.length >= 5 
                            ? 'Maximum photos reached' 
                            : 'Drop your images here, or click to browse'
                          }
                        </p>
                        <p className="text-responsive-xs text-muted-foreground">
                          JPG, PNG, GIF up to 5MB each
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Image Preview Grid */}
                  {formData.images.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-responsive-sm">Uploaded Photos ({formData.images.length}/5)</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {
                          formData.images.map((image, index) => (
                            <div key={index} className="relative group aspect-square">

                              <img
                                src={
                                  image instanceof File
                                    ? URL.createObjectURL(image)              // new upload preview
                                    : digital_ocean_url + image.url           // old image
                                }
                                alt={`Product ${index}`}
                                className="w-full h-full object-cover rounded-lg border"
                              />

                              {/* Delete button */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all rounded-lg flex items-center justify-center">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeImage(index)}
                                >
                                  <XIcon className="h-4 w-4" />
                                </Button>
                              </div>

                              {index === 0 && (
                                <div className="absolute -top-2 -left-2">
                                  <Badge variant="secondary" className="text-xs px-2 py-1">Main</Badge>
                                </div>
                              )}
                            </div>
                          ))
                        }
                      </div>
                      <p className="text-responsive-xs text-muted-foreground">
                        First image will be used as the main product photo.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleEditProduct} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Update Product
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
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteProduct}
                disabled={isSubmitting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Product
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default Inventory