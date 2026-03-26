---
title: "Runtime remediation, revalidation, and auto-repair workflows"
description: "Maps the live runtime safety surface for remediation: preflight checks, V-rule enforcement, save-time auto-fix and revalidation, health auto-repair, validation feedback, and checkpoint-backed rollback."
---

# Runtime remediation, revalidation, and auto-repair workflows

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This category captures the runtime remediation surface that now exists across the MCP server rather than inside one isolated "repair" module. In practice, remediation happens in several layers: `memory_save` can preview failures in `dryRun`, reject hard validation problems before mutation, auto-fix some recoverable formatting issues, and stop or downgrade later indexing when stronger validation says the memory is unsafe. Save-time revalidation is split across `preflight.ts`, the V-rule bridge, the quality loop, and the pre-storage quality gate.

Operator remediation lives in `memory_health`, which can diagnose inconsistencies and, with explicit confirmation, perform bounded repair actions. Human-in-the-loop revalidation lives in `memory_validate`, which feeds confidence, promotion, negative feedback, and learned-feedback pipelines after results are used, while checkpoints provide the rollback safety net around destructive or high-risk remediation work. This means audit phase `021-remediation-revalidation` is now a real runtime category: the system both blocks bad writes and exposes targeted repair and revalidation paths after data has already been indexed.

## 2. CURRENT REALITY

The remediation surface is distributed but coherent:

- `memory_save` is the orchestration layer. It parses the file, optionally runs `runPreflight()`, exposes dry-run summaries, executes V-rule disposition checks, runs the quality-loop auto-fix pass, evaluates semantic sufficiency and template-contract gates, applies the pre-storage quality gate, and then either persists, skips indexing, or rejects the save.
- `preflight.ts` is the earliest save-time guard. It validates anchor structure, duplicate risk, approximate token budget, and content-size bounds. In `dryRun` mode it reports whether the write would pass without mutating files, the database, or indexes. In normal mode it throws structured `PreflightError`s unless the caller explicitly uses `skipPreflight:true`.
- The V-rule bridge adds compiled runtime policy validation without coupling the handler directly to the source TypeScript validator. Its live dispositions are `abort_write`, `write_skip_index`, and `write_and_index`. If the validator cannot be loaded, the bridge degrades gracefully with warnings instead of crashing the save path.
- The quality loop is the first repair-oriented stage, not just a scoring pass. When `SPECKIT_QUALITY_LOOP` is enabled, it scores trigger phrases, anchor integrity, token budget, and coherence, then retries immediate auto-fixes up to 2 times by default. The built-in fixes are narrow and structural: re-extract trigger phrases, normalize unclosed anchors, and trim oversized content to the shared character budget.
- The quality loop can return improved content even on rejection. `memory_save` uses that to surface diagnostics and, on successful downstream clearance, persist rewritten content safely. If the loop rejects, the handler returns `status: 'rejected'`, and the atomic save path treats that as a rollback and cleanup case rather than retrying through persistence.
- The pre-storage quality gate is still live after earlier save-time repair stages. It evaluates three layers: structural validity, weighted content-quality density, and semantic near-duplicate detection. The gate is enabled by default, supports a persisted 14-day warn-only rollout window, and can still allow-through while logging "would reject" decisions during calibration.
- `save-quality-gate.ts` also contains a targeted short-critical exception path, so certain short decision-style memories can survive structural checks when they still carry enough meaningful signals. That makes the gate a calibration layer, not a blunt minimum-length filter.
- `memory_health` is the operator-facing remediation tool. In `reportMode: "full"` it inspects database connectivity, vector search readiness, FTS consistency, alias divergence, and general integrity. With `autoRepair:true`, it never executes immediately; the caller must repeat the request with `confirmed:true`.
- Confirmed `memory_health` auto-repair is intentionally bounded. It can rebuild `memory_fts`, refresh the trigger cache, clean orphaned causal edges, and auto-clean orphaned vectors and chunks. The response tracks `repair.requested`, `attempted`, `repaired`, `partialSuccess`, `actions`, `warnings`, and `errors`, so mixed outcomes stay visible instead of being collapsed into a single success flag.
- `memory_health` also keeps a diagnostics-only lane. `reportMode: "divergent_aliases"` surfaces conflicting `.opencode/specs` versus `specs/` alias groups, but auto-repair is disabled there and the handler returns guidance instead of mutation.
- Runtime revalidation is not limited to save-time gates. `memory_validate`, implemented in `checkpoints.ts`, records whether a surfaced memory was actually useful. Positive feedback updates confidence, writes an adaptive ranking signal, can trigger auto-promotion, can register ground-truth selection against a query, and can learn new query terms. Negative feedback persists a dedicated demotion event and can accumulate enough evidence to suggest the memory should be updated or removed.
- Checkpoints are the rollback layer around remediation work. The same handler module exposes `checkpoint_create`, `checkpoint_list`, `checkpoint_restore`, and `checkpoint_delete`, so operators can snapshot memory state before risky cleanup or recovery operations and restore it later if a repair path goes wrong.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts` | Validation lib | Early save-time preflight checks for anchors, duplicates, token budget, and content size, with structured dry-run reporting |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/v-rule-bridge.ts` | Handler bridge | Loads compiled V-rule validation at runtime and converts failed rules into write, skip-index, or pass dispositions |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts` | Handler | Scores memory quality, applies bounded auto-fixes, and returns repaired content plus rejection metadata |
| `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts` | Validation lib | Three-layer pre-storage gate with warn-only rollout persistence and semantic dedup rejection |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | Handler | Main orchestration path that wires preflight, V-rules, quality loop, later validation gates, dry-run, rejection, and rollback semantics together |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts` | Handler | Exposes checkpoint rollback tools and the `memory_validate` revalidation pathway for confidence, promotion, and learned feedback |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Handler | Diagnostics and explicitly confirmed auto-repair for FTS, trigger cache, orphaned edges, vectors, chunks, and alias-health reporting |

## 4. SOURCE METADATA

- Group: Remediation and Revalidation
- Source feature title: Runtime remediation, revalidation, and auto-repair workflows
- Source spec: Deep research remediation 2026-03-26
