import { useState, useEffect } from 'react';
import { Card } from '../distributer/ui/card';
import { Button } from '../distributer/ui/button';
import { Checkbox } from '../distributer/ui/checkbox';
import { Badge } from '../distributer/ui/badge';
import { Printer, Clipboard, Package, MapPin, Calendar, FileText } from 'lucide-react';
import { PrintOrderView } from './p_printOrderView';

// Filter out items that have been sent to billing
const filterPendingItems = (items) => {
  return items.filter(item => !item.sentToBilling);
};

// Filter out orders that have all items sent to billing
const filterPendingOrders = (ordersWithClients) => {
  return ordersWithClients
    .map(({ client, order }) => ({
      client,
      order: {
        ...order,
        items: filterPendingItems(order.items)
      }
    }))
    .filter(({ order }) => order.items.length > 0);
};

// Group orders by client and merge items
const groupOrdersByClient = (ordersWithClients) => {
  const clientMap = new Map();

  ordersWithClients.forEach(({ client, order }) => {
    if (!clientMap.has(client._id)) {
      clientMap.set(client._id, {
        client,
        orders: [],
        allItems: [],
        orderNumbers: [],
        totalQuantity: 0,
        earliestDate: order.date
      });
    }

    const merged = clientMap.get(client._id);
    merged.orders.push(order);
    merged.allItems.push(...order.items);
    merged.orderNumbers.push(order.order_id);
    merged.totalQuantity += order.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    if (new Date(order.date) < new Date(merged.earliestDate)) {
      merged.earliestDate = order.date;
    }
  }); 

  return Array.from(clientMap.values());
};

export function ClipboardPanel({ allOrders }) {
  const [selectedClientIds, setSelectedClientIds] = useState(new Set());
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  const pendingOrders = filterPendingOrders(allOrders);
  const mergedClientOrders = groupOrdersByClient(pendingOrders);
  console.log("mergedClientOrders",mergedClientOrders)

  // Clear selections if clients no longer have pending orders
  useEffect(() => {
    const pendingClientIds = new Set(
      mergedClientOrders.map(merged => merged.client._id)
    );

    const currentSelectedIds = new Set(
      Array.from(selectedClientIds).filter(id =>
        pendingClientIds.has(id)
      )
    );

    if (currentSelectedIds.size !== selectedClientIds.size) {
      setSelectedClientIds(currentSelectedIds);
    }
  }, [mergedClientOrders.length, selectedClientIds]);

  const handleSelectClient = (clientId, checked) => {
    const newSelected = new Set(selectedClientIds);
    if (checked) {
      newSelected.add(clientId);
    } else {
      newSelected.delete(clientId);
    }
    setSelectedClientIds(newSelected);
  };

  const handlePrint = () => {
    if (selectedClientIds.size === 0) return;
    setShowPrintDialog(true);
  };

  const handlePrintAll = () => {
    if (mergedClientOrders.length === 0) return;
    const allClientIds = new Set(
      mergedClientOrders.map(merged => merged.client._id)
    );
    setSelectedClientIds(allClientIds);
    setShowPrintDialog(true);
  };

  const handlePrintClose = () => {
    setShowPrintDialog(false);
    setSelectedClientIds(new Set());
  };

  const selectedOrdersWithClients = pendingOrders.filter(({ client }) =>
    selectedClientIds.has(client._id)
  );

  return (
    <>
      <div className="h-full flex flex-col bg-background">
        {/* Header Section */}
        <div className="p-3 sm:p-4 md:p-5 border-b border-border bg-card shrink-0">
          {/* Title */}
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clipboard className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
                Order Clipboard
              </h2>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                All pending orders from all clients
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Badge variant="secondary" className="text-[10px] sm:text-xs">
              <Package className="w-3 h-3 mr-1" />
              {mergedClientOrders.length} Clients
            </Badge>
            <Badge variant="outline" className="text-[10px] sm:text-xs">
              {selectedClientIds.size} Selected
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handlePrint}
              disabled={selectedClientIds.size === 0}
              className="w-full flex items-center justify-center gap-2 h-9 sm:h-10 text-xs sm:text-sm touch-manipulation"
              size="sm"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Print Selected ({selectedClientIds.size})</span>
            </Button>
            <Button
              onClick={handlePrintAll}
              disabled={mergedClientOrders.length === 0}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-9 sm:h-10 text-xs sm:text-sm hover:bg-primary/5 touch-manipulation"
              size="sm"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Print All ({mergedClientOrders.length})</span>
            </Button>
          </div>
        </div>

        {/* Order Cards List */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4">
          {mergedClientOrders.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <Package className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
                No Pending Orders
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
                All items have been sent to billing department
              </p>
            </div>
          ) : (
            /* Order Cards */
            <div className="space-y-2 sm:space-y-3">
              {mergedClientOrders.map(merged => (
                <Card
                  key={merged.client._id}
                  className={`p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/50 active:scale-[0.99] touch-manipulation ${
                    selectedClientIds.has(merged.client._id)
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-card'
                  }`}
                  onClick={() =>
                    handleSelectClient(
                      merged.client._id,
                      !selectedClientIds.has(merged.client._id)
                    )
                  }
                >
                  <div className="flex gap-3 sm:gap-4">
                    {/* Checkbox */}
                    <div className="flex-shrink-0 pt-1">
                      <Checkbox
                        checked={selectedClientIds.has(merged.client._id)}
                        onCheckedChange={(checked) =>
                          handleSelectClient(merged.client._id, Boolean(checked))
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 sm:w-6 sm:h-6"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Client Header */}
                      <div className="mb-2 sm:mb-3">
                        <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                          {merged.client.name}
                        </h3>
                        {merged.client.address && (
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                              {merged.client.address}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          <FileText className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            Orders #{merged?.orders?.map((order)=>order.order_id).join(', #')}
                          </p>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2">
                        {merged.allItems.map(item => (
                          <div 
                            key={item.id} 
                            className="bg-muted/50 hover:bg-muted/70 rounded-md p-2 sm:p-2.5 transition-colors"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-xs sm:text-sm font-medium text-foreground flex-1 min-w-0">
                                {item.product_data.name} {item.size && `(${item.size})`}
                              </span>
                              <Badge variant="secondary" className="text-[10px] sm:text-xs flex-shrink-0">
                                Qty: {item.quantity}
                              </Badge>
                            </div>
                            {item.instructions && (
                              <div className="mt-2 pt-2 border-t border-border/50">
                                <p className="text-[10px] sm:text-xs text-muted-foreground">
                                  <span className="font-semibold text-foreground">Instructions: </span>
                                  {item.instructions || "not added"}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Footer Stats */}
                      <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Package className="w-3 h-3 flex-shrink-0" />
                          <span className="text-[10px] sm:text-xs font-medium">
                            {merged.totalQuantity} Total Items
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span className="text-[10px] sm:text-xs">
                            {merged.earliestDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Print Dialog */}
      {selectedOrdersWithClients.length > 0 && (
        <PrintOrderView
          isOpen={showPrintDialog}
          onClose={handlePrintClose}
          ordersWithClients={selectedOrdersWithClients}
          language="en"
        />
      )}
    </>
  );
}