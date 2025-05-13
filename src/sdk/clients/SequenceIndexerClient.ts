import { SequenceIndexer } from '@0xsequence/indexer';

export class SequenceIndexerClient {
  private static instance: SequenceIndexer;
  private static url: string = "https://frequency-testnet-indexer.sequence.app";
  private static apiKey: string = "AQAAAAAAAKMDfcgh3CDe_SgYl1CyJUQbr0o";
  private static useMock: boolean = false;

  private constructor() {}

  public static enableMocking() {
    this.useMock = true;
  }

  public static getInstance(): SequenceIndexer {
    if (!SequenceIndexerClient.instance) {
        SequenceIndexerClient.instance = new SequenceIndexer(
          SequenceIndexerClient.url,
          SequenceIndexerClient.apiKey
        );
    }
    return SequenceIndexerClient.instance;
  }
}
