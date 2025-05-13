import { formatEther } from 'ethers';
import { InventoryItem } from "./InventoryItem";
import type { GetNativeTokenBalanceArgs, GetNativeTokenBalanceReturn, GetTokenBalancesArgs, GetTokenBalancesReturn, MetadataOptions, SequenceIndexer, TokenBalance } from '@0xsequence/indexer'
import { SequenceIndexerClient } from './clients/SequenceIndexerClient';
import { InventoryItemType } from './types';


export class Wallet {
    address: string;
    name?: string;
    balance?: string;
    walletInventory: InventoryItem[];

    constructor(address: string, name?: string) {
        this.address = address;
        this.name = name;
        this.walletInventory = [];
    }

    async getInventory(){

        const indexer: SequenceIndexer  = SequenceIndexerClient.getInstance();

        // Get Native Token Balance like BERA
        const nativeTokenBalanceArgs : GetNativeTokenBalanceArgs = {
                accountAddress: this.address 
        }

        const nativeBalanceResult: GetNativeTokenBalanceReturn = await indexer.getNativeTokenBalance(nativeTokenBalanceArgs);

        console.log('Sequence Native Balance result:', nativeBalanceResult);

        const nativeTokenBalance = new InventoryItem(
            undefined,
            formatEther(BigInt(nativeBalanceResult.balance.balance)),
            InventoryItemType.NATIVE_TOKENS,
            'BERA' // TODO: Make it dynamic if we are supporting multi chain
        );

        this.walletInventory.push(nativeTokenBalance)

        // Get Fungible Token Balances like ERC20 coin token

        const tokenBalancesArgs: GetTokenBalancesArgs = {
            accountAddress: this.address,
            includeMetadata: true,
            includeCollectionTokens: true
        }

        const tokenBalancesResult: GetTokenBalancesReturn = await indexer.getTokenBalances(tokenBalancesArgs);

        console.log('Sequence Token Balance result:', tokenBalancesResult);

        const tokenBalances: InventoryItem[] = tokenBalancesResult.balances.map((balance: TokenBalance) => new InventoryItem(
            balance.tokenID,
            formatEther(BigInt(balance.balance)),
            this.getInventoryItenType(balance.contractType),
            balance.contractInfo?.symbol
        ));

        this.walletInventory.push(...tokenBalances);

        console.log('Wallet inventory balance:', this.walletInventory);

    }

    getInventoryItem(tokenId: string) {
        return this.walletInventory.find(item => item.tokenId === tokenId);
    }

    getInventoryItenType(contractType: string) {
        if(contractType === "ERC20") {
            return InventoryItemType.FUNGIBLE_TOKENS;
        } else if (contractType === "ERC-721" || contractType === "ERC-1155") {
            return InventoryItemType.NON_FUNGIBLE_TOKEN;
        } else {
            return InventoryItemType.UNKNOWN;
        }
    }
}