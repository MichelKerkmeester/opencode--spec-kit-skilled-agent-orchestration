# Audit A-09: 009-architecture-audit (100% Claim Verification)
## Summary
| Metric | Result |
|--------|--------|
| Claimed | 129/129 (100%) |
| Verified count | 129/129 boxes checked, 0 unchecked |
| Findings acted on | 7/9 sampled currently verified in code/workflows; 2/9 stale or regressed in docs/evidence |
| Template compliance | WARN |
| Evidence quality | FAIL |

### Level / Required Files
- **Level determination:** **Level 3 is correct.** The packet carries architecture ADRs, checklist verification, and multi-phase implementation history consistent with a Level 3 folder.
- **Required files:** **PASS.** `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` are all present.

### Verification notes
- The numeric completion claim is **formally true by checkbox count**: `checklist.md` contains **129 checked items** and **no `[ ]` items**.
- The packet is **not substantively “100% verified”** because multiple checked **P0/P1** claims no longer match the repository’s current state.
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` all have YAML frontmatter, `SPECKIT_TEMPLATE_SOURCE`, and anchor tags. `implementation-summary.md` has frontmatter and template source, but **no `<!-- ANCHOR:... -->` tags**.

## Findings Action Verification
| Sampled finding | Expected action | Current repo evidence | Verdict |
|---|---|---|---|
| T021 / CHK-200: integrate `check-api-boundary.sh` into the standard check pipeline | `scripts/package.json` should run the shell boundary check in `npm run check` | `.opencode/skill/system-spec-kit/scripts/package.json:11` includes `bash check-api-boundary.sh`; `npm run check --workspace=scripts` passed on 2026-03-08 | **ACTED ON** |
| T023 / CHK-202: expand boundary enforcement beyond `lib/*` | Checker should block `core/*` and `handlers/*`, not just `lib/*` | `.opencode/skill/system-spec-kit/scripts/evals/import-policy-rules.ts:8-15` now includes `@spec-kit/mcp-server/core`, `@spec-kit/mcp-server/handlers`, and a variable-depth relative regex | **ACTED ON** |
| T024 + T045 / CHK-210 + CHK-231: detect dynamic `import()` and `require()` | Import checker should detect call-form imports, not only `from` imports | `.opencode/skill/system-spec-kit/scripts/evals/check-no-mcp-lib-imports.ts:116,130` matches `(?:require|import)(...)` call forms | **ACTED ON** |
| T030 + T035 / CHK-220 + CHK-225: harden scanner against block comments and transitive re-exports | Checker should avoid comment false positives and inspect local barrel indirection | `.opencode/skill/system-spec-kit/scripts/evals/check-no-mcp-lib-imports.ts:179-209,344-359` tracks block comments and adds transitive violation scanning | **ACTED ON** |
| T039 / CHK-203: `escapeLikePattern` must escape backslash first | SQL LIKE escaping should guard `\`, `%`, `_` in the right order | `.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:21-25` now does `.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')` | **ACTED ON** |
| T040 / CHK-216: quality extraction must be frontmatter-scoped | Parser should ignore `quality_*` text in body content | `.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts:5-45` adds `extractFrontmatter()` and only parses the frontmatter block | **ACTED ON** |
| T041 / CHK-217: causal-link resolution must be deterministic | LIKE fallback queries should order results deterministically | `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:61,70,85` adds `ORDER BY id DESC LIMIT 1` | **ACTED ON** |
| T027 + T028 / CHK-213 + CHK-214: allowlist governance metadata should exist | Exceptions should carry review/expiry metadata | `.opencode/skill/system-spec-kit/scripts/evals/import-policy-allowlist.json:3-44` includes `createdAt`, `lastReviewedAt`, and `expiresAt` on all current exceptions | **ACTED ON** |
| T022 / T048 / T087 and related checklist claims: boundary-doc exception table and cross-links must stay synchronized | Canonical boundary doc should exist at the cited path, match the allowlist, and be the target of README links | The packet still cites `.opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md` (`tasks.md:39,85-87,102,107,128,198,213-214`; `checklist.md:38,60-61,75,81,94,117,130,184,199-211`; `implementation-summary.md:36,143,218,235`), but that file does **not** exist. The current doc is `.opencode/skill/system-spec-kit/ARCHITECTURE.md`, whose “Active exceptions” stat and “Current exceptions” table list **2** exceptions (`ARCHITECTURE.md:41,173-178`) while the allowlist now contains **4** entries (`import-policy-allowlist.json:3-44`). README links in `mcp_server/api/README.md:38`, `scripts/evals/README.md:49`, and `shared/README.md:117` still point to the missing file. | **NOT CURRENTLY VERIFIED** |

## Detailed Findings
### 1. Template compliance
- **Mostly compliant, but not fully clean.**
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` all include frontmatter YAML and `SPECKIT_TEMPLATE_SOURCE`.
- Anchor coverage is not uniform: `spec.md` has 9 anchors, `plan.md` 8, `tasks.md` 17, `checklist.md` 19, `decision-record.md` 6, and `implementation-summary.md` **0**.
- That makes template compliance a **WARN**, not a PASS.

### 2. Checklist count verification
- **Count result:** `129/129` checked, `0` unchecked.
- The folder’s **mathematical** completion claim is accurate.
- However, several checked items are **factually stale**, so “100% complete” is not trustworthy as a current-state verification claim.

### 3. Evidence quality
- Evidence quality is **not consistently specific or durable enough** for a packet claiming full completion.
- Strong evidence examples exist, especially where checklist rows cite exact code or command behavior (for example CHK-200, CHK-203, CHK-216, CHK-217).
- But multiple P0/P1 items rely on **stale document-path claims** or indirect task-status proof instead of present-state verification:
  - `CHK-010`, `CHK-041`, `CHK-110`, `CHK-201`, `CHK-303`, `CHK-513`, `CHK-530`, `CHK-531`, `CHK-532`, `CHK-540`, `CHK-550` all depend on `.opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md`, which is missing.
  - `CHK-201` specifically claims “2 exceptions in table match 2 entries in allowlist JSON,” but the current allowlist has **4** entries.
  - `CHK-433` through `CHK-435` use “Txxx marked done in tasks.md” style evidence, which is weaker than direct file/command proof for P1 verification.
- Because current-state evidence materially fails on checked P0/P1 items, evidence quality is a **FAIL**.

### 4. Level determination
- **Level 3 remains appropriate.**
- The packet contains an architecture spec, phased implementation plan, ADRs, checklist verification, and implementation summary; that matches the v2.2 Level 3 shape.
- I do not see evidence that this must be escalated to 3+.

### 5. Required files
- **PASS:** all Level 3 required files are present.
- The issue is not missing files; it is stale verification content and incomplete template-anchor compliance in `implementation-summary.md`.

## Issues [ISS-A09-NNN]
### ISS-A09-001 — `implementation-summary.md` is missing anchor tags
The folder’s core docs are not uniformly template-compliant. `implementation-summary.md` includes frontmatter and `SPECKIT_TEMPLATE_SOURCE`, but no `<!-- ANCHOR:... -->` blocks, unlike the other packet docs.

### ISS-A09-002 — The packet’s canonical boundary-doc path is stale
The spec packet repeatedly cites `.opencode/skill/system-spec-kit/ARCHITECTURE_BOUNDARIES.md`, but that file does not exist. The current repository uses `.opencode/skill/system-spec-kit/ARCHITECTURE.md`, so multiple checklist, task, and implementation-summary claims now point at a dead path.

### ISS-A09-003 — Checked exception-sync claims are false in the current repo state
`CHK-201` / `CHK-513` and related packet language claim the boundary document exception table matches the allowlist exactly with **2** entries. In the current repository, `ARCHITECTURE.md` still lists **2** exceptions, while `scripts/evals/import-policy-allowlist.json` contains **4** active exceptions.

### ISS-A09-004 — README cross-link verification is broken
The packet claims bidirectional/canonical links to the boundary contract, but `mcp_server/api/README.md`, `scripts/evals/README.md`, and `shared/README.md` all still link to `ARCHITECTURE_BOUNDARIES.md`, which does not exist. Checked rows such as `CHK-041`, `CHK-110`, and `CHK-222` are therefore not valid current-state verifications.

### ISS-A09-005 — “129/129 complete” is numerically correct but audit-invalid as a present-state claim
All checklist boxes are checked, but multiple checked P0/P1 items do not survive current repository verification. The packet should not be treated as a trustworthy 100% verified closure packet until the stale claims are reopened or corrected.

## Recommendations
1. Reconcile the canonical boundary document immediately: either restore `ARCHITECTURE_BOUNDARIES.md` or update all packet docs and README links to `ARCHITECTURE.md`.
2. Re-open and re-verify every checklist item that depends on the boundary doc path or exception-table sync, especially `CHK-010`, `CHK-041`, `CHK-110`, `CHK-201`, `CHK-303`, `CHK-513`, and `CHK-530` through `CHK-550`.
3. Update `ARCHITECTURE.md` so its active-exception count and exception table match `scripts/evals/import-policy-allowlist.json`, or narrow the allowlist so the documented count is again accurate.
4. Add anchor blocks to `implementation-summary.md` and rerun the packet validator.
5. Replace task-status evidence on checked P0/P1 items with direct, current-state proof (exact file refs, commands, or artifacts) before keeping the 100% completion claim.
