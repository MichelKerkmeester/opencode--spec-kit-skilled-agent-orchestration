---
title: "Implementation Plan: CLI Testing Playbooks"
description: "Three-phase delivery (scaffold → build in 2 waves → validate) of manual_testing_playbook packages for cli-claude-code, cli-codex, cli-copilot, cli-gemini, cli-opencode via /create:testing-playbook dispatched through @write."
trigger_phrases:
  - "cli playbook plan"
  - "048 plan"
  - "cli testing playbook plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/048-cli-testing-playbooks"
    last_updated_at: "2026-04-26T00:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Drafted Level 3 plan with Wave 1 + Wave 2 dispatch sequence"
    next_safe_action: "Begin Wave 1: dispatch @write for cli-gemini, cli-claude-code, cli-codex"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/plan.md"
      - ".opencode/command/create/testing-playbook.md"
      - ".opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_template.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000048"
      session_id: "048-plan-init"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Wave plan: 3+2 split, smaller CLIs first"
---

# Implementation Plan: CLI Testing Playbooks

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (per-feature files), shell (validation), YAML (canonical command workflow) |
| **Framework** | sk-doc playbook contract; `/create:testing-playbook` YAML workflow |
| **Storage** | Filesystem under `<skill>/manual_testing_playbook/` |
| **Testing** | `validate_document.py`, link integrity check, feature-ID count check, forbidden-sidecar scan |

### Overview

Spec scaffolding (this folder) + 5 playbook builds dispatched through the canonical `/create:testing-playbook <skill> create :auto` command via `@write` subagent. Builds split into two waves (3+2) to manage parallel dispatch stability. Validation runs per-playbook after each wave; final memory save closes the spec.

---

## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (spec.md §5)
- [x] Dependencies identified (spec.md §6, §3 + decision-record.md)
- [x] Shared category taxonomy decided (decision-record.md ADR-001)
- [x] Per-CLI ID prefixes decided (decision-record.md ADR-002)

### Definition of Done

- [ ] All 5 playbooks pass `validate_document.py` with exit 0
- [ ] Link integrity, feature-ID count, forbidden-sidecar checks pass per playbook
- [ ] Cross-CLI taxonomy invariants verified (categories 01/06/07 match)
- [ ] `implementation-summary.md` filled with non-placeholder content
- [ ] `generate-context.js` refreshed `description.json` + `graph-metadata.json`
- [ ] Spec folder validation `--strict` exits 0

---

## 3. ARCHITECTURE

### Pattern

Pipeline-of-canonical-commands. The playbook contract lives in templates + the `/create:testing-playbook` YAML workflow. Spec 048 owns scope, taxonomy decisions, and validation; the YAML workflow owns generation; this plan orchestrates dispatch.

### Key Components

- **Spec folder (`048-cli-testing-playbooks/`)** — scope, taxonomy decisions, checklist, summary
- **`/create:testing-playbook` command** — YAML-driven generator with H0–H4 validation gates
- **`@write` subagent** — runs the command with template-first generation behavior
- **Templates at `.opencode/skill/sk-doc/assets/documentation/testing_playbook/`** — root + per-feature scaffolds
- **Validator (`validate_document.py`)** — checks root playbook structure
- **Per-skill playbook output** — root + category folders + per-feature files

### Data Flow

```
spec/plan/decision-record (taxonomy frozen)
        │
        ▼
Wave 1: parallel @write dispatch × 3
   ├── cli-gemini   → /create:testing-playbook cli-gemini   create :auto
   ├── cli-claude-code → /create:testing-playbook cli-claude-code create :auto
   └── cli-codex   → /create:testing-playbook cli-codex   create :auto
        │
        ▼
Wave 1 validation (validator + link + ID + sidecar)
        │
        ▼
Wave 2: parallel @write dispatch × 2
   ├── cli-copilot  → /create:testing-playbook cli-copilot  create :auto
   └── cli-opencode → /create:testing-playbook cli-opencode create :auto
        │
        ▼
Wave 2 validation
        │
        ▼
implementation-summary.md + /memory:save
```

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (spec scaffolding)

