import { describe, it, expect } from 'vitest'
import { PatientBaseSchema, PatientSchema, BloodType } from '../index'

describe('Patient Schemas', () => {
  describe('PatientBaseSchema', () => {
    it('validates a valid patient base object', () => {
      const validData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2024-01-01T00:00:00.000Z',
        name: 'John Doe',
        description: 'A test patient'
      }

      const result = PatientBaseSchema.safeParse(validData)
      expect(result.success).toBe(true)
      
      if (result.success) {
        expect(result.data.id).toBe(validData.id)
        expect(result.data.name).toBe(validData.name)
        expect(result.data.description).toBe(validData.description)
      }
    })

    it('rejects missing required fields', () => {
      const invalidData = {
        id: '123',
        name: 'John Doe'
        // missing createdAt and description
      }

      const result = PatientBaseSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('validates name length constraints', () => {
      const baseData = {
        id: '123',
        createdAt: '2024-01-01T00:00:00.000Z',
        description: 'Test description'
      }

      // Too short name
      const shortName = PatientBaseSchema.safeParse({
        ...baseData,
        name: ''
      })
      expect(shortName.success).toBe(false)

      // Too long name (over 255 chars)
      const longName = PatientBaseSchema.safeParse({
        ...baseData,
        name: 'a'.repeat(256)
      })
      expect(longName.success).toBe(false)

      // Valid name length
      const validName = PatientBaseSchema.safeParse({
        ...baseData,
        name: 'John Doe'
      })
      expect(validName.success).toBe(true)
    })
  })

  describe('PatientSchema', () => {
    const baseValidData = {
      id: '123',
      createdAt: '2024-01-01T00:00:00.000Z',
      name: 'John Doe',
      description: 'A test patient'
    }

    it('validates optional fields correctly', () => {
      const dataWithOptionals = {
        ...baseValidData,
        bloodType: 'A+',
        birthDate: '1990-01-01T00:00:00.000Z',
        insuranceNumber: 'INS123456',
        phone: '+1-234-567-8900',
        email: 'john@example.com'
      }

      const result = PatientSchema.safeParse(dataWithOptionals)
      expect(result.success).toBe(true)
    })

    it('validates blood type format', () => {
      // Valid blood types
      const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
      
      validBloodTypes.forEach(bloodType => {
        const result = PatientSchema.safeParse({
          ...baseValidData,
          bloodType
        })
        expect(result.success).toBe(true)
      })

      // Invalid blood type
      const invalidBloodType = PatientSchema.safeParse({
        ...baseValidData,
        bloodType: 'XYZ'
      })
      expect(invalidBloodType.success).toBe(false)
    })

    it('validates email format', () => {
      // Valid email
      const validEmail = PatientSchema.safeParse({
        ...baseValidData,
        email: 'user@example.com'
      })
      expect(validEmail.success).toBe(true)

      // Invalid email
      const invalidEmail = PatientSchema.safeParse({
        ...baseValidData,
        email: 'not-an-email'
      })
      expect(invalidEmail.success).toBe(false)
    })

    it('validates phone number format', () => {
      const validPhoneNumbers = [
        '+1-234-567-8900',
        '(555) 123-4567',
        '+44 20 7946 0958',
        '1234567890',
        '+1 234 567 8900'
      ]

      validPhoneNumbers.forEach(phone => {
        const result = PatientSchema.safeParse({
          ...baseValidData,
          phone
        })
        expect(result.success).toBe(true)
      })

      // Invalid phone
      const invalidPhone = PatientSchema.safeParse({
        ...baseValidData,
        phone: 'not-a-phone'
      })
      expect(invalidPhone.success).toBe(false)
    })

    it('handles date coercion correctly', () => {
      const dateString = '2024-01-15'
      const result = PatientSchema.safeParse({
        ...baseValidData,
        birthDate: dateString
      })
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.birthDate).toBe('2024-01-15T00:00:00.000Z')
      }
    })
  })

  describe('BloodType constants', () => {
    it('contains all standard blood types', () => {
      const expectedBloodTypes = [
        'A+', 'A-', 'B+', 'B-', 
        'AB+', 'AB-', 'O+', 'O-'
      ]

      const actualBloodTypes = Object.values(BloodType)
      expect(actualBloodTypes.sort()).toEqual(expectedBloodTypes.sort())
    })

    it('has correct structure', () => {
      expect(BloodType.A_POSITIVE).toBe('A+')
      expect(BloodType.A_NEGATIVE).toBe('A-')
      expect(BloodType.O_POSITIVE).toBe('O+')
      expect(BloodType.O_NEGATIVE).toBe('O-')
    })
  })
})