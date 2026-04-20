---
title: "Feature Specification: Phase 027 — Skill-Graph Auto-Update Daemon + Advisor Unification"
description: "Research phase for (1) filesystem-driven skill-graph auto-update daemon, (2) auto-derived advisor trigger phrases + keywords, (3) advisor matching upgrade using memory MCP's hybrid + causal search, (4) consolidation of skill-advisor into system-spec-kit MCP server."
trigger_phrases:
  - "phase 027"
  - "skill-graph daemon"
  - "advisor auto-update"
  - "advisor unification"
  - "causal advisor"
  - "skill watcher"
importance_tier: "high"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification"
    last_updated_at: "2026-04-20T05:20:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Scaffolded Phase 027 research packet with 4-track battle plan"
    next_safe_action: "Dispatch 40-iter deep-research (cli-codex gpt-5.4 high fast)"
    blockers: []
    key_files:
      - ".opencode/skill/skill-advisor/scripts/skill_advisor.py"
      - ".opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py"
      - ".opencode/skill/skill-advisor/scripts/skill_graph_compiler.py"
      - ".opencode/skill/skill-advisor/scripts/skill-graph.sqlite"
      - ".opencode/skill/skill-advisor/scripts/skill-graph.json"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/memory/"
      - ".opencode/skill/system-spec-kit/mcp_server/tools/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-scaffold-r01"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 027 — Skill-Graph Auto-Update Daemon + Advisor Unification

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 3 |
| **Priority** | P1 (Architectural) |
| **Status** | Research (Draft) |
| **Created** | 2026-04-20 |
| **Branch** | `main` |
| **Parent** | `../020-skill-advisor-hook-surface/` |
| **Research** | 40-iter deep-research, cli-codex gpt-5.4 high fast |
| **Research artifacts** | `../research/027-skill-graph-daemon-and-advisor-unification-pt-01/` |
| **Sibling decisions** | 021/001 (advisor hook efficacy), 021/002 (SKILL.md smart-router), 025 (R02 remediation), 026 (R03 remediation) |

---

## 2. PROBLEM & PURPOSE

### Problem Statement

Four entangled limitations in the current skill-advisor stack:

1. **Stale graph state.** `skill-graph.sqlite` / `skill-graph.json` and per-skill `graph-metadata.json` files are regenerated via explicit scripts (`skill_graph_compiler.py`, `generate-context.js`). Skill authors who edit a `SKILL.md` must remember to run a script to propagate the change into the advisor's match index. Stale or missing graph entries lead to UNKNOWN-fallback routing (56% baseline accuracy per 024 measurement).

2. **Static trigger_phrases + keywords.** `trigger_phrases` live in YAML frontmatter of each `SKILL.md`. When a skill's scope shifts, the author must hand-maintain the triggers — and they commonly don't. The advisor scoring function (`skill_advisor_runtime.py`) has no automatic mechanism to refresh keywords from actual skill content, examples, or related documentation.

3. **Shallow matching logic.** `skill_advisor.py` uses a keyword + fingerprint match model with fixed weights. It ignores richer signals already available in the memory MCP server: hybrid semantic/keyword search, causal links, tier-aware routing, frequency-weighted triggers. This matters because user prompts that don't contain literal trigger words still need accurate routing.

4. **Architectural split.** Skill-advisor lives at `.opencode/skill/skill-advisor/` as a Python subprocess invoked by TypeScript hooks at `.opencode/skill/system-spec-kit/mcp_server/`. This split complicates telemetry, cache invalidation, MCP-tool exposure, and install distribution. The system-spec-kit MCP server is the natural home for advisor logic — it already owns the memory + context + graph infrastructure the advisor wants to use.

### Purpose

Research-phase output (this packet, r01): converged recommendation on the shape of a unified skill-advisor subsystem that (a) auto-updates on skill change, (b) auto-derives/refreshes triggers + keywords, (c) uses memory MCP's hybrid + causal search primitives, (d) lives inside the system-spec-kit MCP server.

Implementation (follow-on packets): shipped design per the research's `adopt now` / `prototype later` / `reject` call for each research question.

---

## 3. RESEARCH SCOPE — 4 TRACKS

### Track A: Skill-Graph Auto-Update Daemon

**Goal:** filesystem event → incremental skill-graph re-index → metadata refresh, transparent to the skill author.