- [x] Create spec.md
- [x] Create plan.md (this file)
- [x] Create tasks.md
- [x] Create checklist.md
- [x] Create decision-record.md (taxonomy + ID prefix ADRs)
- [x] Create implementation-summary.md placeholder
- [ ] Run `generate-context.js` to create `description.json` + `graph-metadata.json`

### Phase 2: Build (5 playbooks in 2 waves)

**Per-CLI category schemas (frozen — ADR-001 + ADR-003):**

#### cli-claude-code (7 categories, target ~18-20 per-feature files, prefix `CC-`)

1. `01--cli-invocation` — base `-p` flag, model selection, output formats (~3-4 scenarios)
2. `02--permission-modes` — plan, write/default, danger flags (~2-3)
3. `03--reasoning-and-models` — Opus / Sonnet / Haiku, extended thinking (~3)
4. `04--agent-routing` — 9 agents (context, debug, handover, orchestrate, research, review, speckit, ultra-think, write) (~4-5)
5. `05--session-continuity` — `--continue`, `--resume`, fork (~2)
6. `06--integration-patterns` — cross-AI delegation patterns (~2-3)
7. `07--prompt-templates` — template usage + CLEAR quality card (~2-3)

#### cli-codex (8 categories, target ~22-25 per-feature files, prefix `CX-`)

1. `01--cli-invocation` — `codex exec`, `codex exec review`, model gpt-5.5, service tier `fast` (~3-4)
2. `02--sandbox-modes` — read-only, workspace-write, danger-full-access, approval policies (~3-4)
3. `03--reasoning-effort` — none/minimal/low/medium/high/xhigh (~3)
4. `04--agent-routing` — 6 profiles (review, context, research, write, debug, ultra-think) (~4-5)
5. `05--session-continuity` — `--full-auto`, hook integration, session resume/fork (~2)
6. `06--integration-patterns` — cross-AI delegation, web search, image input (~3-4)
7. `07--prompt-templates` — template usage + CLEAR quality card (~2-3)
8. `08--built-in-tools` — `/review`, `--search`, `--image`, MCP, native hooks (~2-3)

#### cli-copilot (8 categories, target ~20-23 per-feature files, prefix `CP-`)

1. `01--cli-invocation` — `-p`, `--allow-all-tools`, `--no-ask-user` (~3-4)
2. `02--multi-model` — gpt-5.4, gpt-5.3-codex, claude-opus-4.6, claude-sonnet-4.6, gemini-3.1-pro-preview (~3-4)
3. `03--autopilot-mode` — autonomous execution, `--allow-all-tools` flag (~2)
4. `04--agent-routing` — explore vs task agent, model switching mid-session (~3)
5. `05--session-continuity` — repo memory, mid-session model switch (~2)
6. `06--integration-patterns` — cross-AI delegation, MCP support (~2-3)
7. `07--prompt-templates` — template usage + CLEAR quality card (~2-3)
8. `08--cloud-delegation` — `/delegate`, inline `&prompt` (~2-3)

#### cli-gemini (6 categories, target ~15-18 per-feature files, prefix `CG-`)

1. `01--cli-invocation` — direct `gemini "[prompt]"`, `-o text` / `-o json`, `-m gemini-3.1-pro-preview` (~3)
2. `02--auto-approve-yolo` — `--yolo` / `-y` flag (~2)
3. `03--built-in-tools` — google_web_search, codebase_investigator, save_memory (~3-4)
4. `04--agent-routing` — 6 agents via `As @<agent>:` prefix (review, context, deep-research, write, debug, ultra-think) (~3-4)
5. `06--integration-patterns` — cross-AI delegation, web grounding (~2-3)
6. `07--prompt-templates` — template usage + CLEAR quality card (~2)

> Note: cli-gemini omits category 05 (no first-class session continuity). Categories 06/07 keep their canonical numbers — gap at 05 is intentional and documented in the playbook.

#### cli-opencode (9 categories, target ~28-32 per-feature files, prefix `CO-`)

