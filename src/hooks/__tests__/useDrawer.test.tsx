import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useDrawer } from '../useDrawer'
import { DrawerProvider } from '../../providers/drawer-provider'

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <DrawerProvider>
    {children}
  </DrawerProvider>
)

describe('useDrawer', () => {
  it('throws error when used outside DrawerProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      renderHook(() => useDrawer())
    }).toThrow('useDrawer must be used within a DrawerProvider')
    
    consoleSpy.mockRestore()
  })

  it('returns correct initial state', () => {
    const { result } = renderHook(() => useDrawer(), {
      wrapper: TestWrapper,
    })

    expect(result.current.isOpen).toBe(false)
    expect(result.current.title).toBe(undefined)
    expect(result.current.content).toBe(undefined)
    expect(result.current.size).toBe('md')
  })

  it('opens drawer with content and options', () => {
    const { result } = renderHook(() => useDrawer(), {
      wrapper: TestWrapper,
    })

    const content = <div>Test Content</div>
    
    act(() => {
      result.current.openDrawer(content, {
        title: 'Test Title',
        size: 'lg'
      })
    })

    expect(result.current.isOpen).toBe(true)
    expect(result.current.title).toBe('Test Title')
    expect(result.current.content).toBe(content)
    expect(result.current.size).toBe('lg')
  })

  it('opens drawer with content only (no options)', () => {
    const { result } = renderHook(() => useDrawer(), {
      wrapper: TestWrapper,
    })

    const content = <div>Simple Content</div>
    
    act(() => {
      result.current.openDrawer(content)
    })

    expect(result.current.isOpen).toBe(true)
    expect(result.current.title).toBe(undefined)
    expect(result.current.content).toBe(content)
    expect(result.current.size).toBe('md') // default size
  })

  it('closes drawer', () => {
    const { result } = renderHook(() => useDrawer(), {
      wrapper: TestWrapper,
    })

    // First open the drawer
    act(() => {
      result.current.openDrawer(<div>Content</div>, { title: 'Test' })
    })

    expect(result.current.isOpen).toBe(true)

    // Then close it
    act(() => {
      result.current.closeDrawer()
    })

    expect(result.current.isOpen).toBe(false)
  })

  it('handles multiple open/close cycles', () => {
    const { result } = renderHook(() => useDrawer(), {
      wrapper: TestWrapper,
    })

    const content1 = <div>Content 1</div>
    const content2 = <div>Content 2</div>

    // Open first content
    act(() => {
      result.current.openDrawer(content1, { title: 'Title 1' })
    })

    expect(result.current.isOpen).toBe(true)
    expect(result.current.content).toBe(content1)
    expect(result.current.title).toBe('Title 1')

    // Close
    act(() => {
      result.current.closeDrawer()
    })

    expect(result.current.isOpen).toBe(false)

    // Open second content
    act(() => {
      result.current.openDrawer(content2, { title: 'Title 2', size: 'xl' })
    })

    expect(result.current.isOpen).toBe(true)
    expect(result.current.content).toBe(content2)
    expect(result.current.title).toBe('Title 2')
    expect(result.current.size).toBe('xl')
  })

  it('updates content when opening a new drawer while one is already open', () => {
    const { result } = renderHook(() => useDrawer(), {
      wrapper: TestWrapper,
    })

    const content1 = <div>Content 1</div>
    const content2 = <div>Content 2</div>

    // Open first drawer
    act(() => {
      result.current.openDrawer(content1, { title: 'Title 1' })
    })

    // Open second drawer (should replace first)
    act(() => {
      result.current.openDrawer(content2, { title: 'Title 2', size: 'sm' })
    })

    expect(result.current.isOpen).toBe(true)
    expect(result.current.content).toBe(content2)
    expect(result.current.title).toBe('Title 2')
    expect(result.current.size).toBe('sm')
  })
})