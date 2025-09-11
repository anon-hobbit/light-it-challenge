import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { PatientManager } from '../../components/PatientManager'
import { createTestQueryClient } from '../test-utils'
import { QueryClientProvider } from '@tanstack/react-query'
import { DrawerProvider } from '../../providers/drawer-provider'
import * as patientsApi from '../../lib/api/patients'

// Mock the patients API
vi.mock('../../lib/api/patients')

const mockPatients = [
  {
    id: '1',
    name: 'John Doe',
    description: 'Test patient',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: null,
    bloodType: 'A+',
    birthDate: '1990-01-01',
    insuranceNumber: '12345',
    phone: '+1234567890',
    email: 'john@example.com'
  }
]

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient()
  
  return (
    <QueryClientProvider client={queryClient}>
      <DrawerProvider>
        {children}
      </DrawerProvider>
    </QueryClientProvider>
  )
}

describe('PatientManager Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders and loads patients successfully', async () => {
    const mockedFetchPatients = vi.mocked(patientsApi.fetchPatients)
    mockedFetchPatients.mockResolvedValue({
      data: mockPatients,
      error: null
    })

    render(
      <TestWrapper>
        <PatientManager />
      </TestWrapper>
    )
    
    // Wait for the main heading to appear
    await screen.findByText(/Patient Management/i, {}, { timeout: 3000 })
    
    // Then eventually show the patient name when loaded
    await screen.findByText('John Doe', {}, { timeout: 3000 })
    
    expect(mockedFetchPatients).toHaveBeenCalled()
  })

  it('handles empty patient list', async () => {
    const mockedFetchPatients = vi.mocked(patientsApi.fetchPatients)
    mockedFetchPatients.mockResolvedValue({
      data: [],
      error: null
    })

    render(
      <TestWrapper>
        <PatientManager />
      </TestWrapper>
    )
    
    // Wait for the main heading to appear after loading
    await screen.findByText(/Patient Management/i, {}, { timeout: 3000 })
    
    // Should handle empty state gracefully
    expect(mockedFetchPatients).toHaveBeenCalled()
  })

  it('handles API errors gracefully', async () => {
    const mockedFetchPatients = vi.mocked(patientsApi.fetchPatients)
    mockedFetchPatients.mockResolvedValue({
      data: null,
      error: 'Failed to fetch patients'
    })

    render(
      <TestWrapper>
        <PatientManager />
      </TestWrapper>
    )
    
    // Wait for the error message to appear
    await screen.findByText(/Error loading patients/i, {}, { timeout: 3000 })
    await screen.findByText('Failed to fetch patients', {}, { timeout: 3000 })
    
    // Component should still render even with API errors
    expect(mockedFetchPatients).toHaveBeenCalled()
  })
})