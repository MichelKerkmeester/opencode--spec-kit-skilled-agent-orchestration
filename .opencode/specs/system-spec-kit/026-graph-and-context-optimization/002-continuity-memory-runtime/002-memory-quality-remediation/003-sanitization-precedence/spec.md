---
title: "...d-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/003-sanitization-precedence/spec]"
description: "Phase 3 of the memory-quality remediation train scopes PR-5 and PR-6 only: trigger-phrase sanitization plus a precedence-only gate for decision extraction."
trigger_phrases:
  - "phase 3 sanitization precedence"
  - "trigger phrase sanitization"
  - "decision precedence gate"
  - "pr-5 pr-6"
  - "f-ac3"
  - "degraded payload regression"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/003-sanitization-precedence"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["spec.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->"
---
# Feature Specification: Phase 3 — Sanitization & Decision Precedence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->

---

**Phase Overview**

Phase 3 is the packet's P2 child spec. It isolates the two behavior-sensitive fixes that the parent packet intentionally deferred until the low-risk foundation and metadata phases landed first: PR-5 for D3 trigger-phrase sanitization and PR-6 for the D2 precedence-only decision gate. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:177-183] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:216-223] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1159]

The D3 side of this phase is not a generic cleanup. The research narrowed it to a sanitizer-backed removal of unconditional junk while explicitly keeping `ensureMinTriggerPhrases()` as the guarded low-count fallback. The concrete targets are path fragments, standalone stopwords, synthetic adjacency bigrams, and narrow ID-style prefixes, with the empirical iteration-15 corpus showing 230 removable trigger occurrences, 10.08% total removal, and zero observed false positives under the tuned rules. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:81-82] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1465-1469] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:31-55]

The D2 side of this phase is also intentionally narrow. The accepted fix is a precedence-only hardening at the `extractDecisions()` boundary so authored decisions win when authoritative raw arrays exist, without broadly disabling lexical fallback for malformed or decision-less payloads. The degraded-payload regression is therefore a first-class acceptance condition, not a side test. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:81-82] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:103-112] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1459-1463] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1512-1518]

This child spec exists to turn that narrowed research into an implementation-ready scope boundary. It does not absorb D1, D4, D5, D7, refactor PR-8, or reviewer guardrail PR-9, and it does not reopen the parent packet's sequencing. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/plan.md:57-65] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/tasks.md:64-83] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/checklist.md:57-68]

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value | Source |
|-------|-------|--------|
| Level | 2 | [SOURCE: .opencode/skill/system-spec-kit/templates/level_2/spec.md:20-30] |
| Priority | P2 | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:181-181] |
| Status | Complete | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/003-sanitization-precedence/implementation-summary.md:35-45] |
| Created | 2026-04-07 | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:177-183] |
| Parent Spec | `../spec.md` | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:173-200] |
| Parent Plan | `../plan.md` | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/plan.md:57-65] |
| Parent Tasks | `../tasks.md` | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/tasks.md:64-73] |
| Phase | 3 of 5 | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:181-181] |
| Predecessor | `002-single-owner-metadata` | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:181-181] |
| Successor | `004-heuristics-refactor-guardrails` | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:182-182] |
| PR Scope | PR-5 for D3 and PR-6 for D2 | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1159] |
| Primary Fixtures | F-AC3, F-AC2, degraded-payload regression | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:199-199] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1159] |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 3** of the five-phase memory-quality remediation packet, and it is the only child phase assigned to the P2 band. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:177-183]

**Scope Boundary**: Implement only the D3 sanitizer path and the D2 precedence-only gate, together with the fixtures and validation needed to prove those two changes safe. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:81-82] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1159]

**Dependencies**:
- Phase 2 must close first because the parent handoff chain makes `002-single-owner-metadata` the immediate predecessor for this child spec. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:198-199]
- Phase 4 is explicitly blocked on PR-5 and PR-6 being merged with green D2 and D3 fixtures. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:199-200]

**Deliverables**:
- PR-5 scope: a new trigger-phrase sanitizer module, workflow integration, semantic-topic integration, and F-AC3 fixture coverage. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158]
- PR-6 scope: a precedence-only lexical gate, authored-decision preservation, F-AC2 coverage, and the degraded-payload regression fixture. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1159-1159]

