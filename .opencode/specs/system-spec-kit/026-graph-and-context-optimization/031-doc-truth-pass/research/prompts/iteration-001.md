## Packet 031: doc-truth-pass — Tier A doc-only remediation

You are cli-codex (gpt-5.5 high fast) implementing remediation packet **031-doc-truth-pass**.

### Goal

Closes the highest-leverage P1 findings from 013's automation reality research via doc-only fixes (no code changes). Specifically:

1. **F5.CopilotDocs** — `.opencode/skill/system-spec-kit/references/config/hook_system.md:22` describes a stale `.claude/settings.local.json` wrapper for Copilot; conflicts with the authoritative `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:27-34`. Make the Copilot-local README authoritative; rewrite the hook_system.md Copilot section to defer to it.
2. **F5.CodexConfig** — `.opencode/skill/system-spec-kit/references/config/hook_system.md:44` requires `[features].codex_hooks=true` + `hooks.json`; repo's `.codex/settings.json` uses settings.json shape without the flag. The user's actual runtime (`~/.codex/config.toml:42`) DOES have hooks.json + codex_hooks=true. Align the in-repo docs to:
   - State that `.codex/settings.json` is an example template, not the live registration point.
   - Document the user-level `~/.codex/config.toml` + `~/.codex/hooks.json` as authoritative.
   - List both legacy and current Codex hook contracts with dates / version notes.
3. **F-013-011** — `.opencode/command/memory/README.txt:271-273` maps CCC tools to `/memory:manage`, but `.opencode/command/memory/manage.md:1-4` doesn't invoke them. Either:
   - Add CCC tool routing to `manage.md` (preferred if scope-light), OR
   - Update `README.txt` to say "CCC tools are MCP-only; use `mcp__spec_kit_memory__ccc_*` directly".
4. **F-013-012** — `.opencode/skill/system-spec-kit/ARCHITECTURE.md:306-308` lists stale `handlers/ccc-*` paths; actual exports are at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:9-11`. Update ARCHITECTURE.md to point to the real paths.
5. **F-013-018** — `AGENTS.md:334` and `.opencode/skill/system-spec-kit/SKILL.md:63` say post-write validation is required; no runtime hook fires it. Adjust wording from "auto-runs" to "workflow-required gate" with explicit `bash validate.sh --strict <packet>` invocation example.
6. **F-013-019** — `AGENTS.md:146` says completion validation runs automatically; concrete surface is `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:87`. Reword to "completion claim triggers validation requirement; operator must run validate.sh".
7. **Add a "Trigger" column** to the broad automation claims in CLAUDE.md, SKILL.md, mcp_server/README.md, and references/config/hook_system.md. Use the 80-row reality map from `specs/system-spec-kit/026-graph-and-context-optimization/013-automation-reality-supplemental-research/research/research-report.md` (sections 2 & 5) as source-of-truth for which trigger to cite per claim.

### Read these first

- `specs/system-spec-kit/026-graph-and-context-optimization/013-automation-reality-supplemental-research/research/research-report.md` — the full reality map and findings registry
- `specs/system-spec-kit/026-graph-and-context-optimization/012-automation-self-management-deep-research/research/research-report.md` — the 50-row baseline reality map and the 4 P1 findings
- `specs/system-spec-kit/026-graph-and-context-optimization/013-automation-reality-supplemental-research/research/iterations/iteration-004.md` — the 4-P1 adversarial verdicts with NEW evidence file:line refs

### Packet structure to create (Level 2)

You MUST create ALL of these files under `specs/system-spec-kit/026-graph-and-context-optimization/031-doc-truth-pass/`:

1. **spec.md** — Level 2 spec contract using template_source `spec-core | v2.2`. Use anchors metadata, problem, scope, requirements, success-criteria, risks, nfr, edge-cases, complexity, questions. Adapt 013's spec.md style.
2. **plan.md** — Level 2 plan using template_source `plan-core | v2.2`. Use anchors summary, quality-gates, architecture, phases, testing, dependencies, rollback, phase-deps, effort, enhanced-rollback.
3. **tasks.md** — Level 2 tasks using template_source `tasks-core | v2.2`. Use anchors notation, phase-1, phase-2, phase-3, completion, cross-refs.
4. **checklist.md** — Level 2 using template_source `checklist | v2.2`. Use anchors protocol, pre-impl, code-quality, testing, security, docs, file-org, summary.
5. **implementation-summary.md** — Level 2 using template_source `impl-summary-core | v2.2`. Use anchors metadata, what-built, how-delivered, decisions, verification, limitations.
6. **description.json** — `specFolder`, `description`, `keywords`, `lastUpdated`, `specId="031"`, `folderSlug="doc-truth-pass"`, `parentChain=["system-spec-kit","026-graph-and-context-optimization"]`, `memorySequence=1`.
7. **graph-metadata.json** — `schema_version=1`, `packet_id`, `parent_id="system-spec-kit/026-graph-and-context-optimization"`, `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/013-automation-reality-supplemental-research"]`, `manual.related_to=["system-spec-kit/026-graph-and-context-optimization/012-automation-self-management-deep-research"]`, `derived.trigger_phrases=["031-doc-truth-pass","doc truth pass","automation doc fixes","Copilot hook docs fix","Codex hook docs fix"]`, `derived.key_topics=["doc-fix","automation","hook-docs","CCC","trigger-column"]`, `derived.importance_tier="important"`, `derived.status="planned"`, `derived.causal_summary="Tier A doc-only remediation: fix Copilot/Codex hook docs, CCC command-home doc, ARCHITECTURE handler paths, validation auto-fire wording, and add Trigger column to broad auto-claims."`.

**FRONTMATTER RULES (CRITICAL):**
- Every spec doc gets frontmatter with `_memory.continuity` block
- `recent_action` and `next_safe_action` MUST be compact (single line, < 80 chars), non-narrative, e.g. `"Initialized 031 packet"` and `"Run impl phase"`. Long narrative text fails strict validation.
- `last_updated_at` ISO 8601 timestamp
- `last_updated_by: "cli-codex"`
- `completion_pct: 5` initially, 100 after impl

### Implementation phases

1. **Phase 1: Setup** — Create all 7 packet files using template_source markers above. Initial completion_pct=5.
2. **Phase 2: Implementation** — Apply the 7 doc fixes above. Use Edit/MultiEdit to be surgical. Each finding maps to specific file:line refs above.
3. **Phase 3: Validation** — Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/031-doc-truth-pass --strict` and verify it exits 0. Update implementation-summary.md to "complete" state (completion_pct=100; recent_action="Doc truth pass complete"; next_safe_action="Plan packet 032 next").

### Constraints

- READ ONLY for runtime CODE (no .ts/.js/.py changes; this is doc-only).
- Doc files (.md, .txt, README, AGENTS.md, CLAUDE.md, etc.) MAY be edited.
- Strict validator MUST exit 0 before completion. If it fails, fix and rerun.
- DO NOT commit. The orchestrator (claude-opus-4-7) will commit after this dispatch returns.
- Cite file:line in spec.md/plan.md evidence markers where possible.
- Use existing 012/013 packet docs as template references for tone and structure.

### Output

When done, your last action is the strict validator passing with `RESULT: PASSED` and 0 errors. Do not narrate; just write files and exit.
