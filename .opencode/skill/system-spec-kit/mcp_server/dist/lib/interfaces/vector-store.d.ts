/**
 * Abstract base class for vector store implementations.
 * All methods throw by default — subclasses must override them.
 */
declare class IVectorStoreBase {
    search(_embedding: unknown, _topK: number, _options?: unknown): Promise<unknown[]>;
    upsert(_id: string, _embedding: unknown, _metadata: Record<string, unknown>): Promise<number>;
    delete(_id: number): Promise<boolean>;
    get(_id: number): Promise<unknown | null>;
    getStats(): Promise<Record<string, number>>;
    isAvailable(): boolean;
    getEmbeddingDimension(): number;
    close(): void;
}
export { IVectorStoreBase as IVectorStore };
export type { IVectorStore as VectorStoreInterface } from '@spec-kit/shared/types';
//# sourceMappingURL=vector-store.d.ts.map