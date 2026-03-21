---
title: "Architecture Audit"
description: "Fixed memory save wrong-session selection bug: locked freshness check in collectActiveTaskSessionIds(), hardened extractQualityScore frontmatter scope, and escaped backslash in escapeLikePattern."
trigger_phrases:
  - "system spec kit/022 hybrid rag fusion/005 architecture audit"
  - "and missing"
  - "collect active task session ids"
  - "estimate token count"
  - "estimate tokens"
  - "extract quality score"
  - "extract quality flags"
  - "escape like pattern"
  - "detect spec level from parsed"
  - "adr 001"
  - "api first"
  - "cross area"
  - "adr 002"
  - "reindex embeddings"
  - "back edge"
  - "adr 003"
  - "tree thinning"
  - "token metrics"
  - "memory indexer"
  - "memory parser"
  - "adr 004"
  - "cross ai"
  - "ultra think"
  - "import policy"
  - "check no mcp lib imports"
  - "multi line"
  - "kit/022"
  - "fusion/005"
  - "architecture"
  - "audit"
importance_tier: "normal"
contextType: "general"
_sourceTranscriptPath: "/Users/michelkerkmeester/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Opencode-Env-Public/a2dc8c2b-c6d4-4aa6-85c3-6abfea094016.jsonl"
_sourceSessionId: "a2dc8c2b-c6d4-4aa6-85c3-6abfea094016"
_sourceSessionCreated: 1773936176052
_sourceSessionUpdated: 1773942291673
captured_file_count: 0
filesystem_file_count: 10
git_changed_file_count: 0
quality_score: 1.00
quality_flags: []
spec_folder_health: {"pass":true,"score":0.75,"errors":0,"warnings":5}
---

# Architecture Audit

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-03-19 |
| Session ID | session-1773942299275-5265604d422d |
| Spec Folder | 02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit |
| Channel | main |
| Importance Tier | normal |
| Context Type | research |
| Total Messages | 2 |
| Tool Executions | 2 |
| Decisions Made | 8 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-03-19 |
| Created At (Epoch) | 1773942299 |
| Last Accessed (Epoch) | 1773942299 |
| Access Count | 1 |

---

---

## TABLE OF CONTENTS

