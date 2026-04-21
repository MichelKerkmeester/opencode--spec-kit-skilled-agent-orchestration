# Spec Documentation Audit (Phase 1)

> Read-only audit. No spec docs modified. Produced by cli-copilot/gpt-5.4/high.

## TL;DR

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/` has no root spec packet yet; Phase 2 needs to create 7 root files.
- Strict validation currently fails for `001-claude-optimization-settings/` and `003-contextador/` because they reference nonexistent root-level `phase-research-prompt.md` files instead of the real `scratch/phase-research-prompt.md` targets.
- `002-codesight/`, `004-graphify/`, and `005-claudest/` pass `validate.sh --strict`, but all three still drift from the Level 3 template contract.
- `002-codesight/` is the only child folder missing `description.json`.
- `spec.md` metadata anchors are missing in 4 child folders: `002-codesight/`, `003-contextador/`, `004-graphify/`, and `005-claudest/`.
- `plan.md` in `002-codesight/` and `005-claudest/` omits the Level 3 sections `L2: ENHANCED ROLLBACK`, `L3: CRITICAL PATH`, and `L3: MILESTONES`.
- `003-contextador/implementation-summary.md` keeps a `### Files Changed` table even though the Level 3/core summary guidance says to omit that table for Level 3+.
- Recommended Phase 2 delta: **8 files to create, 15 files to patch, 0 files to delete**. Level 3 is the right fit for the parent packet.

## Templates inventory

### Level 3 main templates

| Path | Purpose / when used | Required sections | Mandatory vs optional fields |
|---|---|---|---|
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/level_3/spec.md` | Canonical Level 3 `spec.md` for architecture-scale work. | `Executive Summary`; `1. METADATA`; `2. REQUIREMENTS`; `3. NON-FUNCTIONAL REQUIREMENTS`; `4. EDGE CASES`; `5. COMPLEXITY ANALYSIS`; `6. RISK MATRIX`; `7. USER STORIES`; `8. ACCEPTANCE CRITERIA`; `9. OPEN QUESTIONS`. | Metadata block and anchor pairs are mandatory; requirement/NFR/risk sections are mandatory; story examples and notes are adaptable; comments are optional and should be removed when filled. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/level_3/plan.md` | Canonical Level 3 `plan.md` for phased execution. | `Overview`; `1. TECHNICAL CONTEXT`; `2. FILES TO CHANGE`; `3. PHASED IMPLEMENTATION`; `L2: PHASE DEPENDENCIES`; `L2: EFFORT ESTIMATES`; `L2: ENHANCED ROLLBACK`; `L3: DEPENDENCY GRAPH`; `L3: CRITICAL PATH`; `L3: MILESTONES`; `L3: ARCHITECTURE DECISION SUMMARY`. | Metadata header plus all Level 2 and Level 3 H2 blocks are mandatory; specific file lists, commands, and dependency rows are fill-in content. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/level_3/tasks.md` | Canonical executable task tracker. | `Execution Strategy`; `1. TASK BREAKDOWN`; `2. IMPLEMENTATION NOTES`; `3. BLOCKERS / RISKS / DEPS`; `4. VALIDATION COMMANDS`; `5. COMPLETION CRITERIA`. | Metadata header, numbered tasks, validation commands, and completion criteria are mandatory; sub-bullets and task granularity are adaptable. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/level_3/checklist.md` | Canonical verification checklist for Level 3 work. | `Verification Protocol`; `Pre-Implementation`; `Code Quality`; `Testing`; `Security`; `Documentation`; `File Organization`; `Verification Summary`; `L3+: ARCHITECTURE VERIFICATION`; `L3+: PERFORMANCE VERIFICATION`; `L3+: DEPLOYMENT READINESS`; `L3+: COMPLIANCE VERIFICATION`; `L3+: DOCUMENTATION VERIFICATION`; `L3+: SIGN-OFF`. | Anchor blocks and checklist categories are mandatory; individual checks can be rewritten for the initiative; sign-off table is template-required unless intentionally marked N/A. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/level_3/decision-record.md` | Canonical Level 3 ADR document. | Repeating ADR block: `ADR-NNN`; `Context`; `Decision`; `Alternatives Considered`; `Consequences`; `Five Checks Validation`; `Implementation Notes`. | Metadata header is mandatory; each ADR must use the anchorized block structure; multiple ADRs are allowed by the template comments and examples. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md` | Canonical implementation narrative after work completes. | `Requested vs Built`; `What Was Built`; `How It Was Delivered`; `Verification`; `Known Limitations`. | Metadata header is mandatory; Level 3 inherits the core note that `Files Changed` should be omitted for Level 3/3+ and kept only for Level 1/2. |

