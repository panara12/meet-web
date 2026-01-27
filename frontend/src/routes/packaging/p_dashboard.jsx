import { useEffect, useState } from 'react';
import { Header } from './p_header';
import { ClientList } from './p_clientList';
import { OrderList } from './p_orderList';
import { OrderDetails } from './p_orderDetails';
import { ClipboardPanel } from './p_clipBoardPanel';
import { Toaster } from '../distributer/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../distributer/ui/tabs';
import { mockClients, mockOrders } from './mockData';
import { useTranslation } from './translations';
import { toast } from 'sonner';
import { Clipboard, Package } from 'lucide-react';
import { useGetAllOrders } from '../../hooks/order/useGetAllOrder';
import { useUpdateOrder } from '../../hooks/order/useUpdateOrder';
import { useUpdateOrderSeller } from '../../hooks/seller/useUpdateOrderSeller';
import { useLogout } from '../../hooks/auth/useLogOut';

export default function Dashboard() {
  const {
    data: getAllOrders,
    isPending: isGetAllOrdersPending,
    isError: isGetAllOrdersError,
    error: getAllOrdersError
  } = useGetAllOrders();

  const {mutate:updateOrder,isPending:isUpdateOrderPending,isError:isUpdateOrderError,Error:updateOrderError} = useUpdateOrder()
  const {mutate:updateSellerOrder,isPending:isUpdateSellerOrderPending,isError:isUpdateSellerOrderError,Error:updateSellerOrderError} = useUpdateOrderSeller()
  
  const {mutate:logout} = useLogout();

  const [appState, setAppState] = useState({
    currentView: 'clients',
    selectedClient: null,
    selectedOrder: null,
    language: 'en',
    globalSelectedItems: new Map()
  });

  const [orders, setOrders] = useState([]);
  const [mobileTab, setMobileTab] = useState('main');

  // Initialize orders from API response
  useEffect(() => {
    if (!isGetAllOrdersPending && getAllOrders?.orders) {
      setOrders(getAllOrders.orders);
    }
  }, [getAllOrders, isGetAllOrdersPending]);

  // Extract unique clients from orders
  const clientData = orders && orders.length > 0
    ? [...new Map(
        orders
          .filter(o => o.order_seller)
          .map(o => [o.order_seller._id, o.order_seller])
      ).values()]
    : [];

  // Get orders grouped by client
  const getOrdersByClient = (clientId) => {
    return orders.filter(order => order.order_seller?._id === clientId);
  };

  // Get all orders with their clients for clipboard
  const getAllOrdersWithClients = () => {
    return orders
      .filter(order => order.order_seller)
      .map(order => ({
        client: order.order_seller,
        order: order
      }));
  };

  const handleClientSelect = (client) => {
    setAppState({
      ...appState,
      currentView: 'orders',
      selectedClient: client,
      selectedOrder: null,
      globalSelectedItems: new Map()
    });
  };

  const handleOrderSelect = (order) => {
    setAppState({
      ...appState,
      currentView: 'order-details',
      selectedOrder: order
    });
  };

  const handleBackToClients = () => {
    setAppState({
      ...appState,
      currentView: 'clients',
      selectedClient: null,
      selectedOrder: null,
      globalSelectedItems: new Map()
    });
  };

  const handleBackToOrders = () => {
    setAppState({
      ...appState,
      currentView: 'orders',
      selectedOrder: null
    });
  };

  const handleUpdateOrder = (orderId, updatedItems, cartoonCount) => {
    if (!appState.selectedClient) return;

    const allItemsSentToBilling = updatedItems.every(item => item.sentToBilling);
    const hasItemsSentToBilling = updatedItems.some(item => item.sentToBilling);

    let newStatus;
    if (allItemsSentToBilling) {
      newStatus = 'completed';
    } else if (hasItemsSentToBilling) {
      newStatus = 'processing';
    } else {
      newStatus = 'pending';
    }

    const totalItems = updatedItems.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);
    const totalAmount = updatedItems.reduce(
      (sum, item) => sum + parseFloat(item.subtotal || 0),
      0
    );

    // Update orders array
    const updatedOrders = orders.map(order =>
      order._id === orderId
        ? {
            ...order,
            items: updatedItems,
            status: newStatus,
            totalItems,
            totalAmount: totalAmount.toFixed(2)
          }
        : order
    );

    setOrders(updatedOrders);

    const updatedOrder = updatedOrders.find(order => order._id === orderId);
    if (updatedOrder) {
      setAppState({
        ...appState,
        selectedOrder: updatedOrder
      });
    }
  };

  const handleUpdateQuantity = (orderId, updatedItems) => {
    if (!appState.selectedClient) return;

    const totalItems = updatedItems.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);
    const totalAmount = updatedItems.reduce(
      (sum, item) => sum + parseFloat(item.subtotal || 0),
      0
    );

    // Update orders array
    const updatedOrders = orders.map(order =>
      order._id === orderId
        ? {
            ...order,
            items: updatedItems,
            totalItems,
            totalAmount: totalAmount.toFixed(2)
          }
        : order
    );

    setOrders(updatedOrders);

    const updatedOrder = updatedOrders.find(order => order._id === orderId);
    if (updatedOrder) {
      setAppState({
        ...appState,
        selectedOrder: updatedOrder
      });
    }
  };

  const handleGlobalItemSelect = (orderId, itemId, selected) => {
    const newGlobalSelectedItems = new Map(appState.globalSelectedItems);

    if (!newGlobalSelectedItems.has(orderId)) {
      newGlobalSelectedItems.set(orderId, new Set());
    }

    const orderItems = newGlobalSelectedItems.get(orderId);
    if (selected) {
      orderItems.add(itemId);
    } else {
      orderItems.delete(itemId);
    }

    if (orderItems.size === 0) {
      newGlobalSelectedItems.delete(orderId);
    }

    setAppState({
      ...appState,
      globalSelectedItems: newGlobalSelectedItems
    });
  };

  const updateOrderDetails = {};

  const handleSendMultipleOrdersToBilling = (cartoonCount, billingDate) => {
    if (!appState.selectedClient) return;

    const clientOrders = getOrdersByClient(appState.selectedClient._id);
    let totalItemsSent = 0;

    const updatedOrders = orders.map(order => {
      // Only process orders for the selected client
      if (order.order_seller?._id !== appState.selectedClient._id) {
        return order;
      }

      const selectedItems = appState.globalSelectedItems.get(order._id);
      if (!selectedItems || selectedItems.size === 0) {
        return order;
      }

      const updatedItems = order.items.map(item => {
        if (selectedItems.has(item.id) && !item.sentToBilling) {
          totalItemsSent++;
          return {
            ...item,
            sentToBilling: true,
            cartoonCount,
            billingDate
          };
        }
        return item;
      });

      const allItemsSentToBilling = updatedItems.every(item => item.sentToBilling);
      const hasItemsSentToBilling = updatedItems.some(item => item.sentToBilling);

      let newStatus;
      if (allItemsSentToBilling) {
        newStatus = 'completed';
      } else if (hasItemsSentToBilling) {
        newStatus = 'processing';
      } else {
        newStatus = 'pending';
      }

      const totalItems = updatedItems.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);
      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + parseFloat(item.subtotal || 0),
        0
      );
      console.log("order details  uapdate",order,"items",updatedItems,"status",newStatus,"totalItems",totalItems,"totalAmount",totalAmount)
      updateOrder({...order,
        items: updatedItems,
        status: newStatus,
        totalItems,
        totalAmount: totalAmount.toFixed(2)})
      
      if(newStatus=="completed"){
        updateSellerOrder({
          id:order.order_seller._id,
          pendingOrders:order.order_seller.pendingOrders - 1
        });
      }

      return {
        ...order,
        items: updatedItems,
        status: newStatus,
        totalItems,
        totalAmount: totalAmount.toFixed(2)
      };
    });

    setOrders(updatedOrders);

    setAppState({
      ...appState,
      globalSelectedItems: new Map()
    });

    toast.success(
      `${totalItemsSent} Items sent to billing department with ${cartoonCount} cartoons on ${billingDate}`
    );
  };

  const handleLanguageChange = (language) => {
    setAppState({
      ...appState,
      language
    });
  };

  const handleLogout = () => {
    setAppState({
      currentView: 'clients',
      selectedClient: null,
      selectedOrder: null,
      language: 'en',
      globalSelectedItems: new Map()
    });
      logout();
  };

  const { t } = useTranslation(appState.language);

  const getHeaderTitle = () => {
    switch (appState.currentView) {
      case 'clients':
        return 'Package Manager';
      case 'orders':
        return appState.selectedClient?.name || 'Orders';
      case 'order-details':
        return `Order #${appState.selectedOrder?.order_id || ''}`;
      default:
        return 'Package Manager';
    }
  };

  const getBackHandler = () => {
    switch (appState.currentView) {
      case 'orders':
        return handleBackToClients;
      case 'order-details':
        return handleBackToOrders;
      default:
        return undefined;
    }
  };

  // Loading state
  if (isGetAllOrdersPending) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isGetAllOrdersError) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading orders</p>
          <p className="text-sm text-muted-foreground">{getAllOrdersError?.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <Header
        title={getHeaderTitle()}
        onBack={getBackHandler()}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {/* Mobile View - Tabs Layout */}
        <div className="md:hidden h-full flex flex-col">
          <Tabs
            value={mobileTab}
            onValueChange={(v) => setMobileTab(v)}
            className="h-full flex flex-col"
          >
            {/* Mobile Tab Navigation */}
            <TabsList className="grid w-full grid-cols-2 rounded-none border-b h-auto p-0 bg-background shrink-0">
              <TabsTrigger 
                value="clipboard" 
                className="gap-2 rounded-none py-3 sm:py-4 relative data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
              >
                <Clipboard className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium">Clipboard</span>
                {getAllOrdersWithClients().length > 0 && (
                  <span className="absolute top-1 right-1 sm:top-2 sm:right-2 w-2 h-2 bg-destructive rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="main" 
                className="gap-2 rounded-none py-3 sm:py-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
              >
                <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium">
                  {appState.currentView === 'clients' ? 'Clients' : 'Orders'}
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Mobile Tab Content - Clipboard */}
            <TabsContent 
              value="clipboard" 
              className="flex-1 m-0 overflow-hidden h-full data-[state=inactive]:hidden"
            >
              <div className="h-full overflow-y-auto">
                <ClipboardPanel allOrders={getAllOrdersWithClients()} />
              </div>
            </TabsContent>

            {/* Mobile Tab Content - Main */}
            <TabsContent 
              value="main" 
              className="flex-1 m-0 overflow-hidden h-full data-[state=inactive]:hidden"
            >
              <div className="h-full overflow-y-auto">
                {appState.currentView === 'clients' && (
                  <ClientList
                    clients={clientData}
                    onClientSelect={handleClientSelect}
                    language={appState.language}
                  />
                )}

                {appState.currentView === 'orders' && appState.selectedClient && (
                  <OrderList
                    orders={getOrdersByClient(appState.selectedClient._id)}
                    onOrderSelect={handleOrderSelect}
                    language={appState.language}
                    globalSelectedItems={appState.globalSelectedItems}
                    onGlobalItemSelect={handleGlobalItemSelect}
                    onUpdateQuantity={handleUpdateQuantity}
                    onSendToBilling={handleSendMultipleOrdersToBilling}
                    client={appState.selectedClient}
                  />
                )}

                {appState.currentView === 'order-details' && appState.selectedOrder && (
                  <OrderDetails
                    order={appState.selectedOrder}
                    onUpdateOrder={handleUpdateOrder}
                    onUpdateQuantity={handleUpdateQuantity}
                    language={appState.language}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop / Tablet View - Split Layout */}
        <div className="hidden md:flex h-full">
          {/* Clipboard Panel - Sidebar */}
          <div className="w-80 lg:w-96 xl:w-[420px] border-r border-border flex-shrink-0 bg-muted/30">
            <div className="h-full flex flex-col">
              {/* Clipboard Header */}
              <div className="px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-2">
                  <Clipboard className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-base">Clipboard</h2>
                  {console.log("get all client order",getAllOrdersWithClients())}
                  {/* {getAllOrdersWithClients().length > 0 && (
                    <span className="ml-auto text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                      {getAllOrdersWithClients().length}
                    </span>
                  )} */}
                </div>
              </div>
              
              {/* Clipboard Content */}
              <div className="flex-1 overflow-y-auto">
                <ClipboardPanel allOrders={getAllOrdersWithClients()} />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden bg-background">
            <div className="h-full overflow-y-auto">
              {appState.currentView === 'clients' && (
                <ClientList
                  clients={clientData}
                  onClientSelect={handleClientSelect}
                  language={appState.language}
                />
              )}

              {appState.currentView === 'orders' && appState.selectedClient && (
                <OrderList
                  orders={getOrdersByClient(appState.selectedClient._id)}
                  onOrderSelect={handleOrderSelect}
                  language={appState.language}
                  globalSelectedItems={appState.globalSelectedItems}
                  onGlobalItemSelect={handleGlobalItemSelect}
                  onUpdateQuantity={handleUpdateQuantity}
                  onSendToBilling={handleSendMultipleOrdersToBilling}
                  client={appState.selectedClient}
                />
              )}

              {appState.currentView === 'order-details' && appState.selectedOrder && (
                <OrderDetails
                  order={appState.selectedOrder}
                  onUpdateOrder={handleUpdateOrder}
                  onUpdateQuantity={handleUpdateQuantity}
                  language={appState.language}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster 
        position="top-center" 
        richColors 
        closeButton 
        className="sm:bottom-0 sm:right-0"
      />
    </div>
  );
}