- [CONTINUE SESSION](#continue-session)
- [PROJECT STATE SNAPSHOT](#project-state-snapshot)
- [IMPLEMENTATION GUIDE](#implementation-guide)
- [OVERVIEW](#overview)
- [DETAILED CHANGES](#detailed-changes)
- [DECISIONS](#decisions)
- [CONVERSATION](#conversation)
- [RECOVERY HINTS](#recovery-hints)
- [MEMORY METADATA](#memory-metadata)

---

<!-- ANCHOR:continue-session -->
<a id="continue-session"></a>

## CONTINUE SESSION

**Quick resume context for session continuation and handover.**

### Session State

| Field | Value |
|-------|-------|
| Session Status | IN_PROGRESS |
| Completion % | 14% |
| Last Activity | 2026-03-19T16:02:56.052Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** RESEARCH

**Recent:** Implemented three fixes: lock freshness check in collectActiveTaskSessionIds(), harden extractQualityScore frontmatter scope, escape backslash in escapeLikePattern.

**Summary:** Applied Phase 15 quality fixes to scripts/extractors (quality-scorer.ts) and scripts/memory (generate-context.js) to resolve wrong-session selection bug and quality extraction issues.

### Pending Work

- No pending tasks - session completed successfully

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: 02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit
Last: Read extractors/quality-scorer.ts
Next: Continue implementation
```

**Key Context to Review:**

- Files modified: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/spec.md, .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/plan.md, .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/tasks.md

- Check: plan.md, tasks.md, checklist.md

- Last: Implemented three quality fixes in extractors and memory pipeline scripts

<!-- /ANCHOR:continue-session -->

---

<!-- ANCHOR:project-state-snapshot -->
<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | RESEARCH |
| Active File | .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts |
| Last Action | Read extractors/quality-scorer.ts |
| Next Action | Continue implementation |
| Blockers | None |

### File Progress

| File | Status |
|------|--------|
| spec.md | EXISTS |
| plan.md | EXISTS |
| tasks.md | EXISTS |
| checklist.md | EXISTS |
| decision-record.md | EXISTS |

**Related Documentation:**
- [`spec.md`](./spec.md) - Requirements specification
- [`plan.md`](./plan.md) - Implementation plan
- [`tasks.md`](./tasks.md) - Task breakdown
- [`checklist.md`](./checklist.md) - QA checklist
- [`decision-record.md`](./decision-record.md) - Architecture decisions

**Key Topics:** `cross-ai review` | `fusion/005 architecture` | `architecture audit` | `kit/022 hybrid` | `rag fusion/005` | `spec kit/022` | `system spec` | `hybrid rag` | `source-dist alignment` | `enforcement script` | `hardening cross-ai` | `audit system` |

<!-- /ANCHOR:project-state-snapshot -->

---

<!-- ANCHOR:task-guide -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **Phase 15 quality fixes: collectActiveTaskSessionIds, extractQualityScore, escapeLikePattern** - Applied three targeted fixes to quality-scorer.ts and generate-context.js.

**Key Files and Their Roles**:

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/spec.md` - Documentation

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/plan.md` - Documentation

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/tasks.md` - Documentation

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/checklist.md` - Documentation

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/decision-record.md` - Documentation

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/agent1-root-tree-readme-config.md` - Configuration

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/agent2-mcp-tree-readme-config.md` - Configuration

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/agent3-root-source-inventory.md` - Documentation

**How to Extend**:

- Reference existing implementations as patterns for new features

**Common Patterns**:

- No patterns identified

<!-- /ANCHOR:task-guide -->

---

<!-- ANCHOR:summary -->
<a id="overview"></a>

## 2. OVERVIEW

Applied three Phase 15 quality fixes to the architecture audit follow-up work: (1) locked freshness check in `collectActiveTaskSessionIds()` to prevent wrong-session selection, (2) hardened `extractQualityScore` to be frontmatter-scoped only, (3) escaped backslash in `escapeLikePattern` to prevent LIKE semantics corruption.

**Key Outcomes**:
- Lock freshness check in collectActiveTaskSessionIds() applied (line 163-169)
- extractQualityScore hardened to frontmatter scope only
- escapeLikePattern backslash escape fix applied

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/(merged-small-files)` | Tree-thinning merged 5 small files (spec.md, plan.md, tasks.md, checklist.md, decision-record.md).  Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/spec.md : Level 3 audit specification | Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/plan.md : Reorganization implementation plan | Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/tasks.md : Atomic task map | Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/checklist.md : P0/P1/P2 architecture verification checklist | Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/decision-record.md : ADRs for boundary, compatibility, and consolidation |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/(merged-small-files)` | Tree-thinning merged 5 small files (agent1-root-tree-readme-config.md, agent2-mcp-tree-readme-config.md, agent3-root-source-inventory.md, agent4-mcp-source-inventory.md, agent5-architecture-analysis.md).  Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/agent1-root-tree-readme-config.md : Complete root tree/readme/config inventory | Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/agent2-mcp-tree-readme-config.md : Complete mcp_server tree/readme/config inventory | Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/agent3-root-source-inventory.md : Per-file root source mapping | Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-archit... |

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:detailed-changes -->
<a id="detailed-changes"></a>

## 3. DETAILED CHANGES

<!-- ANCHOR:implementation-now-full-context-both-a65c4ba4 -->
### FEATURE: Phase 15 quality fixes applied to scripts/extractors and memory pipeline

Applied three quality fixes: (1) lock freshness check in `collectActiveTaskSessionIds()` — line 163-169 to prevent wrong-session selection, (2) harden `extractQualityScore` to be frontmatter-scoped, (3) escape backslash in `escapeLikePattern` to prevent LIKE semantics corruption.

<!-- /ANCHOR:implementation-now-full-context-both-a65c4ba4 -->

<!-- ANCHOR:implementation-read-extractorsclaudecodecapturets-d75402da -->
### OBSERVATION: Read extractors/claude-code-capture.ts

read

**Files:** .opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts
**Details:** Tool: read | Status: completed | Result: 1→// --------------------------------------------------------------- 2→// MODULE: Claude Code Capture 3→// -------------------------------------------
<!-- /ANCHOR:implementation-read-extractorsclaudecodecapturets-d75402da -->

<!-- ANCHOR:implementation-read-extractorsqualityscorerts-4ad68a15 -->
### OBSERVATION: Read extractors/quality-scorer.ts

read

**Files:** .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts
**Details:** Tool: read | Status: completed | Result: 1→// --------------------------------------------------------------- 2→// MODULE: Quality Scorer 3→// ------------------------------------------------
<!-- /ANCHOR:implementation-read-extractorsqualityscorerts-4ad68a15 -->

<!-- /ANCHOR:detailed-changes -->

---

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## 4. DECISIONS

<!-- ANCHOR:decision-adr001-apifirst-boundary-contract-78969a73 -->
### Decision 1: ADR-001: API-First Boundary Contract for Cross-Area Consumption

**Context**: Evidence shows scripts consumers currently import runtime internals (@spec-kit/mcp-server/lib/*) in multiple files, which weakens encapsulation and increases change coupling.

**Timestamp**: 2026-03-19T18:44:59Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   ADR-001: API-First Boundary Contract for Cross-Area Consumption

#### Chosen Approach

**Selected**: External consumers in scripts/ should use mcp_server/api/* as the default supported boundary.

**Rationale**: Evidence shows scripts consumers currently import runtime internals (@spec-kit/mcp-server/lib/*) in multiple files, which weakens encapsulation and increases change coupling.

#### Trade-offs

**Supporting Evidence**:
- Evidence shows scripts consumers currently import runtime internals (@spec-kit/mcp-server/lib/*) in multiple files, which weakens encapsulation and increases change coupling.

**Confidence**: 70%

<!-- /ANCHOR:decision-adr001-apifirst-boundary-contract-78969a73 -->

---

<!-- ANCHOR:decision-adr002-keep-compatibility-wrappers-4dda6017 -->
### Decision 2: ADR-002: Keep Compatibility Wrappers Transitional, Not Canonical

**Context**: mcp_server/scripts/reindex-embeddings.ts invokes ../../scripts/dist/memory/reindex-embeddings.js, creating a practical compatibility back-edge. This is useful for continuity but can confuse ownership if treated as canonical.

**Timestamp**: 2026-03-19T18:44:59Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   ADR-002: Keep Compatibility Wrappers Transitional, Not Canonical

#### Chosen Approach

**Selected**: Preserve wrappers as transitional compatibility surfaces while moving canonical runbook ownership to root scripts docs.

**Rationale**: mcp_server/scripts/reindex-embeddings.ts invokes ../../scripts/dist/memory/reindex-embeddings.js, creating a practical compatibility back-edge. This is useful for continuity but can confuse ownership if treated as canonical.

#### Trade-offs

**Supporting Evidence**:
- mcp_server/scripts/reindex-embeddings.ts invokes ../../scripts/dist/memory/reindex-embeddings.js, creating a practical compatibility back-edge. This is useful for continuity but can confuse ownership if treated as canonical.

**Confidence**: 70%

<!-- /ANCHOR:decision-adr002-keep-compatibility-wrappers-4dda6017 -->

---

<!-- ANCHOR:decision-adr003-consolidate-duplicate-helper-cf1a0cd5 -->
### Decision 3: ADR-003: Consolidate Duplicate Helper Logic Into Shared Modules

**Context**: Audit found duplicated concerns in token estimation (estimateTokenCount / estimateTokens — Math.ceil(text.length/4) heuristic in tree-thinning.ts and token-metrics.ts) and quality extraction (extractQualityScore / extractQualityFlags in memory-indexer.ts and memory-parser.ts) logic across scripts and runtime modules. Duplicate implementations increase drift and inconsistent behavior risk.

**Timestamp**: 2026-03-19T18:44:59Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   ADR-003: Consolidate Duplicate Helper Logic Into Shared Modules

#### Chosen Approach

**Selected**: Consolidate duplicate helper concerns into shared modules and migrate both sides to consume them.

**Rationale**: Audit found duplicated concerns in token estimation (estimateTokenCount / estimateTokens — Math.ceil(text.length/4) heuristic in tree-thinning.ts and token-metrics.ts) and quality extraction (extractQualityScore / extractQualityFlags in memory-indexer.ts and memory-parser.ts) logic across scripts and runtime modules. Duplicate implementations increase drift and inconsistent behavior risk.

#### Trade-offs

**Supporting Evidence**:
- Audit found duplicated concerns in token estimation (estimateTokenCount / estimateTokens — Math.ceil(text.length/4) heuristic in tree-thinning.ts and token-metrics.ts) and quality extraction (extractQualityScore / extractQualityFlags in memory-indexer.ts and memory-parser.ts) logic across scripts and runtime modules. Duplicate implementations increase drift and inconsistent behavior risk.

**Confidence**: 70%

<!-- /ANCHOR:decision-adr003-consolidate-duplicate-helper-cf1a0cd5 -->

---

<!-- ANCHOR:decision-adr004-enforcement-script-hardening-e843dea5 -->
### Decision 4: ADR-004: Enforcement Script Hardening Based on Cross-AI Review

**Context**: The triple ultra-think cross-AI review identified 4 CRITICAL evasion vectors in the import-policy enforcement script (check-no-mcp-lib-imports.ts): 1. Dynamic import() expressions completely undetected 2. Relative path variants: only ../../mcp_server/lib/ matched; other depths bypass 3. Multi-line imports/requires bypass line-by-line scanning 4. Boundary narrower than architecture intent: only lib/ blocked, core/ paths pass through A subsequent 10-agent cross-AI review (2026-03-05, 5 Codex + 5 Gemini) identified 3 additional vectors documented in ADR-006 (merged from former spec 030): 5. Template literal imports bypass regex extraction 6. Same-line block comments (/ ... /) hide import tokens from line scanners 7. Transitive barrel re-export checks limited to 1 hop (no deep graph traversal) Additionally, allowlist governance gaps were identified: no TTL/expiry enforcement (now addressed by check-allowlist-expiry.ts), broad wildcard exceptions, and missing approval metadata.

**Timestamp**: 2026-03-19T18:44:59Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   ADR-004: Enforcement Script Hardening Based on Cross-AI Review

#### Chosen Approach

**Selected**: Incremental hardening in 3 tiers:

**Rationale**: The triple ultra-think cross-AI review identified 4 CRITICAL evasion vectors in the import-policy enforcement script (check-no-mcp-lib-imports.ts): 1. Dynamic import() expressions completely undetected 2. Relative path variants: only ../../mcp_server/lib/ matched; other depths bypass 3. Multi-line imports/requires bypass line-by-line scanning 4. Boundary narrower than architecture intent: only lib/ blocked, core/ paths pass through A subsequent 10-agent cross-AI review (2026-03-05, 5 Codex + 5 Gemini) identified 3 additional vectors documented in ADR-006 (merged from former spec 030): 5. Template literal imports bypass regex extraction 6. Same-line block comments (/ ... /) hide import tokens from line scanners 7. Transitive barrel re-export checks limited to 1 hop (no deep graph traversal) Additionally, allowlist governance gaps were identified: no TTL/expiry enforcement (now addressed by check-allowlist-expiry.ts), broad wildcard exceptions, and missing approval metadata.

#### Trade-offs

**Supporting Evidence**:
- The triple ultra-think cross-AI review identified 4 CRITICAL evasion vectors in the import-policy enforcement script (check-no-mcp-lib-imports.ts): 1. Dynamic import() expressions completely undetected 2. Relative path variants: only ../../mcp_server/lib/ matched; other depths bypass 3. Multi-line imports/requires bypass line-by-line scanning 4. Boundary narrower than architecture intent: only lib/ blocked, core/ paths pass through A subsequent 10-agent cross-AI review (2026-03-05, 5 Codex + 5 Gemini) identified 3 additional vectors documented in ADR-006 (merged from former spec 030): 5. Template literal imports bypass regex extraction 6. Same-line block comments (/ ... /) hide import tokens from line scanners 7. Transitive barrel re-export checks limited to 1 hop (no deep graph traversal) Additionally, allowlist governance gaps were identified: no TTL/expiry enforcement (now addressed by check-allowlist-expiry.ts), broad wildcard exceptions, and missing approval metadata.

**Confidence**: 70%

<!-- /ANCHOR:decision-adr004-enforcement-script-hardening-e843dea5 -->

---

<!-- ANCHOR:decision-adr005-handlerutils-structural-consolidation-32750c65 -->
### Decision 5: ADR-005: Handler-Utils Structural Consolidation

**Context**: During Phase 2 structural cleanup, handler helper logic was consolidated from scattered handler files into a single module: - escapeLikePattern was extracted from memory-save.ts (T013a). - detectSpecLevelFromParsed was extracted from causal-links-processor.ts (T013b). - Consumer imports were migrated to handler-utils.ts (T014), removing the documented handler cycle (CHK-013). The implementation happened during audit remediation, but the architectural rationale was not fully documented in ADR form.

**Timestamp**: 2026-03-19T18:44:59Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   ADR-005: Handler-Utils Structural Consolidation

#### Chosen Approach

**Selected**: Accept mcp_server/handlers/handler-utils.ts as the canonical consolidation module for shared handler-domain helper logic.

**Rationale**: During Phase 2 structural cleanup, handler helper logic was consolidated from scattered handler files into a single module: - escapeLikePattern was extracted from memory-save.ts (T013a). - detectSpecLevelFromParsed was extracted from causal-links-processor.ts (T013b). - Consumer imports were migrated to handler-utils.ts (T014), removing the documented handler cycle (CHK-013). The implementation happened during audit remediation, but the architectural rationale was not fully documented in ADR form.

#### Trade-offs

**Supporting Evidence**:
- During Phase 2 structural cleanup, handler helper logic was consolidated from scattered handler files into a single module: - escapeLikePattern was extracted from memory-save.ts (T013a). - detectSpecLevelFromParsed was extracted from causal-links-processor.ts (T013b). - Consumer imports were migrated to handler-utils.ts (T014), removing the documented handler cycle (CHK-013). The implementation happened during audit remediation, but the architectural rationale was not fully documented in ADR form.

**Confidence**: 70%

<!-- /ANCHOR:decision-adr005-handlerutils-structural-consolidation-32750c65 -->

---

<!-- ANCHOR:decision-adr006-regex-evasion-risk-2021c18d -->
### Decision 6: ADR-006: Regex Evasion Risk Acceptance with Time-Bounded AST Hardening

**Context**: Cross-AI review (2026-03-05, 5 Codex xhigh + 5 Gemini 3.1 Pro) identified enforcement bypass vectors that remain partially exposed in regex-based import-policy scanning. Combined with prior ADR-004 findings, the active vector set includes: 1. Template literal import variants can evade some regex extraction paths. 2. Same-line block comments can hide import-like tokens from line scanners. 3. Transitive boundary checks are currently limited in depth. 4. Relative-path and multi-line import variants can bypass simplistic scanning patterns. 5. Dynamic import forms require sustained hardening to stay covered.

**Timestamp**: 2026-03-19T18:44:59Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   ADR-006: Regex Evasion Risk Acceptance with Time-Bounded AST Hardening

#### Chosen Approach

**Selected**: Accept short-term residual regex-evasion risk while scheduling AST-based enforcement hardening as explicit, time-bounded technical debt.

**Rationale**: Cross-AI review (2026-03-05, 5 Codex xhigh + 5 Gemini 3.1 Pro) identified enforcement bypass vectors that remain partially exposed in regex-based import-policy scanning. Combined with prior ADR-004 findings, the active vector set includes: 1. Template literal import variants can evade some regex extraction paths. 2. Same-line block comments can hide import-like tokens from line scanners. 3. Transitive boundary checks are currently limited in depth. 4. Relative-path and multi-line import variants can bypass simplistic scanning patterns. 5. Dynamic import forms require sustained hardening to stay covered.

#### Trade-offs

**Supporting Evidence**:
- Cross-AI review (2026-03-05, 5 Codex xhigh + 5 Gemini 3.1 Pro) identified enforcement bypass vectors that remain partially exposed in regex-based import-policy scanning. Combined with prior ADR-004 findings, the active vector set includes: 1. Template literal import variants can evade some regex extraction paths. 2. Same-line block comments can hide import-like tokens from line scanners. 3. Transitive boundary checks are currently limited in depth. 4. Relative-path and multi-line import variants can bypass simplistic scanning patterns. 5. Dynamic import forms require sustained hardening to stay covered.

**Confidence**: 70% (Choice: 70% / Rationale: 85%)

<!-- /ANCHOR:decision-adr006-regex-evasion-risk-2021c18d -->

---

<!-- ANCHOR:decision-adr007-eliminate-libcachecognitive-symlink-c92c7bb2 -->
### Decision 7: ADR-007: Eliminate lib/cache/cognitive Symlink, Restore Canonical Paths

**Context**: mcp_server/lib/cache/cognitive is a symlink to ../cognitive, making all 74+ imports of cognitive modules (FSRS, decay, classification) resolve through a phantom cache/cognitive/ path. The cognitive subsystem has nothing to do with caching — both the Cache README ("tool output caching") and Cognitive README ("memory decay engine") confirm these are unrelated concerns. Deleting lib/cognitive/adaptive-ranking.ts as apparent dead code (zero direct imports found by grep) broke all 11 cognitive modules because the symlink masked the real dependency graph.

**Timestamp**: 2026-03-19T18:44:59Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   ADR-007: Eliminate lib/cache/cognitive Symlink, Restore Canonical Paths

#### Chosen Approach

**Selected**: Remove the symlink entirely and update all 74+ imports from cache/cognitive/X to cognitive/X using direct canonical paths.

**Rationale**: mcp_server/lib/cache/cognitive is a symlink to ../cognitive, making all 74+ imports of cognitive modules (FSRS, decay, classification) resolve through a phantom cache/cognitive/ path. The cognitive subsystem has nothing to do with caching — both the Cache README ("tool output caching") and Cognitive README ("memory decay engine") confirm these are unrelated concerns. Deleting lib/cognitive/adaptive-ranking.ts as apparent dead code (zero direct imports found by grep) broke all 11 cognitive modules because the symlink masked the real dependency graph.

#### Trade-offs

**Supporting Evidence**:
- mcp_server/lib/cache/cognitive is a symlink to ../cognitive, making all 74+ imports of cognitive modules (FSRS, decay, classification) resolve through a phantom cache/cognitive/ path. The cognitive subsystem has nothing to do with caching — both the Cache README ("tool output caching") and Cognitive README ("memory decay engine") confirm these are unrelated concerns. Deleting lib/cognitive/adaptive-ranking.ts as apparent dead code (zero direct imports found by grep) broke all 11 cognitive modules because the symlink masked the real dependency graph.

**Confidence**: 70%

<!-- /ANCHOR:decision-adr007-eliminate-libcachecognitive-symlink-c92c7bb2 -->

---

<!-- ANCHOR:decision-adr008-sourcedist-alignment-check-ae8ddc45 -->
### Decision 8: ADR-008: Add Source-Dist Alignment CI Check

**Context**: adaptive-ranking.ts source was deleted during a cleanup pass, but its compiled dist/ output survived indefinitely. The system continued to function because imports resolved through the cache/cognitive symlink to the dist/ JS file. This meant source loss was invisible — the only copy of the module logic existed as compiled JavaScript. Additional orphaned dist/ artifacts were discovered: retry.js (55+ references, zero source files) and hydra-baseline.js (compiled output with no corresponding source). ARCHITECTURE.md section 4 states dist/ policy, but no automated enforcement exists to verify source-dist alignment.

**Timestamp**: 2026-03-19T18:44:59Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   ADR-008: Add Source-Dist Alignment CI Check

#### Chosen Approach

**Selected**: Create a CI check that verifies every .js file in dist/lib/ has a corresponding .ts source file, with an allowlist for known exceptions.

**Rationale**: adaptive-ranking.ts source was deleted during a cleanup pass, but its compiled dist/ output survived indefinitely. The system continued to function because imports resolved through the cache/cognitive symlink to the dist/ JS file. This meant source loss was invisible — the only copy of the module logic existed as compiled JavaScript. Additional orphaned dist/ artifacts were discovered: retry.js (55+ references, zero source files) and hydra-baseline.js (compiled output with no corresponding source). ARCHITECTURE.md section 4 states dist/ policy, but no automated enforcement exists to verify source-dist alignment.

#### Trade-offs

**Supporting Evidence**:
- adaptive-ranking.ts source was deleted during a cleanup pass, but its compiled dist/ output survived indefinitely. The system continued to function because imports resolved through the cache/cognitive symlink to the dist/ JS file. This meant source loss was invisible — the only copy of the module logic existed as compiled JavaScript. Additional orphaned dist/ artifacts were discovered: retry.js (55+ references, zero source files) and hydra-baseline.js (compiled output with no corresponding source). ARCHITECTURE.md section 4 states dist/ policy, but no automated enforcement exists to verify source-dist alignment.

**Confidence**: 70%

<!-- /ANCHOR:decision-adr008-sourcedist-alignment-check-ae8ddc45 -->

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

## 5. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Linear Sequential** conversation pattern with **1** phase segments across **1** unique phases.

##### Conversation Phases
- **Debugging** - 1 actions
- **Research** - 2 actions
- **Implementation** - 11 actions
- **Verification** - 1 actions

---

### Message Timeline

> **User** | 2026-03-19 @ 17:02:56

Implement the following plan: # Plan: Fix Memory Save Wrong-Session Selection Bug ## Context Running `generate-context.js` for the Phase 15 session produced garbage output — content from a completely different session (`c98949ff`, about `importWorkflowForHarness` debugging). Both investigation agents (Explore + ultra-think) converged on the same root cause chain. **Spec folder**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit` **Code root**: `.opencode/skill/system-spec-kit/scripts/` --- ## Root Cause Chain ``` 1. CLAUDE_CODE_SESSION env var is NOT set by Claude Code → exactSessionMatches (Priority 1) is always empty 2. pickBestCandidate() falls through to Priority 2: activeTaskMatches → Scans ~/.claude/tasks/ for.lock files → 268 stale locks exist, 148 match transcripts → Session c98949ff has a zombie.lock → selected as "active" 3. Time window check passes (12-hour fallback is too wide) → c98949ff updated at 06:59, invocation at 15:09 → Lower bound = 15:09 - 12h = 03:09 → 06:59 passes 4. Alignment check (safety net) fails to catch it: → Spec affinity: no anchors → WARNING only (Q1 downgrade) → File path overlap: both sessions touch system-spec-kit → false positive 5. Quality scorer reports 1.00 despite has_contamination flag → Contamination penalty is offset by structural bonuses ``` --- ## Fixes (3 targeted, zero over-engineering) ### Fix 1: Validate task lock freshness (PRIMARY — eliminates root cause) **File**: `scripts/extractors/claude-code-capture.ts` **Function**: `collectActiveTaskSessionIds()` (~line 135-175) **Current**: Treats ANY session with a `.lock` file in `~/.claude/tasks/` as "active" **Fix**: Check `.lock` file mtime — only include if modified within last 2 hours ``` Before: has.lock file? → "active" After: has.lock file AND mtime < 2 hours ago? → "active" ``` This single change would have prevented the bug. Session `c98949ff` ended 8 hours before the save — its lock would fail the freshness check. ### Fix 2: Tighten fallback time window **File**: `scripts/extractors/claude-code-capture.ts` **Function**: `candidateMatchesTimeWindow()` (~line 215-243) **Current**: When `sessionStartTs` is null, fallback lower bound = `invocationTs - 12 hours` **Fix**: Reduce to `invocationTs - 3 hours` 12 hours is far too permissive — a morning session shouldn't be eligible for an afternoon save. 3 hours covers reasonable session durations while excluding stale sessions. ### Fix 3: Contamination should reduce quality score **File**: `scripts/extractors/quality-scorer.ts` (~line 132-147) **Current**: `has_contamination` sets a flag but penalty is offset by bonuses → score stays 1.00 **Fix**: Apply contamination penalty AFTER bonuses, with a minimum floor: - Low severity: `-0.10` (after bonuses) - Medium severity: `-0.20` - High severity: `-0.30` This ensures contaminated memories are visibly degraded in quality score. --- ## Files to Modify | File | Change | LOC | |------|--------|-----| | `scripts/extractors/claude-code-capture.ts` | Fix 1: lock freshness check in `collectActiveTaskSessionIds()` | ~10 | | `scripts/extractors/claude-code-capture.ts` | Fix 2: reduce time window from 12h to 3h | ~2 | | `scripts/extractors/quality-scorer.ts` | Fix 3: contamination penalty after bonuses | ~15 | **Total**: ~27 LOC across 2 files --- ## NOT Fixing (out of scope) - **`CLAUDE_CODE_SESSION` env var**: This is a Claude Code harness issue, not our code. We can't control what env vars the CLI sets. - **Q1 alignment downgrade**: Was intentionally added for explicit CLI usage. Reverting would break legitimate direct-save workflows. - **`--session-id` CLI flag**: Good future improvement, but the lock freshness fix addresses the root cause without API changes. - **Stale lock cleanup**: The 268 zombie locks are a Claude Code issue. Our fix makes the script resilient to them. --- ## Verification After fixing: 1. **Delete the bad memory file**: `rm 005-architecture-audit/memory/19-03-26_15-09__architecture-audit.md` 2. **Rebuild dist**: `npx tsc --build --force` (from system-spec-kit root) 3. **Re-run memory save**: `node scripts/dist/memory/generate-context.js.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit` 4. **Verify correct session captured**: - Check `_sourceSessionId` matches current session - Check content references Phase 15 (symlink, MODULE_MAP, etc.) - Check `has_contamination` is absent - Check `quality_score < 1.00` if any contamination remains 5. **TypeScript compile**: `npx tsc --noEmit` from scripts/ and mcp_server/ If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/michelkerkmeester/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Opencode-Env-Public/df0fe046-5d7a-476b-9415-9e605649f6f3.jsonl

---

> **Assistant** | 2026-03-19 @ 17:02:56

Implement the following plan: # Plan: Fix Memory Save Wrong-Session Selection Bug ## Context Running `generate-context.js` for the Phase 15 session produced garbage output — content from a completely ... → Now I have full context on both files.  Let me implement all three fixes. Used tools: edit, edit, read and 8 more.

**Tool: edit**
Tool: edit

**Tool: edit**
Tool: edit

**Tool: read**
Tool: read

**Tool: read**
Tool: read

**Tool: edit**
Tool: edit

**Tool: edit**
Tool: edit

**Tool: edit**
Tool: edit

**Tool: edit**
Tool: edit

**Tool: bash**
Tool: bash

**Tool: bash**
Tool: bash

---

<!-- /ANCHOR:session-history -->

---

<!-- ANCHOR:recovery-hints -->
<a id="recovery-hints"></a>

## RECOVERY HINTS

**Diagnostic guidance for common session recovery scenarios.**

### Recovery Scenarios

| Scenario | Symptoms | Recovery Action |
|----------|----------|-----------------|
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume 02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit", limit: 10 })

# Verify memory file integrity
ls -la 02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit --force
```

### Recovery Priority

1. **Verify spec folder exists** - Check path is correct
2. **Load memory context** - Use memory_search to surface prior work
3. **Review last session state** - Check PROJECT STATE SNAPSHOT
4. **Validate pending tasks** - Review CONTINUE SESSION section
5. **Resume with handover prompt** - Use continuation template above

### Session Integrity Checks

| Check | Status | Details |
|-------|--------|---------|
| Memory File Exists |  |  |
| Index Entry Valid |  | Last indexed:  |
| Checksums Match |  |  |
| No Dedup Conflicts |  |  |
<!-- /ANCHOR:recovery-hints -->

---

---

<!-- ANCHOR:metadata -->
<a id="memory-metadata"></a>

## MEMORY METADATA

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1773942299275-5265604d422d"
spec_folder: "02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit"
channel: "main"

# Git Provenance (M-007d)
head_ref: ""
commit_ref: ""
repository_state: "unavailable"
is_detached_head: No

# Classification
importance_tier: "normal"  # constitutional|critical|important|normal|temporary|deprecated
context_type: "research"        # research|implementation|decision|discovery|general

# Memory Classification (v2.2)
memory_classification:
  memory_type: "semantic"         # episodic|procedural|semantic|constitutional
  half_life_days: 365     # decay half-life in days (0 = never decays)
  decay_factors:
    base_decay_rate: 0.9981           # 0.0-1.0, daily decay multiplier
    access_boost_factor: 0.1   # boost per access (default 0.1)
    recency_weight: 0.5             # weight for recent accesses (default 0.5)
    importance_multiplier: 1 # tier-based multiplier

# Session Deduplication (v2.2)
session_dedup:
  memories_surfaced: 0   # count of memories shown this session
  dedup_savings_tokens: 0   # tokens saved via deduplication
  fingerprint_hash: "716d637ee95161019093aa38edfb06ab1e436d52"         # content hash for dedup detection
  similar_memories:

    []

# Causal Links (v2.2)
causal_links:
  caused_by:

    []

  supersedes:

    []

  derived_from:

    []

  blocks:

    []

  related_to:

    []

# Timestamps (for decay calculations)
created_at: "2026-03-19"
created_at_epoch: 1773942299
last_accessed_epoch: 1773942299
expires_at_epoch: 1781718299  # 0 for critical (never expires)

# Session Metrics
message_count: 2
decision_count: 8
tool_count: 2
file_count: 10
captured_file_count: 0
filesystem_file_count: 10
git_changed_file_count: 0
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "cross-ai review"
  - "fusion/005 architecture"
  - "architecture audit"
  - "kit/022 hybrid"
  - "rag fusion/005"
  - "spec kit/022"
  - "system spec"
  - "hybrid rag"
  - "source-dist alignment"
  - "enforcement script"
  - "hardening cross-ai"
  - "audit system"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "system spec kit/022 hybrid rag fusion/005 architecture audit"
  - "and missing"
  - "collect active task session ids"
  - "estimate token count"
  - "estimate tokens"
  - "extract quality score"
  - "extract quality flags"
  - "escape like pattern"
  - "detect spec level from parsed"
  - "adr 001"
  - "api first"
  - "cross area"
  - "adr 002"
  - "reindex embeddings"
  - "back edge"
  - "adr 003"
  - "tree thinning"
  - "token metrics"
  - "memory indexer"
  - "memory parser"
  - "adr 004"
  - "cross ai"
  - "ultra think"
  - "import policy"
  - "check no mcp lib imports"
  - "multi line"
  - "kit/022"
  - "fusion/005"
  - "architecture"
  - "audit"

key_files:
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/spec.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/plan.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/tasks.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/checklist.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/decision-record.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/agent1-root-tree-readme-config.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/agent2-mcp-tree-readme-config.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/agent3-root-source-inventory.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/agent4-mcp-source-inventory.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/agent5-architecture-analysis.md"

# Relationships
related_sessions:

  []

parent_spec: "02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit"
child_sessions:

  []

# Embedding Info (populated by indexer)
embedding_model: "nomic-ai/nomic-embed-text-v1.5"
embedding_version: "1.0"
chunk_count: 1
```

<!-- /ANCHOR:metadata -->

---

*Generated by system-spec-kit skill v1.7.2*

