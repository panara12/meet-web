import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./addOrder/card";
import { Button } from "./addOrder/button";
import { Badge } from "./addOrder/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./addOrder/select";
import { Input } from "./addOrder/input";
import { Label } from "./addOrder/label";
import { Textarea } from "./addOrder/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./addOrder/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./addOrder/sheet";
import { ScrollArea } from "./addOrder/scroll-area";
import { Separator } from "./addOrder/separator";
import { RadioGroup, RadioGroupItem } from "./addOrder/radio-group";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  Package,
  Check,
  User,
  Hash,
  Search,
  Filter,
  Eye,
  Image,
  Info,
  Palette,
  Ruler,
  FileText,
  DollarSign,
  Users,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useGetAllSeller } from '../../hooks/seller/useGetAllSeller';
import { useGetAllOrders } from '../../hooks/order/useGetAllOrder';
import { useGetAllProduct } from "../../hooks/product/useGetAllProduct";
import { useSelector } from 'react-redux';

// ENV CONFIG
const digital_ocean_url = import.meta.env.VITE_DIGITAL_OCEAN_URL;

// Image fallback component
const ImageWithFallback = ({ src, alt, className, onLoad, onError: customOnError, showLoader = true, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    setImgSrc('https://via.placeholder.com/400x400?text=No+Image');
    if (customOnError) customOnError();
  };

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  return (
    <div className="relative w-full h-full">
      {isLoading && showLoader && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-xs text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}
      
      <img 
        src={digital_ocean_url + imgSrc} 
        alt={alt} 
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        {...props} 
      />
    </div>
  );
};

// Toast notification
const toast = {
  success: (message) => alert(`Success: ${message}`),
  error: (message) => alert(`Error: ${message}`)
};

