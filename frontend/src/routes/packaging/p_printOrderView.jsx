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
                margin: 1cm;
                size: A4;
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
            * {
              box-sizing: border-box;
            }
            body {
              font-family: 'Arial', 'Helvetica', sans-serif;
              margin: 0;
              padding: 20px;
              color: #1a1a1a;
              background: #ffffff;
              line-height: 1.6;
            }
            .order-card {
              page-break-inside: avoid;
              margin-bottom: 40px;
              border: 3px solid #E5E7EB;
              padding: 25px;
              border-radius: 12px;
              background: #ffffff;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .order-header {
              border-bottom: 3px solid #e5e7eb;
              padding-bottom: 20px;
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
              align-items: start;
            }
            .party-info {
              flex: 1;
            }
            .party-name {
              font-size: 28px;
              font-weight: 900;
              color: #1a1a1a;
              margin-bottom: 8px;
              letter-spacing: -0.5px;
            }
            .party-city {
              font-size: 18px;
              color: #6b7280;
              margin-bottom: 4px;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .order-meta {
              font-size: 14px;
              color: #9ca3af;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .order-badge {
              background: #E5E7EB;
              color: black;
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 600;
              white-space: nowrap;
            }
            .items-section {
              margin-top: 20px;
            }
            .item {
              margin-bottom: 16px;
              padding: 18px;
              background: linear-gradient(to right, #f9fafb, #ffffff);
              border: 2px solid #e5e7eb;
              border-left: 4px solid #E5E7EB;
              border-radius: 8px;
              transition: all 0.2s;
            }
            .item:hover {
              border-left-color: #1d4ed8;
              box-shadow: 0 2px 6px rgba(37, 99, 235, 0.1);
            }
            .item-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
            }
            .item-name {
              font-size: 18px;
              font-weight: 700;
              color: #1a1a1a;
              flex: 1;
            }
            .item-quantity {
              font-size: 18px;
              font-weight: 700;
              color: black;
              background: #E5E7EB;
              padding: 4px 12px;
              border-radius: 6px;
              white-space: nowrap;
            }
            .item-instructions {
              margin-top: 12px;
              padding: 12px;
              background: #E5E7EB;
              border-left: 3px solid #E5E7EB;
              border-radius: 6px;
              font-size: 14px;
              line-height: 1.5;
            }
            .item-instructions strong {
              color: black;
              display: block;
              margin-bottom: 4px;
            }
            .order-footer {
              margin-top: 24px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }
            .footer-item {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 14px;
              color: #4b5563;
            }
            .footer-label {
              font-weight: 600;
              color: #1a1a1a;
            }
            .print-header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 3px solid #E5E7EB;
            }
            .print-title {
              font-size: 32px;
              font-weight: 900;
              color: #1a1a1a;
              margin-bottom: 8px;
            }
            .print-date {
              font-size: 14px;
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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
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
            <Button 
              onClick={handlePrint} 
              className="gap-2 h-9 sm:h-10 text-xs sm:text-sm touch-manipulation"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Print All Orders
            </Button>
          </div>
        </div>

        {/* Print Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div id="print-content" className="space-y-4 sm:space-y-6">
            {ordersWithClients.map(({ client, order }) => (
              <div
                key={order._id}
                className="order-card border-2 border-primary/20 rounded-lg p-4 sm:p-6 bg-card hover:shadow-lg transition-shadow duration-200"
              >
                {/* Order Header */}
                <div className="order-header border-b-2 border-border pb-4 mb-4">
                  <div className="party-info flex-1">
                    <h2 className="party-name text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {client.name}
                    </h2>
                    {client.city && (
                      <div className="party-city flex items-center gap-2 text-sm sm:text-base text-muted-foreground mb-1">
                        <MapPin className="w-4 h-4" />
                        {client.address}
                      </div>
                    )}
                    <div className="order-meta flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      Order #{order.order_id}
                    </div>
                  </div>
                  <Badge className="order-badge text-xs sm:text-sm px-3 py-1 mt-2 sm:mt-0">
                    Order #{order.order_id}
                  </Badge>
                </div>

                {/* Items Section */}
                <div className="items-section space-y-3 sm:space-y-4">
                  {order.items.map(item => (
                    <div
                      key={item.id}
                      className="item bg-gradient-to-r from-muted/50 to-background border-l-4 border-l-primary rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="item-header flex justify-between items-start gap-3">
                        <span className="item-name text-sm sm:text-base md:text-lg font-bold text-foreground flex-1">
                          {item.product_data.name}
                        </span>
                        <span className="item-quantity text-sm sm:text-base font-bold text-primary bg-primary/10 px-2.5 sm:px-3 py-1 rounded-md whitespace-nowrap">
                          Qty: {item.quantity}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                          {item.product_data.description}
                        </p>
                      )}

                      {item.instructions && (
                        <div className="item-instructions mt-3 p-2.5 sm:p-3 bg-yellow-50 dark:bg-yellow-950/20 border-l-3 border-l-yellow-500 rounded">
                          <p className="text-xs sm:text-sm">
                            <strong className="text-yellow-900 dark:text-yellow-200 block mb-1">
                              Instructions:
                            </strong>
                            <span className="text-yellow-800 dark:text-yellow-300">
                              {item.instructions}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <Separator className="my-4" />
                <div className="order-footer grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                  <div className="footer-item flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    <span className="footer-label font-semibold text-foreground">Total Items:</span>
                    <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="footer-item flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    <span className="footer-label font-semibold text-foreground">Order Date:</span>
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