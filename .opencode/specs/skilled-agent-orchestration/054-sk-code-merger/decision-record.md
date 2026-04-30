---
title: "Decision Record: Merge sk-code-web + sk-code-full-stack into sk-code"
description: "Architectural decisions for 054-sk-code-merger — 5 ADRs covering routing ordering, naming, placeholder strategy, deprecation strategy, and universal namespace scoping."
trigger_phrases: ["sk-code merger ADR", "054 decision record", "sk-code architecture decisions"]
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/054-sk-code-merger"
    last_updated_at: "2026-04-30T08:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored 5 ADRs"
    next_safe_action: "Reference ADRs from spec.md §11"
    blockers: []
    completion_pct: 0
---
# Decision Record: Merge sk-code-web + sk-code-full-stack into sk-code

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Stack-detection-first routing (vs. intent-first)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-30 |
| **Deciders** | michelkerkmeester (user), claude-opus-4-7, Plan-agent |

---

### Context

The two legacy skills disagree on ordering. `sk-code-web` does intent-only scoring (TASK_SIGNALS) because every web project shares one stack. `sk-code-full-stack` does stack-detection then intent. The merged router must pick one ordering.

### Constraints

- Web is the user's daily-driver stack (must remain low-friction)
- Non-web stacks are placeholders (router must surface stack detection cleanly)
- Intent words like "test", "performance", "build" mean radically different things across stacks (Lighthouse vs `go test ./...` vs XCTest)

---

### Decision

**We chose**: Stack-detection FIRST, intent classification SECOND.

**How it works**: The router runs marker-file detection (Webflow signals → go.mod → Package.swift → app.json+expo → next.config → package.json+react → package.json fallback → UNKNOWN) before classifying intent. Once stack is known, intent scoring runs against TASK_SIGNALS extended with stack-aware additions (TESTING, DATABASE, API).

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Stack-first (chosen)** | Disambiguates intent words across stacks; enables per-stack verification commands; mirrors full-stack's proven model | Adds detection cost on every prompt; UNKNOWN case needs hint message | 9/10 |
| Intent-first | Familiar to web users; matches sk-code-web today | Wrong verification commands for non-web; "test" overloaded across 5 stacks | 4/10 |
| Symmetric stack+intent | Treats web as just another stack | Loses web's daily-driver fluency; placeholder routing gets ambiguous | 5/10 |

**Why this one**: Web's intent-only model only works because it implicitly assumes the browser stack. Once multiple stacks are admitted, stack must gate intent or the router silently loads the wrong verification commands and patterns.

---

### Consequences

**What improves**:
- Single deterministic router for all code work; no advisor tie-breaking between sk-code-web and sk-code-full-stack
- Per-stack verification commands route correctly (web: Lighthouse; go: `go test ./...`; swift: XCTest)
- Web stack remains low-friction (Webflow markers detected first; full content loads as before)

**What it costs**:
- Stack detection runs on every prompt (negligible — filesystem stat operations)
  - Mitigation: detection is short-circuit; first match wins
- UNKNOWN case requires friendly hint output
  - Mitigation: SKILL.md includes example marker-file list and prompt-hint patterns

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Multi-marker projects (monorepos) trigger wrong stack | M | Documented precedence order; user can override via explicit prompt hint |
| Webflow project without `src/2_javascript/` falls through to NODEJS | L | Acceptable false negative; user can re-prompt with explicit "Webflow" keyword |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Advisor tie-break between two skills is observable today (0.87 vs 0.86 at session start) |
| 2 | **Beyond Local Maxima?** | PASS | Three orderings considered with explicit pros/cons |
| 3 | **Sufficient?** | PASS | Marker-file detection covers all 5 stacks + web + UNKNOWN |
| 4 | **Fits Goal?** | PASS | Single deterministic router is the stated outcome |
| 5 | **Open Horizons?** | PASS | New stacks added by appending to detection list and creating new placeholder folder |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- New `sk-code/SKILL.md` carries the merged routing pseudocode
- `_router/stack_detection.md` extracts the detection table for deep reads
- `_router/intent_classification.md` extracts TASK_SIGNALS

**How to roll back**: Remove DEPRECATED_SKILLS exclusion → legacy skills resume routing with their original intent-only / stack-then-intent behaviors. No content reverted.

---

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Bare `sk-code` name (vs. `sk-code-stack` or other suffix)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-30 |
| **Deciders** | michelkerkmeester (user) |

---

### Context

The user chose bare `sk-code` over the recommended `sk-code-stack`. Sibling skills follow the `sk-code-<role>` pattern (`sk-code-opencode`, `sk-code-review`, deprecated `sk-code-web`, `sk-code-full-stack`). A bare `sk-code` becomes the umbrella name with siblings as specializations.