**Changelog**:
- When this phase closes, refresh the phase-specific changelog file under `../changelog/` following the parent packet rule for child-phase changelogs. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:191-191]
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 3 needs to improve retrieval and rendered decision quality without deleting the safety valves that still help malformed inputs. The packet research narrowed this slice to two specific contracts: remove empirically proven trigger/topic junk, and make authored decision arrays outrank lexical placeholders only when those authoritative arrays actually exist. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1518]

D3 is a paired retrieval-quality defect, not a single parser bug. The research showed that saved `trigger_phrases` are polluted by folder-token reinsertion after filtering in `workflow.ts:1271-1295`, while `Key Topics` can emit synthetic bigrams because topic extraction counts n-grams after aggressive stopword removal collapses non-adjacent source words together. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:46-46] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:65-65] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-004.md:20-33]

The symptoms are concrete and already reproduced in packet evidence: slash-bearing path fragments like `kit/026`, generic singletons like `graph` and `and`, and stopword-collapsed bigrams like `tiers full` and `level spec` were observed in broken outputs. The accepted remediation is therefore targeted sanitization, not wholesale suppression, because the fallback path still matters when trigger coverage is genuinely sparse. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:53-53] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-004.md:3-4] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:82-82] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:214-214]

D2 is a semantic corruption defect caused by the decision extractor's dependency on normalized carriers only. `extractDecisions()` never reads raw `keyDecisions` directly, so if `_manualDecisions` and decision-typed observations are absent at that boundary, the lexical placeholder branch remains eligible and emits `observation decision N` or `user decision N`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:44-44] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:63-63] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-003.md:17-30] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:44-73]

The narrowed D2 fix is deliberately conservative. The packet rejected a mode-wide lexical shutdown because degraded payloads still benefit from lexical fallback when they genuinely lack authored decisions. This phase therefore has to preserve a meaningful decision section for degraded inputs while preventing lexical placeholders from outranking authored decision arrays. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:81-81] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:110-112] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1461-1463] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1517]

The parent packet already encoded this as the 3 -> 4 handoff rule: trigger phrases must be clean, authored decisions must win, lexical fallback must sit behind a precedence predicate, and the degraded-payload regression must be green before Phase 4 begins. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:199-200]

### Purpose

Ship the narrowest safe Phase 3 slice: sanitize trigger phrases and topic bigrams with the empirical iteration-15 contract, add the authored-decision precedence gate, and prove both changes with fixture-backed verification that keeps degraded payload behavior intact. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1518]
<!-- /ANCHOR:problem -->

> **Memory save contract (cross-ref):** Memory saves in this packet follow the compact retrieval wrapper contract owned by `system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/006-memory-duplication-reduction/`, the implementation host for the `001-research-graph-context-systems/006-research-memory-redundancy/` research findings. Canonical narrative ownership stays in the packet decision record and `implementation-summary.md`; memory files carry only canonical-doc pointers, distinguishing evidence, continuation state, and recovery metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]

---

### User Stories

### Story 1 - Sanitized trigger phrases

As a retrieval consumer, I want saved `trigger_phrases` to exclude path fragments, standalone stopwords, and synthetic junk so that memory search does not index obvious garbage terms. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:46-46] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:21-39]

**Given** a payload whose folder path or summary text could yield fragments such as `kit/026`, `and`, or `with phases` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-004.md:23-25] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:24-27]

**When** Phase 3's sanitizer runs inside the PR-5 flow [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158]

**Then** the saved trigger list keeps legitimate short names via the allowlist, removes empirically validated junk classes, and still leaves the guarded fallback path available when phrase count is truly low. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:37-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:41-55] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:82-82]

### Story 2 - Topic bigrams stay source-adjacent

As a reader of the rendered memory file, I want `Key Topics` to represent adjacent source phrases rather than stopword-collapsed artifacts so the topic list remains interpretable. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-004.md:15-18] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:82-82]

