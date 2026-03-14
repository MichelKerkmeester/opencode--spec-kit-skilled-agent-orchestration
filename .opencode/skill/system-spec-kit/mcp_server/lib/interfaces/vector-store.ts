// ───────────────────────────────────────────────────────────────
// MODULE: Vector Store
// ───────────────────────────────────────────────────────────────
// INTERFACE: IVectorStore (abstract base class)
// Concrete base class providing the IVectorStore contract for JS consumers.
// TypeScript consumers use the interface in @spec-kit/shared/types.ts;
// This file exists for plain-JS files (e.g., vector-index-impl.js)
// That need a real class to extend at runtime.
/**
 * Abstract base class for vector store implementations.
 * All methods throw by default — subclasses must override them.
 */
class IVectorStoreBase {
  async search(_embedding: unknown, _topK: number, _options?: unknown): Promise<unknown[]> {
    throw new Error('Method search() must be implemented by subclass');
  }

  async upsert(_id: string, _embedding: unknown, _metadata: Record<string, unknown>): Promise<number> {
    throw new Error('Method upsert() must be implemented by subclass');
  }

  async delete(_id: number): Promise<boolean> {
    throw new Error('Method delete() must be implemented by subclass');
  }

  async get(_id: number): Promise<unknown | null> {
    throw new Error('Method get() must be implemented by subclass');
  }

  async getStats(): Promise<Record<string, number>> {
    throw new Error('Method getStats() must be implemented by subclass');
  }

  isAvailable(): boolean {
    throw new Error('Method isAvailable() must be implemented by subclass');
  }

  getEmbeddingDimension(): number {
    throw new Error('Method getEmbeddingDimension() must be implemented by subclass');
  }

  close(): void {
    throw new Error('Method close() must be implemented by subclass');
  }
}

export { IVectorStoreBase as IVectorStore };
export type { IVectorStore as VectorStoreInterface } from '@spec-kit/shared/types';
