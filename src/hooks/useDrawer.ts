import { useContext, type ReactNode } from 'react';
import { DrawerContext } from '../contexts/drawer-context';

export function useDrawer() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }

  const { state, dispatch } = context;

  const openDrawer = (
    content: ReactNode,
    options?: {
      title?: string;
      size?: 'sm' | 'md' | 'lg' | 'xl';
    }
  ) => {
    dispatch({
      type: 'OPEN_DRAWER',
      payload: {
        content,
        title: options?.title,
        size: options?.size,
      },
    });
  };

  const closeDrawer = () => {
    dispatch({ type: 'CLOSE_DRAWER' });
  };

  return {
    // State
    isOpen: state.isOpen,
    title: state.title,
    content: state.content,
    size: state.size,
    
    // Actions
    openDrawer,
    closeDrawer,
  };
}