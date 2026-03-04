# DB_PATH extraction and import standardization

## Current Reality

`shared/config.ts` gained an exported `getDbDir()` function reading `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR` env vars. `shared/paths.ts` exports `DB_PATH` using this config. Scripts that hardcoded database paths (`cleanup-orphaned-vectors.ts`) now import from shared. Fourteen relative cross-boundary imports across scripts were converted to `@spec-kit/` workspace aliases.

## Source Metadata

- Group: Multi-agent deep review remediation (Phase 018)
- Source feature title: DB_PATH extraction and import standardization
- Summary match found: Yes
- Summary source feature title: DB_PATH extraction and import standardization
- Current reality source: feature_catalog.md
