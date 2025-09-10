import { type ReactNode, useEffect } from 'react';
import { Button } from './Button';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
}


export function AppDrawer({ 
  isOpen, 
  onClose, 
  title, 
  size = 'md', 
  children 
}: AppDrawerProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // TODO: buscar una forma mejor de hacer esto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // TODO: buscar una forma mejor de hacer esto x2
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Para que las transiciones funcionen
  // el componente debe estar en el DOM todo el tiempo
  return (
    <>
      {/* Backdrop */}
      <button
        className={`
          fixed inset-0 bg-black/20 backdrop-blur-sm z-40 cursor-pointer
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
        aria-label="Close drawer"
      />
      
      {/* Drawer Content */}
      <div 
        className={`
          fixed top-0 right-0 h-full bg-white/95 backdrop-blur-md shadow-2xl border-l border-gray-200/50 z-50
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          ${size === 'sm' ? 'w-96' : 
            size === 'md' ? 'w-[28rem]' : 
            size === 'lg' ? 'w-[42rem]' : 'w-[56rem]'}
        `}
      >
        
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto h-full">
          {children}
        </div>
      </div>
    </>
  );
}