1. `01--cli-invocation` — `opencode run`, `--model`, `--format`, `--dir`, `--port` (~4-5)
2. `02--external-dispatch` — external runtimes dispatching `opencode run` (~3-4)
3. `03--multi-provider` — anthropic / openai / google providers + variant levels (~3-4)
4. `04--agent-routing` — 8 agents (general, context, review, ultra-think, deep-research, deep-review, write, orchestrate) (~4-5)
5. `05--session-continuity` — `-c`/`--continue`, `-s`/`--session`, `--fork`, `--share` (~3)
6. `06--integration-patterns` — cross-AI handback, prompt-template usage (~2-3)
7. `07--prompt-templates` — 13 templates + CLEAR quality card (~3-4)
8. `08--parallel-detached` — `--port` for worker farms, ablation, detached sessions (~3)
9. `09--cross-repo-cross-server` — `--dir` cross-repo, cross-server dispatch, self-invocation guard (~3-4)

**Wave Plan:**

- **Wave 1 (parallel ×3)**: cli-gemini, cli-claude-code, cli-codex
- **Wave 2 (parallel ×2)**: cli-copilot, cli-opencode

Each dispatch is `Agent(subagent_type="write", prompt="run /create:testing-playbook <skill> create :auto with source_strategy=manual_scenario_list, spec_choice=existing 048-cli-testing-playbooks, category_schema=<per-CLI table from plan.md §4>")`.

### Phase 3: Verification (per-playbook + spec-folder)

