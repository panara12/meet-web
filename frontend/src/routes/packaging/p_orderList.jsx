import { Badge } from '../distributer/ui/badge';
import { Button } from '../distributer/ui/button';
import { Card } from '../distributer/ui/card';
import { Checkbox } from '../distributer/ui/checkbox';
import { Input } from '../distributer/ui/input';
import Separator from '../distributer/ui/separator';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  Minus, 
  Plus,
  ShoppingBag,
  DollarSign,
  FileText
} from 'lucide-react';
import { useTranslation } from './translations';
import { useState } from 'react';
import { CartoonCountDialog } from './p_cartoonCountDialog';
import { toast } from 'sonner';

export function OrderList({ 
  orders, 
  onOrderSelect, 
  language, 
  globalSelectedItems,
  onGlobalItemSelect, 
  onUpdateQuantity,
  onSendToBilling,
  client
}) {
  const { t } = useTranslation(language);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [showCartoonDialog, setShowCartoonDialog] = useState(false);
  console.log("orders",orders)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'processing':
        return <Settings className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      default:
        return <Package className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'destructive';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleItemToggle = (orderId, itemId, item) => {
    if (item.sentToBilling) return;
    
    const orderSelections = globalSelectedItems.get(orderId) || new Set();
    const isSelected = orderSelections.has(itemId);
    onGlobalItemSelect(orderId, itemId, !isSelected);
  };

  const handleQuantityUpdate = (order, itemId, newQuantity) => {
    console.log("handle quentity update called")
    const item = order.items.find(item => item.id === itemId);
    if (item?.sentToBilling || newQuantity < 1) return;
    
    const updatedItems = order.items.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity,subtotal: item.product_data.price * newQuantity } : item
    );
    console.log("updated items",updatedItems)
    
    onUpdateQuantity(order._id, updatedItems);
    toast.success(t('Quantity updated successfully'));
  };

  const handleQuantityChange = (order, itemId, delta) => {
    console.log("handle quentity changed called")
    const item = order.items.find(item => item.id === itemId);
    if (!item || item.sentToBilling) return;
    
    const newQuantity = Math.max(1, item.quantity + delta);
    console.log("new quantity",newQuantity)
    handleQuantityUpdate(order, itemId, newQuantity);
  };

  const handleQuantityInputChange = (order, itemId, value) => {
    const numericValue = parseInt(value) || 1;
    const clampedValue = Math.max(1, Math.min(999, numericValue));
    handleQuantityUpdate(order, itemId, clampedValue);
  };

  const handleSendToBillingClick = () => {
    if (totalSelectedItems > 0) {
      setShowCartoonDialog(true);
    }
  };

  const handleCartoonConfirm = (cartoonCount, billingDate) => {
    onSendToBilling(cartoonCount, billingDate);
    setShowCartoonDialog(false);
  };

  // Calculate total selected items across all orders
  let totalSelectedItems = 0;
  let totalSelectedAmount = 0;
  
  orders.forEach(order => {
    const orderSelections = globalSelectedItems.get(order._id);
    if (orderSelections) {
      order.items.forEach(item => {
        if (orderSelections.has(item.id) && !item.sentToBilling) {
          totalSelectedItems++;
          totalSelectedAmount += item.product_data.price * item.quantity;
        }
      });
    }
  });

  return (
    <>
      <div className="flex flex-col h-full bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Orders List */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4">
          <div className="space-y-2 sm:space-y-3">
            {orders.map((order) => {
              const isExpanded = expandedOrders.has(order._id);
              const orderSelections = globalSelectedItems.get(order._id) || new Set();
              const selectedItemsInOrder = Array.from(orderSelections).filter(itemId => {
                const item = order.items.find(i => i.id === itemId);
                return item && !item.sentToBilling;
              }).length;

              return (
                <Card 
                  key={order._id} 
                  className="overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  {/* Order Header */}
                  <div
                    onClick={() => toggleOrderExpansion(order._id)}
                    className="p-3 sm:p-4 cursor-pointer hover:bg-accent/50 transition-colors active:scale-[0.99] touch-manipulation"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Avatar Icon */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>

                      {/* Order Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground truncate">
                            {t('Order')} #{order.order_id}
                          </h3>
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                            {getStatusIcon(order.status)}
                            <span className="text-muted-foreground text-[10px] sm:text-xs whitespace-nowrap">
                              {order.date}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span>{order?.totalItems} {t('Items')}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span>${order?.totalAmount}</span>
                            </div>
                            {selectedItemsInOrder > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-primary font-semibold">
                                  {selectedItemsInOrder} {t('Selected')}
                                </span>
                              </>
                            )}
                          </div>
                          <Badge 
                            variant={getStatusColor(order.status)} 
                            className="text-[10px] sm:text-xs px-2 py-0.5 flex items-center gap-1"
                          >
                            {getStatusIcon(order.status)}
                            {t(order.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Order Items */}
                  {isExpanded && (
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
                      <Separator className="mb-3 sm:mb-4" />
                      <div className="space-y-2 sm:space-y-3">
                        {order.items.map((item) => {
                          const isSelected = orderSelections.has(item.id);
                          
                          return (
                            <Card 
                              key={item._id} 
                              className={`p-3 sm:p-4 transition-all duration-200 ${
                                item.sentToBilling 
                                  ? 'opacity-60 bg-muted/30' 
                                  : 'hover:shadow-md hover:border-primary/30'
                              } ${
                                isSelected && !item.sentToBilling
                                  ? 'border-primary bg-primary/5'
                                  : ''
                              }`}
                            >
                              <div className="flex items-start gap-3 sm:gap-4">
                                {/* Checkbox */}
                                <div className="flex-shrink-0 pt-1">
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => handleItemToggle(order._id, item.id, item)}
                                    disabled={item.sentToBilling}
                                    className="w-5 h-5 sm:w-6 sm:h-6"
                                  />
                                </div>

                                {/* Item Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                                    {/* Item Info */}
                                    <div className="flex-1 min-w-0">
                                      <h4 className={`text-sm sm:text-base font-semibold mb-1 ${
                                        item.sentToBilling ? 'text-muted-foreground line-through' : 'text-foreground'
                                      }`}>
                                        {item.product_data.name}
                                      </h4>
                                      {item.product_data.description && (
                                        <p className={`text-xs sm:text-sm mb-2 ${
                                          item.sentToBilling ? 'line-through text-muted-foreground' : 'text-muted-foreground'
                                        }`}>
                                          {item.product_data.description}
                                        </p>
                                      )}
                                    </div>

                                    {/* Price & Quantity */}
                                    <div className="flex-shrink-0 text-right">
                                      <div className={`text-sm sm:text-base font-semibold mb-2 ${
                                        item.sentToBilling ? 'text-muted-foreground' : 'text-foreground'
                                      }`}>
                                        ${item.product_data.price?.toFixed(2) || '0.00'}
                                      </div>
                                      
                                      {!item.sentToBilling ? (
                                        <div className="flex items-center gap-1 sm:gap-1.5 justify-end">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 touch-manipulation"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              console.log('Minus clicked for item:', item.id);
                                              handleQuantityChange(order, item.id, -1);
                                            }}
                                            disabled={item.quantity <= 1}
                                          >
                                            <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                          </Button>
                                          <Input
                                            type="number"
                                            min="1"
                                            max="999"
                                            value={item.quantity}
                                            onChange={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              handleQuantityInputChange(order, item.id, e.target.value);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-12 sm:w-14 h-7 sm:h-8 text-center text-xs sm:text-sm font-medium"
                                          />
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 touch-manipulation"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              console.log('Plus clicked for item:', item.id);
                                              handleQuantityChange(order, item.id, 1);
                                            }}
                                            disabled={item.quantity >= 999}
                                          >
                                            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                          </Button>
                                        </div>
                                      ) : (
                                        <div className="text-muted-foreground text-xs sm:text-sm">
                                          {t('Qty')}: {item.quantity}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Instructions */}
                                  {item.instructions && (
                                    <div className={`mt-3 p-2 sm:p-2.5 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-500 rounded ${
                                      item.sentToBilling ? 'opacity-60' : ''
                                    }`}>
                                      <p className={`text-xs sm:text-sm ${
                                        item.sentToBilling ? 'line-through' : ''
                                      }`}>
                                        <span className="font-semibold text-black">
                                          {t('Instructions')}: 
                                        </span>
                                        <span className="text-blue-800 ml-1">
                                          {item.instructions}
                                        </span>
                                      </p>
                                    </div>
                                  )}

                                  {/* Item Footer Badges */}
                                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                                    <Badge 
                                      variant="outline" 
                                      className={`text-[10px] sm:text-xs ${
                                        item.sentToBilling ? 'opacity-60' : ''
                                      }`}
                                    >
                                      ${((item.product_data.price || 0) * (item.quantity || 0)).toFixed(2)} {t('total')}
                                    </Badge>
                                    {item.sentToBilling && (
                                      <Badge variant="default" className="text-[10px] sm:text-xs">
                                        {t('Sent to Billing')}
                                      </Badge>
                                    )}
                                    {item.cartoonCount && (
                                      <Badge variant="secondary" className="text-[10px] sm:text-xs">
                                        {item.cartoonCount} cartoons
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Fixed Bottom Bar for Send to Billing */}
        {console.log("selected",totalSelectedItems)}
        {totalSelectedItems > 0 && (
          <div className="p-3 sm:p-4 md:p-5 bg-card border-t border-border shadow-lg shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4">
              <div className="space-y-1">
                <div className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  {t('Selected')} {t('Items')}: {totalSelectedItems}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                  <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {t('Total Amount')}: ${totalSelectedAmount.toFixed(2)}
                </div>
              </div>
              <Badge variant="secondary" className="text-xs sm:text-sm px-3 py-1.5 w-fit">
                <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5" />
                Ready for Billing
              </Badge>
            </div>
            <Button 
              onClick={handleSendToBillingClick} 
              className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base font-semibold gap-2 touch-manipulation"
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('Send to Billing')} ({totalSelectedItems})
            </Button>
          </div>
        )}
      </div>

      <CartoonCountDialog
        isOpen={showCartoonDialog}
        onClose={() => setShowCartoonDialog(false)}
        onConfirm={handleCartoonConfirm}
        selectedItemsCount={totalSelectedItems}
        language={language}
      />
    </>
  );
}