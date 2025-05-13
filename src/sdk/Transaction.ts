import { TransactionDirection } from "./types/transactionInterface";

export class Transaction {
    txHash: string;
    chainId: string;
    value: number;
    altAddress: string;
    direction: TransactionDirection
    timestamp: Date;

    constructor(txHash:string, chainId:string, value: number, altAddress:string, direction: TransactionDirection, timestamp: Date) {
        this.txHash = txHash;
        this.chainId = chainId;
        this.value = value;
        this.altAddress = altAddress;
        this.direction = direction;
        this.timestamp = timestamp;
    }
}
