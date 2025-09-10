import { useState, useMemo } from 'react';
import { PatientGrid } from './PatientGrid';
import { Pagination } from './ui';
import type { Patient } from '../types';

interface PaginatedPatientGridProps {
  patients: Patient[];
  onView?: (patient: Patient) => void;
  onEdit?: (patient: Patient) => void;
  onDelete?: (patientId: string) => void;
  isDeleting?: boolean;
  itemsPerPage?: number;
}

export function PaginatedPatientGrid({
  patients,
  onView,
  onEdit,
  onDelete,
  isDeleting,
  itemsPerPage = 12,
}: PaginatedPatientGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const { paginatedPatients, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = patients.slice(startIndex, endIndex);
    const totalPagesCount = Math.ceil(patients.length / itemsPerPage);

    return {
      paginatedPatients: paginatedData,
      totalPages: totalPagesCount,
    };
  }, [patients, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when patients array changes significantly
  useMemo(() => {
    const maxPossiblePage = Math.ceil(patients.length / itemsPerPage);
    if (currentPage > maxPossiblePage && maxPossiblePage > 0) {
      setCurrentPage(1);
    }
  }, [patients.length, itemsPerPage, currentPage]);

  return (
    <div className="space-y-6">
      <PatientGrid
        patients={paginatedPatients}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />
      
      {patients.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={patients.length}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}