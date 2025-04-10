import { describe, it, expect } from 'vitest'
import { render, renderHook, act } from '@testing-library/react'
import { TransactionProvider, useTransaction } from './TransactionContext'

const mockTransaction = {
  id: "test-id",
  type_id: 1,
  status_id: 1,
  date_claimable: '2025-02-24T09:59:00',
  other_address: '0x123',
  amount: 100,
  fee: 0.01,
  date_created: '2025-02-24T09:59:00'
}

describe('TransactionContext', () => {
  it('provides transaction context to children', () => {
    const TestComponent = () => {
      const { selectedTransaction } = useTransaction()
      return <div>{selectedTransaction ? 'has transaction' : 'no transaction'}</div>
    }

    const { getByText } = render(
      <TransactionProvider>
        <TestComponent />
      </TransactionProvider>
    )

    expect(getByText('no transaction')).toBeInTheDocument()
  })

  it('updates selected transaction', () => {
    const { result } = renderHook(() => useTransaction(), {
      wrapper: TransactionProvider
    })

    act(() => {
      result.current.setSelectedTransaction(mockTransaction)
    })

    expect(result.current.selectedTransaction).toEqual(mockTransaction)
  })

  it('clears selected transaction', () => {
    const { result } = renderHook(() => useTransaction(), {
      wrapper: TransactionProvider
    })

    act(() => {
      result.current.setSelectedTransaction(mockTransaction)
      result.current.setSelectedTransaction(null)
    })

    expect(result.current.selectedTransaction).toBeNull()
  })

  it('throws error when used outside provider', () => {    
    expect(() => renderHook(() => useTransaction())).toThrow(
      'useTransaction must be used within TransactionProvider'
    )
  })

  it('renders children correctly', () => {
    const TestChild = () => <div>test child</div>
    
    const { getByText } = render(
      <TransactionProvider>
        <TestChild />
      </TransactionProvider>
    )

    expect(getByText('test child')).toBeInTheDocument()
  })
})