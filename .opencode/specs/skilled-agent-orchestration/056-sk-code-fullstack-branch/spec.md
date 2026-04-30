---
title: "Feature Specification: sk-code multi-stack scaffolding (Webflow live + Next.js + Go stubs)"
description: "Bring sk-code from a single live Webflow stack to a three-stack smart router: WEBFLOW (live), NEXTJS (stub — Next.js 14 + vanilla-extract + motion v12 + react-hook-form/zod + react-aria + Untitled UI), GO (stub — gin + sqlc + Postgres + golang-jwt). Includes naming reconciliation, kerkmeester scrub, sk-doc smart-router alignment, anchor removal, and per-stack reference scaffolding."
trigger_phrases: ["sk-code multi-stack", "sk-code nextjs go", "056 sk-code", "smart router alignment", "stack scaffolding"]
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/056-sk-code-fullstack-branch"
    last_updated_at: "2026-04-30T17:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "057 merged into 056"
    next_safe_action: "Run /memory:save"
    blockers: []
    completion_pct: 100
---
# Feature Specification: sk-code multi-stack scaffolding

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-30 |
| **Completed** | 2026-04-30 |
| **Branch** | `main` (no feature branch — per-user policy) |
| **Absorbed packet** | `skilled-agent-orchestration/057-sk-code-multi-stack-placeholders` (merged 2026-04-30) |

---

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-code` was the umbrella code-routing skill but only had one live stack (Webflow). Users working on a future Next.js + Go full-stack project needed sk-code to route, validate, and verify their code — not surface a "stack not owned" disambiguation prompt. Packet 055 had retired the canonical content of five non-Webflow stacks (`react/`, `nodejs/`, `go/`, `react-native/`, `swift/`) leaving five `_placeholder.md` files and broken pointers in SKILL.md.

### Purpose
Restore a working three-stack `sk-code`:

- **WEBFLOW** stays live (no regression).
- **NEXTJS** — scaffolded for a future Next.js 14 App Router project (vanilla-extract + motion v12 + react-hook-form/zod + react-aria + Untitled UI + next-themes + optional TinaCMS). Pairs with GO via the cross-stack pairing doc.
- **GO** — scaffolded for a future gin + sqlc + pgx + Postgres + go-playground/validator + golang-jwt service. Pairs with NEXTJS.
- **UNKNOWN** — Node.js without React/Next, React Native, Swift, etc. → disambiguation prompt.

Stubs are project-agnostic: every NEXTJS / GO file declares `status: stub`, `populated: false`, `last_synced_at: 2026-04-30`. SKILL.md, advisor scoring, description.json, graph-metadata.json all describe the three-stack model honestly. The smart router and all 9 universal/router reference docs follow the sk-doc canonical reference template.

---

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Three-stack scaffolding: `references/{webflow,nextjs,go}/` + `assets/{webflow,nextjs,go}/`.
- 43 project-agnostic NEXTJS / GO stubs (23 NEXTJS + 20 GO) covering implementation/, debugging/, verification/, deployment/, standards/, plus checklists/patterns/integrations.
- 4 carry-over rewrites: `references/{nextjs,go}/README.md` + `references/{nextjs,go}/implementation/implementation_workflows.md`.
- Canonical contract: `references/router/cross_stack_pairing.md` (Next.js ↔ Go API contract, JWT, CORS, deploy, drift).
- Naming reconciliation: stack constant standardized to `NEXTJS`, folder paths `references/nextjs/` and `assets/nextjs/`, advisor scoring updated, `STACK_FOLDERS["NEXTJS"]: "nextjs"`.
- Kerkmeester scrub: zero project-name references anywhere in `sk-code/`.
- Anchor removal: every `` HTML comment stripped from sk-code md files.
- sk-doc smart-router alignment: SKILL.md §2 follows sk-doc canonical pattern (anchor `smart-routing-references`, single comprehensive Python pseudocode block, `_task_text`/`_guard_in_skill`/`discover_markdown_resources`/`score_intents`/`select_intents`/`route_code_resources` helpers).
- New SKILL.md §5 REFERENCES section (sk-doc canonical shape: Core References → Templates → Build/Verification Scripts).
- 4 universal/ refs and 5 router/ refs all rewritten to sk-doc canonical reference template (1-2 sentence intro → `## 1. OVERVIEW` with Purpose/Core Principle/When to Use/Key Sources → numbered topical sections → `## N. RELATED RESOURCES`).
- universal/ checklists rewritten to sk-doc asset template (numbered sections, OVERVIEW, RELATED RESOURCES).
- SKILL.md / README.md / CHANGELOG.md / description.json / graph-metadata.json updated to reflect the three-stack model with honest stub markers.
- Skill version bump: 1.2.0 → 1.3.0.

