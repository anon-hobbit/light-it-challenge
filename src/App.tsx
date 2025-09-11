import "./App.css";
import { QueryProvider } from "./providers/query-provider";
import { DrawerProvider } from "./providers/drawer-provider";
import { AppDrawerContainer } from "./components/AppDrawerContainer";
import { PatientManager } from "./components/PatientManager";

function AppContent() {
  return (
    <div className="h-full">
      <PatientManager />
    </div>
  );
}

function App() {
  return (
    <QueryProvider>
      <DrawerProvider>
        <AppContent />
        <AppDrawerContainer />
      </DrawerProvider>
    </QueryProvider>
  );
}

export default App;
