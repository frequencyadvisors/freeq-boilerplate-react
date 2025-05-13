import type { TransactionInterface } from "./transactionInterface";

export interface InventoryItemInterface {
    tokenId: string;
    type: InventoryItemType;
    value: number;
    name?: string;
    getTransactions(): Promise<TransactionInterface[]>;
    getTransaction(txHash: string): Promise<TransactionInterface | null>;
    transfer(amount: number, toAddress: string): Promise<void>;
    faucet(): Promise<void>;
}

export const InventoryItemType = {
    NATIVE_TOKENS: 'Native Tokens',         // Base currency of the blockchain network (eg: ETH, BERA)
    FUNGIBLE_TOKENS: 'Fungible Tokens',     // ERC-20 tokens (USDC, DAI, etc.)
    NON_FUNGIBLE_TOKEN: 'Non Fungible Tokens', // NFTs (unique assets)
    UNKNOWN: 'Unknown'
} as const;
  
export type InventoryItemType = (typeof InventoryItemType)[keyof typeof InventoryItemType];
