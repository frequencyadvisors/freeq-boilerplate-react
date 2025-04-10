export interface ClipboardValueType {
    name?: string;
    hash?: string;
    address?: string;
}

export interface AddressType extends ClipboardValueType {
    value: ClipboardValueType | string;
    display?: string;
    canCopy?: boolean;
    customId?: string;
}