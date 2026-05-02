# Constitutional Cache Investigation

## Question

Determine whether folder-specific constitutional-cache invalidation uses a raw `spec_folder` key while cache entries are stored with a `folder:arch|noarch` suffix.

## Finding

Yes. The cache-key format and the folder-specific invalidation format do not match.

- `get_constitutional_memories()` stores rows under `const cache_key = \`${spec_folder || 'global'}:${includeArchived ? 'arch' : 'noarch'}\`;`, so a folder-scoped entry is keyed as `specs/...:noarch` or `specs/...:arch`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:436-444]
- `clear_constitutional_cache(spec_folder)` deletes `constitutional_cache.delete(spec_folder)` when a folder is provided. That targets the raw folder string only and does not match either suffixed cache key. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:498-507]

## Impact

- A targeted clear such as `clearConstitutionalCache('specs/test-001')` is effectively a no-op for constitutional-cache entries created by the current key builder, because the stored entries are `specs/test-001:noarch` and `specs/test-001:arch`, not `specs/test-001`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:441-445] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:503-505]
- The bug is currently latent rather than broadly user-visible because the production mutation paths I checked clear the whole constitutional cache with no folder argument. That global clear path still works. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:377-381] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:509-510] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:658-660] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:53-56]
- The folder-scoped API is still exposed and has a smoke test, but the test only checks that it does not throw; it does not verify that the matching cache entries are actually removed. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:779-785]

## Conclusion

P2 confirmed: folder-specific constitutional cache invalidation is mismatched against the current cache-key format. Any future caller that relies on folder-only clears will leave stale `:arch` and `:noarch` entries behind unless the invalidation logic is updated to clear the normalized key variants instead of the raw folder string.
