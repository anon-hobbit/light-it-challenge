import { useState } from 'react';
import { Button, Select } from './ui';
import { PatientSchema, BloodType } from '../types';
import type { Patient } from '../types';
import type { SelectOption } from './ui/Select';

interface PatientFormProps {
  initialData?: Partial<Patient>;
  onSubmit: (data: Patient) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PatientForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: PatientFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    bloodType: initialData?.bloodType || '',
    birthDate: initialData?.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0] : '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    insuranceNumber: initialData?.insuranceNumber || '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const bloodTypeOptions: SelectOption[] = Object.values(BloodType).map(type => ({
    value: type,
    label: type,
  }));

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // borra los errores al escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const patientData = {
      id: initialData?.id || crypto.randomUUID(),
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
      name: formData.name.trim(),
      description: formData.description.trim(),
      bloodType: formData.bloodType.trim() || undefined,
      birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : undefined,
      phone: formData.phone.trim() || undefined,
      email: formData.email.trim() || undefined,
      insuranceNumber: formData.insuranceNumber.trim() || undefined,
    };

    const result = PatientSchema.safeParse(patientData);
    
    if (!result.success) {
      console.log('Validation failed:', result.error);
      const fieldErrors: Record<string, string> = {};
      
      try {
        if (result.error?.issues && Array.isArray(result.error.issues)) {
          result.error.issues.forEach(issue => {
            const field = issue.path?.[0] as string;
            if (field) {
              fieldErrors[field] = issue.message;
            } else {
              fieldErrors.general = issue.message;
            }
          });
        } else {
          // fallback...
          fieldErrors.general = 'Please check your input and try again.';
        }
      } catch (err) {
        console.error('Error processing validation errors:', err);
        fieldErrors.general = 'Validation error. Please check your input.';
      }
      
      setErrors(fieldErrors);
      
      // Scroll to first error field
      const firstErrorField = Object.keys(fieldErrors)[0];
      if (firstErrorField && firstErrorField !== 'general') {
        const errorElement = document.getElementById(firstErrorField);
        errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement?.focus();
      }
      
      return;
    }

    try {
      const completePatientData: Patient = {
        ...result.data,
        updatedAt: new Date().toISOString(),
        isDeleted: false,
      };
      
      await onSubmit(completePatientData);
    } catch (error) {
      console.error('error guardar', error);
      setErrors({ general: 'Failed to save patient. Please try again.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter patient name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter patient description"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                Blood Type
              </label>
              <Select
                id="bloodType"
                value={formData.bloodType}
                onChange={(value) => handleChange('bloodType', value)}
                options={bloodTypeOptions}
                placeholder="Select blood type"
                error={!!errors.bloodType}
              />
              {errors.bloodType && <p className="mt-1 text-sm text-red-600">{errors.bloodType}</p>}
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                Birth Date
              </label>
              <input
                type="date"
                id="birthDate"
                value={formData.birthDate}
                onChange={(e) => handleChange('birthDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.birthDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="patient@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="insuranceNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Number
            </label>
            <input
              type="text"
              id="insuranceNumber"
              value={formData.insuranceNumber}
              onChange={(e) => handleChange('insuranceNumber', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.insuranceNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Insurance number"
            />
            {errors.insuranceNumber && <p className="mt-1 text-sm text-red-600">{errors.insuranceNumber}</p>}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Patient'}
        </Button>
      </div>
    </form>
  );
}