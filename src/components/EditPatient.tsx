import { PatientForm } from './PatientForm';
import { usePatients } from '../hooks/usePatients';
import { useDrawer } from '../hooks/useDrawer';
import type { Patient } from '../types';

interface EditPatientProps {
  patient: Patient;
}

export function EditPatient({ patient }: EditPatientProps) {
  const { updatePatient, isUpdating } = usePatients();
  const { closeDrawer } = useDrawer();

  const handleSubmit = async (data: Patient) => {
    try {
      await updatePatient(patient.id, data);
      closeDrawer();
    } catch (error) {
      console.error('Failed to update patient:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    closeDrawer();
  };

  return (
    <PatientForm
      initialData={patient}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isUpdating}
    />
  );
}