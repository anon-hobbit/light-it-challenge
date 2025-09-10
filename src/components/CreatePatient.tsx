import { PatientForm } from './PatientForm';
import { usePatients } from '../hooks/usePatients';
import { useDrawer } from '../hooks/useDrawer';
import type { Patient } from '../types';

export function CreatePatient() {
  const { createPatient, isCreating } = usePatients();
  const { closeDrawer } = useDrawer();

  const handleSubmit = async (data: Patient) => {
    try {
      await createPatient(data);
      closeDrawer();
    } catch (error) {
      console.error('Failed to create patient:', error);
      // Error handling is done by React Query
    }
  };

  const handleCancel = () => {
    closeDrawer();
  };

  return (
    <div className="h-full flex flex-col">
      <PatientForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isCreating}
      />
    </div>
  );
}