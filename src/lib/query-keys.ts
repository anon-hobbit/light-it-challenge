import type { QueryClient } from '@tanstack/react-query';

/**
 * Centralized query key factory for ReactQuery
 * Provides structured, hierarchical query keys for better cache management
 */

export interface Patient {
  id: string;
  [key: string]: unknown;
}

export interface PatientFilters {
  status?: 'active' | 'inactive' | 'all';
  bloodType?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const queryKeys = {
  // Patient-related queries
  patients: {
    // Base key for all patient queries
    all: ['patients'] as const,
    
    // Patient lists
    lists: () => [...queryKeys.patients.all, 'list'] as const,
    list: (filters?: PatientFilters) => 
      [...queryKeys.patients.lists(), { filters }] as const,
    
    // Individual patient details
    details: () => [...queryKeys.patients.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.patients.details(), id] as const,
  },
} as const;

// Helper functions for query key management
export const queryKeyHelpers = {
  /**
   * Invalidate all patient queries
   */
  invalidateAllPatients: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });
  },
  
  /**
   * Remove specific patient from cache
   */
  removePatient: (queryClient: QueryClient, patientId: string) => {
    queryClient.removeQueries({ queryKey: queryKeys.patients.detail(patientId) });
  },
  
  /**
   * Update patient in all relevant caches
   */
  updatePatientInCache: (queryClient: QueryClient, patientId: string, updatedData: Partial<Patient>) => {
    // Update patient list cache
    queryClient.setQueryData<Patient[]>(queryKeys.patients.lists(), (oldData) => {
      if (!oldData) return [];
      return oldData.map(patient => 
        patient.id === patientId ? { ...patient, ...updatedData } : patient
      );
    });
    
    // Update individual patient cache if it exists
    queryClient.setQueryData<Patient>(queryKeys.patients.detail(patientId), (oldData) => {
      if (!oldData) return undefined;
      return { ...oldData, ...updatedData };
    });
  },
};