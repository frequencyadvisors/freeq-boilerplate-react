import { createContext, useContext, useState } from 'react'
import { ActivityType } from '../types/walletTypes'

type TransactionContextType = {
  selectedTransaction: ActivityType | null;
  setSelectedTransaction: (transaction: ActivityType | null) => void;
}

const TransactionContext = createContext<TransactionContextType | null>(null)

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<ActivityType | null>(null)

  return (
    <TransactionContext.Provider value={{ selectedTransaction, setSelectedTransaction }}>
      {children}
    </TransactionContext.Provider>
  )
}

export const useTransaction = () => {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error('useTransaction must be used within TransactionProvider')
  }
  return context
}
