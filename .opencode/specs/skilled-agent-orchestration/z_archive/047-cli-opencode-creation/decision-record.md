---
title: "Decision Record: cli-opencode Skill Creation [skilled-agent-orchestration/047-cli-opencode-creation/decision-record]"
description: "Five Architecture Decision Records covering self-invocation guard, skill positioning, token-boost weight, sibling edge symmetry, and hook-contract scope."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
trigger_phrases:
  - "cli-opencode decision record"
  - "047-cli-opencode-creation decisions"
  - "self-invocation guard opencode"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/047-cli-opencode-creation"
    last_updated_at: "2026-04-26T05:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Drafted 5 ADRs covering the architectural choices for cli-opencode"
    next_safe_action: "Operator review and approval before /spec_kit:implement dispatch"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0470000000000000000000000000000000000000000000000000000000000005"
      session_id: "047-cli-opencode-creation"
      parent_session_id: "skilled-agent-orchestration"
    completion_pct: 0
    open_questions:
      - "ADR-001 final detection signal pin"
      - "ADR-003 final TOKEN_BOOSTS weight pin"
    answered_questions: []
---
# Decision Record: cli-opencode Skill Creation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Self-Invocation Guard Detection Signal

<!-- ANCHOR:adr-001-context -->
### Context

The cli-opencode skill operates inside a repository where opencode IS the host runtime. Without a reliable detection signal, an operator inside an OpenCode TUI session who asks cli-opencode to "delegate this prompt to opencode" will trigger a circular dispatch — the skill calls `opencode run`, that session calls cli-opencode again, etc. The four sibling skills handle this asymmetrically: cli-claude-code uses `$CLAUDECODE` env var ("Detection: `$CLAUDECODE` env var is set when inside Claude Code session"), the others rely on prompt-time heuristics. cli-opencode needs a deterministic signal that fires reliably from TUI mode, `acp` server mode, `serve` headless mode, AND from inside the `opencode run` non-interactive form, but does NOT fire when an OpenCode plugin is loaded into a different runtime (e.g. Claude Code with the OpenCode plugin) — that is a legitimate non-self dispatch.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Use a **layered detection signal** with three checks evaluated in order. Trip on ANY positive:

1. **Env var lookup**: check for `OPENCODE_PROJECT`, `OPENCODE_SESSION_ID`, or any env var matching `OPENCODE_*` that opencode sets in its child processes. (To be confirmed during implementation against the live binary — `opencode run env` should expose this.)
2. **Process ancestry probe**: `ps -o ppid,command -p $$` walked upward looking for the `opencode` binary as an ancestor process. Cross-platform via `pgrep -P $$` style if the env-var path fails.
3. **Lock-file probe**: `~/.opencode/state/<session_id>/lock` existence indicates a live session. Less reliable than the first two but useful as a final fallback.

The smart router refuses dispatch when any signal trips, with a stable error message naming the cycle: "you are already inside OpenCode; use a sibling cli-* skill or a fresh shell session to dispatch a different model."
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

- **Single env var only** (rejected): brittle if the operator's runtime differs from the canonical install (e.g. opencode v2 changes the env var name).
- **Process ancestry only** (rejected): expensive on macOS where `ps` walks are slow; brittle when the parent process is a long-lived shell that pre-existed opencode.
- **Prompt-time heuristic only** (rejected): false-positives on prompts that legitimately discuss opencode without intending self-dispatch; false-negatives on terse prompts.
- **Refuse always when current working directory contains `.opencode/`** (rejected): too aggressive — the directory is present in this repo even from non-OpenCode runtimes.
- **Trust the operator** (rejected): the whole point is that the operator may not realize they're inside opencode (e.g. attached to a `serve` instance from a different terminal).
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive:** Layered signal catches the three runtime modes (TUI, acp, serve, run); the fallback chain handles env-var drift across opencode versions; the explicit error message educates operators about the cycle risk.

**Negative:** Three checks per dispatch is slightly more expensive than one. Implementation needs to short-circuit on the first positive to keep the cost bounded.

**Neutral:** The `~/.opencode/state/` lock-file probe couples the skill to opencode's internal state layout. Document this coupling in references/cli_reference.md so future opencode releases can update the path if needed.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five-Check Validation

