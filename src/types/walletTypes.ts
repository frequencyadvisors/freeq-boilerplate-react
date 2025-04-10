export interface WalletType {
    name: string;
    id: string;
    balance: number;
    address: string;
}

export interface TokenType {
    icon: string;
    name: string;
    balance: string;
    value: string;
  }

export interface ActivityType {
    id: string;
    type_id: WalletTransactionType;
    status_id: WalletTransactionStatus;
    date_claimable: string;
    other_address?: string;
    other_wallet?: {
        address: string;
        name: string;
    }
    image?: string;
    amount: number,
    fee: number;
    date_created: string;
    description?: string;
    token_info?: {
        icon: string;
        name: string;
    }
}

export enum WalletTransactionType {
    Deposit = 1,
    Send = 2,
    Received = 3,
    Withdraw = 4,
};
  
export enum WalletTransactionStatus {
    Pending = 1,
    Successful = 2,
    Failed = 3,
    Cancelled = 4,
};
  