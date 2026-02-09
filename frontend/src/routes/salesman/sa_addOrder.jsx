import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./addOrder/card";
import { Button } from "./addOrder/button";
import { Badge } from "./addOrder/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../distributer/ui/select";
import { Input } from "./addOrder/input";
import dayjs from "dayjs";
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
  ChevronRight,
  IndianRupeeIcon,
  Box
} from 'lucide-react';
import { useGetAllSeller } from '../../hooks/seller/useGetAllSeller';
import { useGetAllProduct } from "../../hooks/product/useGetAllProduct";
import { useDispatch, useSelector } from 'react-redux';
import { useAddCart } from '../../hooks/cart/useAddCart';
import { useUpdateCart } from '../../hooks/cart/useUpdateCart';
import { useDeleteCart } from '../../hooks/cart/useDeleteCart';
import { useGetAllCart } from '../../hooks/cart/useGetAllCart';
import { useAddOrder } from '../../hooks/order/useAddOrder';
import { useAddPayment } from '../../hooks/payment/useAddPayment';
import { useUpdateLimit } from '../../hooks/limit/useUpdateLimit';
import { setLimitsInfo } from '../../store/slice/appSlice';
import { useGetAllCompany } from '../../hooks/company/useGetAllCompany';
import { useGetAllCategory } from '../../hooks/category/useGetAllCategory';
import { useUpdateOrderSeller } from '../../hooks/seller/useUpdateOrderSeller';

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
    <div className="relative w-full h-full flex justify-center items-center">
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
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.app.userInfo);
  const [activeClientCarts,setActiveClientCarts] = useState();
  const userlimits = useSelector((state) => state.app.limits)
  // console.log("limsits",userlimits)  
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
  
  // Quick add states
  const [productQuantities, setProductQuantities] = useState({});
  const [productInstructions, setProductInstructions] = useState({});
  // Filter & Sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [comapletedOrder,setCompletedOrder] = useState();
  const [orderProdcuts,setOrderProducts] = useState();
  
  // Payment states
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    type: "",
    date: new Date().toISOString().split('T')[0],
    note:""
  });
  
  // Order ID
  const orderCount = userlimits?.placedOrderCount; 
  const [orderId, setOrderId] = useState("");

  // API Hooks

  const {mutate:addOrders,isPending: isAddOrderPending} = useAddOrder()
  const { mutate: updateOrderCount, isPending: isUpdateLimitPending, isError: isUpdateLimitError, error: updateLimitError } = useUpdateLimit({
    onSuccess:(res)=>{
      // console.log('responiser kjdbfka akjsb',res)
      dispatch(setLimitsInfo(res.data));
    }
  })

  //cart hooks
  const { data: getCart, isPending: cartPending, isError: isCartError, error: cartError,isSuccess:isCartSuccess } = useGetAllCart();
  // console.log("useGetCart response:", {
  //   getCart,
  //   cartPending,
  //   isCartError,
  //   cartError,
  //   isCartSuccess,
  // });
  // console.log("get cart",getCart?.data?.cart[0])

    useEffect(() => {
  if (!cartPending) {
    const cartData = getCart?.data?.cart[0];
    // console.log("initial cart data", cartData);

    // Transform backend cart data to frontend format
    const transformedCarts = {};
    cartData?.clients?.forEach(clientCart => {
      const clientId = clientCart.seller_data._id || clientCart.seller_data;
      transformedCarts[clientId] = clientCart.items.map(item => ({
        // USE A CONSISTENT ID GENERATION METHOD
        id: item.id || `${item.product_data._id}-${item.color}-${item.size}`,
        product: item.product_data,
        color: item.color,
        size: item.size,
        price: item.price,
        quantity: parseInt(item.quantity) || 1,
        instructions: item.instructions || "",
        subtotal: parseFloat(item.subtotal) || 0
      }));
    });
    
    setClientCarts(transformedCarts);
    setActiveClientCarts(cartData);
  }
}, [cartPending, getCart]);
    // console.log("active after set up",activeClientCart)

    const generateCartItemId = (productId, color, size) => {
      return `${productId}-${color}-${size}`;
    };

    
    const { mutate: addCart, isPending: isAddCartPending } = useAddCart({
      onSuccess: () => {
        // Refetch or update the list
        setCurrentPage(1);
      }
    });
    // console.log("data for cart",clientCarts)
    
    const { mutate: updateCart, isPending: isUpdateCartPending } = useUpdateCart({
      onSuccess: () => {
        // Data will be refetched automatically
      }
    });
    
    const { mutate: deleteCart, isPending: isDeleteCartPending } = useDeleteCart({
      onSuccess: () => {
        // Data will be refetched automatically
      }
    });
    
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: getSellerList, isPending: sellerPending } = useGetAllSeller();
  const { mutate: updateOrderSeller, isPending: isUpdateOrderSellerPending, isError:isUpdateOrderSellerError,Error:updateOrderSellerError } = useUpdateOrderSeller()
  const {mutate:addPayment,isPending: isPaymentPending, isError : isPaymentError, error: paymentError} = useAddPayment()
  const { data: getCompanyList, isPending: companyListPending, isError: isCompanyListError, error: companyListError } = useGetAllCompany({
      page: 1,
      limit: 100,
      search: "",
      status: "",
      sortField: "name",
      sortDirection: "asc"
    });
  
  const { 
    data: getProductList, 
    isPending: productListPending, 
    isError: isProductListError 
  } = useGetAllProduct({
    page: currentPage,
    limit: limit ,
    search: debouncedSearch,
    status: statusFilter,
    category: categoryFilter,
    companyId: companyFilter,
    sortField: sortField,
    sortDirection: sortDirection
  });

  const { data: categoriesAll } = useGetAllCategory();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);


  // Set clients data
  // console.log("sellers daya",getSellerList?.seller?.data[0])
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
  // useEffect(() => {
  //   if (getAllOrders?.count) {
  //     setOrderCount(getAllOrders.count);
  //   }
  // }, [getAllOrders]);

  useEffect(() => {
    if (userInfo?.tenant && orderCount !== undefined) {
      setOrderId(userInfo.tenant.substring(0, 3) + "-" + (orderCount + 1));
    }
  }, [userInfo, orderCount]);

  // Get unique companies and categories
  const companies = [...new Set(getCompanyList?.company?.data)]
  const categories = [...new Set(categoriesAll?.category)].sort();

  // Pagination
  const totalPages = getProductList?.pagination?.totalPages || 1;
  const totalProducts = getProductList?.pagination?.totalProducts || 0;
  const totalRecords = getProductList?.pagination?.totalProducts || 0;

  // const handlePageChange = (newPage) => {
  //   if (newPage >= 1 && newPage <= totalPages) {
  //     setCurrentPage(newPage);
  //   }
  // };

  // Get current active cart
  const cart = activeClientCart ? (clientCarts[activeClientCart] || []) : [];
  
  // Get total cart items across all clients
  const getTotalCartItems = () => {
    return Object.values(clientCarts).reduce((total, cart) => total + (cart?.length || 0), 0);
  };
  
  // Get all active client carts
  const activeClientCartsComputed = Object.entries(clientCarts)
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
    setSearchTerm("");
    setCompanyFilter("");
    setCategoryFilter("");
    setStatusFilter("");
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


