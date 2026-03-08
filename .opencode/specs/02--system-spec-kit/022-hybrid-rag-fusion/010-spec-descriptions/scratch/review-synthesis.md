# Review Synthesis: 010-spec-descriptions

**Generated**: 2026-03-08
**Agents**: 10 Codex CLI sub-agents (5x gpt-5.3-codex + 5x gpt-5.4)
**Scope**: spec.md, plan.md, checklist.md, memory files
**DQI Scores**: spec.md 86/100, plan.md 86/100

---

## FINDINGS SUMMARY

| Severity | Count | Status |
|----------|-------|--------|
| P0       | 3     | Must fix (memory file unusable) |
| P1       | 17    | Fix before implementation |
| P2       | 18    | Fix or schedule |
| P3       | 6     | Nit / informational |
| **Total** | **44** (pre-dedup: ~65) | |

---

## P0 FINDINGS (3) - CRITICAL

### F-01 [P0] [MEM] Memory file content mismatch
Memory file title says "Spec Folder Description System Refactor" but body content describes `036-skill-graphs` (SGQS). The entire memory artifact is from the wrong spec folder.
- **Files**: memory/08-03-26_10-24__spec-folder-description-system-refactor.md
- **Agents**: W1-A5, confirmed
- **Remediation**: Delete memory file and metadata.json. Re-run `generate-context.js` when real session data exists.

### F-02 [P0] [MEM] Message count contradiction
metadata.json says `messageCount: 2` and `messageStats.total: 2`. Memory file says `Total Messages: 3` and YAML `message_count: 3`.
- **Files**: memory/metadata.json:3,31; memory file:26,738
- **Agents**: W1-A5
- **Remediation**: Resolved by F-01 (delete both files).

### F-03 [P0] [MEM] Session state contradiction
`Session Status: BLOCKED` and `Completion %: 10%` conflict with `No pending tasks - session completed successfully`.
- **Files**: memory file:64,65,80
- **Agents**: W1-A5
- **Remediation**: Resolved by F-01 (delete both files).

---

## P1 FINDINGS (17) - FIX BEFORE IMPLEMENTATION

### F-04 [P1] [GAP] Missing tasks.md
Level 2 spec folder requires spec.md, plan.md, tasks.md, checklist.md. No tasks.md exists.
- **Files**: 010-spec-descriptions/ (folder listing)
- **Agents**: W2-A5
- **Remediation**: Create tasks.md from plan.md phases using tasks-core template.

### F-05 [P1] [CROSS] Files-to-change scope drift
spec.md lists 7 files but plan.md adds: (a) `file-writer.ts` in Phase 3, (b) new `scripts/spec-folder/generate-description.ts` in Phase 2. Neither appears in spec.md Files-to-Change table.
- **Files**: spec.md:63-73; plan.md:90,143,158
- **Agents**: W2-A1, W2-A5, W1-A4
- **Remediation**: Add both files to spec.md Files-to-Change table.

### F-06 [P1] [CROSS] Open questions Q1/Q2 stale
spec.md lists Q1 (memory name history) and Q2 (deprecate centralized file) as open. plan.md answers both: Q1 = yes (memoryNameHistory + memorySequence), Q2 = keep as aggregation artifact.
- **Files**: spec.md:183-184; plan.md:33,52,109,118
- **Agents**: W2-A1, W2-A5
- **Remediation**: Update spec.md to mark Q1/Q2 as resolved with plan decisions.

### F-07 [P1] [CROSS] Premature security checklist completion
CHK-030, CHK-031, CHK-032 marked [x] but no implementation exists. spec.md Status: "Draft", plan.md DoD items unchecked.
- **Files**: checklist.md:71-73; plan.md:66-68; spec.md:27
- **Agents**: W2-A1, W2-A5
- **Remediation**: Uncheck CHK-030/031/032 (change `[x]` to `[ ]`).

### F-08 [P1] [CROSS] Performance NFR coverage missing
NFR-P01 (<5ms per-file read) and NFR-P02 (<500ms for 500 folders) have no test scenarios in plan.md and no verification items in checklist.md.
- **Files**: spec.md:134-135; plan.md:188-198; checklist.md:54-64
- **Agents**: W2-A1, W2-A4
- **Remediation**: Add performance benchmark tests to plan Section 5 and add CHK items for NFR-P01/P02.

### F-09 [P1] [CROSS] Performance risk mitigation missing from plan
spec.md risk says "many small files" mitigated by lazy loading + in-memory cache. Plan architecture has neither mechanism.
- **Files**: spec.md:120; plan.md:82,165
- **Agents**: W2-A1
- **Remediation**: Either add lazy load/cache to plan, or revise spec risk mitigation to match plan approach.

