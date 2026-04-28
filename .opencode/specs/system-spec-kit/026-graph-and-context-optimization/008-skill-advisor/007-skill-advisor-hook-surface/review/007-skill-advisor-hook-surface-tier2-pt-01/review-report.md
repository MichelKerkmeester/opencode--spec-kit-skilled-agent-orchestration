# Single-Pass Deep Review Report: 007 Skill-Advisor Hook Surface

## 1. Executive Summary

Verdict: CONDITIONAL.

Counts: P0=0, P1=2, P2=1. hasAdvisories=true.

The subprocess timeout concern is not the blocker in the current tree. The OpenCode plugin timeout path now sends `SIGTERM`, escalates to `SIGKILL`, and resolves on `close`, so the older orphan-process finding is closed for this surface. The release risk is contract-level: Copilot's current adapter computes an advisor brief for the current prompt, but its transport writes that brief into custom instructions that Copilot reads on the next prompt. That does not satisfy the same-current-turn semantics promised by the packet and differs from the direct hook-output semantics used by Claude, Gemini, and Codex.

## 2. Planning Trigger

The P1 findings require a remediation packet because they cross runtime contract, docs, and tests. They are not safe as drive-by fixes inside this review artifact.

```json
{
  "planningPacket": {
    "suggestedSpecFolder": "specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/007-skill-advisor-hook-surface/010-copilot-current-turn-contract",
    "trigger": "Copilot advisor hook current-turn semantics and release evidence drift",
    "verdict": "CONDITIONAL",
    "p0": 0,
    "p1": 2,
    "p2": 1,
    "recommendedLevel": 2,
    "workstreams": [
      "Define and test Copilot current-turn vs next-turn contract",
      "Update stale release/checklist evidence",
      "Add a real or replayed Copilot host contract fixture"
    ]
  }
}
```

## 3. Active Finding Registry

### P1-001 - Copilot advisor brief is one prompt late, not current-turn equivalent

Claim: The Copilot adapter does not semantically match the current-turn SDK-style contract promised by the packet. It builds the advisor brief from the current prompt, writes it into the managed custom-instructions file, then returns `{}`; the managed block itself says Copilot reads it on the next submitted prompt.

Evidence:
- `implementation-summary.md:47` says each `UserPromptSubmit` event runs `buildSkillAdvisorBrief` and renders model context before response.
- `implementation-summary.md:56` says the Copilot adapter has SDK preferred plus wrapper fallback behavior.
- `implementation-summary.md:205` says Copilot wrapper fallback produces `promptWrapper` when a brief exists.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:197-215` builds from the current prompt and writes custom instructions.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:231-236` returns `{}` after the write.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:82-84` says Copilot reads custom instructions on the next submitted prompt.
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:57-64` documents Copilot as file-backed while other runtimes get prompt-visible context.

Counterevidence sought: I looked for an active SDK output path or `promptWrapper` return path in `hooks/copilot/user-prompt-submit.ts`; the exported `onUserPromptSubmitted` is the same `{}` handler at lines 231-239. The current docs also describe file-backed behavior, not current-turn mutation.

Alternative explanation: If the accepted Copilot contract is explicitly next-turn freshness, this becomes a documentation/spec mismatch rather than runtime correctness. The original packet and acceptance wording still promise prompt-time parity, so the severity stays P1.

Final severity: P1. Confidence: high. Downgrade trigger: a Copilot host fixture proves custom-instructions writes are re-read before the same prompt's model invocation, or the spec is amended to declare Copilot next-turn semantics.

Hunter -> Skeptic -> Referee:
Hunter: The adapter cannot influence the prompt it just analyzed. Skeptic: Maybe Copilot reloads custom instructions between hook execution and model invocation. Referee: The repository's own contract says "next submitted prompt"; no code or test proves same-turn reload, so the current-turn parity claim is unsupported.

### P1-002 - Release evidence claims completion while checklist remains pending

Claim: The parent packet's release summary and task evidence claim release readiness, but the Level 3 checklist remains fully unchecked and still says pending.

Evidence:
- `implementation-summary.md:26` says release ready.
- `implementation-summary.md:99-113` lists the T9 integration gauntlet as PASS.
- `implementation-summary.md:175-180` marks release prep items complete.
- `tasks.md:78-80` marks parent checklist and implementation summary updates as complete.
- `checklist.md:35-58` leaves core P0 implementation and testing items unchecked.
- `checklist.md:64-82` leaves security, docs, and file-organization gates unchecked.
- `checklist.md:86-88` still says verification status is pending.

Counterevidence sought: I sampled prior archives. They contain broad D7/documentation findings, but I did not find this specific parent-checklist contradiction in the sampled final reports. The unchecked checklist is live in the target packet.

Alternative explanation: Evidence may have been moved to child checklists, leaving the parent checklist stale. If so, the parent checklist should say delegated/covered-by-child rather than pending.

Final severity: P1. Confidence: high. Downgrade trigger: parent checklist is updated with evidence or explicit child-delegation links for every P0/P1 item.

Hunter -> Skeptic -> Referee:
Hunter: A release-ready packet with an unchecked mandatory checklist cannot be trusted. Skeptic: Child checklists may be the true authority. Referee: The parent file is still part of the requested review inputs and claims "Pending"; traceability remains broken until reconciled.

### P2-001 - `buildCopilotPromptArg` large-prompt path still depends on unverified `@path` behavior

