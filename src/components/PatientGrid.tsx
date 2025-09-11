import { PatientCard } from "./PatientCard";
import type { Patient } from "../types";
import { CircleAlert } from "lucide-react";

interface PatientGridProps {
  patients: Patient[];
  onView?: (patient: Patient) => void;
  onEdit?: (patient: Patient) => void;
  onDelete?: (patientId: string) => void;
  isDeleting?: boolean;
}

export function PatientGrid({
  patients,
  onView,
  onEdit,
  onDelete,
  isDeleting,
}: PatientGridProps) {
  if (patients.length === 0) {
    return (
      <div className="text-center py-12 flex flex-col gap-3">
        <div className="flex items-center justify-center">
          <CircleAlert className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No patients found
        </h3>
        <p className="text-gray-500">
          Get started by adding your first patient.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {patients.map((patient, index) => (
        <div
          key={patient.id}
          className="fade-in"
          style={{ "--delay": `${index * 0.1}s` } as React.CSSProperties}
        >
          <PatientCard
            patient={patient}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        </div>
      ))}
    </div>
  );
}
