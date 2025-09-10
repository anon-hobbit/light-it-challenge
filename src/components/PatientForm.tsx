import { useState } from 'react';
import { Button, Select, InputText, InputDate, Textarea } from './ui';
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
          <InputText
            id="name"
            label="Name"
            value={formData.name}
            onChange={(value) => handleChange('name', value)}
            placeholder="Enter patient name"
            error={errors.name}
            required
          />

          <Textarea
            id="description"
            label="Description"
            value={formData.description}
            onChange={(value) => handleChange('description', value)}
            placeholder="Enter patient description"
            error={errors.description}
            required
            rows={3}
          />

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

            <InputDate
              id="birthDate"
              label="Birth Date"
              value={formData.birthDate}
              onChange={(value) => handleChange('birthDate', value)}
              error={errors.birthDate}
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputText
              id="phone"
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(value) => handleChange('phone', value)}
              placeholder="+1 (555) 123-4567"
              error={errors.phone}
            />

            <InputText
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => handleChange('email', value)}
              placeholder="patient@example.com"
              error={errors.email}
            />
          </div>

          <InputText
            id="insuranceNumber"
            label="Insurance Number"
            value={formData.insuranceNumber}
            onChange={(value) => handleChange('insuranceNumber', value)}
            placeholder="Insurance number"
            error={errors.insuranceNumber}
          />
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