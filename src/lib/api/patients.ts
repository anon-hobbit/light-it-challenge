import { PatientBaseSchema, type Patient, type PatientBase } from "../../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL!;

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function fetchPatients(): Promise<ApiResponse<PatientBase[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();

    // Por las dudas valido los datos
    // y borro los que no cumplen con el schema
    const validatedPatients = rawData
      .map((patient: unknown) => {
        const result = PatientBaseSchema.safeParse(patient);
        if (!result.success) {
          console.warn("Invalid patient data:", patient, result.error);
          return null;
        }
        return result.data;
      })
      .filter(Boolean) as PatientBase[];

    return { data: validatedPatients };
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to fetch patients",
    };
  }
}

// Simulaciones sin persistencia
// Uso zod para validar los datos
// Aplico un delay de 500ms para simular una operacion real
export async function createPatient(
  patient: Omit<Patient, "id" | "createdAt">
): Promise<ApiResponse<Patient>> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newPatientData = {
      ...patient,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const result = PatientBaseSchema.safeParse(newPatientData);
    if (!result.success) {
      return {
        error: `Invalid patient data: ${result.error.message}`,
      };
    }

    return { data: { ...result.data, ...patient } };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to create patient",
    };
  }
}

export async function updatePatient(
  id: string,
  updates: Partial<PatientBase>
): Promise<ApiResponse<PatientBase>> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const updatedPatientData = {
      id,
      createdAt: new Date().toISOString(),
      name: "",
      description: "",
      ...updates,
    };

    const result = PatientBaseSchema.safeParse(updatedPatientData);
    if (!result.success) {
      return {
        error: `Invalid patient data: ${result.error.message}`,
      };
    }

    return { data: result.data };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to update patient",
    };
  }
}

export async function deletePatient(id: string): Promise<ApiResponse<string>> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { data: id };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to delete patient",
    };
  }
}
