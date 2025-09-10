import "./App.css";
import { QueryProvider } from "./providers/query-provider";
import { DrawerProvider } from "./providers/drawer-provider";
import { usePatients } from "./hooks/usePatients";
import { useDrawer } from "./hooks/useDrawer";
import { PatientGrid } from "./components/PatientGrid";
import { PatientDetailView } from "./components/PatientDetailView";
import { CreatePatient } from "./components/CreatePatient";
import { Button } from "./components/ui";
import { AppDrawerContainer } from "./components/AppDrawerContainer";
import type { Patient } from "./types";

function AppContent() {
  const { patients, isLoading, error, deletePatient, isDeleting } =
    usePatients();
  const { openDrawer } = useDrawer();

  const handleEdit = (patient: Patient) => {
    console.log("Edit patient:", patient);
    // TODO: abrir drawer
  };

  const handleView = (patient: Patient) => {
    openDrawer(<PatientDetailView patient={patient} />, {
      title: `Patient Details - ${patient.name}`,
      size: "lg",
    });
  };

  const handleDelete = async (patientId: string) => {
    // TODO: modal custom aca
    if (confirm("Are you sure you want to delete this patient?")) {
      try {
        await deletePatient(patientId);
      } catch (error) {
        console.error("Failed to delete patient:", error);
      }
    }
  };

  const handleAddPatient = () => {
    openDrawer(
      <CreatePatient />,
      { 
        title: "Add New Patient",
        size: 'lg'
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-medium">Error loading patients</p>
            <p className="text-sm text-gray-600 mt-1">
              {error instanceof Error ? error.message : "Something went wrong"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Patient Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and view patient information
            </p>
          </div>
          <Button onClick={handleAddPatient} size="lg">
            Add Patient
          </Button>
        </div>

        {/* Patient Grid */}
        <PatientGrid
          patients={patients}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      </div>
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