const handleAddToCart = async () => {
  if (!selectedProduct || !selectedSize) {
    toast.error("Please select size");
    return;
  }

  if (!activeClientCart) {
    toast.error("Please select a client first");
    return;
  }

  const finalColor = selectedColor || (availableColors[0] || selectedProduct.color);
  const itemId = generateCartItemId(selectedProduct._id, finalColor, selectedSize);

  // Check if item already exists in cart
  const existingItemIndex = (clientCarts[activeClientCart] || []).findIndex(
    item => item.id === itemId
  );

  let updatedClientCarts;

  if (existingItemIndex !== -1) {
    // Update existing item quantity
    updatedClientCarts = {
      ...clientCarts,
      [activeClientCart]: clientCarts[activeClientCart].map((item, index) =>
        index === existingItemIndex
          ? {
              ...item,
              quantity: item.quantity + quantity,
              price: selectedSku?.costPrice || selectedProduct.costPrice,
              subtotal: (selectedSku?.costPrice || selectedProduct.costPrice) * (item.quantity + quantity),
              instructions: instructions || item.instructions
            }
          : item
      )
    };
    toast.success("Product quantity updated in cart!");
  } else {
    // Add new item to cart
    const cartItem = {
      id: itemId,
      product: selectedProduct,
      color: finalColor,
      size: selectedSize,
      quantity,
      instructions,
      price:selectedSku?.costPrice || selectedProduct.costPrice,
      subtotal: (selectedSku?.costPrice || selectedProduct.costPrice) * quantity
    };

    updatedClientCarts = {
      ...clientCarts,
      [activeClientCart]: [...(clientCarts[activeClientCart] || []), cartItem]
    };
    toast.success("Product added to cart!");
  }

  setClientCarts(updatedClientCarts);

  // Backend update logic remains the same
  const existingClients = activeClientCarts?.clients || [];
  
  const clientIndex = existingClients.findIndex(
    client => (client.seller_data._id || client.seller_data) === activeClientCart
  );
  
  let updatedBackendClients;
  
  if (clientIndex !== -1) {
    updatedBackendClients = existingClients.map((client, index) => {
      if (index === clientIndex) {
        return {
          seller_data: activeClientCart,
          items: updatedClientCarts[activeClientCart].map(item => ({
            id: item.id,
            product_data: item.product._id,
            quantity: item.quantity.toString(),
            size: item.size,
            price: item.price,
            subtotal: item.subtotal.toString(),
            instructions: item.instructions,
            color: item.color
          }))
        };
      }
      return {
        seller_data: client.seller_data._id || client.seller_data,
        items: client.items
      };
    });
  } else {
    updatedBackendClients = [
      ...existingClients.map(client => ({
        seller_data: client.seller_data._id || client.seller_data,
        items: client.items
      })),
      {
        seller_data: activeClientCart,
        items: updatedClientCarts[activeClientCart].map(item => ({
          id: item.id,
          product_data: item.product._id,
          quantity: item.quantity.toString(),
          size: item.size,
          price: item.price,
          subtotal: item.subtotal.toString(),
          instructions: item.instructions,
          color: item.color
        }))
      }
    ];
  }

  const backendPayload = {
    cartId: activeClientCarts,
    salesman_data: userInfo.tenant_user_id,
    clients: updatedBackendClients
  };

  if (activeClientCarts?.clients[0]._id) {
    updateCart(backendPayload);
  } else {
    addCart({
      salesman_data: userInfo.tenant_user_id,
      clients: backendPayload.clients
    });
  }

  setShowProductDetail(false);
};

  const handleRemoveFromCart = (clientId, itemId) => {
    const updatedClientCarts = {
      ...clientCarts,
      [clientId]: clientCarts[clientId].filter(item => item.id !== itemId)
    };
    setClientCarts(updatedClientCarts);

    // FIX: Keep existing backend clients
    const existingClients = activeClientCarts?.clients || [];
    
    const updatedBackendClients = existingClients.map(client => {
      const sellerId = client.seller_data._id || client.seller_data;
      if (sellerId === clientId) {
        return {
          seller_data: clientId,
          items: updatedClientCarts[clientId].map(item => ({
            id:item.id,
            product_data: item.product._id,
            quantity: item.quantity.toString(),
            size: item.size,
            price: item.price,
            subtotal: item.subtotal.toString(),
            instructions: item.instructions,
            color: item.color
          }))
        };
      }
      return {
        seller_data: sellerId,
        items: client.items
      };
    }).filter(client => client.items.length > 0); // Remove empty clients

    const backendPayload = {
      cartId: activeClientCarts._id,
      salesman_data: userInfo.tenant_user_id,
      clients: updatedBackendClients
    };

    updateCart(backendPayload);
    toast.success("Item removed from cart");
  };

  