### Constraints

- Must not collide with existing sibling names on advisor scoring
- Must be discoverable in advisor brief output and skill registry

---

### Decision

**We chose**: Bare `sk-code` (no suffix).

**How it works**: The new skill lives at `.opencode/skill/sk-code/`. Sibling skills `sk-code-review`, `sk-code-opencode` keep their suffixed names. Advisor scoring uses exact-name keys, not substring matching, so "review code" continues to route to `sk-code-review`.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Bare sk-code (chosen)** | Cleanest umbrella; signals "the code skill"; user-directed | Substring-match collision risk if advisor scoring naive | 8/10 |
| sk-code-stack | Semantic match to stack-aware routing | Wordy; reads as if siblings aren't also stack-aware | 6/10 |
| sk-code-app | Application code emphasis | Generic; doesn't capture routing | 5/10 |
| sk-code-multi | Multi-stack | Wordy; doesn't capture detection | 4/10 |

**Why this one**: User-directed. The umbrella naming is intuitive once the user adopts the merged skill as the canonical entry point.

---

### Consequences

**What improves**:
- Cleanest naming for the umbrella
- Discoverability: typing "code" in advisor brief surfaces the umbrella prominently

**What it costs**:
- Advisor must use exact-name match (not substring) — already the case but must be verified during implementation
  - Mitigation: T122-T126 trigger tests confirm sibling names still route correctly

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Substring matching causes "review code" to route to bare `sk-code` | M | Audit boost rules for substring/prefix usage; use exact-name keys |
| Future skill named `sk-code-X` collides with bare-name in user mental model | L | Document the umbrella naming convention in sk-code/README.md |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User explicitly chose this option |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives presented and evaluated |
| 3 | **Sufficient?** | PASS | Bare name disambiguates from suffixed siblings |
| 4 | **Fits Goal?** | PASS | Single deterministic umbrella for code work |
| 5 | **Open Horizons?** | PASS | Suffix space available for future siblings |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Skill folder: `.opencode/skill/sk-code/`
- Advisor scoring keys: exact-name `sk-code` (no substring expansion)
- All cross-repo references retarget to `sk-code`

**How to roll back**: Rename folder + advisor entries. Trivial git revert of all retargeting commits restores previous routing.

---

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Empty templated stubs for non-web stacks (vs. full content copy or symlinks)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-30 |
| **Deciders** | michelkerkmeester (user) |

---

### Context

The new skill must scaffold non-web stacks (React, Node.js, Go, React Native, Swift) such that future users adopting those stacks can find guidance. The user's stated preference: *"have only empty placeholder references, assets for the other stacks talked about in sk-code-full-stack"*. Plan-agent recommended full content copy. User intent overrides.

### Constraints

- Must respect user directive: "empty placeholder references"
- Must preserve `sk-code-full-stack/` as the authoritative source for non-web content
- Must enable progressive migration as users adopt stacks

---

### Decision

**We chose**: Empty templated stub files (frontmatter only, body empty) mirroring `sk-code-full-stack` 1:1 layout, plus `_placeholder.md` per stack folder pointing back to canonical content.

**How it works**: Each non-web stack folder (`references/<stack>/`, `assets/<stack>/`) contains a `_placeholder.md` explaining the migration path and N stub files matching sk-code-full-stack file names exactly. Stub frontmatter captures `status: placeholder, canonical_source, source_version: sk-code-full-stack@1.1.0, populated: false` so future drift is detectable.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Templated stubs (chosen)** | Matches user intent; progressive migration ready; drift detectable via source_version | New skill is incomplete for non-web users; they reach for legacy skill | 8/10 |
| Full content copy | Self-contained skill; legacy can be removed cleanly | Duplicates 35+ files; contradicts user's "empty placeholders" directive | 6/10 |
| Symlinks to full-stack | No duplication | Fragile cross-OS; breaks in tarballs/zips; advisor scanner may double-count | 3/10 |
| Bare _placeholder.md only (no stub files) | Leanest | Loses fill-in template benefit; future users still must context-switch | 5/10 |

**Why this one**: User-directed. The "preserve as reference for other users" intent is satisfied because legacy skills remain on disk untouched. Stubs scaffold the migration path so adopters fill in progressively.

---

### Consequences

**What improves**:
- Clean honoring of user directive
- Future users can adopt React/Go/etc. by copying content from legacy skill into populated stubs
- Drift between new skill and legacy is detectable via `source_version` frontmatter

