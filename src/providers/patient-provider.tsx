import { useReducer, type ReactNode } from 'react';
import { PatientContext, patientReducer, initialState } from '../contexts/patient-context';

interface PatientProviderProps {
  children: ReactNode;
}

export function PatientProvider({ children }: PatientProviderProps) {
  const [state, dispatch] = useReducer(patientReducer, initialState);

  return (
    <PatientContext.Provider value={{ state, dispatch }}>
      {children}
    </PatientContext.Provider>
  );
}