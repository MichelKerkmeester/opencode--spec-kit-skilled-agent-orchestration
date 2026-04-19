# Smart-Router Context-Load Efficacy Research

## 1. Executive Summary

Phase 020's advisor hook surface is effective at reducing model-visible preload in the measured static/simulated sense: a compact brief of roughly 320 bytes replaces a potential skill-package load with mean upper-bound size of 289,442 bytes across the 200-prompt corpus. The conclusion is positive but qualified: hook and renderer behavior are well-tested, but live assistant behavior still needs transcript telemetry to prove assistants stop re-reading `SKILL.md`.

## 2. Scope

This research investigated V1-V10 for the pre-approved packet `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/021-smart-router-context-efficacy/001-initial-research/`. It did not modify Phase 020 runtime code or reopen its architecture.

## 3. Methodology

The work used static analysis, corpus simulation, targeted repository reads, prior artifact survey, and plugin architecture review. CocoIndex CLI was attempted but failed in the sandbox because `ccc` could not write or access `~/.cocoindex_code/daemon.log`; this is a tooling limitation, not an advisor finding.

## 4. Evidence Classes

Strong evidence covers renderer output, prompt privacy, runtime parity, fail-open behavior, timing harness gates, plugin architecture, and static package-size measurement. Moderate evidence covers projected savings, assistant override behavior, `SKILL.md` skip behavior, and real OpenCode plugin latency. Weak evidence covers real cross-runtime context-token deltas and user-facing confusion rates.

## 5. V1 Baseline

Without hook, the upper-bound baseline assumes a skill-requiring assistant loads `SKILL.md + references/ + assets/` for the correct skill package. Across the 200-prompt corpus, this measured mean 289,442 bytes, p50 217,001 bytes, p90 580,304 bytes, and max 667,318 bytes. This is intentionally an upper bound; a lower-bound model should measure only `SKILL.md`.

## 6. V2 With-Hook Steering

The hook emits a compact line such as `Advisor: live; use sk-code-opencode 0.91/0.23 pass.` Tests show identical visible output across Claude, Gemini, Copilot, Codex, and Copilot wrapper fixtures. This supports adopting the hook as a routing surface, while keeping manual override for low-confidence or no-brief cases.

## 7. V3 Savings Quantification

The brief model used 80 token-estimate units at 4 chars/token, or about 320 bytes. Against the labeled-correct upper-bound baseline, projected mean savings were 289,122 bytes per prompt, with p50 216,681 bytes and p90 579,984 bytes. Latency savings remain projected because no isolated interactive AI-session telemetry was available.

## 8. V4 Miss-Rate and Overrides

The shipped corpus parity test verifies hook output matches direct CLI advisor top-1 for all 200 prompts. It does not prove top-1 matches the corpus label. Current replay found 80 label mismatches, so V4 needs a dedicated accuracy and override harness with frozen advisor version, skill graph generation, and semantic mode.

## 9. V5 Adversarial Behavior

Renderer and prompt-policy tests cover prompt-poisoning, instruction-shaped labels, newline labels, casual skips, no passing skill, and ambiguity. The renderer derives output from typed fields and excludes prompt text, reason text, stdout, and stderr. Add a dedicated adversarial prompt corpus before default-on plugin rollout.

## 10. V6 Cross-Runtime Behavior

Runtime parity is strong at the visible-text layer. The reference documents Claude, Gemini, Copilot SDK/wrapper, and Codex adapter paths. Codex registration was documented as deferred in Phase 020 due sandbox constraints, so runtime parity should be read as adapter/test parity plus operator setup requirements.

## 11. V7 SKILL.md Skip Behavior

The research cannot prove assistants skip `SKILL.md` after seeing the brief. A scan of 994 prior iteration files found 250 mention `SKILL.md` and 197 mention repository skill paths, suggesting skill reads/citations are common. However, these are not hook-era transcripts. V7 needs transcript instrumentation.

## 12. V8 Plugin Architecture

The working OpenCode reference is `.opencode/plugins/spec-kit-compact-code-graph.js` plus bridge `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs`. It exports a single default plugin function, delegates heavy work to a bridge process, caches per session/spec folder, invalidates on session/message events, and exposes a status tool.

## 13. V9 Plugin Proposal

Implement `spec-kit-skill-advisor` as a thin OpenCode plugin with bridge process, prompt-safe status tool, cache TTL, thresholds, max token cap, disabled flag, node binary override, and bridge timeout. It should reuse the Phase 020 producer and renderer rather than inventing a new format.

## 14. V10 Risks and Mitigations

Risks: prompt injection, stale skill graph, latency, native-module ABI mismatch, opt-out failure, and blind following. Mitigations: typed renderer, freshness badges, cache and timeout, bridge process, `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, plugin `enabled: false`, and follow-up transcript harness.

## 15. Decision Summary

Adopt now: V1 static baseline method, V2 hook steering surface, V3 projected savings, V5 current renderer safeguards, V6 visible-text parity, V8 plugin architecture, V9 plugin design, V10 risk mitigations. Prototype later: V4 miss/override rates and V7 actual skill-read reduction. Reject: no major research question is rejected outright.

## 16. Follow-Up Measurement Plan

Replay the 200-prompt corpus in an instrumented harness that logs prompt id, expected skill, advisor top-1, confidence, uncertainty, brief bytes, skill files read, bytes read, first-tool latency, assistant override, and outcome. Run the subset across Claude, Gemini, Copilot, Codex, and OpenCode plugin mode.

## 17. Final Recommendation

Proceed with an OpenCode plugin prototype in a follow-up packet. Do not change Phase 020 runtime code in this research packet. Treat the advisor hook as effective for model-visible preload reduction and validated for parity/privacy, while reserving final claims about assistant behavior until transcript telemetry exists.