**Given** summary text that contains meaningful nouns separated by numerals or stopwords [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-004.md:16-17]

**When** the semantic-signal extractor generates topic candidates during PR-5 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158]

**Then** the phase must reject synthetic bigrams such as `tiers full` and `level spec` while preserving valid adjacent phrases such as `spec kit`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:123-123] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-004.md:25-29]

### Story 3 - Authored decisions beat placeholders

As a memory consumer, I want authored decisions from raw decision arrays to beat lexical placeholders so the DECISIONS section preserves the actual decision content. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:44-44] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:103-108]

**Given** a payload that still carries `keyDecisions` or `decisions`, even if normalization missed them earlier in the flow [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:44-48] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:65-73]

**When** the precedence gate evaluates the lexical fallback predicate at `decision-extractor.ts:381-384` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1159-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:47-48]

**Then** the phase must block `observation decision N` and `user decision N` placeholders and return authored decisions instead. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-003.md:17-24] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1459-1463]

### Story 4 - Degraded payloads still produce meaningful decisions

As an operator handling malformed or partially normalized JSON, I want degraded payloads to keep a meaningful decision section when no authored decision arrays exist, rather than losing decisions entirely. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:110-112] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1517]

**Given** a payload where `keyDecisions` is missing but `sessionSummary`, observations, or user prompts still contain decision-like narrative [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1517]

**When** the D2 precedence-only gate runs [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1461-1463]

**Then** lexical fallback remains allowed only for that degraded case, and the degraded-payload regression fixture proves the phase did not over-tighten the predicate. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:199-199] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1517]
<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope

- A new `lib/trigger-phrase-sanitizer.ts` module that packages the empirical Phase 3 junk classes: path fragments, standalone stopwords, synthetic bigrams, suspicious prefixes, and a narrow short-name allowlist. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:31-39]
- Workflow-side sanitization at the folder-token append seam in `workflow.ts:1271-1298`, with the low-count fallback preserved instead of removed. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:82-82] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158]
- Semantic-topic sanitization at `semantic-signal-extractor.ts:260-284` so non-adjacent stopword-collapsed bigrams are rejected before they reach rendered `Key Topics`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:65-65] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158]
- A precedence-only D2 patch at `decision-extractor.ts:182-185,381-384` that lets authored raw decisions win without deleting degraded lexical fallback behavior. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1159-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1459-1463]
- Fixture work for F-AC3, F-AC2, and the degraded-payload regression named in the PR train and parent handoff contract. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:199-200]
- Verification through fixture replays, `generate-context.js --json`, and `validate.sh` for this child folder. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:230-237]

### Out of Scope

- D1 truncation, D4 importance-tier synchronization, D5 predecessor discovery, D7 provenance injection, PR-8 refactor work, and PR-9 reviewer upgrades. Those belong to other phases in the packet. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:179-183] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/plan.md:39-73]
- Any speculative D6 production patch. The research kept D6 out of the production PR train until a trustworthy reproducer exists. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1483-1487]
- Parent phase-map edits, sibling-phase fixture authoring, or changes to already-shipped packet documentation outside this child folder. The parent packet tracks those as separate work items and status surfaces. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:185-200] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/tasks.md:64-90]
- Historical migration of old memory files. The PR train leaves that to optional PR-10 after the core fixes. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:227-228] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1522-1524]

### Files to Change

