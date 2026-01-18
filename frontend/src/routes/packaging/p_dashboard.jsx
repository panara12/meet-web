import { useState } from 'react';
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

export default function Dashboard() {
  const [appState, setAppState] = useState({
    currentView: 'clients',
    selectedClient: null,
    selectedOrder: null,
    language: 'en',
    globalSelectedItems: new Map()
  });

  const [orders, setOrders] = useState(mockOrders);
  const [mobileTab, setMobileTab] = useState('main');

  const getAllOrdersWithClients = () => {
    const allOrders = [];

    mockClients.forEach(client => {
      const clientOrders = orders[client.id] || [];
      clientOrders.forEach(order => {
        allOrders.push({ client, order });
      });
    });

    return allOrders;
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
      newStatus = 'processing';
    }

    const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const clientOrders = orders[appState.selectedClient.id] || [];
    const updatedOrders = clientOrders.map(order =>
      order.id === orderId
        ? {
            ...order,
            items: updatedItems,
            status: newStatus,
            totalItems,
            totalAmount
          }
        : order
    );

    setOrders({
      ...orders,
      [appState.selectedClient.id]: updatedOrders
    });

    const updatedOrder = updatedOrders.find(order => order.id === orderId);
    if (updatedOrder) {
      setAppState({
        ...appState,
        selectedOrder: updatedOrder
      });
    }
  };

  const handleUpdateQuantity = (orderId, updatedItems) => {
    if (!appState.selectedClient) return;

    const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const clientOrders = orders[appState.selectedClient.id] || [];
    const updatedOrders = clientOrders.map(order =>
      order.id === orderId
        ? {
            ...order,
            items: updatedItems,
            totalItems,
            totalAmount
          }
        : order
    );

    setOrders({
      ...orders,
      [appState.selectedClient.id]: updatedOrders
    });

    const updatedOrder = updatedOrders.find(order => order.id === orderId);
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

  const handleSendMultipleOrdersToBilling = (cartoonCount, billingDate) => {
    if (!appState.selectedClient) return;

    const clientOrders = orders[appState.selectedClient.id] || [];
    let totalItemsSent = 0;

    const updatedOrders = clientOrders.map(order => {
      const selectedItems = appState.globalSelectedItems.get(order.id);
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
        newStatus = 'processing';
      }

      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        ...order,
        items: updatedItems,
        status: newStatus,
        totalItems,
        totalAmount
      };
    });

    setOrders({
      ...orders,
      [appState.selectedClient.id]: updatedOrders
    });

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

    setOrders(mockOrders);
    toast.success('Logged out successfully');
  };

  const { t } = useTranslation(appState.language);

  const getHeaderTitle = () => {
    switch (appState.currentView) {
      case 'clients':
        return 'Package Manager';
      case 'orders':
        return appState.selectedClient?.name || 'Orders';
      case 'order-details':
        return `Order #${appState.selectedOrder?.orderNumber || ''}`;
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
                    clients={mockClients}
                    onClientSelect={handleClientSelect}
                    language={appState.language}
                  />
                )}

                {appState.currentView === 'orders' && appState.selectedClient && (
                  <OrderList
                    orders={orders[appState.selectedClient.id] || []}
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
                  {getAllOrdersWithClients().length > 0 && (
                    <span className="ml-auto text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                      {getAllOrdersWithClients().length}
                    </span>
                  )}
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
                  clients={mockClients}
                  onClientSelect={handleClientSelect}
                  language={appState.language}
                />
              )}

              {appState.currentView === 'orders' && appState.selectedClient && (
                <OrderList
                  orders={orders[appState.selectedClient.id] || []}
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