const handleQuantityChange = (clientId, itemId, newQuantity, total) => {
  if (newQuantity < 1) return;
  
  // console.log("clientId", clientId, "itemId", itemId, "newQuantity", newQuantity);
  
  const updatedClientCarts = {
    ...clientCarts,
    [clientId]: clientCarts[clientId].map(item => {
      // console.log("Comparing item.id:", item.id, "with itemId:", itemId, "Match:", item.id === itemId);
      // console.log("selectedd sku",selectedSku)
      if (item.id === itemId) {
        const price = total/item.quantity;
        return { 
          ...item, 
          quantity: newQuantity, 
          subtotal: price * newQuantity 
        };
      }
      return item;
    })
  };
  
  setClientCarts(updatedClientCarts);

  // Backend update
  const existingClients = activeClientCarts?.clients || [];
  
  const updatedBackendClients = existingClients.map(client => {
    const sellerId = client.seller_data._id || client.seller_data;
    if (sellerId === clientId) {
      return {
        seller_data: clientId,
        items: updatedClientCarts[clientId].map(item => ({
          id: item.id,
          product_data: item.product._id,
          quantity: item.quantity.toString(),
          size: item.size,
          price: item.price,
          subtotal: item.subtotal.toString(),
          instructions: item.instructions,
          color: item.color
        }))
      };
    }
    return {
      seller_data: sellerId,
      items: client.items
    };
  });

  const backendPayload = {
    cartId: activeClientCarts._id,
    salesman_data: userInfo.tenant_user_id,
    clients: updatedBackendClients
  };

  updateCart(backendPayload);
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
  const currentCart = clientCarts[activeClientCart] || [];
  let updatedCart = [...currentCart];
  let addedCount = 0;
  let updatedCount = 0;
  
  sizesWithQty.forEach(([size, qty]) => {
    const matchingSku = product.skus?.find(sku => sku.size === size);
    console.log("matchingSku", matchingSku,product.costPrice);
    const price = (matchingSku && matchingSku.costPrice) || product.costPrice;
    const productColor = product.color || (product.skus?.[0]?.color || "Default");
    console.log("price", price, "color", productColor)
    // Generate consistent ID
    const itemId = generateCartItemId(product._id, productColor, size);
    
    // Check if this item already exists
    const existingItemIndex = updatedCart.findIndex(item => item.id === itemId);

    if (existingItemIndex !== -1) {
      // Update existing item
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + qty,
        subtotal: price * (updatedCart[existingItemIndex].quantity + qty),
        instructions: productInstr || updatedCart[existingItemIndex].instructions
      };
      updatedCount++;
    } else {
      // Add new item
      const cartItem = {
        id: itemId,
        product: product,
        color: productColor,
        size: size,
        price: price,
        quantity: qty,
        instructions: productInstr,
        subtotal: price * qty
      };
      console.log("Adding cart item", cartItem);
      updatedCart.push(cartItem);
      addedCount++;
    }
  });

  const updatedClientCarts = {
    ...clientCarts,
    [activeClientCart]: updatedCart
  };
  console.log("updatedClientCarts", updatedClientCarts);
  setClientCarts(updatedClientCarts);

  // Backend update logic remains the same
  const existingClients = activeClientCarts?.clients || [];
  
  const clientIndex = existingClients.findIndex(
    client => (client.seller_data._id || client.seller_data) === activeClientCart
  );
  
  let updatedBackendClients;
  
  if (clientIndex !== -1) {
    updatedBackendClients = existingClients.map((client, index) => {
      if (index === clientIndex) {
        return {
          seller_data: activeClientCart,
          items: updatedClientCarts[activeClientCart].map(item => ({
            id: item.id,
            product_data: item.product._id,
            quantity: item.quantity.toString(),
            size: item.size,
            price: item.price,
            subtotal: item.subtotal.toString(),
            instructions: item.instructions,
            color: item.color
          }))
        };
      }
      return {
        seller_data: client.seller_data._id || client.seller_data,
        items: client.items
      };
    });
  } else {
    updatedBackendClients = [
      ...existingClients.map(client => ({
        seller_data: client.seller_data._id || client.seller_data,
        items: client.items
      })),
      {
        seller_data: activeClientCart,
        items: updatedClientCarts[activeClientCart].map(item => ({
          id: item.id,
          product_data: item.product._id,
          quantity: item.quantity.toString(),
          size: item.size,
          price: item.price,
          subtotal: item.subtotal.toString(),
          instructions: item.instructions,
          color: item.color
        }))
      }
    ];
  }

  const backendPayload = {
    cartId: activeClientCarts?._id,
    salesman_data: userInfo.tenant_user_id,
    clients: updatedBackendClients
  };

  if (activeClientCarts?._id) {
    updateCart(backendPayload);
  } else {
    addCart({
      salesman_data: userInfo.tenant_user_id,
      clients: backendPayload.clients
    });
  }

  setProductQuantities(prev => ({
    ...prev,
    [product._id]: {}
  }));
  setProductInstructions(prev => ({
    ...prev,
    [product._id]: ""
  }));

  // if (updatedCount > 0 && addedCount > 0) {
  //   toast.success(`${addedCount} new item${addedCount > 1 ? 's' : ''} added, ${updatedCount} item${updatedCount > 1 ? 's' : ''} updated!`);
  // } else if (updatedCount > 0) {
  //   toast.success(`${updatedCount} item${updatedCount > 1 ? 's' : ''} updated in cart!`);
  // } else {
  //   toast.success(`${addedCount} item${addedCount > 1 ? 's' : ''} added to cart!`);
  // }
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
  const client = clientsdata.find(c => c._id === activeClientCart);
  
  if (!client || cart.length === 0) {
    toast.error("Invalid order data");
    return;
  }

  // Calculate totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = getTotalAmount();

  // Prepare order data
  const orderData = {
    order_id: orderId,
    order_seller: activeClientCart,
    order_salesman: userInfo.tenant_user_id,
    status: 'pending',
    order_firm: userInfo.tenant || null,
    date: new Date(),
    totalItems: totalItems,
    totalAmount: totalAmount.toFixed(2),
    items: cart.map(item => ({
      id: item.id,
      product_data: item.product._id,
      quantity: item.quantity,
      size: item.size,
      price: item.price,
      subtotal: item.subtotal,
      instructions: item.instructions || "",
      color: item.color || "default"
    }))
  };


  // console.log("Creating order:", orderData);
  const Order_seller = {
    id:activeClientCart,
    lastOrder:Date.now(),
    totalOrders:client.totalOrders+1,
    pendingOrders:client.pendingOrders+1
  }
  // console.log("order seller udpte",Order_seller);
  // Create the order
  addOrders(orderData, {
    onSuccess: () => {
      // Order created successfully
      toast.success("Order created and sent to packing!",orderData);
      
      // Remove this client from local cart state
      const updatedLocalCarts = { ...clientCarts };
      delete updatedLocalCarts[activeClientCart];
      setClientCarts(updatedLocalCarts);
      setCompletedOrder(orderData);
      setOrderProducts(cart);
      // Update backend cart - remove this client
      const existingClients = activeClientCarts?.clients || [];
      const updatedBackendClients = existingClients.filter(
        client => (client.seller_data._id || client.seller_data) !== activeClientCart
      );

      // If no clients left, delete the entire cart
      if (updatedBackendClients.length === 0) {
        deleteCart({ cartId: activeClientCarts._id });
        // console.log("No more clients in cart, deleting entire cart");
      } else {
        // Update cart without this client
        const backendPayload = {
          cartId: activeClientCarts._id,
          salesman_data: userInfo.tenant_user_id,
          clients: updatedBackendClients.map(client => ({
            seller_data: client.seller_data._id || client.seller_data,
            items: client.items
          }))
        };
        
        // console.log("Updating cart, removing client:", activeClientCart);
        updateCart(backendPayload);
      }

      // Keep selectedClient for payment but clear activeClientCart
      setActiveClientCart("");
      // DON'T clear selectedClient yet - we need it for payment

      //update order info in sellers data
      updateOrderSeller(Order_seller)
      
      // Increment order count for next order
      updateOrderCount({
        id: userlimits._id,
        updates: {
          placedOrderCount: orderCount + 1
        }
      });

      // Proceed to payment dialog (OPTIONAL - can be closed without payment)
      setShowOrderCompletion(false);
      if (userlimits?.wantToUsePayment) {
        setShowPaymentDialog(true);
        setPaymentData({
          amount: totalAmount.toFixed(2),
          type: "",
          date: new Date().toISOString().split('T')[0],
          note: ""
        });
      }else{
        handleSkipPayment();
      }
    },
    onError: (error) => {
      toast.error("Failed to create order: " + error.message);
      console.error("Order creation failed:", error);
    }
  });
};

  const handleRecordPayment = () => {
  // Validation is optional - can skip payment
  if (!paymentData.amount && !paymentData.type) {
    // User wants to skip payment - just close dialog
    handleSkipPayment();
    return;
  }

  // If user entered partial data, validate it
  if (paymentData.amount && !paymentData.type) {
    toast.error("Please select payment type");
    return;
  }
  
  if (!paymentData.amount && paymentData.type) {
    toast.error("Please enter payment amount");
    return;
  }

  // Get client from selectedClient (still available after order creation)
  const client = clientsdata.find(c => c._id === selectedClient);
  console.log("selected client for payment",comapletedOrder);
  if (!client) {
    toast.error("Client information not found");
    return;
  }

  // Payment API payload
  const payload = {
    payment_client: client._id,
    payment_salesman: userInfo.tenant_user_id,
    payment_amount: paymentData.amount,
    payment_type: paymentData.type,
    payment_date: dayjs(paymentData.date).format("DD-MM-YYYY"),
    order_with_payment: true,
    order_id: orderId, // Link payment to the order
    status: {
      status: "pending",
      adminId: null,
      notes: paymentData.note || ""
    }
  };

  // console.log("Recording payment:", payload);
  // console.log("completed order data",orderProdcuts);

  // Call payment API
  addPayment(payload, {
    onSuccess: () => {
      toast.success(`Payment of ${paymentData.amount} recorded for order ${orderId}`);
      
      // Get order details for WhatsApp
      const orderDetails = `
🛍️ *NEW ORDER CONFIRMATION*

📋 *Order Number:* ${orderId}
📅 *Order Date:* ${new Date().toLocaleDateString()}

👤 *CUSTOMER INFORMATION*
• Name: ${client?.name}
• Phone: ${client?.phone}
• Email: ${client?.email}

💰 *ORDER SUMMARY*
${
  comapletedOrder.items.map((item,index) => `• ${orderProdcuts[index].product?.name} (${item.size}) -> ${item.quantity}`).join('\n')
}

💳 *Payment Details:*
• Amount: ₹${paymentData.amount}
• Type: ${paymentData.type}
• Date: ${new Date(paymentData.date).toLocaleDateString()}
${paymentData.note ? `• Note: ${paymentData.note}` : ''}

✅ *Status:* Payment Confirmed & Sent to Packing Department
      `.trim();

      // Send WhatsApp message
      const whatsappUrl = `https://wa.me/${client?.phone?.replace(/[^\d]/g, '')}?text=${encodeURIComponent(orderDetails)}`;
      window.open(whatsappUrl, '_blank');

      // Reset payment dialog and clear states
      cleanupAfterPayment();
    },
    onError: (error) => {
      toast.error("Failed to record payment: " + error.message);
      console.error("Payment recording failed:", error);
    }
  });
};