- [ ] **Reversible?** Yes — change the detection function in SKILL.md Section 2 pseudocode without touching the skill folder layout.
- [ ] **Observable?** Yes — the smart router logs which signal tripped (env / ancestry / lockfile).
- [ ] **Composable?** Yes — sibling skills can adopt the same layered approach if their providers expose similar runtime markers.
- [ ] **Testable?** Yes — set/unset env vars in test fixtures; mock process ancestry in unit tests.
- [ ] **Reasoned?** Yes — context names the three runtime modes explicitly; alternatives section documents 5 rejected options.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes

In SKILL.md Section 2 (SMART ROUTING) pseudocode block:

```python
def detect_self_invocation():
    # Layer 1: env var
    for key in os.environ:
        if key.startswith('OPENCODE_'):
            return ('env', key)
    # Layer 2: process ancestry
    ancestry = subprocess.check_output(['ps', '-o', 'command', '-p', str(os.getppid())]).decode()
    if '/opencode' in ancestry or 'opencode ' in ancestry:
        return ('ancestry', 'opencode')
    # Layer 3: lock file
    state_dir = os.path.expanduser('~/.opencode/state')
    if os.path.isdir(state_dir):
        for entry in os.listdir(state_dir):
            if os.path.exists(os.path.join(state_dir, entry, 'lock')):
                return ('lockfile', entry)
    return None

if detect_self_invocation():
    refuse('You are already inside OpenCode...')
```

Confirm exact env var name during T01 setup task by running `opencode run env | grep OPENCODE_` against the live binary.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Skill Positioning — Three Documented Use Cases

### Context

Sibling cli-* skills exist because the four target binaries (Claude Code, Codex, Copilot, Gemini) are NOT the framework that owns this repo. They are external runtimes. OpenCode IS the framework — so a naive "delegate to opencode" skill makes no sense for an in-OpenCode operator. The skill needs a positioning story that justifies its existence in a repo where the host runtime might already be opencode.

### Decision

Document **three orthogonal use cases** in the skill, each with a distinct invocation pattern and a distinct routing signal. The smart router selects between them based on the detection signal from ADR-001:

