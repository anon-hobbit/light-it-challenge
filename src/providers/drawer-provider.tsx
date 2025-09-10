import { useReducer, type ReactNode } from 'react';
import { DrawerContext, drawerReducer, initialDrawerState } from '../contexts/drawer-context';

interface DrawerProviderProps {
  children: ReactNode;
}

export function DrawerProvider({ children }: DrawerProviderProps) {
  const [state, dispatch] = useReducer(drawerReducer, initialDrawerState);

  return (
    <DrawerContext.Provider value={{ state, dispatch }}>
      {children}
    </DrawerContext.Provider>
  );
}