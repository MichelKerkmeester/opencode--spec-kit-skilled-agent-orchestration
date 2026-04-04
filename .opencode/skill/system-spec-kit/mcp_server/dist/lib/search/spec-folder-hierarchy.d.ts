import type Database from 'better-sqlite3';
/**
 * Invalidate the cached hierarchy tree for a given database instance.
 * Call this whenever spec_folder membership changes (e.g. after a new memory
 * is saved to a previously unseen folder).
 */
export declare function invalidateHierarchyCache(database: Database.Database): void;
/**
 * Node in the spec-folder hierarchy tree.
 */
export interface HierarchyNode {
    path: string;
    children: HierarchyNode[];
    parent: string | null;
    memoryCount: number;
}
/**
 * Cached hierarchy tree with root nodes and path lookups.
 */
export interface HierarchyTree {
    roots: HierarchyNode[];
    nodeMap: Map<string, HierarchyNode>;
}
/**
 * Build a spec folder hierarchy tree from all spec_folder values in the database.
 *
 * Parses folder paths like "02--system-spec-kit/140-hybrid-rag/006-sprint-5"
 * into a tree structure where each path segment is a node.
 */
export declare function buildHierarchyTree(database: Database.Database): HierarchyTree;
/**
 * Get the parent path of a spec folder path.
 * "003-foo/140-bar/006-baz" -> "003-foo/140-bar"
 * "003-foo" -> null (no parent)
 */
export declare function getParentPath(folderPath: string): string | null;
/**
 * Get all ancestor folder paths for a given spec folder.
 * "003-foo/140-bar/006-baz" -> ["003-foo/140-bar", "003-foo"]
 */
export declare function getAncestorPaths(folderPath: string): string[];
/**
 * Get all sibling folder paths (same parent) for a given spec folder.
 */
export declare function getSiblingPaths(folderPath: string, tree: HierarchyTree): string[];
/**
 * Get all descendant folder paths for a given spec folder.
 */
export declare function getDescendantPaths(folderPath: string, tree: HierarchyTree): string[];
/**
 * Get related spec folders for hierarchy-aware retrieval.
 * Returns the folder itself + ancestors + siblings, ordered by relevance.
 *
 * Relevance order: self > parent > grandparent > siblings
 */
export declare function getRelatedFolders(folderPath: string, tree: HierarchyTree): string[];
/**
 * Query memories from related spec folders using hierarchy traversal.
 * Returns memory IDs from the target folder plus parent/sibling folders.
 */
export declare function queryHierarchyMemories(database: Database.Database, specFolder: string, limit?: number): Array<{
    id: number;
    spec_folder: string;
    title: string | null;
    relevance: number;
}>;
//# sourceMappingURL=spec-folder-hierarchy.d.ts.map