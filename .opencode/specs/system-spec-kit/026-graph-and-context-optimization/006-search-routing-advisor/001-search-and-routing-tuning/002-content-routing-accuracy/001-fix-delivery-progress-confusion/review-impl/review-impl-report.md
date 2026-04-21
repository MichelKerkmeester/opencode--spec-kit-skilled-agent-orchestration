# Implementation Review Report

## 1. Executive summary

Verdict: CONDITIONAL.

The implementation-focused review audited the production/test code claimed by this packet, not the spec docs. I found 0 P0, 4 P1, and 1 P2 active findings. Confidence is high for F-001, F-002, and F-003 because each was reproduced with a behavior probe. Confidence is medium-high for F-004 and F-005.

## 2. Scope

Code files audited:

| File | Role |
| --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` | Production router implementation |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json` | Production prototype data |
| `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts` | Scoped regression tests |

Spec docs, `description.json`, and `graph-metadata.json` were used only to discover scope. They were not used as finding evidence.

## 3. Method

Each iteration checked git history and ran the scoped test command:

```bash
cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/content-router.vitest.ts --reporter=default
```

Result: PASS in all 10 iterations, 30 tests passed each run.

Git history checked for the scoped files. Relevant recent entries included:

| Commit | Note |
| --- | --- |
| `f3dc189938` | Delivery/progress router and prototype implementation changes |
| `561859235f` | Later content-router test additions |

Additional read-only probes executed the built router to validate suspected behavior for delivery/progress classification, Tier 3 target handling, and prototype embedding failure recovery.

## 4. Findings by severity

### P0

None.

### P1

| ID | Dimension | Finding | Evidence |
| --- | --- | --- | --- |
| F-001 | correctness | Generic sequencing plus verification cues can misroute ordinary progress as delivery. | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:404`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:407`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:974`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:986`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:992` |
| F-002 | security | Tier 3 `target_doc` and `target_anchor` are trusted without whitelist or traversal guard. | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:687`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:688`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:859`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:860` |
| F-003 | robustness | Rejected prototype-embedding promises stay cached after transient embedding failures. | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:903`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:914`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:921`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:928` |
| F-004 | testing | The regression suite lacks negative progress cases for sequencing and verification words. | `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:76`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:535`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:404`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:407` |

### P2

| ID | Dimension | Finding | Evidence |
| --- | --- | --- | --- |
| F-005 | security | Routing audit entries persist raw chunk previews without redaction. | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1338`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1339` |

## 5. Findings by dimension

| Dimension | Findings |
| --- | --- |
| correctness | F-001. F-005 was discovered during a correctness pass but classified as security/privacy P2. |
| security | F-002, F-005 |
| robustness | F-003 |
| testing | F-004 |

## 6. Adversarial self-check for P0

No P0 findings were identified.

Potential P0 candidates were considered and downgraded:

| Candidate | Why not P0 |
| --- | --- |
| F-002 target path trust | The router can emit `../../outside.md`, but this review did not prove the downstream writer will persist outside the packet. Severity stays P1 until downstream write behavior is proven exploitable. |
| F-003 embedding failure poison | This can make a router instance fail repeatedly after one transient embedder error, but it does not directly corrupt data or cross a security boundary. Severity stays P1. |

Reproduction evidence:

```text
Progress probe:
"Updated the validator, then checked tests and confirmed the suite passes."
=> narrative_delivery, confidence 0.78

Tier 3 target probe:
target.docPath => "../../outside.md"; refusal => false

Embedding probe:
attempt 1 failed with transient embedding outage
attempt 2 failed with the same cached rejection without calling the embedder again
```

## 7. Remediation order

1. Fix F-002 first: ignore model-provided doc/anchor for known categories or validate against the same `buildTarget` allowlist. Reject traversal, absolute paths, and unknown anchors before caching Tier 3 output.
2. Fix F-001 next: narrow delivery sequencing so generic `then`, `after`, and `before` do not create strong delivery mechanics unless paired with gating, rollout, release, or explicit delivery-order language.
3. Fix F-003: delete the prototype embedding cache entry on promise rejection, or cache only after the full prototype embedding build resolves.
4. Add tests for F-004 alongside the code fix for F-001.
5. Consider F-005 hardening by masking likely secret tokens and private-looking paths in `chunk_text_preview`, or by making preview logging opt-in.

## 8. Test additions needed

Add focused tests to `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts`:

| Test | Expected assertion |
| --- | --- |
| Progress sentence with "then checked tests" | category is `narrative_progress`, anchor is `what-built` |
| Progress sentence with "after the refactor, checked..." | category is `narrative_progress` |
| Tier 3 response with `target_doc: "../../outside.md"` | refusal or canonical fallback target |
| Transient embedder failure followed by recovery | second classification retries embeddings and succeeds |
| Audit preview with a token-like string | preview is redacted or omitted |

## 9. Appendix: iteration list and churn

| Iteration | Dimension | New findings | Churn |
| --- | --- | --- | --- |
| 001 | correctness | F-001 | 0.42 |
| 002 | security | F-002 | 0.33 |
| 003 | robustness | F-003 | 0.33 |
| 004 | testing | F-004 | 0.33 |
| 005 | correctness | F-005 | 0.08 |
| 006 | security | none | 0.06 |
| 007 | robustness | none | 0.06 |
| 008 | testing | none | 0.00 |
| 009 | correctness | none | 0.00 |
| 010 | security | none | 0.00 |

Convergence: all dimensions covered, no P0, and iterations 008-010 produced three consecutive no-new-finding passes.