### Level 3 example templates

| Path | Purpose / when used | Required sections | Mandatory vs optional fields |
|---|---|---|---|
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/examples/level_3/spec.md` | Filled example showing how to populate Level 3 `spec.md`. | Same section set as the main Level 3 `spec.md`. | Use as a phrasing/reference example only; placeholder comments are optional scaffolding, but the section set mirrors the required template. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/examples/level_3/plan.md` | Filled example for Level 3 phased planning. | Same section set as the main Level 3 `plan.md`. | Demonstrates how to fill dependency graph, critical path, and milestone sections that are easy to omit in shorter packets. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/examples/level_3/tasks.md` | Filled example for executable task breakdowns. | Same section set as the main Level 3 `tasks.md`. | Confirms that extra custom H2s are not part of the default contract; custom detail should usually be folded into existing sections. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/examples/level_3/checklist.md` | Filled example for Level 3 verification. | Same section set as the main Level 3 `checklist.md`. | Shows template order, including `Verification Summary` before the appended Level 3 sections. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/examples/level_3/decision-record.md` | Filled multi-ADR example. | Same repeating ADR block set as the main Level 3 `decision-record.md`. | Important reference: the example explicitly supports more than one ADR in a single file, with full anchors for each ADR block. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/examples/level_3/implementation-summary.md` | Filled example for post-implementation summary. | Same section set as the main Level 3 `implementation-summary.md`. | Reinforces narrative summary style rather than a file-by-file delta table for Level 3. |

### Supporting templates and schema references

| Path | Purpose / when used | Required sections | Mandatory vs optional fields |
|---|---|---|---|
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/README.md` | Template-family index and level-selection guide. | Overview; folder structure; level guidance; usage notes. | Not itself a packet doc; serves as the template routing guide. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/core/spec-core.md` | Shared lower-level `spec.md` baseline. | Core metadata, requirements, risks, acceptance, open questions. | Level 3 extends this baseline with NFRs, complexity, and user stories. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/core/plan-core.md` | Shared lower-level `plan.md` baseline. | Overview; context; files; phases. | Level 3 adds the full Level 2 and Level 3 sections on top. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/core/tasks-core.md` | Shared `tasks.md` baseline. | Strategy; tasks; notes; blockers; validation; completion. | Level 3 inherits this structure directly. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/core/impl-summary-core.md` | Shared implementation-summary baseline. | Requested vs Built; What Was Built; How It Was Delivered; Verification; Known Limitations. | Contains the key note that `Files Changed` is for Level 1/2 only and should be omitted for Level 3/3+. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/research.md` | Research deliverable template, relevant to the parent packet source material. | Executive summary; methodology; findings; analysis; recommendations; open questions; appendices. | Useful as source-content guidance, not as a replacement for Level 3 packet docs. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Canonical `description.json` generator/loader behavior. | N/A - code-backed schema reference. | Generated/loaded fields are `specFolder`, `description`, `keywords`, `lastUpdated`, `specId`, `folderSlug`, `parentChain`, `memorySequence`, and `memoryNameHistory`. |

### Templates that look stale or contradictory

- **ADR multiplicity mismatch**: the Level 3 decision-record template comments and example file support multiple ADR blocks in one file, but the current strict validator still warns when it sees extra ADR anchors like `adr-002`, `adr-003`, and `adr-004` in `001-claude-optimization-settings/decision-record.md`.
- **Metadata anchor enforcement gap**: the Level 3 `spec.md` template requires the `metadata` anchor pair, but `validate.sh --strict` still passed `002-codesight/spec.md`, `003-contextador/spec.md`, `004-graphify/spec.md`, and `005-claudest/spec.md` without it.
- **Level 3 summary enforcement gap**: the core summary template says Level 3/3+ should omit `Files Changed`, but `003-contextador/implementation-summary.md` retained that table and the folder's strict validation failure was driven by broken links, not by the summary drift.

## Per-folder audit

### 0. PARENT (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/`)

**Status:** ❌ NO SPEC DOCS  
**Level (user-chosen):** Level 3

**Files needed:**

