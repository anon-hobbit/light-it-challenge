import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { vi } from 'vitest'
import { PatientCard } from '../PatientCard'
import type { Patient } from '../../types'

const mockPatient: Patient = {
  id: '1',
  name: 'John Doe',
  description: 'Test patient description',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
  isDeleted: false,
  bloodType: 'A+',
  birthDate: '1990-01-01',
  insuranceNumber: '12345',
  phone: '+1234567890',
  email: 'john@example.com'
}

const incompletePatient: Patient = {
  id: '2',
  name: 'Jane Smith',
  description: 'Incomplete patient',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: null,
  bloodType: null,
  birthDate: null,
  insuranceNumber: null,
  phone: null,
  email: null
}

describe('PatientCard', () => {
  it('renders patient information correctly', () => {
    render(<PatientCard patient={mockPatient} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Test patient description')).toBeInTheDocument()
    expect(screen.getByText(/Last updated: 1\/14\/2024/)).toBeInTheDocument()
  })

  it('shows created date when no updated date', () => {
    const patientWithoutUpdate = { ...mockPatient, updatedAt: null }
    render(<PatientCard patient={patientWithoutUpdate} />)
    
    expect(screen.getByText(/Created: 12\/31\/2023/)).toBeInTheDocument()
  })

  it('shows completed status for complete patient', () => {
    render(<PatientCard patient={mockPatient} />)
    
    expect(screen.getByText('Completed')).toBeInTheDocument()
    const statusBadge = screen.getByText('Completed').parentElement
    expect(statusBadge).toHaveClass('bg-green-400')
  })

  it('shows not completed status for incomplete patient', () => {
    render(<PatientCard patient={incompletePatient} />)
    
    expect(screen.getByText('Not Completed')).toBeInTheDocument()
    const statusBadge = screen.getByText('Not Completed').parentElement
    expect(statusBadge).toHaveClass('bg-red-400')
  })

  it('calls onView when view button is clicked', async () => {
    const user = userEvent.setup()
    const handleView = vi.fn()
    
    render(<PatientCard patient={mockPatient} onView={handleView} />)
    
    const buttons = screen.getAllByRole('button')
    const viewButton = buttons[0] // First button is view
    await user.click(viewButton)
    
    expect(handleView).toHaveBeenCalledWith(mockPatient)
  })

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup()
    const handleEdit = vi.fn()
    
    render(<PatientCard patient={mockPatient} onView={vi.fn()} onEdit={handleEdit} />)
    
    const buttons = screen.getAllByRole('button')
    const editButton = buttons[1] // Second button is edit
    await user.click(editButton)
    
    expect(handleEdit).toHaveBeenCalledWith(mockPatient)
  })

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    const handleDelete = vi.fn()
    
    render(<PatientCard patient={mockPatient} onView={vi.fn()} onEdit={vi.fn()} onDelete={handleDelete} />)
    
    const buttons = screen.getAllByRole('button')
    const deleteButton = buttons[2] // Third button is delete
    await user.click(deleteButton)
    
    expect(handleDelete).toHaveBeenCalledWith(mockPatient.id)
  })

  it('disables delete button when isDeleting is true', () => {
    render(
      <PatientCard 
        patient={mockPatient} 
        onDelete={vi.fn()} 
        isDeleting={true} 
      />
    )
    
    const buttons = screen.getAllByRole('button')
    const deleteButton = buttons[0] // Only delete button in this case
    expect(deleteButton).toBeDisabled()
  })

  it('does not render action buttons when handlers are not provided', () => {
    render(<PatientCard patient={mockPatient} />)
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders avatar with patient initials', () => {
    render(<PatientCard patient={mockPatient} />)
    
    // Avatar should be rendered - checking for the initials
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('applies hover effect classes', () => {
    const { container } = render(<PatientCard patient={mockPatient} />)
    
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('hover:shadow-md', 'transition-shadow')
  })
})