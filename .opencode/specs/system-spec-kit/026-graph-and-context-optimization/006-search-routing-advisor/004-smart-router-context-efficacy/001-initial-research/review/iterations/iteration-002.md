# Iteration 002 - Security

## Focus

Prompt safety, diagnostics, status output, and plugin proposal boundaries.

## Files Reviewed

- `research/research.md`
- `research/research-validation.md`
- `research/iterations/iteration-005.md`
- `research/iterations/iteration-016.md`
- `research/iterations/iteration-018.md`

## Findings

### DR-P2-001 - Status diagnostics are called prompt-safe but do not define a redaction allowlist

Severity: P2

The proposal says the plugin should reuse the renderer and avoid prompt persistence (`research/research-validation.md:31` to `research/research-validation.md:33`). It also proposes a status tool that reports a last sanitized error (`research/research-validation.md:46` to `research/research-validation.md:49`). The packet does not specify the concrete allowlist or redaction rule for that sanitized error field.

Impact: A future implementation could accidentally expose prompt-bearing diagnostics while still satisfying the vague status-tool text.

### DR-P2-002 - Default-on rollout remains blocked by adversarial and blind-following follow-up tests

Severity: P2

The research correctly says a dedicated adversarial corpus is still needed (`research/research.md:37`) and lists blind-following as a residual risk (`research/research.md:57`). Iteration 016 notes imperative `use <skill>` wording can encourage blind following when the advisor is wrong (`research/iterations/iteration-016.md:20`). Iteration 018 proposes regression gates for adoption (`research/iterations/iteration-018.md:24`).

Impact: This is an advisory because the packet is design/research only, but it should remain a release gate for any default-on plugin implementation.

## Delta

New findings: P2=2. New findings ratio: 0.15.

