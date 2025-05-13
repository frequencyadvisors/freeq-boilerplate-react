export interface TransactionInterface {
    txHash: string;
    chainId: string;
    value: number;
    altAddress: string;
    direction: TransactionDirection
    timestamp: Date;
}

export const TransactionDirection = {
    SEND: 'SEND',
    RECEIVE: 'RECEIVE'
} as const;
  
export type TransactionDirection = (typeof TransactionDirection)[keyof typeof TransactionDirection];
