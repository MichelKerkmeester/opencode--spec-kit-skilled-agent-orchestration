// ───────────────────────────────────────────────────────────────
// MODULE: Spec Document Finder Lib Seam
// ───────────────────────────────────────────────────────────────
// F-016-D1-03: Lib-level wrapper around the existing `findSpecDocuments`
// implementation in `handlers/memory-index-discovery.ts`. The implementation
// can stay in handlers (it is consumed by handler-level code paths too), but
// other lib modules should depend inward on this seam instead of reaching
// across into a sibling handler module.
//
// The seam re-exports the existing function and its associated types so
// callers see no behavioral change; only the import direction is corrected.

export {
  findSpecDocuments,
  type SpecDiscoveryOptions,
  type DiscoveryFileList,
  type DiscoveryCapExceeded,
} from '../../handlers/memory-index-discovery.js';