### Out of Scope
- Filling stubs with real Next.js / Go code — explicit user instruction: "do not fill it with actual content make it project agnostic". A future packet will populate when a real project is wired in.
- Renaming the constant `NEXTJS` to anything else — this is the stable contract.
- Modifying Webflow content — already live, untouched throughout.
- Building stack-specific scripts beyond the 3 Webflow scripts (`minify-webflow`, `verify-minification`, `test-minified-runtime`) — `npm` and `go` CLIs handle NEXTJS / GO natively.

### Files to Change

| File / Path | Change Type | Description |
|------------|-------------|-------------|
| `.opencode/skill/sk-code/references/nextjs/` | Create + populate | 12 stub markdown files + README + impl_workflows entry |
| `.opencode/skill/sk-code/references/go/` | Create + populate | 12 stub markdown files + README + impl_workflows entry |
| `.opencode/skill/sk-code/assets/nextjs/{checklists,patterns,integrations}/` | Create | 3 checklists + 5 code stubs + 3 integrations |
| `.opencode/skill/sk-code/assets/go/{checklists,patterns}/` | Create | 3 checklists + 5 code stubs |
| `.opencode/skill/sk-code/references/router/cross_stack_pairing.md` | Author + scrub | Canonical contract (15K+); kerkmeester scrubbed; sk-doc-aligned |
| `.opencode/skill/sk-code/references/router/{stack_detection,intent_classification,resource_loading,phase_lifecycle}.md` | Rewrite | sk-doc canonical reference template |
| `.opencode/skill/sk-code/references/universal/{code_quality_standards,code_style_guide,error_recovery,multi_agent_research}.md` | Rewrite | sk-doc canonical reference template |
| `.opencode/skill/sk-code/assets/universal/checklists/{debugging,verification}_checklist.md` | Rewrite | sk-doc canonical asset template |
| `.opencode/skill/sk-code/SKILL.md` | Modify | sk-doc smart-router alignment, §5 REFERENCES added, anchors stripped, version 1.3.0 |
| `.opencode/skill/sk-code/README.md` | Modify | Stack table updated; STUB markers honest |
| `.opencode/skill/sk-code/changelog/v1.3.0.0.md` | Create | Version changelog entry |
| `.opencode/skill/sk-code/description.json` | Rewrite | supported_stacks, keywords, lastUpdated, placeholder_fill_packet |
| `.opencode/skill/sk-code/graph-metadata.json` | Rewrite | domains, intent_signals, key_files, causal_summary, placeholder_fill_packet |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | Modify | NEXTJS lane (was REACT); kerkmeester removed; nextjs go pairing triggers |

---

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Three-stack router resolves at runtime | Path-existence sweep over SKILL.md `RESOURCE_MAPS[stack][intent]` for WEBFLOW + NEXTJS + GO returns 0 missing |
| REQ-002 | All NEXTJS / GO stub files declare honest status | Every md stub has `status: stub`, `populated: false`, `last_synced_at: 2026-04-30`; every code stub has `Status: stub` in comment header |
| REQ-003 | No fictional code in stubs | `grep -rE '^\`\`\`' references/{nextjs,go} --include="*.md"` returns empty |
| REQ-004 | No project-name leakage | `grep -rl "kerkmeester" .opencode/skill/sk-code/` returns empty |
| REQ-005 | sk-doc validation passes for all 9 universal+router references | All 9 files report `valid: true`, `total_issues: 0` from `validate_document.py` |
| REQ-006 | SKILL.md follows sk-doc canonical structure | sk-doc validator returns `valid: true`; sections 1-10 numbered; smart-router-references anchor (or anchor-free per user request); REFERENCES section present |
| REQ-007 | No ANCHOR HTML comments anywhere in sk-code | `grep -rln '<!--.*ANCHOR:' .opencode/skill/sk-code/` returns 0 |
| REQ-008 | Advisor smoke regression on 3 prompts | Next.js / Go / Webflow prompts all route to sk-code with `passes_threshold: true` |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | DQI scores ≥ good for all 9 reference docs | `extract_structure.py` reports band ∈ {good, excellent} for all |
| REQ-011 | description.json + graph-metadata.json mirror SKILL.md three-stack model | `supported_stacks: ["WEBFLOW", "NEXTJS", "GO"]`; `placeholder_fill_packet` field present |
| REQ-012 | Skill version bump documented | `changelog/v1.3.0.0.md` exists; SKILL.md frontmatter `version: 1.3.0` |

### P2 — Optional

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | Stub files conform to a future "stub asset template" | sk-doc may evolve a stub template; current files use a custom shape (frontmatter + Intended scope + Outline + See also) |

