import type { InventoryItemInterface } from "./inventoryItemInterface";

export interface WalletInterface {
    getInventory(): Promise<InventoryItemInterface[]>;
    getInventoryItem(tokenId: string): Promise<InventoryItemInterface | null>;
}