### F-10 [P1] [CROSS] REQ-006 not fully traceable
spec.md requires specId, folderSlug, parentChain in description.json. Plan designs these fields but checklist has no CHK item verifying their presence.
- **Files**: spec.md:95-96; plan.md:103-106; checklist.md:48
- **Agents**: W2-A1
- **Remediation**: Add checklist item(s) for REQ-006 field verification.

### F-11 [P1] [DOC] Checklist summary counts wrong
Verification Summary claims P0=8 (3 verified), P1=12 (5 verified). Actual: P0=10 (4 verified), P1=14 (4 verified).
- **Files**: checklist.md:104-106
- **Agents**: W1-A3
- **Remediation**: Update summary table to P0=10 (4 verified), P1=14 (4 verified), P2=3 (0 verified).

### F-12 [P1] [DOC] ANCHOR:questions misplaced in spec.md
`<!-- ANCHOR:questions -->` opens at L126 before NFR/Edge Cases/Complexity sections. Should wrap only Open Questions.
- **Files**: spec.md:126,181,185
- **Agents**: W1-A1
- **Remediation**: Move ANCHOR:questions to wrap only the Open Questions section.

### F-13 [P1] [ARCH] SRP violation + YAGNI in PerFolderDescription
Interface mixes immutable discovery metadata (7 fields) with mutable memory state (memorySequence, memoryNameHistory). Two different uniqueness mechanisms described (sequence counter vs filesystem scan). memoryNameHistory has no consumer.
- **Files**: plan.md:92-110,118,151,156; folder-discovery.ts:34,537
- **Agents**: W2-A3, W1-A4
- **Remediation**: Split into PerFolderDescription (discovery) and MemoryTrackingState (memory). Remove memoryNameHistory until a consumer exists.

### F-14 [P1] [ARCH] Dual sources of truth without authority contract
Plan says centralized descriptions.json remains but never defines: which is authoritative at rest, what wins on conflict, whether divergence is allowed.
- **Files**: plan.md:32,82,165,168; spec.md:94,142
- **Agents**: W2-A3
- **Remediation**: Add explicit authority statement: per-folder = source of truth, centralized = derived/read-only cache.

### F-15 [P1] [CODE] Atomic write under-specified
Plan mentions "temp-then-rename" but does not require: same-directory temp files, temp cleanup on failure, symlink checks.
- **Files**: plan.md:134,158,205
- **Agents**: W1-A4, W2-A2
- **Remediation**: Specify: temp file in target directory, try/finally cleanup, O_EXCL or random temp name.

### F-16 [P1] [CODE] generatePerFolderDescription return type non-nullable
Function returns `PerFolderDescription` but should return `PerFolderDescription | null` for missing/invalid/empty spec.md.
- **Files**: plan.md:131
- **Agents**: W1-A4
- **Remediation**: Change return type to nullable or document explicit throw contract.

### F-17 [P1] [SEC] Path traversal partially covered
New per-folder generation entry points lack allowed-root validation. Existing containment only in discovery/create flows.
- **Files**: plan.md:131,142; folder-discovery.ts:543; create.sh:353
- **Agents**: W2-A2
- **Remediation**: Add mandatory root validation to generatePerFolderDescription and generate-description.ts.

### F-18 [P1] [SEC] Uniqueness guarantee not concurrency-safe
memorySequence read-modify-write has no lock/CAS. Two concurrent saves can read same value. Code says "best-effort" but spec says "guaranteed unique".
- **Files**: spec.md:87; plan.md:118,156,205; folder-discovery.ts:615
- **Agents**: W2-A2
- **Remediation**: Either downgrade spec language from "guaranteed" to "best-effort" or add file-based locking.

### F-19 [P1] [TEST] Edge-case coverage incomplete
6 of 9 spec edge cases have no matching test: very long titles, no heading, write failure, corrupted JSON, missing parent, empty task+fallback.
- **Files**: spec.md:151-163; plan.md:200-205; checklist.md:58-62
- **Agents**: W2-A4
- **Remediation**: Add test scenarios for each uncovered edge case to plan Section 5.

### F-20 [P1] [TEST] No end-to-end pipeline test
No test covers: create.sh -> description.json -> memory save -> unique filename -> aggregation.
- **Files**: plan.md:116-119,194-195; checklist.md:57,61
- **Agents**: W2-A4
- **Remediation**: Add integration test spanning full pipeline.

---

## P2 FINDINGS (18) - FIX OR SCHEDULE

### F-21 [P2] [DOC] Em dashes in spec.md
Banned punctuation character on L41, L59.
- **Agents**: W1-A1

### F-22 [P2] [DOC] Semicolons in spec.md (prose)
L67, L107 (prose context, not code blocks).
- **Agents**: W1-A1

### F-23 [P2] [DOC] Oxford commas in spec.md
L3, L38, L41, L107.
- **Agents**: W1-A1