**Core questions:**
- **A1 Watcher choice.** fs.watch (Node), chokidar, fsevents (macOS), inotify (Linux), polling fallback. Cross-platform matrix. Which primitive survives editor-backup-file writes, atomic rename patterns (Vim swap, VS Code atomic write), rename-rather-than-write semantics?
- **A2 Scope of change detection.** What file events trigger re-index? `SKILL.md` content change, `references/**/*.md` change, `assets/**` change, `scripts/**` change, frontmatter-only change, filename/path change (rename = delete + add), skill folder delete, skill folder add.
- **A3 Incremental vs full re-index.** Can we invalidate + rebuild exactly the affected skill's graph entry, its triggers, and its neighbors without touching the rest of the graph? What dependency edges exist (shared references, cross-skill links)?
- **A4 Update transaction model.** How do we keep the `skill-graph.sqlite` + `.json` fallback + per-skill `graph-metadata.json` atomically consistent during a re-index? What's the lock strategy? Are SQLite transactions sufficient, or do we need a separate generation-tag model (matches Phase 020 `graph-metadata` generation approach)?
- **A5 Daemon lifecycle.** Long-running process vs on-demand spawn. launchd (macOS) vs systemd-user vs bootstrap-on-first-hook. What happens if daemon crashes? How do runtime hooks detect + recover?
- **A6 Resource budget.** Watching ~50-100 SKILL.md + supporting files + 10-20 asset dirs. Target: **≤1% CPU idle** (hard ceiling; well-behaved fs watchers should idle <0.5%), **<20MB RSS**, <10s debounce to avoid thrash during multi-file editor saves. 5% idle is NOT acceptable — that's a laptop fan/battery regression, not a quality target.
- **A7 Sanitization at re-index.** Instruction-shaped content in an updated SKILL.md should not poison the advisor (cross-ref DR-P1-001, DR-P1-008 from R02). Re-index pipeline must apply the same sanitizer as the hook renderer.
- **A8 Failure modes.** Daemon crash, corrupted SQLite, fs event loss (e.g., on network filesystems), editor write-then-replace producing ENOENT mid-read. Graceful degradation?

### Track B: Advisor Trigger + Keyword Auto-Derivation

**Goal:** `trigger_phrases` and keyword scoring tables stay fresh as skills evolve, without manual maintenance.