- [ ] Run `validate_document.py` on each root playbook (5 invocations)
- [ ] Link integrity check per playbook (5 invocations)
- [ ] Feature-ID count check per playbook (5 invocations)
- [ ] Forbidden-sidecar scan per playbook (5 invocations)
- [ ] Cross-CLI taxonomy invariant manual review (categories 01/06/07)
- [ ] Spot-check 2 per-feature files per CLI (10 reads)
- [ ] Spec-folder validation `--strict`
- [ ] Fill `implementation-summary.md` with concrete counts + validator exit codes
- [ ] Run `generate-context.js` for `description.json` + `graph-metadata.json` refresh

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Root playbook H1 + frontmatter + numbered all-caps H2 + TOC | `validate_document.py` |
| Link integrity | Per-feature file links from root playbook | `bash` (grep + test -f) |
| Feature-ID count | Cross-reference index vs per-feature file count | `bash` (grep -c, find \| wc -l) |
| Forbidden sidecars | No `review_protocol.md`, `subagent_utilization_ledger.md`, or `snippets/` | `bash` (find) |
| Per-feature scaffold | Sections 1-5 + 9-column table | Manual spot-check |
| Cross-CLI invariants | Categories 01/06/07 alignment | Manual review |
| Spec folder | Required files, frontmatter, anchors | `bash .../scripts/spec/validate.sh ... --strict` |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@write` subagent | Internal | Green | Cannot dispatch `/create:testing-playbook`; fall back to hand-craft |
| `/create:testing-playbook` command | Internal | Green | Hand-craft to same contract using templates directly |
| `validate_document.py` | Internal | Green | Cannot run H4 validation; manual structural review only |
| `generate-context.js` | Internal | Green | Cannot refresh metadata; hand-edit `description.json` + `graph-metadata.json` |
| Templates at `.opencode/skill/sk-doc/assets/documentation/testing_playbook/` | Internal | Green | Cannot generate playbook; halt |

---

## 7. ROLLBACK PLAN

- **Trigger**: Validator failures cannot be resolved within 3 fix-and-revalidate iterations OR taxonomy drift discovered between waves
- **Procedure**:
  1. Stop further dispatches
  2. `git checkout -- .opencode/skill/<affected-cli>/manual_testing_playbook/` to revert the affected playbook(s)
  3. Re-read decision-record.md to confirm taxonomy invariants
  4. Re-dispatch with corrected briefing
- **Spec docs rollback**: spec docs are versioned in git; `git revert` the offending commit if scope drift discovered

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 Wave 1 ──► Wave 1 validation ──► Phase 2 Wave 2 ──► Wave 2 validation ──► Phase 3 (close-out)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Wave 1 |
| Wave 1 | Setup, taxonomy frozen | Wave 1 validation |
| Wave 1 validation | Wave 1 | Wave 2 |
| Wave 2 | Wave 1 validation | Wave 2 validation |
| Wave 2 validation | Wave 2 | Phase 3 |
| Phase 3 close-out | Wave 2 validation | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (spec docs + metadata) | Low | 30-45 min |
| Wave 1 (3 parallel dispatches + validation) | Medium | 30-60 min wall-clock |
| Wave 2 (2 parallel dispatches + validation) | Medium | 30-60 min wall-clock |
| Phase 3 close-out (summary + memory save) | Low | 15-30 min |
| **Total** | | **~2-3 hours wall-clock** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] All 5 target skill folders exist (cli-claude-code, cli-codex, cli-copilot, cli-gemini, cli-opencode)
- [ ] None of the 5 has a pre-existing `manual_testing_playbook/` (verified empty before dispatch)
- [ ] Templates checksum unchanged from session start

### Rollback Procedure

1. Stop further dispatches
2. `git status` to identify which playbook trees were created
3. `git checkout -- .opencode/skill/<cli>/manual_testing_playbook/` per affected tree
4. Verify checklist.md P0 items not yet marked
5. Notify user with summary of what was reverted and why

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: filesystem-only; `git checkout` reverses all changes

---

## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Phase 1    │────►│  Phase 2 W1  │────►│  Wave 1 val  │
│   Setup      │     │  3 parallel  │     │              │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
                          ┌──────────────────────▼───────┐
                          │  Phase 2 W2 (2 parallel)     │
                          │  cli-copilot, cli-opencode   │
                          └──────────────┬───────────────┘
                                         ▼
                                  ┌──────────────┐
                                  │  Wave 2 val  │
                                  └──────┬───────┘
                                         ▼
                                  ┌──────────────┐
                                  │  Phase 3     │
                                  │  Close-out   │
                                  └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Spec docs (Setup) | None | Frozen taxonomy + scope | Wave 1, Wave 2 |
| Wave 1 dispatch | Spec docs | 3 playbooks | Wave 1 validation |
| Wave 1 validation | Wave 1 | PASS/FAIL per playbook | Wave 2 |
| Wave 2 dispatch | Wave 1 validation | 2 playbooks | Wave 2 validation |
| Wave 2 validation | Wave 2 | PASS/FAIL per playbook | Phase 3 |
| Phase 3 close-out | Wave 2 validation | implementation-summary.md, refreshed metadata | None |

---

## L3: CRITICAL PATH

1. **Spec docs (Setup)** - 30-45 min - CRITICAL
2. **Wave 1 dispatch (largest of 3 wins)** - 20-40 min - CRITICAL (cli-codex)
3. **Wave 1 validation** - 5-10 min - CRITICAL
4. **Wave 2 dispatch (largest of 2 wins)** - 20-40 min - CRITICAL (cli-opencode)
5. **Wave 2 validation** - 5-10 min - CRITICAL
6. **Phase 3 close-out** - 15-30 min - CRITICAL

**Total Critical Path**: ~2-3 hours

**Parallel Opportunities**:
- Wave 1: cli-gemini, cli-claude-code, cli-codex run simultaneously (3-way parallel)
- Wave 2: cli-copilot, cli-opencode run simultaneously (2-way parallel)
- Validation checks within a wave can interleave (validator + link + ID + sidecar are independent)

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup complete | All 6 spec docs written, taxonomy frozen, description.json + graph-metadata.json present | Phase 1 end |
| M2 | Wave 1 done | 3 playbooks created, validator pass, link/ID/sidecar checks pass | Phase 2 mid |
| M3 | Wave 2 done | 5 playbooks created total, all validators pass | Phase 2 end |
| M4 | Spec closed | implementation-summary.md filled, /memory:save run, spec validation --strict passes | Phase 3 end |

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for full ADRs:

- **ADR-001**: Shared category schema (categories 01/06/07 invariant across all 5 playbooks)
- **ADR-002**: Per-CLI feature ID prefixes (`CC-`, `CX-`, `CP-`, `CG-`, `CO-`)
- **ADR-003**: Per-CLI category counts (6/7/8/8/9 by CLI complexity)
- **ADR-004**: Cross-AI handback scenarios stay isolated (no live companion-CLI dependency in default playbook)
- **ADR-005**: Dispatch via `/create:testing-playbook` rather than hand-craft (contract enforcement)