const handleSkipPayment = () => {
  const client = clientsdata.find(c => c._id === selectedClient);
  console.log("compaletd order info",comapletedOrder);
  console.log("order products info",orderProdcuts);
  
  if (client) {
    // Send WhatsApp without payment details
    const orderDetails = `
🛍️ *NEW ORDER CONFIRMATION*

📋 *Order Number:* ${orderId}
📅 *Order Date:* ${new Date().toLocaleDateString()}

💰 *ORDER SUMMARY*
${
  comapletedOrder.items.map((item,index) => `• ${orderProdcuts[index].product?.name} (${item.size}) -> ${item.quantity}`).join('\n')
}

👤 *CUSTOMER INFORMATION*
• Name: ${client?.name}
• Phone: ${client?.phone}
• Email: ${client?.email}

✅ *Status:* Order Sent to Packing Department

💡 Payment can be recorded later.
    `.trim();

    const whatsappUrl = `https://wa.me/${client?.phone?.replace(/[^\d]/g, '')}?text=${encodeURIComponent(orderDetails)}`;
    window.open(whatsappUrl, '_blank');
  }

  toast.success("Order completed without payment record");
  cleanupAfterPayment();
};

const cleanupAfterPayment = () => {
  // Reset payment dialog
  setShowPaymentDialog(false);
  setPaymentData({
    amount: 0,
    type: "",
    date: new Date().toISOString().split('T')[0],
    note: ""
  });
  
  // Clear selected client
  setSelectedClient("");
  setClientSearchQuery("");
};

