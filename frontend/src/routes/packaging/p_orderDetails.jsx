import { useState } from 'react';
import { Button } from '../distributer/ui/button';
import { Checkbox } from '../distributer/ui/checkbox';
import { Badge } from '../distributer/ui/badge';
import  Separator  from '../distributer/ui/separator';
import { Card } from '../distributer/ui/card';
import { Input } from '../distributer/ui/input';
import { CartoonCountDialog } from './p_cartoonCountDialog';
import { useTranslation } from './translations';
import { toast } from 'sonner';
import { 
  Minus, 
  Plus, 
  Package, 
  Calendar, 
  CheckCircle2, 
  Clock,
  Settings,
  ShoppingBag, 
  IndianRupeeIcon
} from 'lucide-react';

export function OrderDetails({ order, onUpdateOrder, onUpdateQuantity, language }) {
  const { t } = useTranslation(language);

  const [selectedItems, setSelectedItems] = useState(
    new Set(order.items.filter(item => item.sentToBilling).map(item => item.id))
  );
  const [showCartoonDialog, setShowCartoonDialog] = useState(false);

  const handleItemToggle = (itemId) => {
    const item = order.items.find(item => item.id === itemId);
    if (item?.sentToBilling) return;

    const newSelected = new Set(selectedItems);
    newSelected.has(itemId) ? newSelected.delete(itemId) : newSelected.add(itemId);
    setSelectedItems(newSelected);
  };

  const handleQuantityUpdate = (itemId, newQuantity) => {
    const item = order.items.find(item => item.id === itemId);
    if (item?.sentToBilling || newQuantity < 1) return;
    // console.log(`Updating quantity for item ${itemId} to ${newQuantity}`);

    const updatedItems = order.items.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    if (onUpdateQuantity) {
      // console.log("called update ")
      onUpdateQuantity(order._id, updatedItems);
      toast.success(t('Quantity updated successfully'));
    }
  };

  const handleQuantityChange = (itemId, delta) => {
    const item = order.items.find(item => item.id === itemId);
    if (!item || item.sentToBilling) return;
    // console.log(`Changing quantity for item ${itemId} by ${delta}`);
    handleQuantityUpdate(itemId, Math.max(1, Number(item.quantity) + delta));
  };

  const handleQuantityInputChange = (itemId, value) => {
    const numericValue = parseInt(value, 10) || 1;
    handleQuantityUpdate(itemId, Math.max(1, Math.min(999, numericValue)));
  };

  const availableItemsCount = order.items.filter(i => !i.sentToBilling).length;
  const newlySelectedCount = [...selectedItems].filter(id => {
    const item = order.items.find(i => i.id === id);
    return item && !item.sentToBilling;
  }).length;

  const handleSendToBilling = () => {
    if (newlySelectedCount > 0) setShowCartoonDialog(true);
  };

  const handleCartoonConfirm = (cartoonCount, billingDate) => {
    const updatedItems = order.items.map(item => ({
      ...item,
      sentToBilling: item.sentToBilling || selectedItems.has(item.id),
      cartoonCount:
        selectedItems.has(item.id) && !item.sentToBilling
          ? cartoonCount
          : item.cartoonCount,
      billingDate:
        selectedItems.has(item.id) && !item.sentToBilling
          ? billingDate
          : item.billingDate
    }));

    onUpdateOrder(order._id, updatedItems, cartoonCount);

    toast.success(
      `${newlySelectedCount} ${t('Items')} sent to Dispatch department with ${cartoonCount} cartoons on ${billingDate}`
    );
  };

  const handleSelectAll = () => {
    const ids = order.items.filter(i => !i.sentToBilling).map(i => i.id);
    setSelectedItems(new Set([...selectedItems, ...ids]));
  };

  const handleSelectNone = () => {
    const sentIds = order.items.filter(i => i.sentToBilling).map(i => i.id);
    setSelectedItems(new Set(sentIds));
  };

  const getOrderStatusVariant = () => {
    switch (order.status) {
      case 'pending':
        return 'destructive';
      case 'processing':
        return 'secondary';
      case 'completed':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = () => {
    switch (order.status) {
      case 'pending':
        return <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case 'processing':
        return <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      default:
        return <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <div className="p-3 sm:p-4 md:p-5 bg-card border-b border-border shrink-0">
        {/* Order Info */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1">
              {t('Order')} #{order.order_id}
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{order.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{order.totalItems} {t('Items')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span><IndianRupeeIcon />{order.totalAmount?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
          <Badge 
            variant={getOrderStatusVariant()} 
            className="text-xs sm:text-sm px-3 py-1 flex items-center gap-1.5 w-fit"
          >
            {getStatusIcon()}
            {t(order.status)}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleSelectAll} 
            size="sm" 
            variant="outline" 
            disabled={availableItemsCount === 0}
            className="flex-1 text-xs sm:text-sm h-8 sm:h-9 touch-manipulation"
          >
            {t('Select All')}
          </Button>
          <Button 
            onClick={handleSelectNone} 
            size="sm" 
            variant="outline" 
            disabled={newlySelectedCount === 0}
            className="flex-1 text-xs sm:text-sm h-8 sm:h-9 touch-manipulation"
          >
            {t('Select None')}
          </Button>
        </div>

        {/* Selection Stats */}
        {newlySelectedCount > 0 && (
          <div className="mt-3 p-2 sm:p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-xs sm:text-sm text-primary font-medium">
              {newlySelectedCount} {t('Items')} selected for Dispatch
            </p>
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4">
        <div className="space-y-2 sm:space-y-3">
          {order.items.map(item => (
            <Card 
              key={item._id} 
              className={`p-3 sm:p-4 transition-all duration-200 ${
                item.sentToBilling 
                  ? 'opacity-60 bg-muted/30' 
                  : 'hover:shadow-md hover:border-primary/30'
              } ${
                selectedItems.has(item.id) && !item.sentToBilling
                  ? 'border-primary bg-primary/5'
                  : ''
              }`}
            >
              <div className="flex gap-3 sm:gap-4">
                {/* Checkbox */}
                <div className="flex-shrink-0 pt-1">
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onCheckedChange={() => handleItemToggle(item.id)}
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
                        item.sentToBilling ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}>
                        {item.product_data.name}
                      </h4>
                      {item.description && (
                        <p className={`text-xs sm:text-sm mb-2 ${
                          item.sentToBilling ? 'line-through text-muted-foreground' : 'text-muted-foreground'
                        }`}>
                          {item.product_data.description}
                        </p>
                      )}
                      {item.instructions && (
                        <div className={`mt-2 p-2 sm:p-2.5 bg-accent rounded-lg ${
                          item.sentToBilling ? 'opacity-60' : ''
                        }`}>
                          <p className={`text-xs sm:text-sm ${
                            item.sentToBilling ? 'line-through' : ''
                          }`}>
                            <span className="font-semibold">{t('Instructions')}: </span>
                            {item.instructions}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Price & Quantity */}
                    <div className="flex-shrink-0 text-right">
                      <div className={`text-sm sm:text-base font-semibold mb-2 ${
                        item.sentToBilling ? 'text-muted-foreground' : 'text-foreground'
                      }`}>
                        ${ item.price ||'0.00'}
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
                              // console.log('Minus clicked for item:', item.id);
                              handleQuantityChange(item.id, -1);
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
                            onChange={e => handleQuantityInputChange(item.id, e.target.value)}
                            className="w-12 sm:w-14 h-7 sm:h-8 text-center text-xs sm:text-sm font-medium"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 touch-manipulation"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // console.log('Plus clicked for item:', item.id);
                              handleQuantityChange(item.id, 1);
                            }}
                            disabled={item.quantity >= 999}
                          >
                            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {t('Qty')}: {item.quantity}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Item Footer */}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <Badge variant="outline" className="text-[10px] sm:text-xs">
                      ${((item.price || 0) * (item.quantity || 0)).toFixed(2)} {t('total')}
                    </Badge>
                    {item.sentToBilling && (
                      <Badge variant="default" className="text-[10px] sm:text-xs">
                        {t('Sent to Billing')}
                      </Badge>
                    )}
                    {item.billingDate && (
                      <Badge variant="secondary" className="text-[10px] sm:text-xs">
                        {item.billingDate} date
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer - Send to Billing */}
      <div className="p-3 sm:p-4 md:p-5 border-t border-border bg-card shrink-0">
        <Separator className="mb-3 sm:mb-4" />
        <Button 
          onClick={handleSendToBilling} 
          disabled={newlySelectedCount === 0} 
          className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base font-semibold touch-manipulation"
        >
          {t('Dispatch')} ({newlySelectedCount})
        </Button>
      </div>

      {/* Cartoon Count Dialog */}
      <CartoonCountDialog
        isOpen={showCartoonDialog}
        onClose={() => setShowCartoonDialog(false)}
        onConfirm={handleCartoonConfirm}
        selectedItemsCount={newlySelectedCount}
        language={language}
      />
    </div>
  );
}