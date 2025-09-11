import { render, renderHook, act } from '@testing-library/react'
import { DrawerProvider } from '../drawer-provider'
import { useDrawer } from '../../hooks/useDrawer'

const TestComponent = () => {
  const drawer = useDrawer()
  return (
    <div>
      <div data-testid="is-open">{drawer.isOpen.toString()}</div>
      <div data-testid="title">{drawer.title || 'no-title'}</div>
      <div data-testid="size">{drawer.size}</div>
      <button 
        data-testid="open-drawer"
        onClick={() => drawer.openDrawer(<div>Test Content</div>, { title: 'Test Title', size: 'lg' })}
      >
        Open Drawer
      </button>
      <button data-testid="close-drawer" onClick={() => drawer.closeDrawer()}>
        Close Drawer
      </button>
    </div>
  )
}

describe('DrawerProvider', () => {
  it('provides drawer context to children', () => {
    const { getByTestId } = render(
      <DrawerProvider>
        <TestComponent />
      </DrawerProvider>
    )

    expect(getByTestId('is-open')).toHaveTextContent('false')
    expect(getByTestId('title')).toHaveTextContent('no-title')
    expect(getByTestId('size')).toHaveTextContent('md')
  })

  it('allows opening and closing drawer through context', () => {
    const { getByTestId } = render(
      <DrawerProvider>
        <TestComponent />
      </DrawerProvider>
    )

    // Initially closed
    expect(getByTestId('is-open')).toHaveTextContent('false')

    // Open drawer
    act(() => {
      getByTestId('open-drawer').click()
    })

    expect(getByTestId('is-open')).toHaveTextContent('true')
    expect(getByTestId('title')).toHaveTextContent('Test Title')
    expect(getByTestId('size')).toHaveTextContent('lg')

    // Close drawer
    act(() => {
      getByTestId('close-drawer').click()
    })

    expect(getByTestId('is-open')).toHaveTextContent('false')
  })

  it('provides initial state correctly', () => {
    const { result } = renderHook(() => useDrawer(), {
      wrapper: DrawerProvider,
    })

    expect(result.current.isOpen).toBe(false)
    expect(result.current.title).toBe(undefined)
    expect(result.current.content).toBe(undefined)
    expect(result.current.size).toBe('md')
  })

  it('handles state updates through reducer', () => {
    const { result } = renderHook(() => useDrawer(), {
      wrapper: DrawerProvider,
    })

    const testContent = <div>Test Content</div>

    act(() => {
      result.current.openDrawer(testContent, { title: 'Test Title', size: 'xl' })
    })

    expect(result.current.isOpen).toBe(true)
    expect(result.current.title).toBe('Test Title')
    expect(result.current.content).toBe(testContent)
    expect(result.current.size).toBe('xl')

    act(() => {
      result.current.closeDrawer()
    })

    expect(result.current.isOpen).toBe(false)
  })

  it('renders children without errors', () => {
    const TestChild = () => <div data-testid="test-child">Child Component</div>

    const { getByTestId } = render(
      <DrawerProvider>
        <TestChild />
      </DrawerProvider>
    )

    expect(getByTestId('test-child')).toBeInTheDocument()
  })
})