export default function AddOrder() {
  const userInfo = useSelector((state) => state.app.userInfo);
  
  // Client states
  const [selectedClient, setSelectedClient] = useState("");
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [clientsdata, setClientsdata] = useState([]);
  
  // Product states
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [selectedSku, setSelectedSku] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  
  // Cart states
  const [clientCarts, setClientCarts] = useState({});
  const [activeClientCart, setActiveClientCart] = useState("");
  
  // UI states
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showOrderCompletion, setShowOrderCompletion] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showCartDialog, setShowCartDialog] = useState(false);
  const [showPhotosDialog, setShowPhotosDialog] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(12);
  
  // Quick add states
  const [productQuantities, setProductQuantities] = useState({});
  const [productInstructions, setProductInstructions] = useState({});
  
  // Payment states
  const [paymentData, setPaymentData] = useState({
    amount: "",
    type: "",
    date: new Date().toISOString().split('T')[0]
  });
  
  // Order ID
  const [orderCount, setOrderCount] = useState(0);
  const [orderId, setOrderId] = useState("");

  // API Hooks
  const { data: getSellerList, isPending: sellerPending } = useGetAllSeller();
  const { data: getAllOrders } = useGetAllOrders();
  
  const { 
    data: getProductList, 
    isPending: productListPending, 
    isError: isProductListError 
  } = useGetAllProduct({
    page: currentPage,
    limit: pageLimit,
    search: searchQuery,
    category: filterCategory && filterCategory !== "all-categories" ? filterCategory : undefined,
    companyId: filterCompany && filterCompany !== "all-companies" ? filterCompany : undefined,
  });

  // Set clients data
  console.log("sellers daya",getSellerList?.seller?.data[0])
  useEffect(() => {
    if (getSellerList?.seller?.data) {
      setClientsdata(getSellerList.seller.data);
    }
  }, [getSellerList]);

  // Set products data
  useEffect(() => {
    if (getProductList?.product) {
      setProducts(getProductList.product);
    }
  }, [getProductList]);

  // Set order count and ID
  useEffect(() => {
    if (getAllOrders?.count) {
      setOrderCount(getAllOrders.count);
    }
  }, [getAllOrders]);

  useEffect(() => {
    if (userInfo?.tenant && orderCount !== undefined) {
      setOrderId(userInfo.tenant.substring(0, 3) + "-" + (orderCount + 1));
    }
  }, [userInfo, orderCount]);

  // Get unique companies and categories
  const companies = products
    .map(p => p.companyId)
    .filter((company, index, self) =>
      index === self.findIndex(c => c._id === company._id)
    );
  const categories = [...new Set(products.map(p => p.category))].sort();

  // Pagination
  const totalPages = getProductList?.totalPages || 1;
  const totalProducts = getProductList?.totalCount || 0;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Get current active cart
  const cart = activeClientCart ? (clientCarts[activeClientCart] || []) : [];
  
  // Get total cart items across all clients
  const getTotalCartItems = () => {
    return Object.values(clientCarts).reduce((total, cart) => total + (cart?.length || 0), 0);
  };
  
  // Get all active client carts
  const activeClientCarts = Object.entries(clientCarts)
    .filter(([_, items]) => items && items.length > 0)
    .map(([clientId, items]) => {
      const client = clientsdata.find(c => c._id === clientId);
      return {
        clientId,
        clientName: client?.name || 'Unknown Client',
        items,
        total: items.reduce((sum, item) => sum + item.subtotal, 0)
      };
    });

  // Filter clients
  const filteredClients = clientsdata.filter(client => {
    const searchLower = clientSearchQuery?.toLowerCase() || "";
    return client.name.toLowerCase().includes(searchLower) ||
           client.phone.toString().includes(clientSearchQuery) ||
           client.email.toLowerCase().includes(searchLower);
  });

  const clearFilters = () => {
    setSearchQuery("");
    setFilterCompany("");
    setFilterCategory("");
    setCurrentPage(1);
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client._id);
    setClientSearchQuery(client.name);
    setShowClientDropdown(false);
    setActiveClientCart(client._id);
    
    if (!clientCarts[client._id]) {
      setClientCarts(prev => ({
        ...prev,
        [client._id]: []
      }));
    }
  };

  const handleClientSearchChange = (value) => {
    setClientSearchQuery(value);
    setShowClientDropdown(true);
    if (!value) {
      setSelectedClient("");
      setActiveClientCart("");
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    
    if (product.skus && product.skus.length > 0) {
      const colors = [...new Set(product.skus.map(sku => sku.color).filter(Boolean))];
      const sizes = [...new Set(product.skus.map(sku => sku.size).filter(Boolean))];
      setAvailableColors(colors);
      setAvailableSizes(sizes);
      
      setSelectedSku(product.skus[0]);
      setSelectedColor(colors[0] || "");
      setSelectedSize(sizes[0] || "");
    } else {
      const colors = product.color ? product.color.split(",").map(c => c.trim()) : [];
      setAvailableColors(colors);
      setSelectedColor(colors[0] || "");
      setSelectedSize("");
      setSelectedSku(null);
    }
    
    setQuantity(1);
    setInstructions(productInstructions[product._id] || "");
    setShowProductDetail(true);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    handleColorSizeChange(color, selectedSize);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    handleColorSizeChange(selectedColor, size);
  };

  const handleColorSizeChange = (newColor, newSize) => {
    if (!selectedProduct.skus || selectedProduct.skus.length === 0) return;
    
    const color = newColor || selectedColor;
    const size = newSize || selectedSize;
    
    const matchingSku = selectedProduct.skus.find(sku => {
      const colorMatch = !color || sku.color === color;
      const sizeMatch = !size || sku.size === size;
      return colorMatch && sizeMatch;
    });
    
    if (matchingSku) {
      setSelectedSku(matchingSku);
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct || !selectedSize) {
      toast.error("Please select size");
      return;
    }

    if (!activeClientCart) {
      toast.error("Please select a client first");
      return;
    }

    const finalColor = selectedColor || (availableColors[0] || selectedProduct.color);

    const cartItem = {
      id: `${selectedProduct._id}-${finalColor}-${selectedSize}-${Date.now()}`,
      product: selectedProduct,
      color: finalColor,
      size: selectedSize,
      quantity,
      instructions,
      subtotal: (selectedSku?.price || selectedProduct.price) * quantity
    };

    setClientCarts(prev => ({
      ...prev,
      [activeClientCart]: [...(prev[activeClientCart] || []), cartItem]
    }));
    
    setShowProductDetail(false);
    toast.success("Product added to cart!");
  };

  const handleRemoveFromCart = (clientId, itemId) => {
    setClientCarts(prev => ({
      ...prev,
      [clientId]: prev[clientId].filter(item => item.id !== itemId)
    }));
    toast.success("Item removed from cart");
  };

  const handleQuantityChange = (clientId, itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setClientCarts(prev => ({
      ...prev,
      [clientId]: prev[clientId].map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity, subtotal: (item.product.price || item.product.skus?.[0]?.price) * newQuantity }
          : item
      )
    }));
  };

  const handleProductQuantityChange = (productId, size, delta) => {
    setProductQuantities(prev => {
      const current = prev[productId]?.[size] || 0;
      const newQty = Math.max(0, current + delta);
      
      return {
        ...prev,
        [productId]: {
          ...(prev[productId] || {}),
          [size]: newQty
        }
      };
    });
  };

  const getProductQuantity = (productId, size) => {
    return productQuantities[productId]?.[size] || 0;
  };

  const handleQuickAddToCart = (product) => {
    if (!activeClientCart) {
      toast.error("Please select a client first");
      return;
    }

    const productQtys = productQuantities[product._id] || {};
    const sizesWithQty = Object.entries(productQtys).filter(([_, qty]) => qty > 0);
    
    if (sizesWithQty.length === 0) {
      toast.error("Please select at least one size with quantity");
      return;
    }

    const productInstr = productInstructions[product._id] || "";
    const newItems = [];
    
    sizesWithQty.forEach(([size, qty]) => {
      const matchingSku = product.skus?.find(sku => sku.size === size);
      const price = matchingSku?.price || product.price;
      
      const cartItem = {
        id: `${product._id}-${product.color}-${size}-${Date.now()}-${Math.random()}`,
        product: product,
        color: product.color || (product.skus?.[0]?.color || "Default"),
        size: size,
        quantity: qty,
        instructions: productInstr,
        subtotal: price * qty
      };
      newItems.push(cartItem);
    });

    setClientCarts(prev => ({
      ...prev,
      [activeClientCart]: [...(prev[activeClientCart] || []), ...newItems]
    }));

    setProductQuantities(prev => ({
      ...prev,
      [product._id]: {}
    }));
    setProductInstructions(prev => ({
      ...prev,
      [product._id]: ""
    }));

    toast.success(`${newItems.length} item${newItems.length > 1 ? 's' : ''} added to cart!`);
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  const handleCompleteOrder = () => {
    if (!activeClientCart) {
      toast.error("Please select a client");
      return;
    }
    
    if (cart.length === 0) {
      toast.error("Please add items to cart");
      return;
    }

    setShowOrderCompletion(true);
  };

  const handleSendToPacking = () => {
    setShowOrderCompletion(false);
    setShowPaymentDialog(true);
    setPaymentData({
      amount: getTotalAmount().toFixed(2),
      type: "",
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleRecordPayment = () => {
    if (!paymentData.amount || !paymentData.type) {
      toast.error("Please enter payment details");
      return;
    }

    const client = clientsdata.find(c => c._id === activeClientCart);
    
    const orderDetails = `
🛍️ *NEW ORDER CONFIRMATION*

📋 *Order Number:* ${orderId}
📅 *Order Date:* ${new Date().toLocaleDateString()}

👤 *CUSTOMER INFORMATION*
• Name: ${client?.name}
• Phone: ${client?.phone}
• Email: ${client?.email}

📦 *ORDER DETAILS*
${cart.map(item => 
  `• ${item.product.name}\n  - Color: ${item.color}\n  - Size: ${item.size}\n  - Qty: ${item.quantity}\n  - Price: $${item.subtotal.toFixed(2)}`
).join('\n\n')}

💰 *ORDER SUMMARY*
• Total Items: ${cart.reduce((sum, item) => sum + item.quantity, 0)}
• Order Total: $${getTotalAmount().toFixed(2)}

💳 *Payment Details:*
• Amount: $${paymentData.amount}
• Type: ${paymentData.type}
• Date: ${new Date(paymentData.date).toLocaleDateString()}

✅ *Status:* Payment Confirmed & Sent to Packing Department
    `.trim();

    toast.success(`Payment of $${paymentData.amount} recorded for order ${orderId}`);
    
    const whatsappUrl = `https://wa.me/${client?.phone?.replace(/[^\d]/g, '')}?text=${encodeURIComponent(orderDetails)}`;
    window.open(whatsappUrl, '_blank');

    setClientCarts(prev => ({
      ...prev,
      [activeClientCart]: []
    }));
    
    setShowPaymentDialog(false);
    setPaymentData({
      amount: "",
      type: "",
      date: new Date().toISOString().split('T')[0]
    });
    
    setSelectedClient("");
    setActiveClientCart("");
    setClientSearchQuery("");
  };

  const selectedClientData = clientsdata.find(c => c._id === selectedClient);

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl truncate">Add New Order</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Create orders for multiple clients</p>
        </div>
        {activeClientCarts.length > 0 && (
          <Badge variant="secondary" className="text-xs sm:text-sm">
            <Users className="h-3 w-3 mr-1" />
            {activeClientCarts.length} Active Cart{activeClientCarts.length > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Active Client Carts Display */}
      {activeClientCarts.length > 0 && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              Active Client Orders
            </CardTitle>
            <CardDescription className="text-sm">
              Manage multiple client orders simultaneously
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-2">
                {activeClientCarts.map((clientCart) => (
                  <Card
                    key={clientCart.clientId}
                    className={`flex-shrink-0 w-64 cursor-pointer transition-all ${
                      activeClientCart === clientCart.clientId
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'hover:border-primary/50 hover:shadow-sm'
                    }`}
                    onClick={() => {
                      setActiveClientCart(clientCart.clientId);
                      setSelectedClient(clientCart.clientId);
                      const client = clientsdata.find(c => c._id === clientCart.clientId);
                      if (client) setClientSearchQuery(client.name);
                    }}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{clientCart.clientName}</h4>
                          <p className="text-xs text-muted-foreground">
                            {clientCart.items.length} item{clientCart.items.length > 1 ? 's' : ''}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setClientCarts(prev => {
                              const newCarts = { ...prev };
                              delete newCarts[clientCart.clientId];
                              return newCarts;
                            });
                            if (activeClientCart === clientCart.clientId) {
                              setActiveClientCart("");
                              setSelectedClient("");
                              setClientSearchQuery("");
                            }
                            toast.success("Cart cleared");
                          }}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          ${clientCart.total.toFixed(2)}
                        </span>
                        {activeClientCart === clientCart.clientId && (
                          <Badge variant="default" className="text-xs">Active</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Client Selection & Order Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <User className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">Client Selection</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="relative space-y-1.5 sm:space-y-2">
              <Label className="text-sm sm:text-base">Search & Select Client</Label>
              <div className="relative">
                <Search className="absolute left-2.5 sm:left-3 top-2 sm:top-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, or email..."
                  value={clientSearchQuery}
                  onChange={(e) => handleClientSearchChange(e.target.value)}
                  onFocus={() => setShowClientDropdown(true)}
                  className="pl-8 sm:pl-10 text-sm sm:text-base"
                />
              </div>
              
              {showClientDropdown && clientSearchQuery && filteredClients.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-auto bg-card border border-border rounded-md shadow-lg">
                  {filteredClients.map((client) => (
                    <div
                      key={client._id}
                      className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                      onClick={() => handleClientSelect(client)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <div>
                          <p className="font-medium text-sm sm:text-base">{client.name}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">{client.phone}</p>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {showClientDropdown && clientSearchQuery && filteredClients.length === 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 p-3 bg-card border border-border rounded-md shadow-lg text-center">
                  <p className="text-sm text-muted-foreground">No clients found</p>
                </div>
              )}
            </div>
            
            {selectedClientData && (
              <div className="p-3 sm:p-4 bg-muted/50 rounded-lg space-y-1">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <p className="font-medium text-sm sm:text-base">{selectedClientData.name}</p>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{selectedClientData.phone}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{selectedClientData.email}</p>
                {cart.length > 0 && (
                  <div className="pt-2 mt-2 border-t">
                    <p className="text-sm font-medium">
                      Cart: {cart.length} item{cart.length > 1 ? 's' : ''} · ${getTotalAmount().toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Hash className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">Order Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm sm:text-base">Order ID</Label>
              <Input 
                value={orderId} 
                disabled 
                className="font-mono text-sm sm:text-base" 
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm sm:text-base">Order Date</Label>
              <Input 
                value={new Date().toLocaleDateString()} 
                disabled 
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm sm:text-base">Status</Label>
              <Badge variant="secondary" className="text-xs sm:text-sm">Draft</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="truncate">Search & Filter Products</span>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">Find products by name, material, or company</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 sm:left-3 top-2 sm:top-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 sm:pl-10 text-sm sm:text-base"
              />
            </div>
            {companies.length > 0 && (
              <div>
                <Select value={filterCompany} onValueChange={(value) => {
                  setFilterCompany(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="Filter by company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-companies">All Companies</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company._id} value={company._id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Select value={filterCategory} onValueChange={(value) => {
                setFilterCategory(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="w-full flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">Clear Filters</span>
              </Button>
            </div>
          </div>
          {(searchQuery || (filterCompany && filterCompany !== "all-companies") || (filterCategory && filterCategory !== "all-categories")) && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>
                Showing {products.length} of {totalProducts} products
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Catalog */}
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>
            {productListPending ? "Loading products..." : `Select size and quantity, then add to cart or view full details (Page ${currentPage} of ${totalPages})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {productListPending ? (
            <div className="text-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : isProductListError || products.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-muted-foreground">No products found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search criteria or clearing filters
              </p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {products.map((product) => {
                  const sizes = product.skus?.map(sku => sku.size).filter(Boolean) || [];
                  const uniqueSizes = [...new Set(sizes)];
                  const hasQuantities = uniqueSizes.some(size => getProductQuantity(product._id, size) > 0);
                  
                  return (
                    <Card key={product._id} className="flex flex-col">
                      <div className="p-3 sm:p-4 border-b bg-muted/30">
                        <h4 className="font-medium text-sm sm:text-base line-clamp-2 min-h-[2.5em] mb-2">{product.name}</h4>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-primary">${product.price}</span>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">{product.category}</Badge>
                          </div>
                        </div>
                      </div>

                      <ScrollArea className="flex-1 max-h-64">
                        <div className="p-3 sm:p-4 space-y-2">
                          <Label className="text-xs font-semibold text-muted-foreground uppercase">Sizes</Label>
                          <div className="space-y-2">
                            {uniqueSizes.map((size) => {
                              const qty = getProductQuantity(product._id, size);
                              return (
                                <div key={size} className="flex items-center justify-between gap-2 p-2 rounded-md border bg-background hover:bg-muted/50 transition-colors">
                                  <Badge variant="secondary" className="text-xs min-w-[2.5rem] justify-center">
                                    {size}
                                  </Badge>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleProductQuantityChange(product._id, size, -1);
                                      }}
                                      className="h-7 w-7 p-0"
                                      disabled={qty === 0}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-8 text-center text-sm font-medium">
                                      {qty}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleProductQuantityChange(product._id, size, 1);
                                      }}
                                      className="h-7 w-7 p-0"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          <div className="space-y-1.5 mt-3 pt-3 border-t">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase">Special Instructions</Label>
                            <Textarea
                              placeholder="Add special instructions..."
                              value={productInstructions[product._id] || ""}
                              onChange={(e) => {
                                setProductInstructions(prev => ({
                                  ...prev,
                                  [product._id]: e.target.value
                                }));
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs sm:text-sm resize-none"
                              rows={2}
                            />
                          </div>
                        </div>
                      </ScrollArea>

                      <div className="p-3 sm:p-4 border-t space-y-2 bg-background">
                        <Button
                          variant="default"
                          className="w-full text-xs sm:text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAddToCart(product);
                          }}
                          disabled={!hasQuantities || !activeClientCart}
                        >
                          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            className="w-full text-xs sm:text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductSelect(product);
                            }}
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Full Details
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full text-xs sm:text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(product);
                              setShowPhotosDialog(true);
                            }}
                          >
                            <Image className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Photos
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-10"
                          >
                            {page}
                          </Button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Floating Cart Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <Button
          onClick={() => setShowCartDialog(true)}
          size="lg"
          className="relative rounded-full shadow-lg hover:shadow-xl transition-all duration-200 h-14 w-14 sm:h-16 sm:w-16"
        >
          <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7" />
          {getTotalCartItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-semibold rounded-full h-6 w-6 flex items-center justify-center min-w-[1.5rem]">
              {getTotalCartItems()}
            </span>
          )}
        </Button>
      </div>

      {/* Multi-Client Cart Sheet - same as before */}
      <Sheet open={showCartDialog} onOpenChange={setShowCartDialog}>
        <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl flex flex-col p-0 h-full">
          <SheetHeader className="flex-shrink-0 p-3 sm:p-4 lg:p-6 border-b bg-background">
            <SheetTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">All Client Carts ({activeClientCarts.length} client{activeClientCarts.length > 1 ? 's' : ''})</span>
            </SheetTitle>
            <SheetDescription className="text-xs sm:text-sm lg:text-base">
              Manage orders for all your clients
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="px-3 sm:px-4 lg:px-6">
              {activeClientCarts.length === 0 ? (
                <div className="text-center py-8 sm:py-12 lg:py-16">
                  <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 mx-auto text-muted-foreground/50 mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium">No client carts yet</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Select a client and add products to get started</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4 lg:space-y-6 py-3 sm:py-4 lg:py-6">
                  {activeClientCarts.map((clientCart) => (
                    <Card key={clientCart.clientId} className="border-2 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4 lg:p-6">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm sm:text-base lg:text-lg truncate">{clientCart.clientName}</CardTitle>
                            <CardDescription className="text-xs sm:text-sm mt-0.5 sm:mt-1">
                              {clientCart.items.length} item{clientCart.items.length > 1 ? 's' : ''} · ${clientCart.total.toFixed(2)}
                            </CardDescription>
                          </div>
                          <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                            {activeClientCart === clientCart.clientId && (
                              <Badge variant="default" className="text-xs h-6 sm:h-7">Active</Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setClientCarts(prev => {
                                  const newCarts = { ...prev };
                                  delete newCarts[clientCart.clientId];
                                  return newCarts;
                                });
                                if (activeClientCart === clientCart.clientId) {
                                  setActiveClientCart("");
                                  setSelectedClient("");
                                  setClientSearchQuery("");
                                }
                                toast.success("Cart cleared");
                              }}
                              className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4 lg:p-6 pt-0">
                        <div className="max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto overscroll-contain space-y-2 sm:space-y-3 pr-1">
                          {clientCart.items.map((item) => (
                            <div key={item.id} className="flex gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
                              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 overflow-hidden rounded flex-shrink-0 bg-muted">
                                <ImageWithFallback
                                  src={item.product.images?.[0]?.url || item.product.image}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0 space-y-1">
                                <h4 className="text-xs sm:text-sm font-medium line-clamp-2">{item.product.name}</h4>
                                <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                                  <span>Color: {item.color}</span>
                                  <span>•</span>
                                  <span>Size: {item.size}</span>
                                </div>
                                {item.instructions && (
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    Instructions: {item.instructions}
                                  </p>
                                )}
                                <div className="flex items-center justify-between pt-1">
                                  <p className="text-xs sm:text-sm font-semibold text-primary">${item.subtotal.toFixed(2)}</p>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleQuantityChange(clientCart.clientId, item.id, item.quantity - 1)}
                                      className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                                    >
                                      <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                    </Button>
                                    <span className="w-4 sm:w-6 text-center text-xs sm:text-sm font-medium">{item.quantity}</span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleQuantityChange(clientCart.clientId, item.id, item.quantity + 1)}
                                      className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                                    >
                                      <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleRemoveFromCart(clientCart.clientId, item.id)}
                                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-6 w-6 sm:h-7 sm:w-7 p-0 ml-0.5 sm:ml-1"
                                    >
                                      <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 sm:pt-3 border-t">
                          <Button
                            onClick={() => {
                              setActiveClientCart(clientCart.clientId);
                              setSelectedClient(clientCart.clientId);
                              const client = clientsdata.find(c => c._id === clientCart.clientId);
                              if (client) setClientSearchQuery(client.name);
                              setShowCartDialog(false);
                              setShowOrderCompletion(true);
                            }}
                            className="w-full h-9 sm:h-10 lg:h-11 text-xs sm:text-sm"
                          >
                            <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                            <span className="truncate">Complete Order for {clientCart.clientName}</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Product Detail Dialog - Simplified */}
      <Dialog open={showProductDetail} onOpenChange={setShowProductDetail} >
        <DialogContent className="max-w-2xl bg-white max-h-[95vh] overflow-hidden flex flex-col p-0">
          {console.log(selectedProduct,selectedSku)}
          {selectedProduct && (
            <>
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
                <div className="relative px-4 py-6 sm:px-6 sm:py-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Badge variant="outline" className="mb-3">
                        {selectedProduct.category}
                      </Badge>
                      <h2 className="text-2xl sm:text-3xl font-bold mb-2 line-clamp-2">
                        {selectedProduct.name}
                      </h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        {selectedProduct?.companyId && selectedProduct.company.name} · {selectedProduct.material}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-primary">
                          ${selectedSku?.price || selectedProduct.price}
                        </span>
                        <span className="text-sm text-muted-foreground">per unit</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowProductDetail(false)}
                      className="flex-shrink-0 rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <ScrollArea className="flex-1 overflow-auto">
                <div className="p-4 sm:p-6 space-y-6">
                  {availableColors.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold">
                          Select Color
                          <span className="text-xs text-muted-foreground font-normal ml-2">(Optional)</span>
                        </h3>
                      </div>
                      <RadioGroup value={selectedColor} onValueChange={handleColorChange}>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {availableColors.map((color) => (
                            <label
                              key={color}
                              className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                                selectedColor === color 
                                  ? 'border-primary bg-primary/5 shadow-md' 
                                  : 'border-border hover:bg-muted/50'
                              }`}
                            >
                              <RadioGroupItem value={color} id={`color-${color}`} className="sr-only" />
                              <span className="text-sm font-medium text-center">{color}</span>
                              {selectedColor === color && (
                                <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
                              )}
                            </label>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {availableColors.length > 0 && <Separator />}

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">
                        Select Size
                        <span className="text-xs text-destructive font-normal ml-2">*Required</span>
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSizes.map((size) => (
                        <Button
                          key={size}
                          variant={selectedSize === size ? "default" : "outline"}
                          onClick={() => handleSizeChange(size)}
                          className="h-14 font-bold text-base relative overflow-hidden group"
                        >
                          {selectedSize === size && (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
                          )}
                          <span className="relative z-10">{size}</span>
                        </Button>
                      ))}
                    </div>
                    {!selectedSize && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Please select a size to continue
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Hash className="h-4 w-4 text-primary" />
                      Quantity
                    </h3>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="h-16 w-16 p-0 rounded-full"
                      >
                        <Minus className="h-6 w-6" />
                      </Button>
                      <div className="text-center">
                        <Input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-24 text-center text-2xl font-bold h-16 border-2"
                          min="1"
                        />
                      </div>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => setQuantity(quantity + 1)}
                        className="h-16 w-16 p-0 rounded-full"
                      >
                        <Plus className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Special Instructions
                    </h3>
                    <Textarea
                      placeholder="Add any special requirements, customizations, or notes..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="resize-none min-h-[120px] text-sm"
                      rows={5}
                    />
                  </div>

                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Order Summary
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Unit Price</span>
                          <span className="font-medium">${selectedSku?.price || selectedProduct.price}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Quantity</span>
                          <span className="font-medium">×{quantity}</span>
                        </div>
                        {selectedColor && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Color</span>
                            <span className="font-medium">{selectedColor}</span>
                          </div>
                        )}
                        {selectedSize && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Size</span>
                            <span className="font-medium">{selectedSize}</span>
                          </div>
                        )}
                        <Separator className="my-2" />
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold">Subtotal</span>
                          <span className="text-3xl font-bold text-primary">
                            ${((selectedSku?.price || selectedProduct.price) * quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>

              <div className="sticky bottom-0 z-10 bg-background border-t p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowProductDetail(false)} 
                    className="flex-1 h-12 text-sm sm:text-base"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddToCart} 
                    className="flex-1 h-12 text-sm sm:text-base font-semibol" 
                    disabled={!selectedSize || !activeClientCart}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart - ${(selectedProduct.price * quantity).toFixed(2)}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Photos Dialog */}
      <Dialog open={showPhotosDialog} onOpenChange={setShowPhotosDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-lg sm:text-xl">
              Product Photos - {selectedProduct?.name}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              View all available product images
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <ScrollArea className="flex-1 overflow-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                {/* Main product image */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                    <ImageWithFallback
                      src={selectedProduct.image}
                      alt={`${selectedProduct.name} - Main`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-center text-muted-foreground mt-2">Main Product Image</p>
                </div>
                
                {/* Additional product images (simulated with the same image for demonstration) */}
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="group relative">
                    <div className="aspect-square overflow-hidden rounded-lg bg-muted group-hover:ring-2 group-hover:ring-primary transition-all">
                      <ImageWithFallback
                        src={selectedProduct.image}
                        alt={`${selectedProduct.name} - View ${index + 2}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                    <p className="text-xs text-center text-muted-foreground mt-1">View {index + 2}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Product Information</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Category:</span> {selectedProduct.category}</p>
                  <p><span className="font-medium">Company:</span> {selectedProduct.company}</p>
                  <p><span className="font-medium">Material:</span> {selectedProduct.material}</p>
                  <p><span className="font-medium">Available Colors:</span> {selectedProduct.colors}</p>
                  <p><span className="font-medium">Available Sizes:</span> {selectedProduct.sizes}</p>
                  <p><span className="font-medium">Price:</span> ${selectedProduct.price}</p>
                </div>
              </div>
            </ScrollArea>
          )}
          <div className="flex-shrink-0 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowPhotosDialog(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Completion Dialog */}
      <Dialog open={showOrderCompletion} onOpenChange={setShowOrderCompletion}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Order</DialogTitle>
            <DialogDescription>
              Choose how to process this order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Order Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Client:</span>
                  <span className="font-medium">{selectedClientData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>{cart.length} items</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${getTotalAmount().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Button
                onClick={handleSendToPacking}
                className="h-20 flex-col gap-2"
              >
                <Package className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Send to Packing Department</div>
                  <div className="text-xs text-muted-foreground">Record payment details and send order to packing</div>
                </div>
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowOrderCompletion(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Enter payment details for order {orderId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Payment Form */}
            <div className="space-y-4">
              <div>
                <Label>Payment Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData(prev => ({
                    ...prev,
                    amount: e.target.value
                  }))}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Payment Type</Label>
                <Select 
                  value={paymentData.type} 
                  onValueChange={(value) => setPaymentData(prev => ({
                    ...prev,
                    type: value
                  }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="debit-card">Debit Card</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="digital-wallet">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Payment Date</Label>
                <Input
                  type="date"
                  value={paymentData.date}
                  onChange={(e) => setPaymentData(prev => ({
                    ...prev,
                    date: e.target.value
                  }))}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleRecordPayment} className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
