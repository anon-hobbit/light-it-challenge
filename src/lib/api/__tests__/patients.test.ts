import { vi, beforeEach, afterEach } from 'vitest'
import { fetchPatients, createPatient, updatePatient, deletePatient } from '../patients'
import type { Patient, PatientBase } from '../../../types'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock crypto.randomUUID
const mockRandomUUID = vi.fn()
Object.defineProperty(global, 'crypto', {
  value: { randomUUID: mockRandomUUID }
})

// Mock import.meta.env to use the actual API URL
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_BASE_URL: 'https://63bedcf7f5cfc0949b634fc8.mockapi.io'
  },
  configurable: true
})

describe('Patients API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRandomUUID.mockReturnValue('test-uuid-123')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchPatients', () => {
    const mockPatientData = [
      {
        id: '1',
        name: 'John Doe',
        description: 'Test patient',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: '2',
        name: 'Jane Smith',
        description: 'Another test patient',
        createdAt: '2024-01-02T00:00:00.000Z'
      }
    ]

    it('successfully fetches and validates patients', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPatientData)
      })

      const result = await fetchPatients()

      expect(mockFetch).toHaveBeenCalledWith('https://63bedcf7f5cfc0949b634fc8.mockapi.io/users')
      expect(result.data).toHaveLength(2)
      expect(result.data?.[0]).toEqual(
        expect.objectContaining({
          id: '1',
          name: 'John Doe',
          description: 'Test patient'
        })
      )
      expect(result.error).toBeUndefined()
    })

    it('handles network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const result = await fetchPatients()

      expect(result.data).toBeUndefined()
      expect(result.error).toBe('Network error')
    })

    it('handles HTTP errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404
      })

      const result = await fetchPatients()

      expect(result.data).toBeUndefined()
      expect(result.error).toBe('HTTP error! status: 404')
    })

    it('filters out invalid patient data', async () => {
      const mixedData = [
        // Valid patient
        {
          id: '1',
          name: 'John Doe',
          description: 'Valid patient',
          createdAt: '2024-01-01T00:00:00.000Z'
        },
        // Invalid patient (missing required fields)
        {
          id: '2',
          name: '', // empty name should be invalid
          createdAt: '2024-01-02T00:00:00.000Z'
        },
        // Valid patient
        {
          id: '3',
          name: 'Jane Smith',
          description: 'Another valid patient',
          createdAt: '2024-01-03T00:00:00.000Z'
        }
      ]

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mixedData)
      })

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchPatients()

      expect(result.data).toHaveLength(2) // Only valid patients
      expect(result.data?.[0].name).toBe('John Doe')
      expect(result.data?.[1].name).toBe('Jane Smith')
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid patient data'),
        expect.any(Object),
        expect.any(Object)
      )

      consoleSpy.mockRestore()
    })
  })

  describe('createPatient', () => {
    const newPatientData = {
      name: 'New Patient',
      description: 'New patient description',
      updatedAt: '2024-01-01T00:00:00.000Z',
      isDeleted: false,
      bloodType: 'A+',
      birthDate: '1990-01-01',
      insuranceNumber: '12345',
      phone: '+1234567890',
      email: 'test@example.com'
    } as Omit<Patient, 'id' | 'createdAt'>

    it('successfully creates a patient', async () => {
      vi.useFakeTimers()
      const mockDate = new Date('2024-01-01T12:00:00.000Z')
      vi.setSystemTime(mockDate)

      const createPromise = createPatient(newPatientData)
      
      // Fast-forward the delay
      vi.advanceTimersByTime(500)
      
      const result = await createPromise

      expect(result.data).toEqual(
        expect.objectContaining({
          ...newPatientData,
          id: 'test-uuid-123',
          createdAt: expect.any(String),
        })
      )
      expect(result.error).toBeUndefined()

      vi.useRealTimers()
    })

    it('handles validation errors', async () => {
      const invalidPatientData = {
        name: '', // Invalid - empty name
        description: 'Test description',
        updatedAt: '2024-01-01T00:00:00.000Z',
        isDeleted: false
      } as Omit<Patient, 'id' | 'createdAt'>

      vi.useFakeTimers()
      const createPromise = createPatient(invalidPatientData)
      vi.advanceTimersByTime(500)
      const result = await createPromise

      expect(result.data).toBeUndefined()
      expect(result.error).toContain('Invalid patient data')
      vi.useRealTimers()
    })
  })

  describe('updatePatient', () => {
    it('successfully updates a patient', async () => {
      vi.useFakeTimers()

      const updates = {
        name: 'Updated Name',
        description: 'Updated description'
      }

      const updatePromise = updatePatient('test-id', updates)
      vi.advanceTimersByTime(500)
      const result = await updatePromise

      expect(result.data).toEqual(
        expect.objectContaining({
          id: 'test-id',
          name: 'Updated Name',
          description: 'Updated description',
          updatedAt: expect.any(String),
          isDeleted: false
        })
      )
      expect(result.error).toBeUndefined()

      vi.useRealTimers()
    })

    it('handles partial updates', async () => {
      vi.useFakeTimers()
      const updatePromise = updatePatient('test-id', { name: 'Only Name Update' })
      vi.advanceTimersByTime(500)
      const result = await updatePromise

      expect(result.data?.id).toBe('test-id')
      expect(result.data?.name).toBe('Only Name Update')
      expect(result.data?.description).toBe('') // default value

      vi.useRealTimers()
    })
  })

  describe('deletePatient', () => {
    it('successfully deletes a patient', async () => {
      vi.useFakeTimers()
      
      const deletePromise = deletePatient('test-id')
      vi.advanceTimersByTime(500)
      const result = await deletePromise

      expect(result.data).toBe('test-id')
      expect(result.error).toBeUndefined()

      vi.useRealTimers()
    })

    it('maintains consistent delay timing', async () => {
      vi.useFakeTimers()
      
      const start = Date.now()
      const deletePromise = deletePatient('test-id')
      
      // Should not resolve immediately
      let resolved = false
      deletePromise.then(() => { resolved = true })
      
      expect(resolved).toBe(false)
      
      vi.advanceTimersByTime(499)
      expect(resolved).toBe(false)
      
      vi.advanceTimersByTime(1)
      await deletePromise
      expect(resolved).toBe(true)

      vi.useRealTimers()
    })
  })
})