---
title: "Audit Findings: Phase 020 TypeScript Alignment"
description: "Running sk-code-opencode audit checklist for Phase 020 advisor hook files."
---

# Audit Findings: Phase 020 TypeScript Alignment

Audit basis: `sk-code-opencode` TypeScript checklist plus the Phase 022 requirement checklist for strict TypeScript, explicit exported return types, no unqualified `any`, boundary-only error handling, comment discipline, dead-code scan, naming, no unreleased compatibility shims, and field-path error messages.

---

## Summary

| Severity | Count | Outcome |
|---|---:|---|
| Major | 0 | None found |
| Minor | 9 | Fixed in place |
| Style deferred | 0 | None deferred |

---

## Findings and Remediations

| File | Severity | Finding | Remediation |
|---|---|---|---|
| `lib/skill-advisor/generation.ts` | Minor | `catch (error)` omitted explicit `unknown`, and malformed generation-counter payload errors did not include a field path plus expected/actual shape. | Added `catch (error: unknown)` and expanded the payload error message with file path, expected payload, and actual type. |
| `lib/skill-advisor/subprocess.ts` | Minor | Spawn attempt used an untyped `child` variable and two `catch (error)` blocks omitted explicit `unknown`. | Added `ChildProcessWithoutNullStreams` typing and explicit `catch (error: unknown)` annotations. |
| `lib/skill-advisor/subprocess.ts` | Minor | Advisor subprocess JSON-shape errors did not report field paths or expected vs actual types. | Updated recommendation parser errors to report `advisor stdout[...]` field paths and expected/actual type information. |
| `lib/skill-advisor/metrics.ts` | Minor | Diagnostic-record validation throws used a generic message without schema expectation. | Expanded error messages for serialization and collector validation to name `AdvisorHookDiagnosticRecord` and the expected closed prompt-free schema. |
| `lib/codex-hook-policy.ts` | Minor | Module comment used legacy-install language that reads like a backwards-compatibility shim. | Rephrased the comment around restricted native-hook support without compatibility wording. |
| `hooks/copilot/user-prompt-submit.ts` | Minor | Header comment included dated local-checkout package availability. | Rephrased as runtime SDK probing plus wrapper fallback behavior. |
| `hooks/codex/prompt-wrapper.ts` | Minor | Header comment called the wrapper a compatibility path. | Rephrased as native-hook-unavailable fallback path. |
| `lib/skill-advisor/normalize-adapter-output.ts` | Minor | TSDoc referenced packet numbers instead of the durable adapter-parity purpose. | Rephrased the comment to describe parity-test use directly. |
| `lib/context/shared-payload.ts` | Minor | Existing parser-provenance comment used packet and legacy wording near the advisor shared-payload additions. | Rephrased the comment to describe detector-to-parser trust-axis mapping without packet or legacy language. |

---

## Per-File Audit Ledger

| File | Result |
|---|---|
| `lib/context/shared-payload.ts` | Minor comment drift fixed; advisor metadata/source-kind additions otherwise aligned. |
| `lib/skill-advisor/freshness.ts` | No major/minor issues found. |
| `lib/skill-advisor/source-cache.ts` | No major/minor issues found. |
| `lib/skill-advisor/generation.ts` | Minor catch/error-message issues fixed. |
| `lib/skill-advisor/prompt-policy.ts` | No major/minor issues found. |
| `lib/skill-advisor/prompt-cache.ts` | No major/minor issues found. |
| `lib/skill-advisor/subprocess.ts` | Minor typing and error-message issues fixed. |
| `lib/skill-advisor/skill-advisor-brief.ts` | No major/minor issues found. |
| `lib/skill-advisor/render.ts` | No major/minor issues found. |
| `lib/skill-advisor/normalize-adapter-output.ts` | Minor packet-number comment fixed. |
| `lib/skill-advisor/metrics.ts` | Minor diagnostic error-message issue fixed. |
| `lib/codex-hook-policy.ts` | Minor compatibility-wording issue fixed. |
| `hooks/claude/user-prompt-submit.ts` | No major/minor issues found. |
| `hooks/gemini/user-prompt-submit.ts` | No major/minor issues found. |
| `hooks/copilot/user-prompt-submit.ts` | Minor dated comment fixed. |
| `hooks/codex/user-prompt-submit.ts` | No major/minor issues found. |
| `hooks/codex/pre-tool-use.ts` | No major/minor issues found. |
| `hooks/codex/prompt-wrapper.ts` | Minor compatibility-wording issue fixed. |

---

## Deferred Items

None. All major and minor findings were remediated in place.