**What it costs**:
- New skill is incomplete for non-web users until they migrate content
  - Mitigation: `_placeholder.md` instructions are clear; legacy skill remains accessible
- ~35 stub files add filesystem clutter
  - Mitigation: minimal frontmatter-only files; ~30 lines each

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future drift between stubs and legacy canonical | M | source_version frontmatter; scheduled drift-check agent (out of scope this packet) |
| Users mistake empty stubs for current content | L | Each stub frontmatter `populated: false`; `_placeholder.md` directs to canonical |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User directive explicitly requested empty placeholders |
| 2 | **Beyond Local Maxima?** | PASS | 4 strategies evaluated |
| 3 | **Sufficient?** | PASS | Stubs + _placeholder.md cover discovery + migration |
| 4 | **Fits Goal?** | PASS | Honors "preserve as reference" intent without duplication |
| 5 | **Open Horizons?** | PASS | Progressive migration path; future skills add stubs the same way |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- 5 stack folders × 2 namespaces (references/, assets/) = 10 directories created
- 35 frontmatter-only stub files
- 10 `_placeholder.md` pointer files (1 per stack per namespace)

**How to roll back**: Delete `sk-code/{references,assets}/{react,nodejs,go,react-native,swift}/`. Legacy skills remain untouched.

---

<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Code-level `DEPRECATED_SKILLS` exclusion list (vs. SKILL.md rename)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-30 |
| **Deciders** | michelkerkmeester (user, indirect via "don't overwrite" directive), claude-opus-4-7 |

---

### Context

The advisor currently scores both legacy skills competitively. After merge, they must stop auto-routing. Plan-agent flagged Risk 1: setting `weight: 0` in frontmatter is insufficient because `doctor:skill-advisor :confirm` rebuilds re-scan keyword headers and frontmatter triggers, re-amplifying dead skills. Plan-agent recommended renaming `SKILL.md` → `SKILL.deprecated.md` to remove from advisor discovery glob. User directive: *"I dont want you to overwrite the 2 skills"*.

### Constraints

- Must respect "don't overwrite" — minimize structural mutation of legacy folders
- Must survive `doctor:skill-advisor :confirm` rebuilds
- Must be reversible without data loss

---

### Decision

**We chose**: Code-level `DEPRECATED_SKILLS = frozenset({"sk-code-web", "sk-code-full-stack"})` in `skill_advisor.py` and `lib/scorer/lanes/explicit.ts`, with early-return guard in score-computation. Combined with additive frontmatter keys (`deprecated: true`, `superseded_by: sk-code`, `advisor_weight: 0`) on legacy SKILL.md.

**How it works**: The advisor's score-computation function checks `if skill_name in DEPRECATED_SKILLS: return 0.0` before any keyword/boost/lane processing. Survives rebuilds because the exclusion is pinned in code, not derived from frontmatter or YAML triggers. Frontmatter additions are non-destructive and provide secondary signaling for direct readers.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Exclusion list + frontmatter (chosen)** | Non-invasive; reversible by removing 1 entry; respects "don't overwrite"; survives rebuilds | Two places to keep in sync (.py and .ts) | 9/10 |
| Rename SKILL.md → SKILL.deprecated.md | Strongest isolation; advisor discovery glob skips them | Mutates folder structure; breaks any external link to `.opencode/skill/sk-code-web/SKILL.md` | 6/10 |
| Frontmatter weight=0 only | Simplest | Re-amplification risk during rebuilds; insufficient | 3/10 |
| Move to `.opencode/skill/_archive/` | Strongest signal | Heavy folder restructure; breaks every literal path reference | 4/10 |

**Why this one**: Best balance of effectiveness and respect for user directive. Reversibility is a single-line edit.

---

### Consequences

**What improves**:
- Legacy skills no longer auto-route under any advisor configuration
- Folder structure preserved (no rename, no move)
- Reversal is trivial (remove entry from frozenset)
- Frontmatter signal also visible to direct readers

**What it costs**:
- DEPRECATED_SKILLS list must be kept in sync between `skill_advisor.py` and `explicit.ts`
  - Mitigation: integration test (lane-attribution.test.ts) covers both paths
