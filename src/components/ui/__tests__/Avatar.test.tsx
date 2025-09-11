import { render, screen } from '@testing-library/react'
import { Avatar } from '../Avatar'

describe('Avatar', () => {
  it('renders with user initials', () => {
    render(<Avatar user={{ name: 'John Doe' }} />)
    
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('handles single name', () => {
    render(<Avatar user={{ name: 'Madonna' }} />)
    
    expect(screen.getByText('M')).toBeInTheDocument()
  })

  it('handles multiple names correctly', () => {
    render(<Avatar user={{ name: 'John Michael Doe Smith' }} />)
    
    // Should only show first 2 initials
    expect(screen.getByText('JM')).toBeInTheDocument()
  })

  it('handles empty name gracefully', () => {
    const { container } = render(<Avatar user={{ name: '' }} />)
    
    const avatar = container.querySelector('.inline-flex')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveTextContent('')
  })

  it('handles name with extra spaces', () => {
    render(<Avatar user={{ name: '  John   Doe  ' }} />)
    
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('converts initials to uppercase', () => {
    render(<Avatar user={{ name: 'john doe' }} />)
    
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('applies default size', () => {
    render(<Avatar user={{ name: 'John Doe' }} />)
    
    const avatar = screen.getByText('JD')
    expect(avatar).toHaveClass('h-12', 'w-12', 'text-base')
  })

  it('applies small size variant', () => {
    render(<Avatar user={{ name: 'John Doe' }} size="sm" />)
    
    const avatar = screen.getByText('JD')
    expect(avatar).toHaveClass('h-8', 'w-8', 'text-sm')
  })

  it('applies large size variant', () => {
    render(<Avatar user={{ name: 'John Doe' }} size="lg" />)
    
    const avatar = screen.getByText('JD')
    expect(avatar).toHaveClass('h-16', 'w-16', 'text-lg')
  })

  it('applies extra large size variant', () => {
    render(<Avatar user={{ name: 'John Doe' }} size="xl" />)
    
    const avatar = screen.getByText('JD')
    expect(avatar).toHaveClass('h-20', 'w-20', 'text-xl')
  })

  it('applies consistent background color for same name', () => {
    const { rerender } = render(<Avatar user={{ name: 'John Doe' }} />)
    const firstAvatar = screen.getByText('JD')
    const firstBackgroundClass = Array.from(firstAvatar.classList).find(cls => cls.startsWith('bg-'))
    
    rerender(<Avatar user={{ name: 'John Doe' }} />)
    const secondAvatar = screen.getByText('JD')
    const secondBackgroundClass = Array.from(secondAvatar.classList).find(cls => cls.startsWith('bg-'))
    
    expect(firstBackgroundClass).toBe(secondBackgroundClass)
    expect(firstBackgroundClass).toBeTruthy()
  })

  it('applies different background colors for different names', () => {
    const { rerender } = render(<Avatar user={{ name: 'Alex Anderson' }} />)
    const firstAvatar = screen.getByText('AA')
    const firstBackgroundClass = Array.from(firstAvatar.classList).find(cls => cls.startsWith('bg-'))
    
    rerender(<Avatar user={{ name: 'Zara Zhang' }} />)
    const secondAvatar = screen.getByText('ZZ')
    const secondBackgroundClass = Array.from(secondAvatar.classList).find(cls => cls.startsWith('bg-'))
    
    // Use names that will definitely hash differently
    expect(firstBackgroundClass).not.toBe(secondBackgroundClass)
  })

  it('applies custom className', () => {
    render(<Avatar user={{ name: 'John Doe' }} className="custom-class" />)
    
    const avatar = screen.getByText('JD')
    expect(avatar).toHaveClass('custom-class')
  })

  it('includes base avatar classes', () => {
    render(<Avatar user={{ name: 'John Doe' }} />)
    
    const avatar = screen.getByText('JD')
    expect(avatar).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'text-white',
      'rounded-full'
    )
  })

  it('handles names with special characters', () => {
    render(<Avatar user={{ name: 'José María' }} />)
    
    expect(screen.getByText('JM')).toBeInTheDocument()
  })

  it('handles names with numbers', () => {
    render(<Avatar user={{ name: 'John 123 Doe' }} />)
    
    expect(screen.getByText('J1')).toBeInTheDocument()
  })

  it('applies one of the predefined background colors', () => {
    render(<Avatar user={{ name: 'Test User' }} />)
    
    const avatar = screen.getByText('TU')
    const expectedColors = [
      'bg-red-300',
      'bg-blue-300',
      'bg-green-300',
      'bg-yellow-300',
      'bg-purple-300',
      'bg-pink-300',
      'bg-indigo-300',
      'bg-teal-300',
      'bg-orange-300',
      'bg-cyan-300',
    ]
    
    const hasExpectedColor = expectedColors.some(color => avatar.classList.contains(color))
    expect(hasExpectedColor).toBe(true)
  })
})