| File | Source for content | Template to use |
|---|---|---|
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/spec.md` | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/research/research-v2.md` (`§1`, `§2`, `§11`, `§13`) plus `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/research/recommendations-v2.md` | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/level_3/spec.md` |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/plan.md` | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/research/research-v2.md` (`§5.4`, `§8`) plus `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/research/cross-phase-matrix.md` | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/level_3/plan.md` |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/tasks.md` | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/research/research-v2.md` (`§8`) plus `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/research/recommendations-v2.md` (top 10 recommendations) | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/level_3/tasks.md` |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/checklist.md` | Level 3 checklist structure plus convergence/verification criteria from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/research/deep-research-strategy.md` and `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/research/research-v2.md` (`§11`) | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/level_3/checklist.md` |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/decision-record.md` | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/research/research-v2.md` (`§5`, `§8`, `§11`, `§13`) plus `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/research/iterations/v1-v2-diff-iter-18.md` | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/level_3/decision-record.md` |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/implementation-summary.md` | Session chronology and final synthesis summary from the packet's research iterations and the parent research deliverables | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md` |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/description.json` | Repo-native folder metadata derived from the finished spec packet; do **not** invent a new metadata schema | Repo-native schema from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` |

**Notes for phase 2:**

- No standalone `q-d-adoption-sequencing.md` was found under the parent packet. Use `research-v2.md §5.4` and `research-v2.md §8` as the source for sequencing unless another canonical file is surfaced during implementation.
- `spec.md` should translate research findings into packet requirements. For a research-only initiative, product-style feature requirements can be reframed as evidence, evaluation, and adoption-decision requirements.
- `plan.md` should treat "rollback" as packet rollback or recommendation rollback, not runtime rollback. That section still needs to exist because the Level 3 template requires it.
- `tasks.md` should turn the top recommendations and adoption roadmap into executable doc tasks with dependency order, not just restate findings.
- `checklist.md` should focus on evidence traceability, cross-link integrity, convergence completeness, and recommendation readiness. Deployment-oriented checks can be marked N/A with rationale.
- `decision-record.md` should capture the high-level packet conclusions and adoption decisions, one ADR block per major decision area.
- `implementation-summary.md` should summarize how the packet was produced, what changed between v1 and v2, and what remains for downstream implementation phases.
- `description.json` should follow the repo-native generated shape (`specFolder`, `description`, `keywords`, `lastUpdated`, etc.), not an ad hoc `title/status/level/owner` schema unless the underlying generator is changed.
- Sections that will need explicit N/A handling because this is research-only: runtime deployment readiness, feature flags, production monitoring, and file-by-file implementation deltas.

### 1. 001-claude-optimization-settings (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/`)

**Status:** ✅ has full set  
**Strict validator:** FAIL - broken link in `spec.md`; warnings on custom task/ADR sections

**Files audit (each existing file vs template):**

| File | LOC | Template alignment | Drift items |
|---|---:|---|---|
| `spec.md` | 260 | partial | Broken relative link points to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/phase-research-prompt.md`; the actual file is `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/scratch/phase-research-prompt.md`. |
| `plan.md` | 297 | match | - |
| `tasks.md` | 136 | partial | Adds non-template `## AI Execution Protocol`; adds non-template `## Phase 2b: Convergence and Synthesis (Analyst-only)`; both should be folded into template sections if strict conformity is the goal. |
| `checklist.md` | 183 | partial | `## Verification Summary` is moved to the end instead of the template position before the appended Level 3 blocks; `## L3+: Sign-Off` uses custom status text rather than the template's approval table shape. |
| `decision-record.md` | 434 | partial | Validator warns on `ADR-002+` anchor/header names as "custom", but the template comments/examples support multiple ADR blocks; treat this as a validator/template mismatch, not a clear content bug. |
| `implementation-summary.md` | 128 | match | - |
| `description.json` | 28 | match | Matches the repo-native folder-description shape. |

### 2. 002-codesight (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/`)

**Status:** ✅ has set EXCEPT `description.json`  
**Strict validator:** PASS

