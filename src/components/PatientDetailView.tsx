import { Avatar, Button } from "./ui";
import { Pencil, Trash2 } from "lucide-react";
import { usePatients } from "../hooks/usePatients";
import { useDrawer } from "../hooks/useDrawer";
import { EditPatient } from "./EditPatient";
import type { Patient } from "../types";

interface PatientDetailViewProps {
  patient: Patient;
}

export function PatientDetailView({ patient }: PatientDetailViewProps) {
  const { deletePatient, isDeleting } = usePatients();
  const { openDrawer, closeDrawer } = useDrawer();

  const handleEdit = () => {
    openDrawer(<EditPatient patient={patient} />, {
      title: `Edit Patient - ${patient.name}`,
      size: "lg",
    });
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this patient?")) {
      try {
        await deletePatient(patient.id);
        closeDrawer();
      } catch (error) {
        console.error("Failed to delete patient:", error);
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Avatar user={{ name: patient.name }} size="lg" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {patient.name}
            </h2>
            <p className="text-gray-500">
              {patient.updatedAt
                ? `Last updated: ${new Date(patient.updatedAt).toLocaleDateString()}`
                : `Created: ${new Date(patient.createdAt).toLocaleDateString()}`}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            icon={Pencil}
            onClick={handleEdit}
            disabled={isDeleting}
          />
          <Button
            size="sm"
            variant="danger"
            icon={Trash2}
            onClick={handleDelete}
            disabled={isDeleting}
          />
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Description
        </h3>
        <p className="text-gray-700 leading-relaxed">{patient.description}</p>
      </div>

      {/* Patient Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600">
                Patient ID
              </span>
              <p className="font-mono text-sm text-gray-900 bg-gray-50 px-2 py-1 rounded">
                {patient.id}
              </p>
            </div>

            {patient.birthDate && (
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Birth Date
                </span>
                <p className="text-gray-900">
                  {new Date(patient.birthDate).toLocaleDateString()}
                </p>
              </div>
            )}

            {patient.bloodType && (
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Blood Type
                </span>
                <p className="text-gray-900 font-semibold">
                  {patient.bloodType}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Information
          </h3>
          <div className="space-y-3">
            {patient.phone && (
              <div>
                <span className="text-sm font-medium text-gray-600">Phone</span>
                <p className="text-gray-900">{patient.phone}</p>
              </div>
            )}

            {patient.email && (
              <div>
                <span className="text-sm font-medium text-gray-600">Email</span>
                <p className="text-gray-900">{patient.email}</p>
              </div>
            )}

            {patient.insuranceNumber && (
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Insurance Number
                </span>
                <p className="text-gray-900">{patient.insuranceNumber}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          System Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Created At:</span>
            <p className="text-gray-900">
              {new Date(patient.createdAt).toLocaleString()}
            </p>
          </div>

          {patient.updatedAt && (
            <div>
              <span className="font-medium text-gray-600">Last Updated:</span>
              <p className="text-gray-900">
                {new Date(patient.updatedAt).toLocaleString()}
              </p>
            </div>
          )}

          <div>
            <span className="font-medium text-gray-600">Status:</span>
            <p className="text-gray-900">
              {patient.isDeleted ? (
                <span className="text-red-600 font-medium">Deleted</span>
              ) : (
                <span className="text-green-600 font-medium">Active</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
