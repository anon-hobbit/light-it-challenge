import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import { createElement } from 'react'
import { usePatients } from '../usePatients'
import * as patientsApi from '../../lib/api/patients'
import type { Patient } from '../../types'

// Mock the API module
vi.mock('../../lib/api/patients')

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    description: 'Test patient',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
    isDeleted: false,
    bloodType: 'A+',
    birthDate: '1990-01-01',
    insuranceNumber: '12345',
    phone: '+1234567890',
    email: 'john@example.com'
  },
  {
    id: '2',
    name: 'Jane Smith',
    description: 'Another patient',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    isDeleted: false,
    bloodType: undefined,
    birthDate: undefined,
    insuranceNumber: undefined,
    phone: undefined,
    email: undefined
  }
]

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: React.ReactNode }) => 
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('usePatients', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches patients successfully', async () => {
    const mockedFetchPatients = vi.mocked(patientsApi.fetchPatients)
    mockedFetchPatients.mockResolvedValue({
      data: mockPatients,
      error: undefined
    })

    const wrapper = createWrapper()
    const { result } = renderHook(() => usePatients(), { wrapper })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.patients).toEqual([])

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Patients should be sorted by updatedAt/createdAt (most recent first)
    expect(result.current.patients).toHaveLength(2)
    expect(result.current.patients[0].id).toBe('1') // Has updatedAt, should be first
    expect(result.current.patients[1].id).toBe('2')
  })

  it('handles fetch error correctly', async () => {
    const mockedFetchPatients = vi.mocked(patientsApi.fetchPatients)
    mockedFetchPatients.mockResolvedValue({
      data: undefined,
      error: 'Failed to fetch patients'
    })

    const wrapper = createWrapper()
    const { result } = renderHook(() => usePatients(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.patients).toEqual([])
  })

  it('creates a patient successfully', async () => {
    const mockedFetchPatients = vi.mocked(patientsApi.fetchPatients)
    const mockedCreatePatient = vi.mocked(patientsApi.createPatient)
    
    mockedFetchPatients.mockResolvedValue({
      data: [],
      error: undefined
    })

    const newPatient = mockPatients[0]
    mockedCreatePatient.mockResolvedValue({
      data: newPatient,
      error: undefined
    })

    const wrapper = createWrapper()
    const { result } = renderHook(() => usePatients(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await result.current.createPatient({
      name: newPatient.name,
      description: newPatient.description
    })

    await waitFor(() => {
      expect(result.current.patients).toContainEqual(
        expect.objectContaining({
          id: newPatient.id,
          name: newPatient.name
        })
      )
    })
  })

  it('updates a patient successfully', async () => {
    const mockedFetchPatients = vi.mocked(patientsApi.fetchPatients)
    const mockedUpdatePatient = vi.mocked(patientsApi.updatePatient)
    
    mockedFetchPatients.mockResolvedValue({
      data: [mockPatients[0]],
      error: undefined
    })

    const updatedPatient = { ...mockPatients[0], name: 'Updated Name' }
    mockedUpdatePatient.mockResolvedValue({
      data: updatedPatient,
      error: undefined
    })

    const wrapper = createWrapper()
    const { result } = renderHook(() => usePatients(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await result.current.updatePatient('1', { name: 'Updated Name' })

    await waitFor(() => {
      const patient = result.current.patients.find(p => p.id === '1')
      expect(patient?.name).toBe('Updated Name')
      expect(patient?.updatedAt).toBeDefined()
    })
  })

  it('deletes a patient successfully', async () => {
    const mockedFetchPatients = vi.mocked(patientsApi.fetchPatients)
    const mockedDeletePatient = vi.mocked(patientsApi.deletePatient)
    
    mockedFetchPatients.mockResolvedValue({
      data: mockPatients,
      error: null
    })

    mockedDeletePatient.mockResolvedValue({
      data: true,
      error: null
    })

    const wrapper = createWrapper()
    const { result } = renderHook(() => usePatients(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.patients).toHaveLength(2)

    await result.current.deletePatient('1')

    await waitFor(() => {
      expect(result.current.patients).toHaveLength(1)
      expect(result.current.patients.find(p => p.id === '1')).toBeUndefined()
    })
  })

  it('provides loading states for mutations', async () => {
    const mockedFetchPatients = vi.mocked(patientsApi.fetchPatients)
    mockedFetchPatients.mockResolvedValue({
      data: [],
      error: null
    })

    const wrapper = createWrapper()
    const { result } = renderHook(() => usePatients(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isCreating).toBe(false)
    expect(result.current.isUpdating).toBe(false)
    expect(result.current.isDeleting).toBe(false)
  })
})