**Core questions:**
- **B1 Extraction sources.** Frontmatter (current), SKILL.md headings, SKILL.md body, references/**.md headings, assets/** filenames, examples in SKILL.md, commit messages touching the skill folder. Which signals are high-precision vs high-recall? Weighting?
- **B2 Extraction pipeline.** Regex-only (cheap, brittle), TF-IDF over the skill corpus (classical, interpretable), embeddings + cluster labels (rich, opaque), or hybrid?
- **B3 Sync model.** On re-index, replace frontmatter `trigger_phrases` in-place? Keep a separate derived index (doesn't touch SKILL.md)? Hybrid (author-authored triggers + auto-derived companions)?
- **B4 Precision safeguards.** Author-authored triggers are often more precise; auto-derived ones can add noise. How do we keep auto-derived triggers from lowering match precision? Confidence-weighted union? Separate explicit vs implicit trigger lists?
- **B5 Freshness trigger.** When B1's inputs change, what invalidates which scoring rows? Same dependency graph as A3, or a finer-grained one specific to keyword provenance?
- **B6 Corpus stats.** Do we maintain repo-level corpus frequencies (DF/IDF) that shift as the set of skills grows? How often should corpus stats re-baseline?
- **B7 Adversarial resilience.** User-authored SKILL.md can be crafted to poison their skill's scoring weight relative to others (a "keyword stuffing" attack at the skill level). What's the threat model and mitigation?

### Track C: Advanced Advisor Matching (Hybrid + Causal)

**Goal:** replace or augment the current fixed-weight keyword scorer with a richer matching pipeline that leverages primitives already in the memory MCP server.

**Core questions:**
- **C1 Available primitives.** Inventory what's already shipped in `mcp_server/lib/memory/`: hybrid search (keyword + embedding), causal link API (`memory_causal_link`, `memory_causal_stats`), trigger matching (`memory_match_triggers`), tier-weighted retrieval, constitutional-surface boost, "always-surface" logic.
- **C2 Mapping memory concepts to advisor concepts.** A "memory entry" has text + triggers + tier + causal edges; a "skill" has SKILL.md + triggers + tier (`importance_tier`) + dependencies. How do these map? What's the adapter layer?
- **C3 Causal graph for skills.** Can we model skill-to-skill relationships (e.g. sk-deep-research uses sk-deep-review; sk-code-opencode is-a-parent-of sk-code-web) as causal edges? Would that improve ambiguous-prompt routing?
- **C4 Scoring fusion.** Keyword score + embedding similarity + causal-boost + tier-weight → single confidence. What fusion function? Learned weights or analytical? How do we stay explainable (advisor brief shows "used X because Y")?
- **C5 Ambiguity handling.** When top-2 skills are within 0.05 confidence, current system emits ambiguous top-two rendering (post-025 fix). Richer matching should explicitly detect "user needs both" vs "ambiguous which one". Use causal edges as tiebreaker?
- **C6 Performance.** Memory MCP hybrid search has known p95 latencies. Advisor hook is a prompt-blocking call — can we afford embedding lookups on every prompt? What's the caching story (post-025 HMAC cache is already in place)?
- **C7 Training / tuning data.** The 019/004 200-prompt labeled corpus is available. Can it be used to learn scoring weights? Hold-out evaluation?
- **C8 Measurement.** Current advisor accuracy: 56% vs 200-prompt corpus (024 Track 2 baseline). Target: what accuracy should C1-C7 achieve to justify the added complexity?

### Track D: System-Spec-Kit MCP Server Consolidation

**Goal:** move advisor logic from `.opencode/skill/skill-advisor/` into `.opencode/skill/system-spec-kit/mcp_server/` as a first-class MCP subsystem.

**Core questions:**
- **D1 Current split.** Map what's already in `mcp_server/lib/skill-advisor/` vs what still lives in `.opencode/skill/skill-advisor/scripts/`. Inventory Python scripts, TypeScript modules, SQLite DB location, test files, install surfaces.
- **D2 Migration target.** Target file layout under `mcp_server/lib/skill-advisor/` after consolidation. Which Python stays (if any)? Which gets ported to TS? SQLite schema — stays as-is or converges with memory MCP's schema?
- **D3 MCP-tool surface.** Expose advisor as MCP tools: `advisor_match`, `advisor_reindex`, `advisor_status`, `advisor_explain`. Signature + semantics for each.
- **D4 Subprocess elimination.** Can we remove `child_process.spawn('python3', ...)` entirely by porting `skill_advisor_runtime.py` matching logic to TS? Or keep the Python matcher and call it in-process via a Node FFI / pyodide bridge?
- **D5 Cache + freshness sharing.** Can advisor share the memory MCP's session cache, freshness-check primitives, and observability pipeline?
- **D6 Install/bootstrap.** How does install change when advisor is part of the mcp_server package? `.opencode` plugin manifest, opencode.json MCP declaration, uninstall, upgrade path.
- **D7 Backward compat.** `skill_advisor.py` is referenced from Claude's Gate 2 fallback, from scripted checks, from the OpenCode plugin bridge, from manual-testing-playbook scenarios. Migration path that keeps all of these working until deprecated.
- **D8 Plugin relationship.** `.opencode/plugins/spec-kit-skill-advisor.js` currently proxies to the Python subprocess. Post-consolidation: proxy to the MCP server's `advisor_match` tool? Deprecate the plugin? Keep both?

---

## 4. REQUIREMENTS (FOR RESEARCH OUTPUT)

### 4.1 Research Must Produce

- **R1** Per-question (A1-A8, B1-B7, C1-C8, D1-D8 = 31 questions) an `adopt now` / `prototype later` / `reject` call with ≥2 evidence sources (code refs, benchmarks, doc citations, analogous system comparisons).
- **R2** A unified architectural sketch covering A+B+C+D: a single diagram-worth of text showing data flow (fs event → daemon → re-index → graph → advisor match → hook renderer).
- **R3** An implementation roadmap: ordered list of sub-packets (027/001 through 027/NNN) with scope, dependencies, effort estimates, and hard gates.
- **R4** Risk register: what could break existing 4-runtime hook surface / plugin path / 200-prompt corpus parity / HMAC cache during the migration.
- **R5** Measurement plan: how to verify the new system is ≥ current accuracy after migration, target accuracy after enhancement (C-track), daemon resource budget adherence, migration backward-compat confirmations.

### 4.2 Research Must NOT Produce

- Code changes. Research-only phase.
- Architectural decisions that reopen Phase 020-026 shipped work.
- Design that assumes live-AI telemetry collection (still deferred; primitive shipped).

---

## 5. ACCEPTANCE SCENARIOS (for research convergence)

1. **AC-1** All 31 sub-questions (A1-A8, B1-B7, C1-C8, D1-D8) have a `adopt now | prototype later | reject` verdict with evidence citations.
2. **AC-2** Architectural sketch (R2) shows the 4 tracks unified as a single coherent design.
3. **AC-3** Implementation roadmap (R3) defines ≥ 3 follow-on sub-packets with estimates and dependencies.
4. **AC-4** Risk register (R4) identifies ≥ 5 risks with mitigation strategy.
5. **AC-5** Measurement plan (R5) names concrete metrics + targets + test harness.
6. **AC-6** 40 research iterations completed (user directive; no early-convergence stop).
7. **AC-7** Final synthesis `research.md` passes sk-doc DQI ≥ 85.

---

## 6. DISPATCH

40-iter deep-research, cli-codex gpt-5.4 high fast, maxConcurrent=1. Fresh per-iter invocation (proven pattern from R02 review + Phase 025 + Phase 026 drivers).

Detailed research protocol + per-iteration prompt template: `../research/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-research-strategy.md` (battle plan).

---

## 7. POST-RESEARCH

After research converges + synthesis emits `research.md`:
1. Orchestrator reads `research.md` + per-question verdicts
2. Scaffold implementation sub-packets (027/001, 027/002, ...) per R3 roadmap
3. Dispatch implementation phases sequentially (cli-codex per phase)
4. Each implementation phase runs its own deep-review at completion (r01, r02, ... as needed)
5. Track against acceptance scenarios AC-1 through AC-5