const handlePaymentDialogClose = (open) => {
  if (!open) {
    // User is closing the dialog - ask for confirmation
    const hasPaymentData = paymentData.amount || paymentData.type;
    
    if (hasPaymentData) {
      // User entered some data - confirm before closing
      const confirmClose = window.confirm(
        "You have entered payment details. Do you want to close without saving?"
      );
      if (!confirmClose) return;
    }
    
    // Close without saving
    handleSkipPayment();
  } else {
    setShowPaymentDialog(true);
  }
};

  const selectedClientData = clientsdata.find(c => c._id === selectedClient);

  return (
    <div className="p-0 sm:p-2 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl truncate">Add New Order</h1>
        </div>
        {activeClientCarts?.length > 0 && (
          <Badge variant="secondary" className="text-xs sm:text-sm">
            <Users className="h-3 w-3 mr-1" />
            {activeClientCarts.length} Active Cart{activeClientCarts.length > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Active Client Carts Display */}
      {/* {console.log("active cleint card",activeClientCarts)} */}
      {activeClientCarts?.clients.length > 0 && (
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
          <CardContent className="p-0 sm:p-6">
            {/* Mobile View - Vertical Stack */}
            <div className="sm:hidden px-3 space-y-2">
              {activeClientCarts.clients.map((clientCart) => (
                <Card
                  key={clientCart.seller_data._id}
                  className={`cursor-pointer transition-all ${
                    activeClientCart === clientCart.seller_data._id
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'hover:border-primary/50 hover:shadow-sm'
                  }`}
                  onClick={() => {
                    setActiveClientCart(clientCart.seller_data._id);
                    setSelectedClient(clientCart.seller_data._id);
                    const client = clientsdata.find(c => c._id === clientCart.seller_data._id);
                    if (client) setClientSearchQuery(client.name);
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">
                          {clientCart?.seller_data?.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {clientCart?.items?.length} item{clientCart?.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {activeClientCart === clientCart.seller_data._id && (
                          <Badge variant="default" className="text-xs">Active</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            const sellerId = clientCart.seller_data._id;
                            
                            const updatedCarts = { ...clientCarts };
                            delete updatedCarts[sellerId];
                            setClientCarts(updatedCarts);
                            
                            const existingClients = activeClientCarts?.clients || [];
                            const updatedBackendClients = existingClients.filter(
                              client => (client.seller_data._id || client.seller_data) !== sellerId
                            );
                            
                            const backendPayload = {
                              cartId: activeClientCarts._id,
                              salesman_data: userInfo.tenant_user_id,
                              clients: updatedBackendClients
                            };
                            
                            if (updatedBackendClients.length === 0) {
                              deleteCart({ cartId: activeClientCarts._id });
                            } else {
                              updateCart(backendPayload);
                            }
                            
                            if (activeClientCart === sellerId) {
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop View - Horizontal Scroll */}
            <div className="hidden sm:block">
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2 px-3 sm:px-0">
                  {activeClientCarts.clients.map((clientCart) => (
                    <Card
                      key={clientCart.seller_data._id}
                      className={`flex-shrink-0 w-64 cursor-pointer transition-all ${
                        activeClientCart === clientCart.seller_data._id
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'hover:border-primary/50 hover:shadow-sm'
                      }`}
                      onClick={() => {
                        setActiveClientCart(clientCart.seller_data._id);
                        setSelectedClient(clientCart.seller_data._id);
                        const client = clientsdata.find(c => c._id === clientCart.seller_data._id);
                        if (client) setClientSearchQuery(client.name);
                      }}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">
                              {clientCart?.seller_data?.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {clientCart?.items?.length} item{clientCart?.items.length > 1 ? 's' : ''}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              const sellerId = clientCart.seller_data._id;
                              
                              const updatedCarts = { ...clientCarts };
                              delete updatedCarts[sellerId];
                              setClientCarts(updatedCarts);
                              
                              const existingClients = activeClientCarts?.clients || [];
                              const updatedBackendClients = existingClients.filter(
                                client => (client.seller_data._id || client.seller_data) !== sellerId
                              );
                              
                              const backendPayload = {
                                cartId: activeClientCarts._id,
                                salesman_data: userInfo.tenant_user_id,
                                clients: updatedBackendClients
                              };
                              
                              if (updatedBackendClients.length === 0) {
                                deleteCart({ cartId: activeClientCarts._id });
                              } else {
                                updateCart(backendPayload);
                              }
                              
                              if (activeClientCart === sellerId) {
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
                          {activeClientCart === clientCart.seller_data._id && (
                            <Badge variant="default" className="text-xs">Active</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
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
                      Cart: {cart.length} item{cart.length > 1 ? 's' : ''} · ₹{getTotalAmount().toFixed(2)}
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
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 sm:pl-10 text-sm sm:text-base"
              />
            </div>
            {companies.length > 0 && (
              <div>
                <Select value={companyFilter} onValueChange={(value) => {
                  setCompanyFilter(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="Filter by company" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
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
              <Select value={categoryFilter} onValueChange={(value) => {
                setCategoryFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category.name}>
                      {category.name}
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
          {(searchTerm || (companyFilter  && companyFilter !== "all-companies") || (categoryFilter && categoryFilter !== "all-categories")) && (
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
          <CardTitle>Product Catalogue</CardTitle>
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
                  // console.log("product data",product);
                  // console.log("product skus",product.skus);
                  // console.log("product size",product.size);
                  const sizes = product.skus && product.skus.length > 0 ? product.skus?.map(sku => sku.size).filter(Boolean) : [product.size] || [];
                  const uniqueSizes = [...new Set(sizes)];
                  const hasQuantities = uniqueSizes.some(size => getProductQuantity(product._id, size) > 0);
                  
                  return (
                    <Card key={product._id} className="flex flex-col overflow-hidden h-full">
                      <div className="p-3 sm:p-4 border-b bg-muted/30 flex-shrink-0">
                        <h4 className="font-medium text-sm sm:text-base line-clamp-2 min-h-[2.5em] mb-2">{product.name}</h4>
                        <div className="flex items-center justify-between">
                          {/* <span className="font-semibold text-primary"><IndianRupeeIcon className='w-3 h-3 inline-block' />{product.costPrice}</span> */}
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">{product.category}</Badge>
                          </div>
                        </div>
                      </div>

                      <ScrollArea className="flex-1 overflow-y-auto overscroll-contain max-h-64 min-h-0">
                        <div className="flex-1 overflow-y-auto overscroll-contain max-h-64">
                          <div className="p-3 sm:p-4 space-y-2">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase">Sizes</Label>
                            <div className="space-y-2 pb-2"> {/* Added pb-2 for bottom padding */}
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
                            
                            <div className="space-y-1.5 pt-3 border-t">
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
                          </div>
                      </ScrollArea>

                      <div className="p-3 sm:p-4 border-t space-y-2 bg-background flex-shrink-0">
                        <Button
                          variant="default"
                          className="w-full text-xs sm:text-sm"
                          onClick={() => {
                            handleQuickAddToCart(product);
                          }}
                          disabled={!hasQuantities || !activeClientCart}
                        >
                          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <div className={`grid grid-cols-1 gap-1 ${userlimits?.wantToUsePhotos && 'grid grid-cols-2 gap-2'}`}>
                          <Button
                            variant="outline"
                            className="w-full text-xs sm:text-sm"
                            onClick={() => {
                              handleProductSelect(product);
                            }}
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Full Details
                          </Button>
                          {
                            userlimits?.wantToUsePhotos &&
                            <Button
                            variant="outline"
                            className="w-full text-xs sm:text-sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowPhotosDialog(true);
                            }}
                          >
                            <Image className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Photos
                          </Button>
                          }
                          
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              
            </>
          )}
        </CardContent>
      </Card>
      {totalPages >= 1 && (
  <Card className="p-4 mt-6">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground">
        Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalRecords)} of {totalRecords} products
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex items-center gap-1">
          {[...Array(Math.min(5, totalPages))].map((_, idx) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = idx + 1;
            } else if (currentPage <= 3) {
              pageNum = idx + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + idx;
            } else {
              pageNum = currentPage - 2 + idx;
            }
            
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className="w-10"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Label className="text-sm">Per page:</Label>
        <Select value={limit.toString()} onValueChange={(val) => {
          setLimit(parseInt(val));
          setCurrentPage(1);
        }}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </Card>
)}

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
        <SheetContent side="right" className="w-full bg-white sm:max-w-xl md:max-w-2xl lg:max-w-3xl flex flex-col p-0 h-full">
          <SheetHeader className="flex-shrink-0 p-3 sm:p-4 lg:p-6 border-b bg-background">
            <SheetTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">All Client Carts ({activeClientCarts?.clients.length} client{activeClientCarts?.clients.length > 1 ? 's' : ''})</span>
            </SheetTitle>
            <SheetDescription className="text-xs sm:text-sm lg:text-base">
              Manage orders for all your clients
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="px-3 sm:px-4 lg:px-6">
              {activeClientCarts?.length === 0 ? (
                <div className="text-center py-8 sm:py-12 lg:py-16">
                  <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 mx-auto text-muted-foreground/50 mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium">No client carts yet</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Select a client and add products to get started</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4 lg:space-y-6 py-3 sm:py-4 lg:py-6">
                  {/* {console.log("active client data",activeClientCarts)} */}
                  {activeClientCarts && activeClientCarts.clients.map((clientCart) => (
                    <Card key={clientCart.seller_data._id} className="border-2 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4 lg:p-6">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm sm:text-base lg:text-lg truncate">{clientCart.seller_data.name}</CardTitle>
                            <CardDescription className="text-xs sm:text-sm mt-0.5 sm:mt-1">
                              {clientCart?.items.length} item{clientCart?.items.length > 1 ? 's' : ''}
                            </CardDescription>
                          </div>
                          <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                            {activeClientCart === clientCart.clientId && (
                              <Badge variant="default" className="text-xs h-6 sm:h-7">Active</Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                              e.stopPropagation();
                              const sellerId = clientCart.seller_data._id || clientCart.seller_data;
                              
                              // console.log("🗑️ Removing client cart from active cards:", sellerId);
                              
                              // Update local state
                              const updatedCarts = { ...clientCarts };
                              delete updatedCarts[sellerId];
                              setClientCarts(updatedCarts);
                              
                              // Update backend
                              const existingClients = activeClientCarts?.clients || [];
                              const updatedBackendClients = existingClients
                                .filter(client => {
                                  const clientSellerId = client.seller_data._id || client.seller_data;
                                  return clientSellerId !== sellerId;
                                })
                                .map(client => ({
                                  seller_data: client.seller_data._id || client.seller_data,
                                  items: client.items
                                }));
                              
                              if (updatedBackendClients.length === 0) {
                                deleteCart({ cartId: activeClientCarts._id });
                              } else {
                                const backendPayload = {
                                  cartId: activeClientCarts._id,
                                  salesman_data: userInfo.tenant_user_id,
                                  clients: updatedBackendClients
                                };
                                updateCart(backendPayload);
                              }
                              
                              // Clear active cart if this was the active one
                              if (activeClientCart === sellerId) {
                                setActiveClientCart("");
                                setSelectedClient("");
                                setClientSearchQuery("");
                              }
                              
                              toast.success("Client cart removed");
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
                          {/* {console.log("side bar cleint cart",clientCart)} */}
                          {clientCart?.items.map((item,index) => (
                            <div key={index} className="flex gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
                              {/* <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 overflow-hidden rounded flex-shrink-0 bg-muted">
                                <ImageWithFallback
                                  src={item.product_data?.images[0]?.url || item?.product_data?.image[0].url}
                                  alt={item?.product_data?.name}
                                  className="w-full h-full object-cover"
                                />
                              </div> */}
                              <div className="flex-1 min-w-0 space-y-1">
                                <h4 className="text-xs sm:text-sm font-medium line-clamp-2">{item.product_data?.name}</h4>
                                <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                                  {/* <span>Color: {item.color}</span> */}
                                  <span>•</span>
                                  <span>Size: {item.size}</span>
                                </div>
                                {item.instructions && (
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    Instructions: {item.instructions}
                                  </p>
                                )}
                                <div className="flex items-center justify-between pt-1">
                                  <p className="text-xs sm:text-sm font-semibold text-primary"><IndianRupeeIcon className='w-3 h-3 inline-block' />{item.subtotal}</p>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleQuantityChange(clientCart.seller_data._id, item.id, Number(item.quantity) - 1,item.subtotal)}
                                      className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                                    >
                                      <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                    </Button>
                                    <span className="w-4 sm:w-6 text-center text-xs sm:text-sm font-medium">{item.quantity}</span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleQuantityChange(clientCart.seller_data._id, item.id, Number(item.quantity) + 1,item.subtotal)}
                                      className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                                    >
                                      <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleRemoveFromCart(clientCart.seller_data._id, item.id)}
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
                              setActiveClientCart(clientCart.seller_data._id);
                              setSelectedClient(clientCart.seller_data._id);
                              const client = clientsdata.find(c => c._id === clientCart.seller_data._id);
                              if (client) setClientSearchQuery(client.name);
                              setShowCartDialog(false);
                              setShowOrderCompletion(true);
                            }}
                            className="w-full h-9 sm:h-10 lg:h-11 text-xs sm:text-sm"
                          >
                            <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                            <span className="truncate">Complete Order for {clientCart.seller_data.name}</span>
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
      <Dialog open={showProductDetail} onOpenChange={setShowProductDetail}>
  <DialogContent className="max-w-2xl bg-white max-h-[95vh] overflow-hidden flex flex-col p-0">
    {selectedProduct && (
      <>
        {/* Hidden accessibility headers */}
        <DialogHeader className="sr-only">
          <DialogTitle>{selectedProduct.name}</DialogTitle>
          <DialogDescription>
            Complete product information for {selectedProduct.name}.
          </DialogDescription>
        </DialogHeader>

        {/* Header with Close Button */}
        <div className="flex items-start justify-between gap-3 p-3 sm:p-4 lg:p-6 border-b bg-muted/30">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
              Product Information
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Complete details and specifications
            </p>
          </div>
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowProductDetail(false)}
            className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-full"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button> */}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Product Name & Category */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <h3 className="text-sm sm:text-base font-semibold">
                    Product Details
                  </h3>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Product Name
                    </p>
                    <p className="text-sm sm:text-base font-semibold">
                      {selectedProduct.name}
                    </p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Category
                      </p>
                      <Badge variant="outline" className="text-xs sm:text-sm">
                        {selectedProduct.category}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Brand
                      </p>
                      <p className="text-sm sm:text-base font-medium">
                        {selectedProduct?.company?.name || selectedProduct?.brand || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description - Only show if available */}
              {selectedProduct.description && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <h3 className="text-sm sm:text-base font-semibold">
                      Description
                    </h3>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Material & Specifications - Only show if available */}
              {(selectedProduct.material || selectedProduct.dimensions || selectedProduct.weight) && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <h3 className="text-sm sm:text-base font-semibold">
                      Specifications
                    </h3>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {selectedProduct.material && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Material
                          </p>
                          <p className="text-sm sm:text-base font-medium">
                            {selectedProduct.material}
                          </p>
                        </div>
                      )}
                      {selectedProduct.dimensions?.weight && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Weight
                          </p>
                          <p className="text-sm sm:text-base font-medium">
                            {selectedProduct.dimensions.weight} {selectedProduct.dimensions.weightUnit || 'kg'}
                          </p>
                        </div>
                      )}
                    </div>
                    {selectedProduct.dimensions?.length && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Dimensions
                          </p>
                          <p className="text-sm sm:text-base font-medium">
                            {selectedProduct.dimensions.length} × {selectedProduct.dimensions.width} × {selectedProduct.dimensions.height} {selectedProduct.dimensions.unit || 'cm'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Available Colors */}
              {(() => {
                // Get colors from SKUs or product itself
                let colors = [];
                
                if (selectedProduct.skus && selectedProduct.skus.length > 0) {
                  // Get unique colors from SKUs
                  const skuColors = selectedProduct.skus
                    .map(sku => sku.color)
                    .filter(Boolean)
                    .flatMap(color => color.split(',').map(c => c.trim()))
                    .filter(Boolean);
                  colors = [...new Set(skuColors)];
                } else if (selectedProduct.color) {
                  // Get colors from product
                  if (typeof selectedProduct.color === 'string') {
                    colors = selectedProduct.color.split(',').map(c => c.trim()).filter(Boolean);
                  } else if (Array.isArray(selectedProduct.color)) {
                    colors = selectedProduct.color.filter(Boolean);
                  }
                }

                return colors.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <h3 className="text-sm sm:text-base font-semibold">
                        Available Colors
                      </h3>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 sm:p-4">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {colors.map((color, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs sm:text-sm"
                          >
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Available Sizes */}
              {(() => {
                // Get sizes from SKUs or product itself
                let sizes = [];
                
                if (selectedProduct.skus && selectedProduct.skus.length > 0) {
                  // Get unique sizes from SKUs
                  sizes = [...new Set(
                    selectedProduct.skus
                      .map(sku => sku.size)
                      .filter(Boolean)
                  )];
                } else if (selectedProduct.size) {
                  // Get sizes from product
                  if (typeof selectedProduct.size === 'string') {
                    sizes = selectedProduct.size.split(',').map(s => s.trim()).filter(Boolean);
                  } else if (Array.isArray(selectedProduct.size)) {
                    sizes = selectedProduct.size.filter(Boolean);
                  }
                } else if (selectedProduct.sizes) {
                  // Alternative field name
                  if (typeof selectedProduct.sizes === 'string') {
                    sizes = selectedProduct.sizes.split(',').map(s => s.trim()).filter(Boolean);
                  } else if (Array.isArray(selectedProduct.sizes)) {
                    sizes = selectedProduct.sizes.filter(Boolean);
                  }
                }

                return sizes.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <h3 className="text-sm sm:text-base font-semibold">
                        Available Sizes
                      </h3>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 sm:p-4">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {sizes.map((size, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs sm:text-sm"
                          >
                            {size}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Pricing */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <h3 className="text-sm sm:text-base font-semibold">
                    Pricing
                  </h3>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                  {selectedProduct.skus && selectedProduct.skus.length > 0 ? (
                    // Show SKU-based pricing
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground mb-2">
                        Price varies by size/color
                      </p>
                      {selectedProduct.skus.map((sku, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                          <div className="flex items-center gap-2">
                            {sku.size && (
                              <Badge variant="outline" className="text-xs">
                                {sku.size}
                              </Badge>
                            )}
                            {sku.color && (
                              <span className="text-xs text-muted-foreground">
                                {sku.color}
                              </span>
                            )}
                          </div>
                          <p className="text-base sm:text-lg font-bold text-primary">
                            ₹{sku.costPrice?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Show product-level pricing
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          M.R.P.
                        </p>
                        <p className="text-base sm:text-lg font-semibold text-muted-foreground line-through">
                          ₹{selectedProduct.price?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          D.P.
                        </p>
                        <p className="text-lg sm:text-2xl font-bold text-primary">
                          ₹{selectedProduct.costPrice?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Packaging Information - Only show if available */}
              {(selectedProduct.innerPack || selectedProduct.masterPack) && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Box className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <h3 className="text-sm sm:text-base font-semibold">
                      Packaging
                    </h3>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {selectedProduct.innerPack && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Inner Pack
                          </p>
                          <p className="text-sm sm:text-base font-medium">
                            {selectedProduct.innerPack}
                          </p>
                        </div>
                      )}
                      {selectedProduct.masterPack && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Master Pack
                          </p>
                          <p className="text-sm sm:text-base font-medium">
                            {selectedProduct.masterPack}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Supplier - Only show if available */}
              {selectedProduct.supplier && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <h3 className="text-sm sm:text-base font-semibold">
                      Supplier
                    </h3>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
                    <p className="text-sm sm:text-base font-medium">
                      {selectedProduct.supplier}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 bg-background border-t p-3 sm:p-4 lg:p-6">
          <Button
            onClick={() => setShowProductDetail(false)}
            className="w-full h-9 sm:h-10 lg:h-11 text-xs sm:text-sm"
          >
            Close
          </Button>
        </div>
      </>
    )}
  </DialogContent>
</Dialog>

      {/* Photos Dialog */}
      <Dialog open={showPhotosDialog} onOpenChange={setShowPhotosDialog}>
  <DialogContent className="max-w-5xl bg-white max-h-[90vh] overflow-hidden flex flex-col p-4 sm:p-6">
    <DialogHeader className="flex-shrink-0">
      <DialogTitle className="text-base sm:text-lg md:text-xl font-semibold">
        {selectedProduct?.name}
      </DialogTitle>
      <DialogDescription className="text-xs sm:text-sm">
        Product Gallery & Details
      </DialogDescription>
    </DialogHeader>
    {selectedProduct && (
      <ScrollArea className="flex-1 overflow-auto">
        <div className="space-y-4 sm:space-y-6">
          {/* Main product image - Hero Section */}
          <div className="w-full">
            {
              selectedProduct.images.length > 0 ? ( 
              <div className="aspect-[4/3] sm:aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center p-6 sm:p-8 shadow-sm">
                <ImageWithFallback
                  src={selectedProduct?.images[0]?.url}
                  alt={`${selectedProduct?.name} - Main`}
                  className="max-w-full max-h-full w-auto flex justify-center items-center h-auto object-contain drop-shadow-lg"
                />
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  Featured
                </div>
              </div>) : (
                <div>
                  <p>No Images Found</p>
                </div>
              )
            }
            
          </div>
          
          {/* Additional product images - Horizontal Scroll */}
          {selectedProduct.images.length > 1 && (
            <div>
              <h4 className="text-sm font-medium mb-3 text-muted-foreground">More Views</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {selectedProduct.images.slice(1).map((image, index) => (
                  <div 
                    key={index} 
                    className="group relative cursor-pointer"
                  >
                    <div className="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-muted/30 to-muted border border-border group-hover:border-primary group-hover:shadow-md transition-all duration-300 flex items-center justify-center p-3">
                      <ImageWithFallback
                        src={image.url}
                        alt={`${selectedProduct.name} - View ${index + 2}`}
                        className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Product Information Card */}
          {/* <div className="bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl p-4 sm:p-5 border border-border">
            <h4 className="font-semibold mb-3 text-sm sm:text-base flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full"></span>
              Product Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <span className="font-medium text-muted-foreground min-w-[80px]">Category:</span> 
                <span className="font-medium">{selectedProduct.category}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-muted-foreground min-w-[80px]">Company:</span> 
                <span className="font-medium">{selectedProduct.company.name}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-muted-foreground min-w-[80px]">Colors:</span> 
                <span>{selectedProduct.color}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-muted-foreground min-w-[80px]">Sizes:</span> 
                <span>{selectedProduct.sizes}</span>
              </div>
              <div className="flex items-start gap-2 sm:col-span-2">
                <span className="font-medium text-muted-foreground min-w-[80px]">Price:</span> 
                <span className="text-primary font-bold text-sm sm:text-lg">${selectedProduct.price}</span>
              </div>
            </div>
          </div> */}
        </div>
      </ScrollArea>
    )}
    <div className="flex-shrink-0 pt-4 border-t mt-4">
      <Button
        variant="outline"
        onClick={() => setShowPhotosDialog(false)}
        className="w-full text-sm sm:text-base hover:bg-muted"
      >
        Close
      </Button>
    </div>
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
                  <span>Client:</span>
                  <span className="font-medium">{selectedClientData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>{cart.length} items</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span><IndianRupeeIcon className='w-4 h-4 inline-block mr-1' />{getTotalAmount().toFixed(2)}</span>
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
                  {/* <div className="text-xs text-muted-foreground">Record payment details and send order to packing</div> */}
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
      {
        userlimits?.wantToUsePayment && 
        <Dialog open={showPaymentDialog} onOpenChange={handlePaymentDialogClose}>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>Record Payment (Optional)</DialogTitle>
              <DialogDescription>
                Enter payment details for order {orderId} or skip to complete without payment
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Payment Amount (Optional)</Label>
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
                  <Label>Payment Type (Optional)</Label>
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
                    <SelectContent className="bg-white">
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
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

                <div>
                  <Label>Payment Note (Optional)</Label>
                  <Textarea
                    placeholder="Add notes about payment..."
                    value={paymentData.note}
                    onChange={(e) => setPaymentData(prev => ({
                      ...prev,
                      note: e.target.value
                    }))}
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleSkipPayment} 
                  className="flex-1"
                >
                  Skip Payment
                </Button>
                <Button 
                  onClick={handleRecordPayment} 
                  className="flex-1"
                  disabled={!paymentData.amount || !paymentData.type}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                You can skip payment recording and add it later if needed
              </p>
            </div>
          </DialogContent>
        </Dialog>
      }
    </div>
  );
}
