import { render, screen, fireEvent } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { vi } from 'vitest'
import { Modal, ConfirmModal } from '../Modal'
import { Button } from '../Button'

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Modal',
    children: <div>Modal Content</div>
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset body overflow style
    document.body.style.overflow = ''
  })

  it('renders modal content when open', () => {
    render(<Modal {...defaultProps} />)
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<Modal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    
    render(<Modal {...defaultProps} onClose={onClose} />)
    
    const closeButton = screen.getByRole('button')
    await user.click(closeButton)
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    
    render(<Modal {...defaultProps} onClose={onClose} />)
    
    const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/50')
    expect(backdrop).toBeInTheDocument()
    
    if (backdrop) {
      await user.click(backdrop)
      expect(onClose).toHaveBeenCalledTimes(1)
    }
  })

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn()
    
    render(<Modal {...defaultProps} onClose={onClose} />)
    
    fireEvent.keyDown(document, { key: 'Escape' })
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose for other keys', () => {
    const onClose = vi.fn()
    
    render(<Modal {...defaultProps} onClose={onClose} />)
    
    fireEvent.keyDown(document, { key: 'Enter' })
    fireEvent.keyDown(document, { key: 'Space' })
    
    expect(onClose).not.toHaveBeenCalled()
  })

  it('sets body overflow hidden when open', () => {
    render(<Modal {...defaultProps} isOpen={true} />)
    
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('resets body overflow when closed', () => {
    const { rerender } = render(<Modal {...defaultProps} isOpen={true} />)
    expect(document.body.style.overflow).toBe('hidden')
    
    rerender(<Modal {...defaultProps} isOpen={false} />)
    expect(document.body.style.overflow).toBe('unset')
  })

  it('renders actions when provided', () => {
    const actions = (
      <Button onClick={vi.fn()}>Action Button</Button>
    )
    
    render(<Modal {...defaultProps} actions={actions} />)
    
    expect(screen.getByText('Action Button')).toBeInTheDocument()
  })

  it('does not render actions section when no actions provided', () => {
    render(<Modal {...defaultProps} />)
    
    const actionsSection = document.querySelector('.border-t.border-gray-200.bg-gray-50')
    expect(actionsSection).not.toBeInTheDocument()
  })

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    const onClose = vi.fn()
    
    const { unmount } = render(<Modal {...defaultProps} onClose={onClose} />)
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    expect(document.body.style.overflow).toBe('unset')
  })
})

describe('ConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    document.body.style.overflow = ''
  })

  it('renders confirm modal with message', () => {
    render(<ConfirmModal {...defaultProps} />)
    
    expect(screen.getByText('Confirm Action')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Confirm')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    
    render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} />)
    
    const confirmButton = screen.getByText('Confirm')
    await user.click(confirmButton)
    
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    
    render(<ConfirmModal {...defaultProps} onClose={onClose} />)
    
    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('uses custom confirm text', () => {
    render(<ConfirmModal {...defaultProps} confirmText="Delete Forever" />)
    
    expect(screen.getByText('Delete Forever')).toBeInTheDocument()
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument()
  })

  it('applies danger variant to confirm button', () => {
    render(<ConfirmModal {...defaultProps} confirmVariant="danger" />)
    
    const confirmButton = screen.getByText('Confirm')
    expect(confirmButton).toHaveClass('bg-red-400') // danger variant class
  })

  it('shows loading state', () => {
    render(<ConfirmModal {...defaultProps} isLoading={true} />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument()
    
    const confirmButton = screen.getByText('Loading...')
    const cancelButton = screen.getByText('Cancel')
    
    expect(confirmButton).toBeDisabled()
    expect(cancelButton).toBeDisabled()
  })

  it('disables buttons during loading', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onClose = vi.fn()
    
    render(
      <ConfirmModal 
        {...defaultProps} 
        isLoading={true}
        onConfirm={onConfirm}
        onClose={onClose}
      />
    )
    
    const confirmButton = screen.getByText('Loading...')
    const cancelButton = screen.getByText('Cancel')
    
    await user.click(confirmButton)
    await user.click(cancelButton)
    
    expect(onConfirm).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('does not render when closed', () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument()
    expect(screen.queryByText('Are you sure you want to proceed?')).not.toBeInTheDocument()
  })
})