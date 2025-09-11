import { useState, useCallback, useMemo } from "react";
import { usePatients } from "../hooks/usePatients";
import { useDrawer } from "../hooks/useDrawer";
import { PatientDetailView } from "./PatientDetailView";
import { CreatePatient } from "./CreatePatient";
import { EditPatient } from "./EditPatient";
import { Button, ConfirmModal } from "./ui";
import { PaginatedPatientGrid } from "./PaginatedPatientGrid";
import type { Patient } from "../types";

export function PatientManager() {
  const { patients, isLoading, error, deletePatient, isDeleting } = usePatients();
  const { openDrawer } = useDrawer();
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; patientId?: string; patientName?: string }>({ isOpen: false });

  const sortedPatients = useMemo(() => {
    return patients?.sort((a, b) => {
      const dateToCheckA = new Date(a.updatedAt || a.createdAt);
      const dateToCheckB = new Date(b.updatedAt || b.createdAt);

      return dateToCheckB.getTime() - dateToCheckA.getTime();
    });
  }, [patients]);

  const handleEdit = useCallback((patient: Patient) => {
    openDrawer(<EditPatient patient={patient} />, {
      title: `Edit Patient - ${patient.name}`,
      size: "lg",
    });
  }, [openDrawer]);

  const handleView = useCallback((patient: Patient) => {
    openDrawer(<PatientDetailView patient={patient} />, {
      title: `Patient Details - ${patient.name}`,
      size: "lg",
    });
  }, [openDrawer]);

  const handleDelete = useCallback((patientId: string) => {
    const patient = sortedPatients.find(p => p.id === patientId);
    setDeleteModal({ isOpen: true, patientId, patientName: patient?.name });
  }, [sortedPatients]);

  const handleConfirmDelete = async () => {
    if (deleteModal.patientId) {
      try {
        await deletePatient(deleteModal.patientId);
        setDeleteModal({ isOpen: false });
      } catch (error) {
        console.error("Failed to delete patient:", error);
      }
    }
  };

  const handleAddPatient = useCallback(() => {
    openDrawer(<CreatePatient />, {
      title: "Add New Patient",
      size: "lg",
    });
  }, [openDrawer]);

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
      <div className="max-w-7xl mx-auto p-6 h-full flex flex-col">
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
        <div className="flex-1">
          <PaginatedPatientGrid
            patients={sortedPatients}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </div>

        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false })}
          onConfirm={handleConfirmDelete}
          title="Delete Patient"
          message={`Are you sure you want to delete ${deleteModal.patientName}? This action cannot be undone.`}
          confirmText="Delete"
          confirmVariant="danger"
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}