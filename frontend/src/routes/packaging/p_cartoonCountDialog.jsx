import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '../distributer/ui/dialog';
import { Button } from '../distributer/ui/button';
import { Input } from '../distributer/ui/input';
import { Label } from '../distributer/ui/label';
import { Badge } from '../distributer/ui/badge';
import { useTranslation } from './translations';
import { Package, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

export function CartoonCountDialog({
  isOpen,
  onClose,
  onConfirm,
  selectedItemsCount,
  language
}) {
  const [cartoonCount, setCartoonCount] = useState('');
  const [billingDate, setBillingDate] = useState('');
  const { t } = useTranslation(language);

  const handleConfirm = () => {
    const count = parseInt(cartoonCount, 10);
    if (count > 0 && billingDate) {
      onConfirm(count, billingDate);
      setCartoonCount('');
      setBillingDate('');
      onClose();
    }
  };

  const handleCancel = () => {
    setCartoonCount('');
    setBillingDate('');
    onClose();
  };

  const isValid = cartoonCount && parseInt(cartoonCount, 10) > 0 && billingDate;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-[90vw] max-w-md mx-auto p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1">
                {t('Send to Billing')}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                Configure billing details for this batch
              </DialogDescription>
            </div>
          </div>
          
          {/* Selected Items Badge */}
          <Badge variant="secondary" className="w-fit text-xs sm:text-sm px-3 py-1.5">
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5" />
            {selectedItemsCount} {t('Items')} Selected
          </Badge>
        </DialogHeader>

        {/* Form Content */}
        <div className="px-4 sm:px-6 py-4 space-y-4 sm:space-y-5">
          {/* Cartoon Count Input */}
          <div className="space-y-2">
            <Label 
              htmlFor="cartoonCount" 
              className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2"
            >
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              {t('Cartoon Count')}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cartoonCount"
              type="number"
              min="1"
              max="9999"
              value={cartoonCount}
              onChange={(e) => setCartoonCount(e.target.value)}
              placeholder={t('Enter cartoon count')}
              className="h-10 sm:h-11 text-sm sm:text-base"
            />
            {cartoonCount && parseInt(cartoonCount, 10) <= 0 && (
              <div className="flex items-center gap-1.5 text-destructive text-xs">
                <AlertCircle className="w-3 h-3" />
                <span>Count must be greater than 0</span>
              </div>
            )}
          </div>

          {/* Billing Date Input */}
          <div className="space-y-2">
            <Label 
              htmlFor="billingDate" 
              className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              {t('Billing Date')}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="billingDate"
              type="date"
              value={billingDate}
              onChange={(e) => setBillingDate(e.target.value)}
              placeholder={t('Select billing date')}
              className="h-10 sm:h-11 text-sm sm:text-base"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Info Box */}
          <div className="p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-primary space-y-1">
                <p className="font-semibold">Important:</p>
                <p className="text-primary/80">
                  These items will be marked as sent to billing and cannot be modified afterwards.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 sm:p-6 pt-3 sm:pt-4 border-t bg-muted/30 flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm order-2 sm:order-1 touch-manipulation"
          >
            {t('Cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isValid}
            className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm order-1 sm:order-2 gap-2 touch-manipulation"
          >
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {t('Confirm')} & Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}