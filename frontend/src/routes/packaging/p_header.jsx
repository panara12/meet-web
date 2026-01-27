import { ArrowLeft, LogOut } from 'lucide-react';
import logo from '../../assets/logo.png';
import { Button } from '../distributer/ui/button';

export function Header({ title, onBack, onLogout }) {

  return (
    <header className="flex items-center gap-2 sm:gap-3 md:gap-4 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 bg-card border-b border-border shrink-0 shadow-sm">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="p-1.5 sm:p-2 rounded-full hover:bg-accent active:bg-accent/80 transition-colors duration-200 flex-shrink-0 touch-manipulation"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
        </button>
      )}

      {/* Logo */}
      <div className="flex-shrink-0">
        <img
          src={logo}
          alt="Company Logo"
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-primary/20 shadow-sm"
        />
      </div>

      {/* Title */}
      <h1 className="flex-1 text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-foreground truncate min-w-0">
        {title}
      </h1>

      {/* Logout Button */}
      {onLogout && (
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="gap-1.5 sm:gap-2 h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4 text-xs sm:text-sm hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-200 flex-shrink-0 touch-manipulation"
        >
          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline font-medium">Logout</span>
        </Button>
      )}
    </header>
  );
}