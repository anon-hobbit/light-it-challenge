import { createContext, type ReactNode } from 'react';

export interface DrawerState {
  isOpen: boolean;
  title?: string;
  content?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export type DrawerAction =
  | { type: 'OPEN_DRAWER'; payload: { title?: string; content: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' } }
  | { type: 'CLOSE_DRAWER' };

export const initialDrawerState: DrawerState = {
  isOpen: false,
  title: undefined,
  content: undefined,
  size: 'md',
};

export function drawerReducer(state: DrawerState, action: DrawerAction): DrawerState {
  switch (action.type) {
    case 'OPEN_DRAWER':
      return {
        ...state,
        isOpen: true,
        title: action.payload.title,
        content: action.payload.content,
        size: action.payload.size || 'md',
      };
    
    case 'CLOSE_DRAWER':
      return {
        ...state,
        isOpen: false,
        title: undefined,
        content: undefined,
      };
    
    default:
      return state;
  }
}

export interface DrawerContextType {
  state: DrawerState;
  dispatch: React.Dispatch<DrawerAction>;
}

export const DrawerContext = createContext<DrawerContextType | null>(null);