# Audit C-04: Playbook Command Accuracy
## Summary
| Metric | Result |
|--------|--------|
| Scenarios sampled | 10 |
| Valid tool names | 10/10 |
| Correct parameters | 3/10 |
| Testable signals | 9/10 |

## Per-Scenario Verification
| Scenario ID | Tool Name | Valid? | Params Match? | Notes |
|-------------|-----------|--------|--------------|-------|
| EX-003 | `memory_match_triggers` | Yes | No | Playbook uses `sessionId`; actual schema uses `session_id` (plus optional `turnNumber`). Signal is testable because it expects trigger hits with cognitive fields. Sources: playbook L38; `tool-schemas.ts` L162-L166; `tool-input-schemas.ts` L129-L135. |
| EX-007 | `memory_update` | Yes | No | Playbook uses `triggers`; actual tool exposes `triggerPhrases`. Retrieval follow-up is a specific/testable check. Sources: playbook L42; `tool-schemas.ts` L236-L240; `tool-input-schemas.ts` L161-L168. |
| EX-010 | `memory_validate` | Yes | No | Playbook uses `memoryId` and `helpful:true`; actual schema requires `id` and `wasUseful`. Evidence is somewhat vague because it does not name the returned metadata fields to inspect. Sources: playbook L45; `tool-schemas.ts` L242-L261; `tool-input-schemas.ts` L170-L181. |
| EX-012 | `memory_stats` | Yes | No | Playbook uses `ranking:composite`; actual parameter is `folderRanking`. Expected counts/tier/folder-ranking output is specific enough to test. Sources: playbook L47; `tool-schemas.ts` L182-L186; `tool-input-schemas.ts` L199-L205. |
| EX-018 | `checkpoint_delete` | Yes | Yes | Command matches `name` + `confirmName`, which is exactly what the tool requires. Before/after `checkpoint_list` evidence is specific and testable. Sources: playbook L53; `tool-schemas.ts` L289-L303; `tool-input-schemas.ts` L230-L233. |
| NEW-002 | `memory_search` | Yes | No | The sequence shows `memory_search(includeContent:false)` but omits the required `query` or `concepts` input. Dedup verification is still a concrete/testable signal. Sources: playbook L81; `tool-schemas.ts` L34-L160; `tool-input-schemas.ts` L88-L127. |
| NEW-095 | `memory_search` | Yes | No | The extra `bogus` parameter is intentionally off-schema; that makes this an accurate negative test, but not a schema-matching command. The evidence is highly specific because it expects strict-mode Zod rejection and passthrough behavior when `SPECKIT_STRICT_SCHEMAS=false`. Sources: playbook L174; `tool-input-schemas.ts` L13-L17, L88-L127, L397-L420. |
| NEW-096 | `memory_search` | Yes | Yes | `query` and `includeTrace` both exist, and the handler honors either the arg or `SPECKIT_RESPONSE_TRACE=true`. Signals/evidence are specific because they name the envelope fields to compare across runs. Sources: playbook L175; `tool-schemas.ts` L153-L157; `tool-input-schemas.ts` L88-L127; `handlers/memory-search.ts` L617-L620. |
| NEW-097 | `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel` | Yes | No | Tool names and `jobId` are correct, and the documented state machine exists, but the sample `paths` are relative (`specs/...`) while the tool definition says absolute file paths. State-sequence evidence is specific and testable. Sources: playbook L176; `tool-schemas.ts` L399-L439; `tool-input-schemas.ts` L309-L320; `lib/ops/job-queue.ts` L11-L17, L53-L61, L175-L193, L493-L505. |
| NEW-101 | `memory_delete` | Yes | Yes | The scenario aligns with the union schema requiring either `id` or `specFolder`, and `confirm` is correctly modeled as literal `true` in the bulk-delete branch. Validation outputs are specific and testable. Sources: playbook L180; `tool-schemas.ts` L221-L234; `tool-input-schemas.ts` L145-L159. |

## Issues [ISS-C04-NNN]
- **ISS-C04-001** — EX-003 uses `sessionId` in the command sequence, but `memory_match_triggers` expects `session_id`.
- **ISS-C04-002** — EX-007 uses `triggers`; the actual `memory_update` parameter is `triggerPhrases`.
- **ISS-C04-003** — EX-010 uses outdated validation argument names (`memoryId`, `helpful`) instead of `id` and `wasUseful`.
- **ISS-C04-004** — EX-012 uses `ranking`; the actual stats parameter is `folderRanking`.
- **ISS-C04-005** — NEW-002 omits the required `query`/`concepts` argument for `memory_search`, so the example command is not executable as written.
- **ISS-C04-006** — NEW-095 is a valid negative test, but it should be explicitly labeled as an intentional schema violation so readers do not treat the example command as a valid invocation.
- **ISS-C04-007** — NEW-097 uses relative ingest paths in the sample call, while the tool definition documents absolute file paths.
- **ISS-C04-008** — EX-010 should name the exact response fields/metadata expected after validation to make the signal/evidence fully specific.
