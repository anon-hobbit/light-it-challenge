import { useMemo, memo } from "react";
import { Button, Avatar } from "./ui";
import type { Patient } from "../types";
import { AlertCircle, CheckCircle, Eye, Pencil, Trash } from "lucide-react";

interface PatientCardProps {
  patient: Patient;
  onView?: (patient: Patient) => void;
  onEdit?: (patient: Patient) => void;
  onDelete?: (patientId: string) => void;
  isDeleting?: boolean;
}

export const PatientCard = memo(function PatientCard({
  patient,
  onView,
  onEdit,
  onDelete,
  isDeleting,
}: PatientCardProps) {
  const isCompleted = useMemo(
    () => Object.values(patient).every(
      (value) => value !== null && value !== undefined
    ),
    [patient]
  );

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col">
      <div
        className={`flex items-center gap-1 absolute top-1 right-1 text-xs leading-0 p-1 rounded-3xl text-white ${isCompleted ? "bg-green-400" : "bg-red-400"}`}
      >
        {isCompleted ? (
          <CheckCircle className="w-2.5 h-2.5" />
        ) : (
          <AlertCircle className="w-2.5 h-2.5" />
        )}
        <span>{isCompleted ? "Completed" : "Not Completed"}</span>
      </div>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar user={{ name: patient.name }} size="md" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {patient.name}
            </h3>
            <p className="text-sm text-gray-500">
              {patient.updatedAt ? (
                <>
                  {`Last updated: ${new Date(patient.updatedAt).toLocaleDateString()}`}
                </>
              ) : (
                <>
                  {`Created: ${new Date(patient.createdAt).toLocaleDateString()}`}
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 line-clamp-2 grow">
        {patient.description}
      </p>

      {/* Actions */}
      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
        {onView && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(patient)}
            icon={Eye}
          />
        )}
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(patient)}
            icon={Pencil}
          />
        )}
        {onDelete && (
          <Button
            variant="danger"
            size="sm"
            icon={Trash}
            onClick={() => onDelete(patient.id)}
            disabled={isDeleting}
          />
        )}
      </div>
    </div>
  );
});
