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
    async search(_embedding, _topK, _options) {
        throw new Error('Method search() must be implemented by subclass');
    }
    async upsert(_id, _embedding, _metadata) {
        throw new Error('Method upsert() must be implemented by subclass');
    }
    async delete(_id) {
        throw new Error('Method delete() must be implemented by subclass');
    }
    async get(_id) {
        throw new Error('Method get() must be implemented by subclass');
    }
    async getStats() {
        throw new Error('Method getStats() must be implemented by subclass');
    }
    isAvailable() {
        throw new Error('Method isAvailable() must be implemented by subclass');
    }
    getEmbeddingDimension() {
        throw new Error('Method getEmbeddingDimension() must be implemented by subclass');
    }
    close() {
        throw new Error('Method close() must be implemented by subclass');
    }
}
export { IVectorStoreBase as IVectorStore };
//# sourceMappingURL=vector-store.js.map