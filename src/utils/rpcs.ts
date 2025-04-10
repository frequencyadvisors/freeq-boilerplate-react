import { RPCListType } from "../types/rpcTypes";

export const RpcIds = {
  QUICKNODE: 'quicknode',
  ZEEVE: 'zeeve',
  ALTLAYER: 'altlayer',
};

export const rpcList = [
  {
    id: RpcIds.ALTLAYER,
    title: 'AltLayer',
    endpoint: 'https://orbit-berachain-testnet.alt.technology',
    description:
      'AltLayer is a decentralized protocol that facilitates the launch of native and restaked rollups with both optimistic and zk rollup stacks.',
  },
  {
    id: RpcIds.QUICKNODE,
    title: 'QuickNode',
    endpoint: 'https://frequency-testnet.quiknode.net',
    description:
      'Speed Up Your Blockchain: Our API is 2.5x Faster Than Any One. Because You Deserve More!',
  },
  {
    id: RpcIds.ZEEVE,
    title: 'Zeeve',
    endpoint: 'https://rpc.frequency.zeeve.net',
    description:
      'Zeeve is trusted by thousands of Blockchain startups, Enterprises and Web3 Developers to deploy, scale, monitor and manage their decentralized applications.',
  },
];

export const setRpc = (newValue:RPCListType) => {
  localStorage.setItem('rpc', JSON.stringify(newValue));
};

export const getRpc = () => {
  const rpc = localStorage.getItem('rpc');
  return rpc ? JSON.parse(rpc) : null;
};
