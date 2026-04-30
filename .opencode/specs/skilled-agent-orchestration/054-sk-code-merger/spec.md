---
title: "Feature Specification: Merge sk-code-web + sk-code-full-stack into sk-code"
description: "Create a new unified sk-code skill that smart-routes by detected stack — web carries forward verbatim from sk-code-web; non-web stacks (React, Node.js, Go, React Native, Swift) are placeholder skeletons pointing back to sk-code-full-stack."
trigger_phrases: ["merge sk-code-web", "merge sk-code-full-stack", "create sk-code", "sk-code merger", "054 sk-code"]
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/054-sk-code-merger"
    last_updated_at: "2026-04-30T08:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 3 spec/plan/tasks/checklist/decision-record for sk-code merger"
    next_safe_action: "Create new sk-code/ skill scaffold, then migrate web content + create placeholder stubs"
    blockers: []
    completion_pct: 0
---
# Feature Specification: Merge sk-code-web + sk-code-full-stack into sk-code

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The repo currently runs two parallel "code skills" with overlapping responsibilities — `sk-code-web` (Webflow/CDN, the user's daily driver) and `sk-code-full-stack` (multi-stack reference for React/Node/Go/Swift/React-Native, used by other users). Both compete in the skill advisor's scoring tables (advisor returned `sk-code-full-stack 0.87 vs sk-code-web 0.86` at session start — within tie threshold), and ~884 cross-repo references touch one or the other. This packet creates a single new skill `sk-code` that smart-routes by detected stack, with web content carried forward verbatim and non-web stacks scaffolded as placeholder stubs that point back to `sk-code-full-stack` for current authoritative content. Both legacy skills are preserved on disk untouched (frontmatter-only deprecation marker) per the user directive *"I dont want you to overwrite the 2 skills"*.

**Key Decisions**: Stack-detection-first router (detection precedes intent classification); non-invasive deprecation via code-level exclusion list in `skill_advisor.py` (no SKILL.md rename); empty templated stubs for non-web stacks (mirrors sk-code-full-stack 1:1 layout).

**Critical Dependencies**: `skill_advisor.py` rewrite (PHRASE_BOOSTS, TOKEN_BOOSTS, DEPRECATED_SKILLS), `explicit.ts` lane scorer, 8 graph-metadata.json files, 4 root instruction files (AGENTS.md, CLAUDE.md, AGENTS_example_fs_enterprises.md, AGENTS_Barter.md), 3 deep-review agent definitions, ~10 README/doc files.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-30 |
| **Branch** | `main` (no feature branch — per-user policy) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two parallel code skills (`sk-code-web` and `sk-code-full-stack`) overlap in phase model, intent vocabulary, and advisor scoring keys, causing routing ambiguity and operator confusion. The user works exclusively in the web stack but wants `sk-code-full-stack`'s multi-stack content preserved as reference for other users adopting React/Node/Go/Swift/RN. There is no single router that handles both audiences cleanly.

### Purpose
A single new skill `sk-code` that smart-routes by detected stack: web → live full content; non-web → placeholder skeleton with explicit pointer to `sk-code-full-stack`. Legacy skills remain on disk untouched but are removed from advisor routing via a code-level `DEPRECATED_SKILLS` exclusion list. All 40 active cross-repo references retarget to `sk-code`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create new `.opencode/skill/sk-code/` with merged routing SKILL.md, README.md, CHANGELOG.md, graph-metadata.json, description.json
- `_router/` extracted reference docs (stack_detection.md, intent_classification.md, resource_loading.md, phase_lifecycle.md)
- `references/universal/` tightly-scoped stack-agnostic content (4 files copied from sk-code-web with browser-context bits stripped)
- `references/web/` LIVE content (copied verbatim from sk-code-web/references/{implementation,debugging,verification,deployment,performance,standards}/)
- `references/{react,nodejs,go,react-native,swift}/` placeholder stubs (frontmatter only, body empty, mirroring sk-code-full-stack 1:1 layout) + one `_placeholder.md` per stack
- `assets/{universal,web}/` content carried + `assets/{react,nodejs,go,react-native,swift}/_placeholder.md` placeholders
- `scripts/` web-only build utilities (minify-webflow.mjs, verify-minification.mjs, test-minified-runtime.mjs) — copied verbatim, no path edits required (CWD-relative)
- Tier 1 advisor edits: `skill_advisor.py` (PHRASE_BOOSTS, TOKEN_BOOSTS, DEPRECATED_SKILLS), `explicit.ts` (lane mappings, DEPRECATED_SKILLS), `lexical.ts`, `lane-attribution.test.ts` fixtures
- Tier 2 graph-metadata.json updates (8 files: new skill + 7 existing)
- Tier 3 sister SKILL.md cross-ref updates (7 files: sk-code-review, sk-code-opencode, mcp-chrome-devtools, cli-claude-code, cli-codex, cli-gemini, sk-improve-prompt)
- Tier 4 root instruction file updates (AGENTS.md, CLAUDE.md, AGENTS_example_fs_enterprises.md, AGENTS_Barter.md)
- Tier 5 deep-review agent definition updates (3 files across runtime profiles)
- Tier 6 README and documentation updates (~10 files)
- Tier 7 old skill frontmatter deprecation markers (additive YAML only; bodies untouched)
- Validation suite: spec validate, advisor sanity, 5 trigger-test prompts, lane-attribution test, regrep, web smoke test

### Out of Scope
- Migrating non-web content from `sk-code-full-stack` into the new skill body (placeholders defer; users migrate progressively as they adopt the stack)
- Rewriting archival spec-folder references in `specs/`, `.opencode/changelog/`, `observability/` (~268 files; historical, not safe to bulk-edit)
- Deleting or restructuring legacy `sk-code-web/` or `sk-code-full-stack/` folders (preserved per user directive)
- Touching `sk-code-opencode` or `sk-code-review` content (only metadata + cross-ref edits)
- Creating new stacks beyond the 5 already in sk-code-full-stack
- Changing the SKILL.md routing format used by other code skills (sk-code-opencode, sk-code-review remain on the v1.1.0.0 contract)

### Files to Change

| Path Class | Action | Count |
|------------|--------|-------|
| `.opencode/skill/sk-code/**` | Create | ~80 files (SKILL.md + READMEs + 4 _router + ~30 web refs/assets + 35 placeholder stubs + 3 scripts + metadata) |
| `.opencode/skill/sk-code-web/SKILL.md` | Modify | 1 (frontmatter only) |
| `.opencode/skill/sk-code-web/graph-metadata.json` | Modify | 1 |
| `.opencode/skill/sk-code-full-stack/SKILL.md` | Modify | 1 (frontmatter only) |
| `.opencode/skill/sk-code-full-stack/graph-metadata.json` | Modify | 1 |
| Skill advisor scoring | Modify | 4 (skill_advisor.py, explicit.ts, lexical.ts, lane-attribution.test.ts) |
| Other graph-metadata.json | Modify | 6 (sk-code-review, sk-code-opencode, mcp-chrome-devtools, mcp-figma, advisor) |
| Sister SKILL.md cross-refs | Modify | 7 |
| Root instructions | Modify | 4 (AGENTS.md, CLAUDE.md, AGENTS_example_fs_enterprises.md, AGENTS_Barter.md) |
| Agent definitions | Modify | 3 (deep-review across profiles) |
| README/docs | Modify | ~10 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | New skill `sk-code` exists with valid SKILL.md, README.md, CHANGELOG.md, graph-metadata.json, description.json | Files present at `.opencode/skill/sk-code/`; `bash validate.sh --strict` passes |
| REQ-002 | Web content carried forward verbatim into `sk-code/references/web/` and `sk-code/assets/web/` and `sk-code/scripts/` | Diff between source and destination is empty for every migrated file |
| REQ-003 | Smart routing in SKILL.md detects stack first (Webflow markers / go.mod / Package.swift / app.json+expo / next.config / package.json) then classifies intent | Pseudocode in SKILL.md is reviewable and 5 representative trigger-test prompts route to expected stack branch |
| REQ-004 | Placeholder stubs exist for all 5 non-web stacks with frontmatter `status: placeholder, canonical_source, source_version: sk-code-full-stack@1.1.0, populated: false` | Each stack folder contains `_placeholder.md` + N stub files where N matches sk-code-full-stack/<stack>/ doc count |
| REQ-005 | Advisor scoring tables (`skill_advisor.py`, `explicit.ts`) updated with `DEPRECATED_SKILLS = {"sk-code-web", "sk-code-full-stack"}` early-return guard and PHRASE/TOKEN boosts retargeted to `sk-code` | Trigger tests "Fix Webflow flicker", "React component", "Go service" all return `sk-code`; "Audit OpenCode plugin" returns `sk-code-opencode`; "Review PR" returns `sk-code-review` |
| REQ-006 | Legacy SKILL.md frontmatter (sk-code-web, sk-code-full-stack) gets additive deprecation keys (`deprecated: true`, `superseded_by: sk-code`, `advisor_weight: 0`); bodies untouched | `git diff` on legacy SKILL.md shows only frontmatter additions, no body changes |
| REQ-007 | All Tier 4 root instruction files (AGENTS.md, CLAUDE.md, AGENTS_example_fs_enterprises.md, AGENTS_Barter.md) reference `sk-code` instead of legacy names | Regrep returns no remaining `sk-code-(web\|full-stack)` mentions in root files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | `_router/` reference docs extracted with stack_detection.md, intent_classification.md, resource_loading.md, phase_lifecycle.md | Files exist with content sourced from SKILL.md routing pseudocode |
| REQ-011 | `universal/` namespace scoped tightly (NO `debugging_workflows.md` or `verification_workflows.md` — those stay in `web/` per Plan-agent critique because they assume DOM/console/page-load semantics) | `universal/` contains only error_recovery.md (decision tree), code_quality_standards.md (P0/P1/P2 model), code_style_guide.md (language-agnostic parts), multi_agent_research.md |
| REQ-012 | Lane-attribution test fixtures updated and tests pass | `cd mcp_server && npm test -- lane-attribution` exits 0 |
| REQ-013 | Sister SKILL.md cross-refs (7 files) updated where they name the legacy skills | Regrep returns only intentional historical refs in observability/, specs/, .opencode/changelog/ |
| REQ-014 | Deep-review agent definitions (3 files) updated to reference `sk-code` | Each file's stack-overlay table shows `sk-code` (web+full-stack collapsed) and `sk-code-opencode` (preserved) |
| REQ-015 | Web smoke test passes from new skill location | `node scripts/minify-webflow.mjs` produces output identical to running from sk-code-web/scripts/ in a Webflow project |

### P2 - Optional (defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | Observability reports get a deprecation note (vs. rewriting historical metrics) | `smart-router-measurement-report.md` and `smart-router-analyze-report-*.md` retain historical content with a note prepended |
| REQ-021 | Stub files include a `last_synced_at` timestamp for future drift detection tooling | Each stub frontmatter has the field, defaulting to spec creation date |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh prompt "minify the Webflow JS bundle" routes to `sk-code` (not `sk-code-web` or `sk-code-full-stack`) and returns the WEB load level with full content
- **SC-002**: A fresh prompt "Add a React component to my Next.js app" routes to `sk-code` and surfaces the placeholder note pointing at `sk-code-full-stack/references/frontend/react/`
- **SC-003**: `bash validate.sh --strict` exits 0 for `054-sk-code-merger/`
- **SC-004**: `doctor:skill-advisor :confirm` re-tunes scoring tables without regressions; `lane-attribution.test.ts` passes
- **SC-005**: `git diff` on `sk-code-web/SKILL.md` and `sk-code-full-stack/SKILL.md` is bounded to 3 added YAML keys + their values; references/, assets/, scripts/ unchanged
- **SC-006**: Regrep `sk-code-(web|full-stack)` excluding `specs/`, `.opencode/changelog/`, `observability/` returns only intentional refs in the deprecated SKILL.md frontmatters and the `DEPRECATED_SKILLS` constants
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hand-tuned advisor scores degrade after rename | Routing regressions for live web prompts | Run `doctor:skill-advisor :confirm` after text edits; verify with 5 trigger-test prompts |
| Risk | `lane-attribution.test.ts` fixtures break | CI fails | Update fixtures in same commit as `explicit.ts` rewrite; run test before claiming completion |
| Risk | Universal/ split smuggles browser assumptions into stack-agnostic content | Wrong guidance to non-web users | TIGHTEN scope (Plan-agent critique): only error_recovery + P0/P1/P2 model + language-agnostic style; keep debugging_workflows + verification_workflows inside web/ |
| Risk | Scripts hard-code paths relative to `sk-code-web/` | Build break | RESOLVED: audit confirmed scripts use CWD-relative paths (`'src/2_javascript'`) — no edits needed |
| Risk | Advisor re-amplifies dead skills via keyword headers | Routing ambiguity returns | `DEPRECATED_SKILLS` frozenset in `skill_advisor.py` + `explicit.ts` with early-return guard; survives `doctor:skill-advisor :confirm` rebuilds |
| Risk | Bare `sk-code` name causes substring-matching ambiguity with siblings (`sk-code-review`, `sk-code-opencode`) | Wrong skill triggered | Audit boost rules for substring/prefix matching vs exact-name keys; trigger-test "review code" → expect `sk-code-review`; "opencode plugin" → expect `sk-code-opencode` |
| Dependency | `skill_advisor.py`, `explicit.ts` | Advisor must accept the rewrite without breaking other skills | Run full lane-attribution test after edits; spot-check 10 unrelated skills route correctly |
| Dependency | `generate-context.js` | Spec metadata refresh | Run after spec docs are stable to populate description.json + graph-metadata.json |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Skill advisor scoring round-trip stays under 100ms per prompt (no regression vs. baseline)

### Reliability
- **NFR-R01**: Live web smoke test (minify-webflow.mjs from new skill location) produces byte-identical output to legacy skill location

---

## 8. EDGE CASES

### Stack detection
- Multiple marker files (e.g. monorepo with go.mod AND package.json+react): first match in precedence order wins (Webflow → Go → Swift → RN → React → NodeJS)
- No marker file: route to UNKNOWN with hint message offering stack-marker examples
- Webflow project without `src/2_javascript/` (e.g. fresh project setup): falls through to `package.json` → `NODEJS` (acceptable false negative; user can override via explicit hint in prompt)

### Bare `sk-code` name collision
- Token "code" alone (no qualifier) — should NOT auto-route to `sk-code` because review/opencode siblings legitimately match
- Mitigation: advisor uses exact-name keys, not substring matching (verify in audit)

### Deprecated skill prompts
- User explicitly asks "use sk-code-web for X" → advisor's `DEPRECATED_SKILLS` short-circuit returns 0; SKILL.md frontmatter `superseded_by: sk-code` provides the redirect signal in any direct read

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: ~80 created, ~35 modified, ~50 web files migrated; LOC: ~3000 added/moved; Systems: skill registry, advisor, graph |
| Risk | 18/25 | Auth: N, API: N, Breaking: Y (advisor scoring); affects all code skills routing |
| Research | 8/20 | Investigation light — both skills already explored in plan phase; minimal unknowns |
| Multi-Agent | 6/15 | Workstreams: 7 tiers; can be sequential by tier; cli-codex parallel dispatch optional but not required |
| Coordination | 10/15 | Dependencies between Tier 1 (advisor) and Tier 2 (graph) and Tier 7 (deprecation); 3-tier ordering required |
| **Total** | **64/100** | **Level 3** (within 50-79 range) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Advisor scoring regression after rewrite | H | M | doctor:skill-advisor :confirm + trigger tests + lane-attribution test |
| R-002 | Universal/ content surfaces browser assumptions | M | M | Tighten scope per Plan-agent critique; review each file for DOM refs |
| R-003 | Bare `sk-code` name collides with siblings on substring match | M | L | Audit advisor for exact-name vs substring matching; trigger tests |
| R-004 | Web smoke test fails after script copy | H | L | Scripts already audited as CWD-relative — no path edits needed; smoke test confirms |
| R-005 | User intent re-interpretation: "don't overwrite" vs frontmatter additions | L | L | Additive YAML keys are non-destructive and reversible; no body changes |

---

## 11. USER STORIES

### US-001: Web user (the user) — daily web work routes to one skill (Priority: P0)

**As a** Webflow developer (the user), **I want** "fix this Webflow animation flicker" to route to a single deterministic skill, **so that** the advisor doesn't tie-break between sk-code-web and sk-code-full-stack.

**Acceptance Criteria**:
1. Given a fresh prompt with Webflow markers in cwd, when the skill advisor scores skills, then `sk-code` returns highest with the WEB load level applied.
2. Given the prompt "minify the Webflow JS bundle", when the user invokes the recommended skill, then `scripts/minify-webflow.mjs` is reachable from `sk-code/scripts/` and produces identical output.

---

### US-002: Future React user — placeholder routes to legacy reference (Priority: P0)

**As a** developer adopting React/Next.js, **I want** the smart router to detect React stack and surface a clear placeholder note pointing at the canonical source, **so that** I'm not silently misled by empty stub files.

**Acceptance Criteria**:
1. Given a project with `next.config.js`, when the user prompts "Add a React component", then `sk-code` is recommended and `references/react/_placeholder.md` displays the migration pointer.
2. Given the placeholder pointer, when the user follows it to `sk-code-full-stack/references/frontend/react/`, then the legacy content is intact and readable.

---

### US-003: Other user (full-stack developer) — legacy skills remain accessible (Priority: P1)

**As a** full-stack developer using the repo (someone other than the user), **I want** `sk-code-full-stack/` to remain on disk with all references readable, **so that** I can copy patterns into my own work even though the advisor no longer auto-routes there.

**Acceptance Criteria**:
1. Given the deprecated frontmatter on `sk-code-full-stack/SKILL.md`, when I read the file, then the body content is unchanged and the frontmatter clearly indicates `superseded_by: sk-code`.
2. Given `sk-code-full-stack/references/{backend,frontend,mobile}/`, all files are present and unchanged.

---

### US-004: Skill maintainer — deprecation is reversible (Priority: P2)

**As a** skill maintainer, **I want** deprecation handled via a code-level exclusion list (not folder rename), **so that** unwinding the deprecation is a single line edit instead of a directory restructure.

**Acceptance Criteria**:
1. Given `DEPRECATED_SKILLS = frozenset({"sk-code-web", "sk-code-full-stack"})` in `skill_advisor.py`, when I remove an entry, then the corresponding skill resumes normal routing without further changes.

---

## 12. OPEN QUESTIONS

- (resolved) Suffix for new skill name → bare `sk-code`, no suffix
- (resolved) Spec folder placement → `054-sk-code-merger` under skilled-agent-orchestration
- (resolved) Placeholder fidelity → empty templated stubs + `_placeholder.md` per stack folder
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md` (also references the approved plan at `~/.claude/plans/merge-users-michelkerkmeester-mega-devel-crispy-rabin.md`)
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
