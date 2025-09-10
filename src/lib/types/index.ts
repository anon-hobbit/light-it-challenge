import { z } from 'zod';

export const PatientBaseSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  createdAt: z.string().pipe(z.coerce.date({ message: 'Invalid date format' })).transform(val => val.toISOString()),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  avatar: z.string().refine(val => /^https?:\/\/.+/.test(val), { message: 'Invalid avatar URL' }).nullable(),
  description: z.string().min(1, 'Description is required'),
  website: z.string().refine(val => /^https?:\/\/.+/.test(val), { message: 'Invalid website URL' }),
});

export const PatientSchema = PatientBaseSchema.extend({
  bloodType: z.string().refine(val => /^(A|B|AB|O)[+-]$/.test(val), { message: 'Invalid blood type format' }).optional(),
  birthDate: z.string().pipe(z.coerce.date({ message: 'Invalid birth date format' })).transform(val => val.toISOString()).optional(),
  insuranceNumber: z.string().min(1, 'Insurance number cannot be empty').optional(),
  phone: z.string().refine(val => /^\+?[\d\s\-()]+$/.test(val), { message: 'Invalid phone number format' }).optional(),
  email: z.string().refine(val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), { message: 'Invalid email format' }).optional(),
});

export type PatientBase = z.infer<typeof PatientBaseSchema>;
export type Patient = z.infer<typeof PatientSchema>;