1. **External runtime → OpenCode for full plugin/skill/MCP context.** When the orchestrator is Claude Code / Codex / Copilot / Gemini / raw shell, cli-opencode dispatches `opencode run --model X --agent Y` to give the calling AI access to the full Spec-Kit + plugin + MCP runtime that this repo provides.
2. **In-OpenCode parallel detached session.** When the orchestrator IS opencode (ADR-001 signal fires), cli-opencode allows ONE narrow path: spawning a parallel detached session with `--share --port N` for ablation, worker farms, or research that needs a separate session ID. This is NOT self-invocation because the new session has different state.
3. **Cross-AI orchestration handback.** When a non-Anthropic CLI (Codex/Copilot/Gemini) needs OpenCode-specific plugins (e.g. spec-kit workflows that depend on the project's MCP servers), cli-opencode is the documented bridge.

Use cases (1) and (3) are functionally similar but documented separately so the prompt templates are distinct.

### Alternatives Considered

- **One unified "delegate to opencode" use case** (rejected): blurs the cycle-risk story; operator can't tell which case they're in.
- **No skill at all because opencode is the host** (rejected): denies use cases (1) and (3) which are real.
- **Skill only for cross-AI orchestration** (rejected): denies use case (2) which is genuinely useful for parallel research.

### Consequences

**Positive:** Each use case has a copy-paste prompt template + matching `opencode run` invocation. Operators don't need to think — they pick the use case that matches their situation.

**Negative:** The skill is harder to summarize in the description field (~80-150 chars). The current draft "OpenCode CLI orchestrator enabling external AI assistants and detached sessions to invoke OpenCode for full plugin/skill/MCP runtime dispatch" is at 152 chars — slightly over budget. Trim during implementation.

### Five-Check Validation

- [ ] **Reversible?** Yes — collapse to fewer use cases if telemetry shows one is unused.
- [ ] **Observable?** Yes — each use case has its own prompt template and invocation, so logs show which one was chosen.
- [ ] **Composable?** Yes — additional use cases can be appended without breaking existing ones.
- [ ] **Testable?** Yes — five acceptance scenarios in spec.md exercise the three cases plus the refusal path.
- [ ] **Reasoned?** Yes — each use case maps to a concrete operator scenario.

### Implementation Notes

References/integration_patterns.md is the canonical home for the three use cases. Each gets a copy-paste prompt template + matching `opencode run` invocation + a "when to use this vs. the other two" rubric.

---

## ADR-003: TOKEN_BOOSTS Weight for the Noisy "opencode" Token

### Context

The advisor's TOKEN_BOOSTS table at `lib/scorer/lanes/explicit.ts:15` currently has one cli-* entry: `codex: [['cli-codex', 0.9]]`. The token "codex" appears rarely in non-cli-codex contexts in this repo, so 0.9 is safe. The token "opencode" is the framework name and appears thousands of times across spec folders, READMEs, package.json files, and plugin code. A 0.9 boost would false-positive cli-opencode on prompts that incidentally mention "opencode" but actually want a different skill.

### Decision

**Conservative path: skip TOKEN_BOOSTS entirely for cli-opencode**, OR set a low weight (0.3-0.4) only for compound tokens like `"opencode cli"` or `"opencode run"`. The explicit lane's automatic skillNameVariants matching + intent_signals ("opencode cli", "opencode run", "delegate to opencode" in graph-metadata.json) already provides discoverability via the explicit_author lane (weight 0.45) without needing a token boost.

If telemetry shows under-discoverability after a one-week canary, add `'opencode cli': [['cli-opencode', 0.5]]` to PHRASE_BOOSTS instead — phrase boosts are safer because they require multi-token matches.

### Alternatives Considered

- **Match cli-codex's 0.9 weight** (rejected): false-positives on every prompt mentioning "opencode" as the framework.
- **No boost ever** (default fallback): rely on intent_signals + skillNameVariants. May under-discover for terse prompts.
- **Only PHRASE_BOOSTS, never TOKEN_BOOSTS** (selected as primary): compound phrases are unambiguous; single tokens are noisy.

### Consequences

**Positive:** No false-positives. The advisor relies on the four other scoring lanes (lexical, derived, semantic, graph) plus the explicit-author lane's name-variant matching, which is enough for the golden prompts in spec.md §4.1.

**Negative:** Slightly lower discoverability on terse prompts like "use opencode" (without "cli" or "run"). Operators may need to be more specific.

**Neutral:** Telemetry-driven re-tuning is the path forward if discovery falls short.

### Five-Check Validation

- [ ] **Reversible?** Yes — add the entry later without breaking anything.
- [ ] **Observable?** Yes — advisor regression suite reports per-skill discoverability.
- [ ] **Composable?** Yes — coexists with the other four cli-* siblings' scoring without conflict.
- [ ] **Testable?** Yes — golden prompts in spec.md §4.1 verify the desired ranking.
- [ ] **Reasoned?** Yes — the noisy-token argument is data-driven (grep count of "opencode" across the repo).

### Implementation Notes

Run `grep -rn "opencode" .opencode/ | wc -l` during T01 setup to confirm the noise level. If the count is < 100, reconsider. If > 100 (likely), commit to the no-boost / phrase-boost-only path.

---

## ADR-004: Sibling Edge Weight Symmetry (0.5 across all 5 cli-* skills)

### Context

The four existing cli-* skills have sibling edges to each other at weight 0.5 with context "CLI orchestrator peer". The user's spec mentions OpenCode is the framework that owns this repo — should cli-opencode have STRONGER edges to any of the four (e.g. cli-claude-code because OpenCode often dispatches Claude models, or cli-codex because the dominant local CLI integration uses Codex)?

### Decision

**Keep all 5 cli-* sibling edges at weight 0.5 ("CLI orchestrator peer").** The sibling edge represents "these are functional peers from the advisor's POV", not "these are deeply coupled". Coupling-by-content (e.g. cli-opencode's cli_reference.md citing cli-codex's hook contract) is documented in references/, not in graph edges.

### Alternatives Considered

- **Stronger edge (0.7) cli-opencode ↔ cli-claude-code** because OpenCode hosts Claude models heavily (rejected): asymmetric pull on the advisor's graph_causal lane that the existing four siblings don't have.
- **Stronger edge cli-opencode ↔ cli-codex** because Codex is the canonical executor in saved memory (rejected): same asymmetry concern.
- **No edges at all** (rejected): breaks sibling-discovery via graph traversal.

### Consequences

**Positive:** Symmetry across the family. Predictable advisor behavior. Easy to add a 6th sibling later without re-tuning weights.

**Negative:** Slight under-recommendation when an operator's prompt is genuinely about OpenCode-on-Claude-models or OpenCode-on-Codex-models. Mitigation: those use cases are covered by the prompt templates in references/integration_patterns.md (per ADR-002), not by graph weights.

### Five-Check Validation

- [ ] **Reversible?** Yes — change a JSON field.
- [ ] **Observable?** Yes — `skill-graph.json` adjacency block surfaces the weights.
- [ ] **Composable?** Yes — symmetric weights compose with future siblings.
- [ ] **Testable?** Yes — advisor regression suite covers cli-* discoverability.
- [ ] **Reasoned?** Yes — symmetry argument is principled.

### Implementation Notes

Tasks.md T12-T15 patch each of the 4 existing cli-* graph-metadata.json files with a sibling edge to cli-opencode. Verify symmetry via the round-trip CHK-042 in checklist.md.

---

## ADR-005: Hook-Contract Reference File Scope

### Context

Sibling cli-codex ships an extra hook_contract reference file under its references/ folder (10th file vs. the 9-file blueprint) documenting Codex's native hook surface (SessionStart, UserPromptSubmit). cli-claude-code, cli-copilot, cli-gemini do NOT have this — they don't have a comparable hook surface. OpenCode HAS first-class hooks (its plugin system is hook-driven). Should cli-opencode ship a hook_contract reference file?

### Decision

**Defer. Ship the v1.0.0 release with the 9-file blueprint. Add a references/hook_contract file in v1.1.0 if an operator hits a use case that requires it.**

The reasoning: most cli-opencode dispatches will use `opencode run` non-interactively, which doesn't trigger the per-session hooks the way the TUI does. Documenting the hook surface in a dedicated reference adds cognitive load to the SKILL.md without a clear use case. cli-codex has the hook contract reference because Codex's hook surface is the documented integration point with Spec Kit Memory — that integration story is unique.

### Alternatives Considered

- **Ship the dedicated hook_contract file in v1.0.0** (rejected): no clear use case; adds maintenance load.
- **Skip the hook_contract file permanently** (rejected): forecloses a future use case.
- **Defer the dedicated reference to v1.1.0** (selected): land the v1.0 release fast; iterate.

### Consequences

**Positive:** Faster v1.0 release. No premature documentation.

**Negative:** Operators wanting to integrate OpenCode hooks have to read OpenCode's own docs. Mitigation: Section 8 (RELATED RESOURCES) of SKILL.md links to OpenCode's hook documentation.

### Five-Check Validation

- [ ] **Reversible?** Yes — add the file in a later version bump.
- [ ] **Observable?** Yes — file presence is a Git-visible event.
- [ ] **Composable?** Yes — additive change.
- [ ] **Testable?** Yes — DQI score on the hook_contract reference when it ships.
- [ ] **Reasoned?** Yes — defer-with-trigger pattern.

### Implementation Notes

If telemetry or an operator request surfaces a hook-integration use case before v1.0.0 even ships, reverse this decision and add the file as part of T03-T08. Otherwise, file a follow-up packet for v1.1.0.

---

<!-- ANCHOR:summary -->
## Summary

| ADR | Title | Status | Risk |
|-----|-------|--------|------|
| 001 | Self-invocation guard detection signal | Proposed | HIGH |
| 002 | Three documented use cases | Proposed | LOW |
| 003 | TOKEN_BOOSTS weight (skip or low) | Proposed | MEDIUM |
| 004 | Sibling edge weights (0.5 symmetric) | Proposed | LOW |
| 005 | Hook-contract reference file scope | Proposed | LOW |
<!-- /ANCHOR:summary -->