**Missing:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/description.json` (must be added in phase 2)

**Files audit (each existing file vs template):**

| File | LOC | Template alignment | Drift items |
|---|---:|---|---|
| `spec.md` | 272 | partial | Missing the required `metadata` anchor pair around `## 1. METADATA`; body structure otherwise tracks the Level 3 template. |
| `plan.md` | 311 | partial | Missing `## L2: ENHANCED ROLLBACK`, `## L3: CRITICAL PATH`, and `## L3: MILESTONES`; uses a custom `## L3: ARCHITECTURE DECISION RECORD` heading instead of the template's summary heading. |
| `tasks.md` | 123 | match | - |
| `checklist.md` | 197 | match | - |
| `decision-record.md` | 406 | partial | `ADR-001` is only partially wrapped; the `Implementation Notes` block is not fully anchorized; later ADRs are plain headings/subsections rather than full template ADR blocks. |
| `implementation-summary.md` | 154 | match | - |
| `description.json` | MISSING | drift | Required repo-native folder metadata file is absent. |

### 3. 003-contextador (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/`)

**Status:** ✅ has full set + `CONTEXT.md`  
**Strict validator:** FAIL - broken prompt links in `spec.md`, `tasks.md`, and `CONTEXT.md`

**Files audit (each existing file vs template):**

| File | LOC | Template alignment | Drift items |
|---|---:|---|---|
| `spec.md` | 259 | partial | Missing the required `metadata` anchor pair; broken link points to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/phase-research-prompt.md` instead of `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/scratch/phase-research-prompt.md`. |
| `plan.md` | 347 | match | - |
| `tasks.md` | 106 | partial | Broken prompt link should target `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/scratch/phase-research-prompt.md`. |
| `checklist.md` | 182 | match | - |
| `decision-record.md` | 127 | match | Single ADR packet is structurally aligned. |
| `implementation-summary.md` | 135 | partial | Retains a `### Files Changed` table even though the Level 3/core guidance says to omit that table for Level 3+. |
| `description.json` | 24 | match | Matches the repo-native folder-description shape. |
| `CONTEXT.md` | 38 | auxiliary / non-template | Useful redirect stub, but it is not a system-spec-kit template artifact and its prompt link is broken; if retained, patch the link and keep it explicitly auxiliary. |

### 4. 004-graphify (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/`)

**Status:** ✅ has full set  
**Strict validator:** PASS

**Files audit (each existing file vs template):**

| File | LOC | Template alignment | Drift items |
|---|---:|---|---|
| `spec.md` | 312 | partial | Missing the required `metadata` anchor pair around `## 1. METADATA`. |
| `plan.md` | 371 | match | - |
| `tasks.md` | 135 | match | - |
| `checklist.md` | 182 | match | - |
| `decision-record.md` | 404 | partial | `ADR-001` is anchorized, but later ADRs are plain headings/subsections rather than repeated full ADR blocks with anchors. |
| `implementation-summary.md` | 128 | match | - |
| `description.json` | 24 | match | Matches the repo-native folder-description shape. |

### 5. 005-claudest (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/`)

**Status:** ✅ has full set  
**Strict validator:** PASS

**Files audit (each existing file vs template):**

| File | LOC | Template alignment | Drift items |
|---|---:|---|---|
| `spec.md` | 277 | partial | Missing the required `metadata` anchor pair around `## 1. METADATA`. |
| `plan.md` | 307 | partial | Missing `## L2: ENHANCED ROLLBACK`, `## L3: CRITICAL PATH`, and `## L3: MILESTONES`; uses a custom `## L3: ARCHITECTURE DECISION RECORD` heading instead of the template's summary heading. |
| `tasks.md` | 123 | match | - |
| `checklist.md` | 197 | match | - |
| `decision-record.md` | 407 | partial | `ADR-001` is anchorized, but later ADRs are plain headings/subsections rather than repeated full ADR blocks with anchors. |
| `implementation-summary.md` | 162 | match | - |
| `description.json` | 24 | match | Matches the repo-native folder-description shape. |

## Total file delta

| Folder | Files to create | Files to patch | Files to delete |
|---|---:|---:|---:|
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/` | 7 | 0 | 0 |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/` | 0 | 3 | 0 |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/` | 1 | 3 | 0 |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/` | 0 | 4 | 0 |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/` | 0 | 2 | 0 |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/` | 0 | 3 | 0 |
| **Total** | **8** | **15** | **0** |

## Level confirmation

User chose Level 3 for the parent packet. That is the right fit. The parent deliverable is not a tiny documentation wrapper around one research file; it is a synthesis packet with 88 findings, ranked recommendations, cross-phase analysis, adoption sequencing, and architecture-level conclusions that need a decision record. Level 2 would under-document the architectural conclusions, while Level 3+ would only be justified if this packet also needed formal governance gates, sign-off workflows, or multi-agent operational controls as first-class deliverables. Right now it does not. **Recommend: confirm-level-3.**

