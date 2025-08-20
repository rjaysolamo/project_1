import { ReactNode } from 'react';

interface ResponsiveLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function ResponsiveLayout({ 
  children, 
  sidebar, 
  header, 
  footer, 
  className = '' 
}: ResponsiveLayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Mobile-first responsive container */}
      <div className="flex flex-col lg:flex-row h-screen">
        
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        {sidebar && (
          <aside className="hidden lg:flex lg:flex-col lg:w-80 bg-white border-r border-gray-200 shadow-sm">
            <div className="flex-1 overflow-y-auto">
              {sidebar}
            </div>
          </aside>
        )}

        {/* Main content area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          {header && (
            <header className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 lg:px-6 lg:py-4">
              {header}
            </header>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </div>

          {/* Footer */}
          {footer && (
            <footer className="bg-white border-t border-gray-200 px-4 py-3 lg:px-6 lg:py-4">
              {footer}
            </footer>
          )}
        </main>
      </div>

      {/* Mobile sidebar overlay - Only visible when sidebar is open on mobile */}
      {sidebar && (
        <div className="lg:hidden">
          {/* This would be controlled by mobile menu state */}
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 hidden" id="mobile-sidebar-overlay">
            <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl transform -translate-x-full transition-transform duration-300 ease-in-out" id="mobile-sidebar">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                  <button 
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    onClick={() => {
                      const overlay = document.getElementById('mobile-sidebar-overlay');
                      const sidebar = document.getElementById('mobile-sidebar');
                      if (overlay && sidebar) {
                        overlay.classList.add('hidden');
                        sidebar.classList.add('-translate-x-full');
                      }
                    }}
                  >
                    <span className="text-gray-600">✕</span>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {sidebar}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mobile menu toggle function
export const toggleMobileSidebar = () => {
  const overlay = document.getElementById('mobile-sidebar-overlay');
  const sidebar = document.getElementById('mobile-sidebar');
  
  if (overlay && sidebar) {
    const isHidden = overlay.classList.contains('hidden');
    
    if (isHidden) {
      overlay.classList.remove('hidden');
      setTimeout(() => {
        sidebar.classList.remove('-translate-x-full');
      }, 10);
    } else {
      sidebar.classList.add('-translate-x-full');
      setTimeout(() => {
        overlay.classList.add('hidden');
      }, 300);
    }
  }
};

// Mobile-friendly component wrapper
interface MobileCardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export function MobileCard({ 
  children, 
  title, 
  className = '', 
  padding = 'md' 
}: MobileCardProps) {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4 lg:p-6',
    lg: 'p-6 lg:p-8'
  };

  return (
    <div className={`bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-100 ${paddingClasses[padding]} ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
}

// Mobile-optimized button component
interface MobileButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export function MobileButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  disabled = false,
  className = '' 
}: MobileButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 focus:ring-blue-500 shadow-sm',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm lg:px-6 lg:py-3',
    lg: 'px-6 py-3 text-base lg:px-8 lg:py-4'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-[1.02] active:scale-[0.98]';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
}

// Mobile-optimized input component
interface MobileInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function MobileInput({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  type = 'text', 
  required = false, 
  disabled = false,
  className = '' 
}: MobileInputProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full px-3 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base lg:text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}