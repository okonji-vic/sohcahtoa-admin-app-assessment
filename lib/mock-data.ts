import { ITransaction } from "@/interfaces/transactions"



export const mockTransactions: ITransaction[] = [
    {
      id: '1',
      reference: 'TXN-2024-001',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      amount: 1250.00,
      currency: 'USD',
      status: 'completed',
      merchant: 'Amazon Inc.',
      category: 'E-commerce',
      cardLast4: '4242',
      risk_score: 15,
      flagged: false,
    },
    {
      id: '2',
      reference: 'TXN-2024-002',
      timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
      amount: 89.99,
      currency: 'USD',
      status: 'completed',
      merchant: 'Spotify AB',
      category: 'Subscription',
      cardLast4: '5555',
      risk_score: 5,
      flagged: false,
    },
    {
      id: '3',
      reference: 'TXN-2024-003',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      amount: 5500.00,
      currency: 'USD',
      status: 'completed',
      merchant: 'Luxury Hotels Ltd',
      category: 'Travel',
      cardLast4: '3333',
      risk_score: 45,
      flagged: true,
      fraud_indicator: 'Unusual merchant location',
    },
    {
      id: '4',
      reference: 'TXN-2024-004',
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      amount: 2100.00,
      currency: 'USD',
      status: 'pending',
      merchant: 'Best Buy Corp',
      category: 'Electronics',
      cardLast4: '1234',
      risk_score: 25,
      flagged: false,
    },
    {
      id: '5',
      reference: 'TXN-2024-005',
      timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
      amount: 75.50,
      currency: 'USD',
      status: 'completed',
      merchant: 'Local Coffee Shop',
      category: 'Dining',
      cardLast4: '9999',
      risk_score: 2,
      flagged: false,
    },
    {
      id: '6',
      reference: 'TXN-2024-006',
      timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
      amount: 3200.00,
      currency: 'USD',
      status: 'failed',
      merchant: 'Unknown Merchant',
      category: 'Other',
      cardLast4: '6789',
      risk_score: 78,
      flagged: true,
      fraud_indicator: 'Blocked by issuer',
    },
  ]
  
  export const SAMPLE_CARD_NUMBERS = ['4242', '5555', '3333', '1234', '9999', '6789']
  
  export function getTransactionsByEmail(email: string, limit: number = 20): ITransaction[] {
    // Returns mock data for the purpose of this assessment, server side filtering and pagination should be used for production level application
    return mockTransactions.slice(0, Math.min(limit, mockTransactions.length))
  }
  
  export function getTransactionById(id: string): ITransaction | undefined {
    return mockTransactions.find((t) => t.id === id)
  }
  