Claim: `buildCopilotPromptArg` is internally guarded, but its large-prompt branch depends on Copilot honoring a bare `@promptPath` reference. The repository tests simulate that behavior with Node rather than invoking Copilot.

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:304-328` switches large approved prompts to `@${promptPath}` and returns `promptFileBody`.
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:704-717` writes `promptFileBody` before spawning `copilot`.
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:723-729` explicitly notes the reliance on Copilot honoring `@path`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts:381-452` uses a Node subprocess to emulate the receiver reading `@path`.

This is advisory because the helper's safety properties are well covered: approved authority preamble, missing-authority Gate 3 enforcement, and `--allow-all-tools` stripping all have direct tests.

## 4. Remediation Workstreams

WS1 - Copilot contract remediation:
Decide whether Copilot is allowed to be next-turn only. If no, add a real SDK/host path that makes the advisor brief visible to the current prompt. If yes, update spec, reference docs, implementation summary, and tests to make next-turn semantics explicit and exclude Copilot from same-current-turn parity claims.

WS2 - Traceability repair:
Update the parent `checklist.md` with evidence links, or mark parent gates as delegated to child packets with exact child checklist/summary references. Do not leave release-ready claims and pending checklist state side by side.

WS3 - Copilot large-prompt evidence:
Add one contract fixture against the actual Copilot CLI or an approved host-level replay proving bare `@path` is honored in the same way the Node smoke test assumes.

## 5. Spec Seed

Problem: Copilot hook semantics currently mix two contracts: current-prompt advisor classification and next-prompt custom-instructions visibility.

Requirements seed:
- REQ-001: Copilot runtime contract states whether advisor output is current-turn or next-turn.
- REQ-002: Tests prove the chosen contract using a real SDK/host fixture or an accepted replay harness.
- REQ-003: Parent release evidence and checklist agree on completion state.
- REQ-004: Deep-loop `cli-copilot` large-prompt dispatch has a real `@path` contract test or documented limitation.

Acceptance seed:
- Given a Copilot prompt, when the advisor hook runs, then the test proves exactly which prompt sees the generated brief.
- Given the parent packet claims release readiness, then the parent checklist contains evidence or child-delegation links for every P0/P1 gate.

## 6. Plan Seed

1. Reproduce the Copilot host lifecycle with the locally supported hook surface.
2. Update the Copilot adapter contract and docs to either current-turn or next-turn semantics.
3. Add a contract test for the selected behavior.
4. Reconcile parent checklist evidence with implementation summary claims.
5. Add or defer an actual Copilot `@path` contract fixture for `buildCopilotPromptArg`.

## 7. Traceability Status

Core requirements:
- REQ-001 compact brief: implemented in producer/renderer; no new issue found.
- REQ-002 and REQ-003 runtime hooks: Claude/Gemini/Codex current-turn semantics are supported; Copilot is conditional due P1-001.
- REQ-004 cache: plugin and producer cache paths are covered; no new issue found.
- REQ-005 freshness: prior archives cover freshness concerns; no duplicate finding raised.
- REQ-006 200-prompt parity: release summary claims 200/200; not re-run in this single pass.
- REQ-007 shared payload: no new issue found.
- REQ-009 disable flag: Copilot hook and plugin both honor `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`.
- REQ-010 regression fixture suite: conditional because parent checklist still marks testing pending.

Overlay status:
- D1 Correctness: Conditional, due Copilot current-turn contract mismatch.
- D2 Security: Pass for reviewed timeout and prompt-forwarding paths; prompts are sent over stdin/managed file, not argv, in the reviewed subprocess paths.
- D3 Traceability: Conditional, due checklist/release contradiction.
- D4 Maintainability: Pass with advisory; runtime-specific adapters are thin, but Copilot's transport difference needs an explicit contract so future adapters can copy the right pattern.

Prior archive status:
- R01/R02 plugin timeout/orphan concern: closed in current plugin code by `SIGTERM` then `SIGKILL` escalation and `close`-based resolution.
- R01/R02 plugin parity coverage advisories: not duplicated; P2-001 is narrower and specific to `buildCopilotPromptArg` large-prompt `@path` semantics.
- R02 documentation/setup findings: sampled and treated as priors; P1-002 is a distinct live parent-checklist contradiction.

## 8. Deferred Items

- Full mcp_server test suite was not completed. I attempted `npm --prefix .opencode/skill/system-spec-kit/mcp_server test -- spec-kit-skill-advisor-plugin.vitest.ts copilot-user-prompt-submit-hook.vitest.ts`, but the script starts the full `test:core` suite first and surfaced many unrelated existing failures before targeted hook tests could run.
- Real Copilot SDK behavior was not exercised; this review is static plus existing test inspection.
- I did not re-audit every prior archive iteration; I sampled the final R01/R02 reports and high-signal Copilot references to avoid duplicating known findings.

## 9. Audit Appendix

Reviewed packet docs:
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`, `handover.md`, `battle-plan.md`

Reviewed code and tests:
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts`
- `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/subprocess.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `copilot-user-prompt-submit-hook.vitest.ts`, `spec-kit-skill-advisor-plugin.vitest.ts`, `deep-loop/cli-matrix.vitest.ts`

Targeted observations:
- OpenCode plugin timeout path: `.opencode/plugins/spec-kit-skill-advisor.js:422-433` sends `SIGTERM` then `SIGKILL`; `.opencode/plugins/spec-kit-skill-advisor.js:460-483` resolves on `close`.
- Core subprocess path: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/subprocess.ts:165-170` writes prompt to stdin and kills on timeout; `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/subprocess.ts:196-215` resolves on `close` with `TIMEOUT`/`SIGNAL_KILLED`.
- Plugin error translation: `.opencode/plugins/spec-kit-skill-advisor.js:226-255` maps empty stdout, parse failure, and status vocabulary to prompt-safe fail-open envelopes.
