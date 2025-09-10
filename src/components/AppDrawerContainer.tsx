import { useDrawer } from '../hooks/useDrawer';
import { AppDrawer } from './ui/AppDrawer';


// Medio overkill? si no lo tengo, le cargo a App.tsx la logica de la drawer
// ver mas tarde.

export function AppDrawerContainer() {
  const { isOpen, title, content, size, closeDrawer } = useDrawer();

  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={closeDrawer}
      title={title}
      size={size}
    >
      {content}
    </AppDrawer>
  );
}