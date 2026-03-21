// ---------------------------------------------------------------
// MODULE: Memory Frontmatter (re-export shim)
// ---------------------------------------------------------------
// Canonical implementation moved to lib/memory-frontmatter.ts.
// This shim preserves backward compatibility for existing importers.

export {
  GENERIC_MEMORY_DESCRIPTION,
  LEGACY_GENERIC_MEMORY_TRIGGER_PHRASES,
  hasLegacyGenericTriggerPhrases,
  containsLegacyGenericTriggerPhrase,
  hasGenericMemoryDescription,
  sanitizeMemoryFrontmatterTitle,
  deriveMemoryDescription,
  deriveMemoryTriggerPhrases,
} from '../lib/memory-frontmatter';
