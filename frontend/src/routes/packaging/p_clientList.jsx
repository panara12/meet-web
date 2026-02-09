import { Badge } from '../distributer/ui/badge';
import { User, Calendar, ShoppingBag } from 'lucide-react';

export function ClientList({ clients, onClientSelect, language }) {
  console.log("client lsit",clients)
  return (
    <div
      className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="space-y-2 sm:space-y-3">
        {clients.map((client) => (
          <div
            key={client._id}
            onClick={() => onClientSelect(client)}
            className="group relative bg-card hover:bg-accent/50 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 cursor-pointer overflow-hidden active:scale-[0.98] touch-manipulation"
          >
            {/* Hover Effect Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-primary/10 border-2 border-primary/20 group-hover:border-primary/40 group-hover:shadow-md transition-all duration-200 flex items-center justify-center">
                  <span className="text-sm sm:text-lg md:text-xl font-semibold text-primary">
                    {client.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                {client.pendingOrders > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-destructive rounded-full flex items-center justify-center border-2 border-background shadow-lg animate-pulse">
                    <span className="text-[10px] sm:text-xs font-bold text-destructive-foreground">
                      {client.pendingOrders}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200">
                    {client.name}
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="text-[10px] sm:text-xs whitespace-nowrap">
                      {client.lastOrder}
                    </span>
                  </div>
                </div>

                {/* Info Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-muted-foreground min-w-0 flex-1">
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                    <p className="text-xs sm:text-sm truncate">
                      {client.lastOrderPreview}
                    </p>
                  </div>

                  {client.pendingOrders > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="text-[10px] sm:text-xs px-2 py-0.5 flex-shrink-0 font-semibold shadow-sm"
                    >
                      {client.pendingOrders} Pending
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {clients.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 text-center px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-muted flex items-center justify-center mb-4 sm:mb-6">
            <User className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-muted-foreground" />
          </div>
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-1 sm:mb-2">
            No clients found
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-sm">
            Start by adding your first client to manage their orders
          </p>
        </div>
      )}
    </div>
  );
}