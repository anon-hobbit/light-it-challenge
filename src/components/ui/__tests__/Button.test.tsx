import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { vi } from 'vitest'
import { Button } from '../Button'
import { Edit } from 'lucide-react'

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-blue-400', 'h-10', 'px-4')
  })

  it('applies variant styles correctly', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200')
    
    rerender(<Button variant="danger">Danger</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-red-400')
    
    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border', 'border-gray-300')
  })

  it('applies size variants correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-8', 'px-3')
    
    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-12', 'px-6')
  })

  it('handles click events', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders with icon on left by default', () => {
    render(
      <Button icon={Edit} iconPosition="left">
        Edit
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    
    // Check that icon is rendered
    const svg = button.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('mr-2')
  })

  it('renders with icon on right', () => {
    render(
      <Button icon={Edit} iconPosition="right">
        Edit
      </Button>
    )
    
    const button = screen.getByRole('button')
    const svg = button.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('ml-2')
  })

  it('renders icon-only button correctly', () => {
    render(<Button icon={Edit} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('aspect-square', 'w-10')
    
    const svg = button.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).not.toHaveClass('mr-2', 'ml-2')
  })

  it('is disabled when disabled prop is true', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:opacity-50')
    
    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('forwards additional props', () => {
    render(
      <Button data-testid="custom-button" aria-label="Custom button">
        Button
      </Button>
    )
    
    const button = screen.getByTestId('custom-button')
    expect(button).toHaveAttribute('aria-label', 'Custom button')
  })
})