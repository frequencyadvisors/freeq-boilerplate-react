export interface RPCListType {
    id: RpcIds.ALTLAYER,
    title: string,
    endpoint: string,
    description: string,
}

export enum RpcIds {
    QUICKNODE = 'quicknode',
    ZEEVE = 'zeeve',
    ALTLAYER = 'altlayer',
};