### F-24 [P2] [DOC] Em dashes in plan.md (prose)
L68, L69, L78, L143, L281, L283, L286, L287, L304, L308. Note: semicolons in TypeScript code blocks (L98-110, L302) are FALSE POSITIVES.
- **Agents**: W1-A2

### F-25 [P2] [DOC] 8x H2 headings in checklist.md not ALL CAPS
Verification Protocol, Pre-Implementation, Code Quality, Testing, Security, Documentation, File Organization, Verification Summary.
- **Files**: checklist.md:19,31,41,54,69,79,90,100
- **Agents**: W1-A3

### F-26 [P2] [CODE] TOCTOU on filename existence check
Check-then-write is not concurrency-safe. Needs O_EXCL or similar exclusive-create semantics.
- **Files**: plan.md:90,158
- **Agents**: W1-A4

### F-27 [P2] [CODE] ensureUniqueSlug contract ambiguous
Unclear whether it returns slug or full filename. Extension ownership undefined.
- **Files**: plan.md:151,155
- **Agents**: W1-A4

### F-28 [P2] [SEC] Atomic-write hardening underspecified
No fsync, O_EXCL, or symlink checks. Predictable temp name `description.json.tmp`.
- **Files**: spec.md:119,139; plan.md:134; folder-discovery.ts:626
- **Agents**: W2-A2

### F-29 [P2] [SEC] Corrupted description.json weakly validated
Loader checks description/keywords but not specId/parentChain/memorySequence types. Spec says "regenerate on read" but code does soft fallback.
- **Files**: spec.md:157; plan.md:165; folder-discovery.ts:601-602
- **Agents**: W2-A2

### F-30 [P2] [SEC] Slug exhaustion undefined at iteration 101
Max 100 retries with no defined fallback. Attacker could force exhaustion.
- **Files**: spec.md:87; plan.md:151,154; slug-utils.ts:144,149
- **Agents**: W2-A2

### F-31 [P2] [ARCH] Migration story missing
400+ existing folders have no convergence mechanism. System stays mixed-mode indefinitely.
- **Files**: plan.md:33,170; spec.md:38,58,60
- **Agents**: W2-A3

### F-32 [P2] [ARCH] folder-discovery.ts bloat
Adding per-folder CRUD + staleness makes it both discovery engine and persistence layer. Should be separate module.
- **Files**: plan.md:77,82,127; folder-discovery.ts:425,543,720
- **Agents**: W2-A3

### F-33 [P2] [ARCH] Phase dependencies overstated
Phases 2/3/4 can be developed in parallel but not rolled out independently. Phase 3 needs description.json files from Phase 2.
- **Files**: plan.md:138,244,252
- **Agents**: W2-A3

### F-34 [P2] [ARCH] Complexity score optimistic
Claimed 35/70 but dual-store transition, backward compatibility, bash/TS integration, concurrent writes push to mid/high L2.
- **Files**: spec.md:168,173; plan.md:151,205
- **Agents**: W2-A3

### F-35 [P2] [TEST] Concurrent write coverage too shallow
Only "two saves to same folder" scenario. No repeated contention, no 10+ writers, no atomicity assertion.
- **Files**: spec.md:139; plan.md:205; checklist.md:63
- **Agents**: W2-A4

### F-36 [P2] [TEST] Vitest filesystem strategy underspecified
No stated mock vs real policy, no temp-dir strategy.
- **Files**: plan.md:192-195
- **Agents**: W2-A4

### F-37 [P2] [TEST] Missing test scenarios
Legacy mode (no per-folder files), --phase child folders, memoryNameHistory ring-buffer, negative stale-check.
- **Files**: plan.md:117,145,157,170
- **Agents**: W2-A4

### F-38 [P2] [GAP] Readiness signal mixed
spec.md Status: "Draft" but plan.md Definition of Ready items all checked.
- **Files**: spec.md:27; plan.md:61-64
- **Agents**: W2-A5

---

## P3 FINDINGS (6) - NIT / INFORMATIONAL

### F-39 [P3] [DOC] Oxford comma in plan.md (L252)
- **Agents**: W1-A2

### F-40 [P3] [CODE] Module header convention not mentioned in plan
- **Agents**: W1-A4

### F-41 [P3] [SEC] JSON injection mitigated (JSON.stringify) but no output encoding defined
- **Agents**: W2-A2

### F-42 [P3] [SEC] memoryNameHistory last-writer-wins under concurrency
- **Agents**: W2-A2

### F-43 [P3] [SEC] File permissions unspecified (mode/umask)
- **Agents**: W2-A2

### F-44 [P3] [SEC] memorySequence unbounded (MAX_SAFE_INTEGER overflow)
- **Agents**: W2-A2

---

## MEMORY FILE SECONDARY FINDINGS

These P1 findings from W1-A5 are all consequences of the P0 content mismatch (F-01) and are resolved by deleting the memory files:

- [P1] [MEM] Tool Executions: 0 contradicts extensive activity (memory:27)
- [P1] [MEM] Key files have (merged-small-files) placeholder paths (memory:202-209)
- [P1] [MEM] Metadata YAML empty/null fields (memory:692-699)
- [P1] [MEM] contextType inconsistency: general vs implementation (memory:9 vs 25)
- [P1] [MEM] Trigger phrases match skill-graphs not spec-descriptions (memory:765-798)

---

## REMEDIATION CHECKLIST

### Required Before Implementation (P0 + P1)

- [ ] **REM-01**: Delete memory/08-03-26_10-24__*.md and memory/metadata.json (F-01/02/03)
- [ ] **REM-02**: Create tasks.md from plan phases (F-04)
- [ ] **REM-03**: Add file-writer.ts and generate-description.ts to spec.md Files-to-Change (F-05)
- [ ] **REM-04**: Resolve Q1/Q2 in spec.md Open Questions (F-06)
- [ ] **REM-05**: Uncheck CHK-030/031/032 in checklist.md (F-07)
- [ ] **REM-06**: Add NFR-P01/P02 test scenarios and checklist items (F-08)
- [ ] **REM-07**: Align spec risk mitigation with plan approach (F-09)
- [ ] **REM-08**: Add checklist items for REQ-006 fields (F-10)
- [ ] **REM-09**: Fix checklist summary counts (F-11)
- [ ] **REM-10**: Fix ANCHOR:questions placement (F-12)
- [ ] **REM-11**: Split PerFolderDescription; remove memoryNameHistory (F-13)
- [ ] **REM-12**: Add authority contract for dual sources of truth (F-14)
- [ ] **REM-13**: Specify atomic write requirements fully (F-15)
- [ ] **REM-14**: Make generatePerFolderDescription return nullable (F-16)
- [ ] **REM-15**: Add root validation to new entry points (F-17)
- [ ] **REM-16**: Resolve "guaranteed" vs "best-effort" uniqueness language (F-18)
- [ ] **REM-17**: Add test scenarios for 6 uncovered edge cases (F-19)
- [ ] **REM-18**: Add end-to-end pipeline test (F-20)

### Recommended (P2)

- [ ] **REM-19**: Fix punctuation in spec.md and plan.md (F-21/22/23/24)
- [ ] **REM-20**: Convert checklist H2 headings to ALL CAPS (F-25)
- [ ] **REM-21**: Address code-level findings: TOCTOU, slug contract (F-26/27)
- [ ] **REM-22**: Harden atomic writes and JSON validation (F-28/29)
- [ ] **REM-23**: Define slug exhaustion fallback (F-30)
- [ ] **REM-24**: Add migration strategy for 400+ folders (F-31)
- [ ] **REM-25**: Extract per-folder description to separate module (F-32)
- [ ] **REM-26**: Clarify phase dependency semantics (F-33)
- [ ] **REM-27**: Reassess complexity score (F-34)
- [ ] **REM-28**: Deepen concurrency and filesystem test coverage (F-35/36/37)
- [ ] **REM-29**: Align spec status with plan readiness (F-38)

---

## AGENT PERFORMANCE

| Agent | Model | Findings | Tokens | Focus |
|-------|-------|----------|--------|-------|
| W1-A1 | gpt-5.3-codex | 4 | 23,203 | spec.md doc quality |
| W1-A2 | gpt-5.3-codex | 4 | 20,194 | plan.md doc quality |
| W1-A3 | gpt-5.3-codex | 9 | 9,056 | checklist.md doc quality |
| W1-A4 | gpt-5.3-codex | 9 | 51,694 | code accuracy |
| W1-A5 | gpt-5.3-codex | 11 | 34,605 | memory quality |
| W2-A1 | gpt-5.4 | 6 | 39,579 | cross-doc consistency |
| W2-A2 | gpt-5.4 | 9 | 102,163 | security review |
| W2-A3 | gpt-5.4 | 6 | 78,138 | architecture assessment |
| W2-A4 | gpt-5.4 | 8 | 40,363 | testing completeness |
| W2-A5 | gpt-5.4 | 7 | 42,824 | completeness gaps |
| **Total** | | **73 raw** | **441,819** | **44 deduplicated** |

---

## ARCHITECTURAL RECOMMENDATION

The architecture review (W2-A3) identified the simplest viable path:
1. Keep `description.json` as **discovery-only** (description, keywords, metadata)
2. Treat centralized `descriptions.json` as **derived/read-only**
3. Keep uniqueness at the **filesystem layer** (directory-based collision checks already work)
4. Remove `memorySequence` and `memoryNameHistory` from the description schema

This eliminates F-13, F-14, F-18, and significantly reduces F-15, F-26, F-28, F-29, F-35.
