import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./addOrder/card";
import { Button } from "./addOrder/button";
import { Badge } from "./addOrder/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./addOrder/select";
import { Input } from "./addOrder/input";
import { Label } from "./addOrder/label";
import { Textarea } from "./addOrder/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./addOrder/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./addOrder/sheet";
import { ScrollArea } from "./addOrder/scroll-area";
import { Separator } from "./addOrder/separator";
import { RadioGroup, RadioGroupItem } from "./addOrder/radio-group";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  Package,
  CreditCard,
  MessageSquare,
  Check,
  User,
  Hash,
  Calendar,
  DollarSign,
  Search,
  Filter
} from 'lucide-react';
import { useGetAllSeller } from '../../hooks/seller/useGetAllSeller';
import { useGetAllOrders } from '../../hooks/order/useGetAllOrder';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';



// Mock data
const mockClients = [
  { id: "1", name: "John Smith", phone: "+1234567890", email: "john@example.com" },
  { id: "2", name: "Sarah Johnson", phone: "+1234567891", email: "sarah@example.com" },
  { id: "3", name: "Mike Wilson", phone: "+1234567892", email: "mike@example.com" },
  { id: "4", name: "Emma Davis", phone: "+1234567893", email: "emma@example.com" },
  { id: "5", name: "Alex Brown", phone: "+1234567894", email: "alex@example.com" }
];

const mockProducts = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    material: "100% Premium Cotton",
    colors: ["White", "Black", "Navy", "Gray", "Red"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    category: "T-Shirts",
    company: "Cotton Co."
  },
  {
    id: "2",
    name: "Classic Denim Jeans",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    material: "98% Cotton, 2% Elastane",
    colors: ["Dark Blue", "Light Blue", "Black", "Gray"],
    sizes: ["28", "30", "32", "34", "36", "38", "40"],
    category: "Pants",
    company: "Denim Works"
  },
  {
    id: "3",
    name: "Elegant Summer Dress",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
    material: "Viscose Blend",
    colors: ["Floral Print", "Solid Black", "Navy Blue", "Wine Red"],
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Dresses",
    company: "Fashion Elite"
  },
  {
    id: "4",
    name: "Sport Sneakers",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    material: "Synthetic & Mesh",
    colors: ["White/Blue", "Black/Red", "Gray/Green", "All White"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    category: "Shoes",
    company: "SportTech"
  },
  {
    id: "5",
    name: "Winter Jacket",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    material: "Water-resistant Polyester",
    colors: ["Black", "Navy", "Forest Green", "Burgundy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "Outerwear",
    company: "Winter Gear Co."
  },
  {
    id: "6",
    name: "Casual Polo Shirt",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop",
    material: "Cotton Pique",
    colors: ["White", "Navy", "Royal Blue", "Forest Green", "Burgundy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "Polo Shirts",
    company: "Polo Pro"
  }
];

// Image fallback component
const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    setImgSrc('https://via.placeholder.com/400x400?text=No+Image');
  };

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className}
      onError={handleError}
      {...props} 
    />
  );
};

// Toast notification (simple alert for demo)
const toast = {
  success: (message) => alert(`Success: ${message}`),
  error: (message) => alert(`Error: ${message}`)
};