- Future maintainers may not realize the exclusion list exists if they only read SKILL.md frontmatter
  - Mitigation: skill_advisor.py comments document the gate; CHANGELOG.md records the deprecation

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Drift between .py and .ts exclusion lists | M | Lane-attribution test asserts on both |
| Maintainer adds new skill named "sk-code-web-2" by accident | L | Naming convention; advisor :confirm output flags ambiguous names |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Re-amplification risk surfaced by Plan-agent is real |
| 2 | **Beyond Local Maxima?** | PASS | 4 strategies evaluated |
| 3 | **Sufficient?** | PASS | Code-level gate + frontmatter signal covers both rebuild and direct-read paths |
| 4 | **Fits Goal?** | PASS | Respects "don't overwrite" and removes routing |
| 5 | **Open Horizons?** | PASS | Pattern reusable for future deprecations |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `skill_advisor.py`: add `DEPRECATED_SKILLS` frozenset + early-return guard
- `lib/scorer/lanes/explicit.ts`: add `DEPRECATED_SKILLS` constant + early-return guard
- Legacy SKILL.md frontmatter: add 3 YAML keys (additive, body untouched)
- Legacy graph-metadata.json: add same 3 keys

**How to roll back**: `sed -i 's/.*sk-code-web.*//' skill_advisor.py` (or git revert) → entry removed → routing resumes.

---

<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Tightly-scoped `universal/` namespace (vs. broad lift from web)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-30 |
| **Deciders** | claude-opus-4-7, Plan-agent |

---

### Context

The merge needs a stack-agnostic namespace for content shared across web + non-web routes. Initial draft promoted 6 files from `sk-code-web/references/` into `universal/`: `debugging_workflows.md`, `error_recovery.md`, `verification_workflows.md`, `code_quality_standards.md`, `code_style_guide.md`, `multi_agent_research.md`. Plan-agent flagged that `debugging_workflows.md` and `verification_workflows.md` carry browser/DOM/console assumptions and would mislead non-web users.

### Constraints

- `universal/` content must be truly stack-agnostic — no DOM, no `window`, no page-load semantics
- Must not weaken web's debugging/verification fluency

---

### Decision

**We chose**: Tightly-scoped `universal/` containing only:
- `error_recovery.md` (decision tree, no browser context)
- `code_quality_standards.md` (P0/P1/P2 severity model)
- `code_style_guide.md` (language-agnostic naming/formatting parts only)
- `multi_agent_research.md` (10-agent methodology, applicable to any stack)

`debugging_workflows.md` and `verification_workflows.md` stay inside `references/web/` because they assume DOM/console/page-load semantics.

**How it works**: Each `universal/` file is reviewed during migration for browser-specific references (DOM, window, document, console.log, page-load events). Browser-coupled portions either get lifted out or the file stays in `web/`.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Tight scope (chosen)** | No misleading guidance to non-web users; honest split | Smaller universal/ namespace; some content duplication if future stacks need debugging methodology | 8/10 |
| Broad lift from web | Larger universal/ namespace; less duplication | debugging_workflows.md surfaces browser assumptions to Go users on Phase 3 | 4/10 |
| No universal/ namespace | Simplest | Code quality standards (P0/P1/P2) and validation patterns are genuinely shared; loses reuse | 5/10 |

**Why this one**: Plan-agent critique was specific and verifiable. Browser-coupling in debugging/verification is real (DevTools console, page-load semantics). Tight scope prevents wrong guidance.

---

### Consequences

**What improves**:
- Non-web users (or future placeholders) see only stack-agnostic content in universal/
- Web content stays organized under web/ where its assumptions hold
- Future stacks adopting debugging methodology can either reference web/'s file or contribute their own

**What it costs**:
- Some "obvious shared" content (debugging methodology) ends up in web/ until non-web stacks contribute their own variants
  - Mitigation: `_placeholder.md` notes the universal/ + web/ split; users adopt cross-references explicitly

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future contributor lifts something into universal/ that's still browser-coupled | L | SKILL.md routing note + universal/_README.md documents the rule |
| Web users miss debugging workflows because they expect them in universal/ | L | SKILL.md routing always loads web/ for WEB stack |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Plan-agent surfaced concrete browser-coupling examples |
| 2 | **Beyond Local Maxima?** | PASS | 3 scoping strategies evaluated |
| 3 | **Sufficient?** | PASS | 4-file universal/ covers severity model + style + research |
| 4 | **Fits Goal?** | PASS | No misleading guidance to non-web routes |
| 5 | **Open Horizons?** | PASS | Universal/ can grow as truly stack-agnostic content emerges |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `sk-code/references/universal/` contains 4 files (not 6)
- `debugging_workflows.md` and `verification_workflows.md` remain in `sk-code/references/web/`
- Stub READMEs in universal/ document the scoping rule

**How to roll back**: Move debugging_workflows.md and verification_workflows.md from `web/` to `universal/`. Trivial; reversible.

---

<!--
Level 3 Decision Record — 5 ADRs.
Direct, active voice. No em dashes, no hedging.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->

<!-- /ANCHOR:adr-005 -->
