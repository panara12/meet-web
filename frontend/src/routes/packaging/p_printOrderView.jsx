import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '../distributer/ui/dialog';
import { Button } from '../distributer/ui/button';
import { Badge } from '../distributer/ui/badge';
import Separator  from '../distributer/ui/separator';
import { Printer, X, FileText, MapPin, Calendar, Package } from 'lucide-react';

export function PrintOrderView({
  isOpen,
  onClose,
  ordersWithClients,
  language
}) {
  const handlePrint = () => {
    const printContent = document.getElementById('print-content');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Orders</title>
          <style>
            @media print {
              @page {
                margin: 0.5cm;
                size: A4;
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: 'Arial', 'Helvetica', sans-serif;
              padding: 10px;
              color: #1a1a1a;
              background: #ffffff;
              line-height: 1.3;
              font-size: 11px;
            }
            .order-card {
              page-break-inside: avoid;
              margin-bottom: 15px;
              border: 1.5px solid #d1d5db;
              padding: 12px;
              border-radius: 6px;
              background: #ffffff;
            }
            .order-header {
              border-bottom: 1.5px solid #e5e7eb;
              padding-bottom: 8px;
              margin-bottom: 10px;
            }
            .company-name {
              font-size: 16px;
              font-weight: 800;
              color: #1a1a1a;
              margin-bottom: 3px;
              text-transform: uppercase;
            }
            .company-details {
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;
              gap: 8px;
              font-size: 10px;
              color: #6b7280;
            }
            .company-address {
              display: flex;
              align-items: center;
              gap: 4px;
            }
            .order-id {
              background: #f3f4f6;
              color: #374151;
              padding: 3px 8px;
              border-radius: 4px;
              font-weight: 600;
              font-size: 10px;
            }
            .items-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 8px;
              margin-top: 10px;
            }
            .item {
              padding: 8px;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-left: 2px solid #9ca3af;
              border-radius: 4px;
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              gap: 8px;
              margin-bottom: 4px;
            }
            .item-name {
              font-size: 11px;
              font-weight: 700;
              color: #1a1a1a;
              flex: 1;
              line-height: 1.3;
            }
            .item-quantity {
              font-size: 11px;
              font-weight: 700;
              color: #1f2937;
              background: #e5e7eb;
              padding: 2px 6px;
              border-radius: 3px;
              white-space: nowrap;
              flex-shrink: 0;
            }
            .item-instructions {
              margin-top: 4px;
              padding: 4px 6px;
              background: #fef3c7;
              border-left: 2px solid #f59e0b;
              border-radius: 3px;
              font-size: 9px;
              line-height: 1.3;
            }
            .item-instructions strong {
              color: #92400e;
              font-size: 9px;
            }
            .order-footer {
              margin-top: 8px;
              padding-top: 8px;
              border-top: 1px solid #e5e7eb;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 9px;
              color: #6b7280;
            }
            .footer-item {
              display: flex;
              align-items: center;
              gap: 4px;
            }
            .footer-label {
              font-weight: 600;
              color: #374151;
            }
            .print-header {
              text-align: center;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 2px solid #d1d5db;
            }
            .print-title {
              font-size: 20px;
              font-weight: 900;
              color: #1a1a1a;
              margin-bottom: 4px;
            }
            .print-date {
              font-size: 10px;
              color: #6b7280;
            }
            @media print {
              .no-print {
                display: none !important;
              }
              .order-card {
                box-shadow: none;
              }
            }
            /* Single column on small content */
            @media (max-width: 600px) {
              .items-grid {
                grid-template-columns: 1fr;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <div class="print-title">Package Orders</div>
            <div class="print-date">Printed: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
          </div>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    };
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-6 border-b shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 mb-1">
                <Printer className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                Print Preview
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Review {ordersWithClients.length} order{ordersWithClients.length !== 1 ? 's' : ''} before printing
              </DialogDescription>
            </div>
            {/* <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button> */}
          </div>
        </DialogHeader>

        {/* Action Bar */}
        <div className="px-4 sm:px-6 py-3 bg-muted/30 border-b shrink-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs sm:text-sm">
                <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                {ordersWithClients.length} Orders
              </Badge>
              <Badge variant="outline" className="text-xs sm:text-sm">
                {ordersWithClients.reduce((sum, { order }) => 
                  sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
                )} Items
              </Badge>
            </div>
            {/* <Button 
              onClick={handlePrint} 
              className="gap-2 h-9 sm:h-10 text-xs sm:text-sm touch-manipulation"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Print All Orders
            </Button> */}
          </div>
        </div>

        {/* Print Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div id="print-content" className="space-y-3 sm:space-y-4">
            {ordersWithClients.map(({ client, order }) => (
              <div
                key={order._id}
                className="order-card border border-primary/20 rounded-lg p-3 sm:p-4 bg-card hover:shadow-md transition-shadow duration-200"
              >
                {/* Order Header - Company Name */}
                <div className="order-header border-b border-border pb-2 sm:pb-3 mb-2 sm:mb-3">
                  <h2 className="company-name text-base sm:text-lg md:text-xl font-bold text-foreground uppercase mb-1">
                    {client.name}
                  </h2>
                  <div className="company-details flex justify-between items-center flex-wrap gap-2 text-xs text-muted-foreground">
                    {client.address && (
                      <div className="company-address flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{client.address}</span>
                      </div>
                    )}
                    <span className="order-id text-xs px-2 py-0.5 bg-muted rounded">
                      Order #{order.order_id}
                    </span>
                  </div>
                </div>

                {/* Items Grid - Side by Side */}
                <div className="items-grid grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {order.items.map(item => (
                    <div
                      key={item.id}
                      className="item bg-muted/30 border-l-2 border-l-primary rounded p-2 sm:p-3 hover:bg-muted/50 transition-colors duration-200"
                    >
                      <div className="item-row flex justify-between items-baseline gap-2">
                        <span className="item-name text-xs sm:text-sm font-bold text-foreground leading-tight">
                          {item.product_data.name} {item.size && `(${item.size})`}
                        </span>
                        <span className="item-quantity text-xs font-bold text-foreground bg-muted px-1.5 sm:px-2 py-0.5 rounded whitespace-nowrap">
                          {item.quantity}
                        </span>
                      </div>

                      {item.instructions && (
                        <div className="item-instructions mt-1.5 sm:mt-2 p-1.5 sm:p-2 bg-yellow-50 dark:bg-yellow-950/20 border-l-2 border-l-yellow-500 rounded">
                          <p className="text-[10px] sm:text-xs leading-tight">
                            <strong className="text-yellow-900 dark:text-yellow-200">
                              Note:
                            </strong>
                            <span className="text-yellow-800 dark:text-yellow-300 ml-1">
                              {item.instructions}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="order-footer flex justify-between items-center mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border text-[10px] sm:text-xs text-muted-foreground">
                  <div className="footer-item flex items-center gap-1">
                    <Package className="w-3 h-3 text-primary" />
                    <span className="footer-label font-semibold text-foreground">Total:</span>
                    <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                  </div>
                  <div className="footer-item flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span className="footer-label font-semibold text-foreground">Date:</span>
                    <span>{order.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t bg-muted/30 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Ready to print {ordersWithClients.length} order{ordersWithClients.length !== 1 ? 's' : ''}
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClose}
                className="h-8 sm:h-9 text-xs sm:text-sm"
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePrint}
                size="sm"
                className="gap-2 h-8 sm:h-9 text-xs sm:text-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}