export default function AddOrder() {
  const userInfo = useSelector((state) => state.app.userInfo);
  const [selectedClient, setSelectedClient] = useState("");
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [cart, setCart] = useState([]);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showOrderCompletion, setShowOrderCompletion] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showCartDialog, setShowCartDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [paymentData, setPaymentData] = useState({
    amount: "",
    type: "",
    date: new Date().toISOString().split('T')[0]
  });
  const { data: getSellerList, isPending:sellerPending, isError:issellerError, error:sellerError } = useGetAllSeller();
  const { data: getAllOrders, isPending:isAllorderPending, isError:isAllOrderError, error:allOrderError } = useGetAllOrders();
  const [clientsdata,setClientsdata] = useState([]);
  const [orderCount,setOrderCount] = useState(0);
  useEffect(()=>{
      if (getAllOrders?.count) {
        setOrderCount(getAllOrders.count);
        console.log(orderCount)
      }
  },[getAllOrders])

  useEffect(() => {
    if (getSellerList?.seller?.seller_data) {
      setClientsdata(getSellerList.seller.seller_data);
    }
  }, [getSellerList]);
  const [orderId] = useState(userInfo.tenant.substring(0, 3)+"-"+(orderCount+1));


  // Get unique companies and categories for filter options
  const companies = [...new Set(mockProducts.map(p => p.company))].sort();
  const categories = [...new Set(mockProducts.map(p => p.category))].sort();

  // Filter clients based on search query
  const filteredClients = clientsdata.filter(client => {
    const searchLower = clientSearchQuery.toLowerCase();
    return client.company_name.toLowerCase().includes(searchLower) ||
           client.phone_number.toString().includes(clientSearchQuery) ||
           client.primary_email.toLowerCase().includes(searchLower);
  });

  // Filter products based on search and filters
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCompany = !filterCompany || filterCompany === "all-companies" || product.company === filterCompany;
    const matchesCategory = !filterCategory || filterCategory === "all-categories" || product.category === filterCategory;
    
    return matchesSearch && matchesCompany && matchesCategory;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setFilterCompany("");
    setFilterCategory("");
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client._id);
    setClientSearchQuery(client.company_name);
    setShowClientDropdown(false);
  };

  const handleClientSearchChange = (value) => {
    setClientSearchQuery(value);
    setShowClientDropdown(true);
    if (!value) {
      setSelectedClient("");
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSelectedColor("");
    setSelectedSize("");
    setQuantity(1);
    setInstructions("");
    setShowProductDetail(true);
  };

  const handleAddToCart = () => {
    if (!selectedProduct || !selectedSize) {
      toast.error("Please select size");
      return;
    }

    const finalColor = selectedColor || selectedProduct.colors[0];

    const cartItem = {
      id: `${selectedProduct.id}-${finalColor}-${selectedSize}-${Date.now()}`,
      product: selectedProduct,
      color: finalColor,
      size: selectedSize,
      quantity,
      instructions,
      subtotal: selectedProduct.price * quantity
    };

    setCart(prev => [...prev, cartItem]);
    setShowProductDetail(false);
    toast.success("Product added to cart!");
  };

  const handleRemoveFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    toast.success("Item removed from cart");
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity, subtotal: item.product.price * newQuantity }
        : item
    ));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  const handleCompleteOrder = () => {
    if (!selectedClient) {
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

    const client = clientsdata.find(c => c._id === selectedClient);
    
    const orderDetails = `
🛍️ *NEW ORDER CONFIRMATION*

📋 *Order Number:* ${orderId}
📅 *Order Date:* ${new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
🕐 *Order Time:* ${new Date().toLocaleTimeString('en-US', { 
  hour: '2-digit', 
  minute: '2-digit',
  hour12: true 
})}

👤 *CUSTOMER INFORMATION*
• Name: ${client?.name}
• Phone: ${client?.phone}
• Email: ${client?.email}

📦 *ORDER DETAILS*
${cart.map((item, index) => 
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
    toast.success("Payment information sent to admin panel");
    toast.success(`Order ${orderId} sent to packing department`);
    
    const whatsappUrl = `https://wa.me/${client?.phone?.replace(/[^\d]/g, '')}?text=${encodeURIComponent(orderDetails)}`;
    window.open(whatsappUrl, '_blank');
    toast.success(`Order and payment details sent to ${client?.name} via WhatsApp`);

    // Reset form
    setSelectedClient("");
    setCart([]);
    setShowPaymentDialog(false);
    setPaymentData({
      amount: "",
      type: "",
      date: new Date().toISOString().split('T')[0]
    });
  };

  const selectedClientData = clientsdata.find(c => c._id === selectedClient);

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl truncate">Add New Order</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Create a new order for your clients</p>
        </div>
      </div>

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
              
              {/* Client Dropdown */}
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
                          <p className="font-medium text-sm sm:text-base">{client.company_name}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">{client.phone_number}</p>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{client.primary_email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* No results message */}
              {showClientDropdown && clientSearchQuery && filteredClients.length === 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 p-3 bg-card border border-border rounded-md shadow-lg text-center">
                  <p className="text-sm text-muted-foreground">No clients found</p>
                </div>
              )}
            </div>
            
            {/* Selected Client Display */}
            {selectedClientData && (
              <div className="p-3 sm:p-4 bg-muted/50 rounded-lg space-y-1">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <p className="font-medium text-sm sm:text-base">{selectedClientData.company_name}</p>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{selectedClientData.phone_number}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{selectedClientData.primary_email}</p>
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 sm:pl-10 text-sm sm:text-base"
              />
            </div>
            <div>
              <Select value={filterCompany} onValueChange={setFilterCompany}>
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Filter by company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-companies">All Companies</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
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
                Showing {filteredProducts.length} of {mockProducts.length} products
              </span>
              {searchQuery && (
                <Badge variant="secondary">Search: "{searchQuery}"</Badge>
              )}
              {filterCompany && filterCompany !== "all-companies" && (
                <Badge variant="secondary">Company: {filterCompany}</Badge>
              )}
              {filterCategory && filterCategory !== "all-categories" && (
                <Badge variant="secondary">Category: {filterCategory}</Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Catalog */}
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>Select products to add to the order</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]" onClick={() => handleProductSelect(product)}>
                  <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-2">
                      <h4 className="line-clamp-2 text-sm sm:text-base font-medium">{product.name}</h4>
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">{product.category}</Badge>
                        <Badge variant="secondary" className="text-xs">{product.company}</Badge>
                      </div>
                      <p className="text-muted-foreground text-xs sm:text-sm line-clamp-1">{product.material}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-semibold text-sm sm:text-base">${product.price}</span>
                        <Button size="sm" variant="outline" className="text-xs sm:text-sm">
                          <Plus className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">Select</span>
                          <span className="sm:hidden">+</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-semibold rounded-full h-6 w-6 flex items-center justify-center min-w-[1.5rem]">
              {cart.length}
            </span>
          )}
        </Button>
      </div>

      {/* Cart Sheet Dialog */}
      <Sheet open={showCartDialog} onOpenChange={setShowCartDialog}>
        <SheetContent side="right" className="w-full bg-white sm:max-w-md flex flex-col p-0">
          <SheetHeader className="flex-shrink-0 p-4 sm:p-6 border-b">
            <SheetTitle className="flex items-center gap-2 text-base sm:text-lg">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              Shopping Cart ({cart.length} items)
            </SheetTitle>
            <SheetDescription className="text-sm sm:text-base">
              {cart.length > 0 ? `Total: $${getTotalAmount().toFixed(2)}` : "Your cart is empty"}
            </SheetDescription>
          </SheetHeader>
          
          <ScrollArea className="flex-1 px-4 sm:px-6">
            {cart.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground/50 mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-muted-foreground">Your cart is empty</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Add products to get started</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4 py-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border rounded-lg bg-card">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 overflow-hidden rounded flex-shrink-0 bg-muted">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                      <h4 className="text-sm font-medium line-clamp-2">{item.product.name}</h4>
                      <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                        <span>Color: {item.color}</span>
                        <span>•</span>
                        <span>Size: {item.size}</span>
                      </div>
                      {item.instructions && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          Instructions: {item.instructions}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">${item.subtotal.toFixed(2)}</p>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-5 sm:w-6 text-center text-xs sm:text-sm">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-6 w-6 sm:h-7 sm:w-7 p-0 ml-1"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          {cart.length > 0 && (
            <div className="flex-shrink-0 p-4 sm:p-6 border-t bg-background/95 backdrop-blur">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm sm:text-base">Total ({cart.length} items)</span>
                  <span className="font-semibold text-lg sm:text-xl">${getTotalAmount().toFixed(2)}</span>
                </div>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCart([]);
                      toast.success("Cart cleared");
                    }} 
                    className="w-full text-sm sm:text-base"
                  >
                    Clear Cart
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowCartDialog(false);
                      setShowOrderCompletion(true);
                    }} 
                    disabled={!selectedClient}
                    className="w-full text-sm sm:text-base"
                  >
                    {!selectedClient ? "Select Client First" : "Complete Order"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Product Detail Dialog */}
      <Dialog open={showProductDetail} onOpenChange={setShowProductDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-white overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-lg sm:text-xl">Product Details</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Customize your product selection
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <ScrollArea className="flex-1 overflow-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-1">
                <div className="space-y-3 sm:space-y-4">
                  <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                    <ImageWithFallback
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-lg sm:text-xl">{selectedProduct.name}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">{selectedProduct.material}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs sm:text-sm">{selectedProduct.category}</Badge>
                      <Badge variant="secondary" className="text-xs">{selectedProduct.company}</Badge>
                    </div>
                    <p className="text-xl sm:text-2xl font-semibold">${selectedProduct.price}</p>
                  </div>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-sm sm:text-base">Available Colors (Optional)</Label>
                    <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {selectedProduct.colors.map((color) => (
                          <div key={color} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value={color} id={color} />
                            <Label htmlFor={color} className="text-sm sm:text-base font-normal cursor-pointer flex-1">{color}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground">
                      If no color is selected, we'll use the first available color
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">Size (Required)</Label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="text-sm sm:text-base">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedProduct.sizes.map((size) => (
                          <SelectItem key={size} value={size} className="text-sm sm:text-base">{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">Quantity</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 sm:w-20 text-center text-sm sm:text-base"
                        min="1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setQuantity(quantity + 1)}
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <div className="flex-1 text-right">
                        <span className="text-sm sm:text-base font-medium">
                          Subtotal: ${(selectedProduct.price * quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">Special Instructions</Label>
                    <Textarea
                      placeholder="Any special instructions or customizations..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="mt-2 text-sm sm:text-base resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setShowProductDetail(false)} className="flex-1 text-sm sm:text-base">
                      Cancel
                    </Button>
                    <Button onClick={handleAddToCart} className="flex-1 text-sm sm:text-base" disabled={!selectedSize}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Cart - ${(selectedProduct.price * quantity).toFixed(2)}
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Order Completion Dialog */}
      <Dialog open={showOrderCompletion} onOpenChange={setShowOrderCompletion}>
        <DialogContent className="max-w-md bg-white">
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
        <DialogContent className="max-w-md bg-white">
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