| File Path | Change Type | Description | Source |
|-----------|-------------|-------------|--------|
| `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts` | Create | Centralize the empirical blocklist and allowlist contract for PR-5. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:31-39] |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modify | Sanitize folder-derived trigger additions without deleting `ensureMinTriggerPhrases()`. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:82-82] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158] |
| `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts` | Modify | Reject non-adjacent synthetic bigrams in the topic-extraction path. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:65-65] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158] |
| `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts` | Modify | Tighten the lexical predicate so authored decisions take precedence without removing degraded fallback. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1159-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:47-73] |
| Phase 3 test fixtures | Create / Modify | Add F-AC3, F-AC2, and degraded-payload regression coverage. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1514-1518] |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Why It Exists | Source |
|----|-------------|---------------|--------|
| REQ-301 | PR-5 must create a dedicated sanitizer module instead of relying on one-off inline filters. | The PR train explicitly allocates a new module to D3. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158] |
| REQ-302 | PR-5 must preserve `ensureMinTriggerPhrases()` while removing unconditional junk. | The final remediation matrix retained that fallback intentionally. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:82-82] |
| REQ-303 | PR-5 must sanitize both persisted triggers and rendered semantic topics. | D3 has two concrete owners, not one. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:65-65] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158] |
| REQ-304 | PR-6 must harden the lexical predicate so authored decisions win when authoritative raw arrays exist. | Iteration 13 fixed the exact patch boundary. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:47-73] |
| REQ-305 | PR-6 must preserve degraded lexical fallback when authored arrays are genuinely absent. | The degraded-payload fixture is a required regression guard. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1517] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Acceptance Criterion | Evidence Required | Source |
|----|----------------------|-------------------|--------|
| F-AC3 | Saved `trigger_phrases` and rendered `Key Topics` exclude path fragments, standalone stopwords, suspicious prefixes, and synthetic bigrams introduced by stopword-collapsed adjacency. | Fixture replay proves junk phrases are absent from both trigger and topic surfaces. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:82-82] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158] |
| F-AC3-ZFP | The Phase 3 sanitizer demonstrates zero observed false positives against the iteration-15 tuned corpus categories and preserves allowlisted short names such as `mcp`. | Unit tests plus fixture assertions show no legitimate short-name removals under the agreed blocklist. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:37-44] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:52-59] |
| F-AC2 | When authoritative authored decisions are present, the DECISIONS section never emits `observation decision N` or `user decision N`. | Targeted decision-extractor fixture proves authored decisions win over lexical placeholders. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:199-199] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1159-1159] |
| F-REG-D2 | When `keyDecisions` is missing but narrative decisions still exist elsewhere in the payload, degraded lexical fallback still yields meaningful decisions instead of an empty section. | A dedicated degraded-payload regression fixture remains green after the precedence gate lands. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:199-199] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1517] |
| PHASE-GATE | Phase 4 can only begin after F-AC2, F-AC3, and the degraded-payload regression are green together. | Parent handoff row updated to show the phase's completion contract is met. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:199-200] |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## L2: NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Rationale | Source |
|----|-------------|-----------|--------|
| NFR-01 | The sanitizer must preserve zero observed false positives against the tuned iteration-15 blocklist simulation. | The empirical filter only earned acceptance because it removed 10.08% of trigger occurrences with zero observed false positives. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:40-44] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:54-54] |
| NFR-02 | `ensureMinTriggerPhrases()` must remain present and functional after PR-5. | The final remediation matrix explicitly keeps that fallback as the only guarded folder-derived recovery path. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:82-82] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:214-214] |
| NFR-03 | The D2 patch must be precedence-only, not a mode-wide lexical shutdown. | The packet rejected broad lexical suppression because degraded payloads still need fallback behavior. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:221-221] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1461-1463] |
| NFR-04 | The D3 patch must remain mode-agnostic across shared save paths. | Gen-3 explicitly called out D3 as a shared-mode defect, so the fix cannot assume JSON-mode-only behavior. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1467-1469] |
| NFR-05 | Verification should prefer localized fixtures over full pipeline runs, with full `generate-context.js` execution reserved for final confirmation. | The research verification strategy limits full end-to-end runs to the end of the phase. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:230-237] |
<!-- /ANCHOR:risks -->

---

## L2: EDGE CASES