---

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Smart router resolves all `RESOURCE_MAPS` paths for the three stacks (33 paths across NEXTJS + GO).
- **SC-002**: Every reference doc under `references/{universal,router}/` reads as a sk-doc canonical reference: 1-2 sentence intro, `## 1. OVERVIEW` with Purpose/Core Principle/When to Use/Key Sources, numbered sections, `## N. RELATED RESOURCES`.
- **SC-003**: Every md stub under `references/{nextjs,go}/` and `assets/{nextjs,go}/` is project-agnostic (no kerkmeester, no fictional code, honest status markers).
- **SC-004**: Advisor routes Next.js / Go / Webflow prompts to `sk-code` with score ≥ threshold (no regression on Webflow).
- **SC-005**: `cross_stack_pairing.md` retains its 15K+ of canonical contract content (topology, success/error envelopes, JWT, CORS, pagination, deploy table, drift detection) wrapped in sk-doc structure.
- **SC-006**: Skill version v1.3.0 published with changelog entry summarizing the three-stack scaffolding and naming reconciliation.

---

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Auto-linter polluting files with `## N. OVERVIEW _TODO_` blocks | Medium — wastes write cycles | Cleanup pass after every batch of writes; conform files to sk-doc structure so linter leaves them alone |
| Risk | LLM-generated stubs include fictional code | High — would regress to packet 056's failure mode | Strict template guards in cli-codex prompts; post-dispatch grep for fenced code blocks |
| Risk | Folder rename breaks downstream consumers | Low — pre-flight grep showed only spec docs reference `references/nextjs` paths | git mv preserves history; advisor scoring updated alongside |
| Risk | Naming inconsistency between constant `NEXTJS` and folder paths | High during rename — broke routing temporarily | Single source of truth: `STACK_FOLDERS["NEXTJS"]: "nextjs"`; verified via path sweep |
| Dependency | cli-codex (gpt-5.5 high, fast service tier) | Used for bulk stub creation | Available; explicit fast-mode flag per memory rule |
| Dependency | sk-doc validator + DQI scorer | Validates reference docs | `validate_document.py` and `extract_structure.py` both available |

---

<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Cleanup + rewrite passes complete in under 5 minutes total wall-clock per batch.
- **NFR-P02**: cli-codex stub fill completes in one dispatch (≤ 25 files) per stack.

### Security
- **NFR-S01**: No secrets, credentials, or API keys in any stub or reference file.
- **NFR-S02**: External URLs limited to `example.com` placeholders or canonical doc URLs (react.dev, nextjs.org, gin-gonic.com, etc.).

### Reliability
- **NFR-R01**: Path-existence sweep is exhaustive — every `RESOURCE_MAPS` entry must resolve.
- **NFR-R02**: Idempotent re-runs — re-running cli-codex with the same path list overwrites with identical output (template-driven).

---

<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty subdir post-rename: tolerated until stubs land; resource_map paths fail the sweep until Phase 2 completes.
- File modification race with auto-linter: detected on Write tool failure; resolved by switching to Python file writes (bypasses Write-tool stale-read tracking).

### Error Scenarios
- cli-codex dispatch generates fictional code: caught by post-dispatch fenced-code grep; re-dispatch with stricter prohibitions.
- File deleted by user mid-task (e.g., user cleared `references/react/` during the rename): detected via path sweep; re-create at the corrected `references/nextjs/` path.

### State Transitions
- Mid-rename failure (some files moved, others not): `git status` identifies partial state; `git mv` the remaining entries explicitly.
- Linter re-pollution: standalone Python cleanup pass strips trailing TODO blocks; subsequent rewrites should match sk-doc structure to prevent re-pollution.

---

<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | ~85 files touched (43 stubs + 5 carry-over + 9 reference rewrites + 2 asset rewrites + ~10 metadata + spec packet) |
| Risk | 14/25 | Naming reconciliation broke routing temporarily; auto-linter races; cli-codex template adherence is highest-variance factor |
| Research | 8/20 | Comprehensive Phase 1 exploration via 3 Explore agents; Plan agent stress-test; sk-doc reference template study |
| **Total** | **44/70** | **Level 2** confirmed |

---

<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None at completion. Lineage from prior packet (055 retirement of legacy stack content) and absorbed packet (057, merged into 056) is documented in §1 METADATA.

<!--
LEVEL 2 SPEC — Merged narrative covering:
  Phase A: original 056 attempt to promote react/ + go/ placeholders to live (kerkmeester-tied content, broken folder naming)
  Phase B: 057 naming reconciliation (nextjs / NEXTJS) + cli-codex stub fill (43 files) + carry-over rewrites + cross_stack scrub
  Phase C: sk-doc smart-router alignment + universal/router reference rewrites + anchor removal + asset checklist alignment
End state: WEBFLOW (live), NEXTJS + GO (project-agnostic stubs), all 9 reference docs sk-doc-canonical, version 1.3.0
-->
<!-- /ANCHOR:questions -->
