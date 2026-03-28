## P2-001: Dry-run not actually non-mutating when eval logging enabled
- **Decision**: FIX
- **Reason**: Dry-run should be side-effect free, but both dry-run branches still drove the quality loop's eval logger. I patched the dry-run paths to disable eval-metric emission and hardened the quality-loop API so callers can explicitly suppress logging.
- **Evidence**: `handlers/memory-save.ts:137`, `handlers/memory-save.ts:920`, `handlers/memory-save.ts:1011`, `handlers/quality-loop.ts:581`
- **Impact**: medium real-world impact

## P2-002: Anchor auto-fix cannot repair repeated anchor-name count mismatches
- **Decision**: FIX
- **Reason**: The scorer already counts repeated anchor names, but the fixer only checked name presence, so repeated opens with a single close stayed broken after auto-fix. The fixer now appends the exact number of missing closers per anchor name.
- **Evidence**: `handlers/quality-loop.ts:521`
- **Impact**: low real-world impact

## P2-003: Split-brain window where DB commits but file never reaches final path
- **Decision**: REJECT
- **Reason**: The current implementation no longer reports rename failure as success. It already returns `success: false` plus `dbCommitted: true`, which is a best-effort-with-recovery contract rather than the stale success-path described in the finding.
- **Evidence**: `lib/storage/transaction-manager.ts:277`
- **Impact**: medium real-world impact

## P2-004: Delete paths commit even when secondary vector cleanup fails
- **Decision**: FIX
- **Reason**: Unexpected `vec_memories` delete failures can leave orphaned vector rows and search drift if the primary row delete still commits. I made non-legacy vector cleanup failures fatal inside the delete transaction while preserving the legacy missing-table exemption.
- **Evidence**: `lib/search/vector-index-mutations.ts:497`
- **Impact**: medium real-world impact

## P2-028: Parsed state can go stale between preflight and locked save
- **Decision**: FIX
- **Reason**: The handler could preflight one file snapshot and then save/index another if the file changed before the folder lock was acquired. The save path now reparses and re-evaluates the memory inside the lock whenever a preflight parse is being reused.
- **Evidence**: `handlers/memory-save.ts:384`, `handlers/memory-save.ts:794`
- **Impact**: medium real-world impact

## P2-036: PE reinforcement can backfill content_text without updating hash
- **Decision**: FIX
- **Reason**: Backfilling `content_text` while leaving `content_hash` stale breaks downstream change detection and hash-based dedup assumptions. Reinforcement now updates `content_hash` in the same statement when it backfills missing content.
- **Evidence**: `handlers/pe-gating.ts:147`
- **Impact**: medium real-world impact

## P2-037: Hash matches trusted blindly, no secondary verification
- **Decision**: FIX
- **Reason**: A raw hash hit is cheap but not enough when stored metadata is stale or corrupted. Dedup and preflight now verify the matched row against `content_text` or, if needed, the readable file on disk before short-circuiting as a duplicate.
- **Evidence**: `handlers/save/dedup.ts:80`, `handlers/save/dedup.ts:174`, `lib/validation/preflight.ts:159`, `lib/validation/preflight.ts:419`
- **Impact**: low real-world impact
