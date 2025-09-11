import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "../lib/api/patients";
import { queryKeys, queryKeyHelpers } from "../lib/query-keys";
import type { Patient } from "../types";

export function usePatients() {
  const queryClient = useQueryClient();

  const {
    data: patients,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.patients.lists(),
    queryFn: async () => {
      const result = await fetchPatients();
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: createPatient,
    onSuccess: (result) => {
      if (result.data) {
        // Add new patient to the list cache
        queryClient.setQueryData<Patient[]>(
          queryKeys.patients.lists(),
          (old) => [...(old || []), result.data as Patient]
        );
      }
    },
    onError: (error) => {
      console.error("Failed to create patient:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Patient> }) =>
      updatePatient(id, data),
    onSuccess: (result, variables) => {
      if (result.data) {
        // Update patient in list cache
        queryClient.setQueryData<Patient[]>(
          queryKeys.patients.lists(),
          (old) =>
            old?.map((p) => (p.id === variables.id ? result.data! : p)) || []
        );

        // Update individual patient cache if it exists
        queryClient.setQueryData(
          queryKeys.patients.detail(variables.id),
          result.data
        );
      }
    },
    onError: (error) => {
      console.error("Failed to update patient:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: (result, patientId) => {
      if (result.data) {
        // Remove patient from list cache
        queryClient.setQueryData<Patient[]>(
          queryKeys.patients.lists(),
          (old) => old?.filter((p) => p.id !== patientId) || []
        );

        // Remove individual patient cache
        queryKeyHelpers.removePatient(queryClient, patientId);
      }
    },
    onError: (error) => {
      console.error("Failed to delete patient:", error);
    },
  });

  return {
    patients: patients || [],
    isLoading,
    error,

    // Actions
    refetch,
    createPatient: createMutation.mutateAsync,
    updatePatient: (id: string, data: Partial<Patient>) =>
      updateMutation.mutateAsync({
        id,
        data: { ...data, updatedAt: new Date().toISOString() },
      }),
    deletePatient: deleteMutation.mutateAsync,

    // Mutaciones
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