## Phase 2 plan (concrete file-by-file)

| Order | Action | File | Source content | Estimated effort |
|---|---|---|---|---|
| 1 | create | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/spec.md` | `research-v2.md §1`, `§2`, `§11`, `§13`; `recommendations-v2.md` | M |
| 2 | create | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/plan.md` | `research-v2.md §5.4`, `§8`; `cross-phase-matrix.md` | M |
| 3 | create | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/tasks.md` | `research-v2.md §8`; `recommendations-v2.md` | M |
| 4 | create | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/checklist.md` | Level 3 checklist template plus convergence/evidence requirements from `deep-research-strategy.md` and `research-v2.md §11` | M |
| 5 | create | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/decision-record.md` | `research-v2.md §5`, `§8`, `§11`, `§13`; `research/iterations/v1-v2-diff-iter-18.md` | M |
| 6 | create | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/implementation-summary.md` | Parent-session synthesis and v1-to-v2 delivery summary | M |
| 7 | create | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/description.json` | Repo-native per-folder description metadata | S |
| 8 | patch | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/spec.md` | Fix broken cross-folder prompt path | S |
| 9 | patch | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/tasks.md` | Fold custom H2s into template sections or explicitly reframe them | S |
| 10 | patch | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/checklist.md` | Restore template order/shape for summary and sign-off | S |
| 11 | create | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/description.json` | Repo-native per-folder description metadata | S |
| 12 | patch | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/spec.md` | Add missing metadata anchors | S |
| 13 | patch | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/plan.md` | Add missing Level 2/3 sections and normalize heading names | M |
| 14 | patch | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/decision-record.md` | Convert later ADRs into full anchorized ADR blocks | M |
| 15 | patch | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/spec.md` | Add metadata anchors and fix prompt link | S |
| 16 | patch | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/tasks.md` | Fix prompt link | S |
| 17 | patch | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/CONTEXT.md` | If retained, repoint broken prompt link and mark it clearly auxiliary | S |
| 18 | patch | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/implementation-summary.md` | Remove `Files Changed` and keep Level 3 narrative summary only | S |
| 19 | patch | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/spec.md` | Add missing metadata anchors | S |
| 20 | patch | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/decision-record.md` | Convert later ADRs into full anchorized ADR blocks | M |
| 21 | patch | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/spec.md` | Add missing metadata anchors | S |
| 22 | patch | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/plan.md` | Add missing Level 2/3 sections and normalize heading names | M |
| 23 | patch | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/decision-record.md` | Convert later ADRs into full anchorized ADR blocks | M |

## Phase 3 validation plan

1. Run strict validation on the parent packet and all 5 child folders:
   - `bash /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems --strict`
   - Repeat the same command for each child folder under the parent.
2. Re-check broken prompt links:
   - `rg -n "phase-research-prompt\\.md" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`
   - Confirm every surviving reference points to an existing `scratch/phase-research-prompt.md`.
3. Re-check metadata anchors in every `spec.md`:
   - `rg -n "<!-- ANCHOR:metadata -->|<!-- /ANCHOR:metadata -->" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/**/spec.md`
4. Re-check the short Level 3 plans:
   - `rg -n "^## L2: ENHANCED ROLLBACK|^## L3: CRITICAL PATH|^## L3: MILESTONES" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/{002-codesight,005-claudest}/plan.md`
5. Re-check ADR anchor completeness:
   - `rg -n "^<!-- ANCHOR:adr-[0-9]{3} -->|^<!-- ANCHOR:adr-[0-9]{3}-impl -->" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/{001-claude-optimization-settings,002-codesight,003-contextador,004-graphify,005-claudest}/decision-record.md`
6. Re-check that Level 3 summaries do not carry a `Files Changed` table:
   - `rg -n "^### Files Changed" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/**/implementation-summary.md`

## Open questions

- Should Phase 2 create the parent `description.json` in the repo-native generator shape, or is there an explicit reason to introduce the richer `title/status/level/owner` metadata model the prompt suggested?
- In `001-claude-optimization-settings/decision-record.md`, should the multi-ADR structure be preserved even though the current strict validator warns on later ADR anchors, or should Phase 2 normalize the file toward the validator's narrower expectation?
- Should `003-contextador/CONTEXT.md` remain as an auxiliary redirect stub once its links are fixed, or should Phase 2 remove it to keep the folder template-pure?