| Scenario | Required Behavior | Why It Matters | Source |
|----------|-------------------|----------------|--------|
| Raw authored decisions exist, but normalized carriers are empty. | The precedence gate must still block placeholder generation and route authored decisions into the final output. | This is the exact D2 failure shape the phase is meant to close. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-003.md:17-24] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:46-48] |
| `keyDecisions` is absent, but `sessionSummary` or prompts still contain decision-like narrative. | Lexical fallback remains enabled so degraded payloads still yield meaningful decision output. | The packet explicitly protects this degraded case from regression. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1462-1463] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1517] |
| Folder names produce slash-bearing fragments or ID-shaped phrases such as `kit/026` or `phase 7 cocoindex`. | The sanitizer must reject the fragment or prefix pattern before persistence. | Those are the empirically confirmed junk classes in the corpus study. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:24-25] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:33-38] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:53-59] |
| Legitimate short names such as `mcp` appear in the trigger set. | The allowlist must preserve them even though they are short tokens. | The empirical D3 work found legitimate short names rare but real. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:28-29] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:44-45] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:52-59] |
| Topic extraction sees non-adjacent nouns become adjacent after stopword removal. | The semantic-topic path must reject the synthetic bigram rather than emit it into `Key Topics`. | This is the second concrete D3 owner and cannot be solved by workflow filtering alone. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-004.md:15-18] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-004.md:23-25] |
| Trigger counts are genuinely sparse after sanitization. | The phase keeps `ensureMinTriggerPhrases()` instead of deleting fallback behavior outright. | The narrowed remediation preserved the recovery path by design. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:82-82] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:214-214] |

---

## 6. RISKS & DEPENDENCIES

| Dependency | Type | Status | Why It Matters | Source |
|------------|------|--------|----------------|--------|
| Parent packet phase ordering | Internal | Required | The parent packet defines this child as Phase 3 of 5 and blocks Phase 4 on Phase 3 completion criteria. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:177-200] |
| Parent P2 plan grouping | Internal | Required | The parent plan already isolates D3 and D2 as the behaviorally sensitive P2 group. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/plan.md:57-65] |
| Parent deferred task inventory | Internal | Required | The parent tasks file already names the D3 and D2 work items this child spec must now detail. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/tasks.md:64-73] |
| PR owner map | Internal | Required | The PR train fixes the canonical file:line ownership for PR-5 and PR-6. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1159] |
| Iteration 13 precedence-gate design | Research | Required | This iteration fixes the exact D2 branch boundary and degraded-fallback guard. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:44-73] |
| Iteration 15 empirical filter-list build | Research | Required | This iteration fixes the D3 blocklist classes, allowlist, and zero-false-positive target. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:21-59] |
| `validate.sh` for the phase folder | Tooling | Required | The parent handoff rules require each child phase to validate independently before the next phase begins. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:187-190] |

---

### Prior Art

1. The parent phase map already defines this child as the PR-5 and PR-6 phase and names the exact handoff contract required to unlock Phase 4. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:181-182] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:199-200]

2. The parent plan groups D3 and D2 together under P2 because they are behaviorally sensitive and need fixture-first rollout rather than blanket behavior changes. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/plan.md:57-65]

3. The parent tasks file already establishes the baseline implementation placeholders this child spec is expected to refine into execution order and fixture detail. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/tasks.md:68-73]

4. Iteration 3 established that D2 is caused by the decision extractor's normalized-carrier dependency and placeholder lexical fallback, not by template rendering. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-003.md:17-37]

5. Iteration 4 established that D3 has two owners: workflow-side folder-token reinsertion and semantic-topic bigram generation over a stopword-collapsed token stream. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-004.md:20-41]

6. Iteration 13 converted D2 from diagnosis into a concrete precedence-gate design by identifying `decisionObservations.length === 0 && processedManualDecisions.length === 0` as the predicate that must be tightened. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:44-73]

7. Iteration 15 converted D3 from diagnosis into an empirical filter contract by defining the blocklist categories, the short-name allowlist, and the zero-observed-false-positive success target. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:21-59]

8. Appendix D.1 and D.3 in the canonical research synthesis are the authoritative fix-and-test summary for this phase, including the precedence-only D2 recommendation and the degraded-payload regression fixture. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1459-1469] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1512-1518]

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the eventual implementation rehydrate authored decisions directly inside `extractDecisions()` or extract that mapping into a shared helper so the raw and normalized paths cannot drift later? [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:80-82]

- Should a later follow-up introduce a frequency-based or reviewer-backed singleton suppressor for residue terms such as `graph` and `research`, or keep that outside Phase 3's narrow regex contract? [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:55-64]
<!-- /ANCHOR:questions -->
