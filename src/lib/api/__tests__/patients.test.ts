import { vi, beforeEach, afterEach, describe, expect, it } from 'vitest'
import { fetchPatients, createPatient, updatePatient, deletePatient } from '../patients'
import type { Patient } from '../../../types'

// Mock fetch globally
const mockFetch = vi.fn()
globalThis.fetch = mockFetch

// Mock crypto.randomUUID
const mockRandomUUID = vi.fn()
Object.defineProperty(globalThis, 'crypto', {
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
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        isDeleted: false
      },
      {
        id: '2',
        name: 'Jane Smith',
        description: 'Another test patient',
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
        isDeleted: false
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
      expect(result.data?.[0]).toMatchObject({
        id: '1',
        name: 'John Doe',
        description: 'Test patient'
      })
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
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          isDeleted: false
        },
        // Invalid patient (missing required fields)
        {
          id: '2',
          name: '', // empty name should be invalid
          createdAt: '2024-01-02T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
          isDeleted: false
        },
        // Valid patient
        {
          id: '3',
          name: 'Jane Smith',
          description: 'Another valid patient',
          createdAt: '2024-01-03T00:00:00.000Z',
          updatedAt: '2024-01-03T00:00:00.000Z',
          isDeleted: false
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

      const result = await createPatient(newPatientData)
      
      expect(result.data).toMatchObject({
        ...newPatientData,
        id: 'test-uuid-123',
        createdAt: expect.any(String),
      })
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

      const result = await createPatient(invalidPatientData)

      expect(result.data).toBeUndefined()
      expect(result.error).toContain('Invalid patient data')
    })
  })

  describe('updatePatient', () => {
    it('successfully updates a patient', async () => {
      const updates = {
        name: 'Updated Name',
        description: 'Updated description'
      }

      const result = await updatePatient('test-id', updates)

      expect(result.data).toMatchObject({
        id: 'test-id',
        name: 'Updated Name',
        description: 'Updated description',
        updatedAt: expect.any(String),
        isDeleted: false,
        createdAt: expect.any(String)
      })
      expect(result.error).toBeUndefined()
    })

    it('handles partial updates', async () => {
      const result = await updatePatient('test-id', { name: 'Only Name Update' })

      expect(result.data).toMatchObject({
        id: 'test-id',
        name: 'Only Name Update',
        description: '', // default value
        updatedAt: expect.any(String),
        isDeleted: false,
        createdAt: expect.any(String)
      })
    })
  })

  describe('deletePatient', () => {
    it('successfully deletes a patient', async () => {
      const result = await deletePatient('test-id')
      expect(result.data).toBe('test-id')
      expect(result.error).toBeUndefined()
    })
  })
})