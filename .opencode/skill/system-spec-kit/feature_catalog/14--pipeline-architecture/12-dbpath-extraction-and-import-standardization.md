# DB_PATH extraction and import standardization

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for DB_PATH extraction and import standardization.

## 2. CURRENT REALITY

`shared/config.ts` gained an exported `getDbDir()` function reading `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR` env vars. `shared/paths.ts` exports `DB_PATH` using this config. Scripts that hardcoded database paths (`cleanup-orphaned-vectors.ts`) now import from shared. Fourteen relative cross-boundary imports across scripts were converted to `@spec-kit/` workspace aliases.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `shared/config.ts` | Shared | Shared configuration |
| `shared/paths.ts` | Shared | DB_PATH resolver using shared getDbDir() |
| `shared/index.ts` | Shared | Re-exports DB_PATH/getDbDir for shared consumers |
| `scripts/tsconfig.json` | Script | Workspace alias resolver for @spec-kit/shared and @spec-kit/mcp-server imports |
| `scripts/memory/cleanup-orphaned-vectors.ts` | Script | DB cleanup script now consuming shared DB_PATH |
| `scripts/spec-folder/folder-detector.ts` | Script | Spec-folder scanner consuming shared DB_PATH |

### Tests

| File | Focus |
|------|-------|
| `scripts/tests/test-folder-detector-functional.js` | Functional DB-path construction checks for script resolver usage |
| `scripts/tests/test-cleanup-orphaned-vectors.js` | Script-level DB_PATH consumer coverage for cleanup flow |
| `scripts/tests/import-policy-rules.vitest.ts` | Import-standardization policy checks for @spec-kit alias usage |

## 4. SOURCE METADATA

- Group: Multi-agent deep review remediation (Phase 018)
- Source feature title: DB_PATH extraction and import standardization
- Current reality source: feature_catalog.md
