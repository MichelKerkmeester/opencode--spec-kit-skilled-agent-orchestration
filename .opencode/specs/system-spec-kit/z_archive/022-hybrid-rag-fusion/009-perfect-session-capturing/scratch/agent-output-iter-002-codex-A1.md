1. **Exact “first child” selection code**

In `buildExchanges()`:

- Parent match is built here:  
[opencode-capture.ts#L808](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts#L808)
- First candidate is selected here:  
[opencode-capture.ts#L812](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts#L812)
- That first candidate drives `assistant_message_id`:  
[opencode-capture.ts#L832](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts#L832)

```ts
const matchingResponses = responses.filter((r) => {
  const responseMsg = messages.find((m) => m.id === r.messageId);
  return responseMsg?.parent_id === userMsg.id;
});
const response = matchingResponses[0];
...
assistant_message_id: response?.messageId || null,
```

2. **3+ real transcript shapes where P1-03 yields wrong memory**

1. Regenerate/retry siblings:
```json
u1 -> a1(parent=u1, text="draft")
u1 -> a2(parent=u1, text="final")
```
Result: extractor treats first candidate as canonical (`a1`), so message-id linkage points at stale output.

2. Error-then-recovery siblings:
```json
u1 -> a1(parent=u1, text="tool failed / partial")
u1 -> a2(parent=u1, text="fixed answer")
```
Result: stale failure text can be mixed/privileged over final response identity.

3. Agent handoff siblings:
```json
u1 -> a1(parent=u1, agent="general", text="handoff")
u1 -> a2(parent=u1, agent="build", text="actual implementation summary")
```
Result: wrong assistant message becomes the paired identity for that user turn.

4. Partial aborted + completed sibling:
```json
u1 -> a1(parent=u1, completed=null, text="partial")
u1 -> a2(parent=u1, completed=..., text="complete")
```
Result: no “prefer completed/latest” rule, so stale partial can win identity.

3. **Exact multi-part handling code + where reassembly fails**

- Text parts are flattened per part (not per assistant message):  
[opencode-capture.ts#L643](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts#L643), [opencode-capture.ts#L650](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts#L650), [opencode-capture.ts#L655](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts#L655)
- Later join is by parent-filtered response parts, not by chosen assistant message:  
[opencode-capture.ts#L818](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts#L818)
- Only direct children of the user are included:  
[opencode-capture.ts#L810](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts#L810)
- Cached native parts are returned unsorted:  
[opencode-capture.ts#L607](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts#L607)

4. **3+ real transcript shapes where P1-04 causes incomplete/truncated memory**

1. Continuation chain (assistant child of assistant):
```json
u1 -> a1(parent=u1, text="part 1")
a2(parent=a1, text="part 2 final")
```
Result: `a2` is excluded (parent is not `u1`) so memory misses the continuation.

2. Two sibling assistant messages with multi-part text:
```json
u1 -> a1(parts=["attempt 1a","attempt 1b"])
u1 -> a2(parts=["final 2a","final 2b"])
```
Result: parts are flattened then concatenated across both siblings; no per-message boundary/final-choice.

3. Native export cached parts out of order:
```json
a1.parts = [{time.start:200,text:"later"}, {time.start:100,text:"earlier"}]
```
Result: cached path skips sorting, so reconstructed text order can be wrong/incoherent.

4. Long multipart response:
Many parts join into one long string, then clipped by `TOOL_OUTPUT_MAX_LENGTH` in exchange assembly ([opencode-capture.ts#L820](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts#L820)), causing incomplete memory text.

5. **Severity / likely frequency (inferred)**

- **Impact severity:** High. Bad pairing/assembly directly contaminates `assistantResponse`, which feeds observations/recent context and then memory templates downstream ([workflow.ts#L1581](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1581), [workflow.ts#L1624](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1624), [workflow.ts#L1888](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1888)).
- **Occurrence in OpenCode-style logs:**  
  - Multi-part text: common in tool-heavy turns.  
  - Multiple assistant children (retry/regenerate): moderate, but frequent enough to matter.  
  - Assistant continuation chains: less common, but high-impact when present.
- **Claude/Codex/Copilot/Gemini direct extractors:** these bugs are specific to `opencode-capture.ts`; dedicated extractors use different pairing logic, so risk there is much lower.

6. **Minimal fix approach**

1. **P1-03 (first-child pairing):**  
In `buildExchanges`, stop using `matchingResponses[0]`. Build assistant-message candidates per `userMsg.id`, then choose best by deterministic rule: prefer `completed` message, else latest `created`. Use that chosen message for `assistant_message_id` and text.

2. **P1-04 (multipart reassembly):**  
In `getSessionResponses`, aggregate text **per assistant messageId** before returning. Join ordered parts into one `ResponseInfo` per message. Then in `buildExchanges`, operate on aggregated assistant messages (not raw parts), so you can cleanly choose final/best message and avoid cross-sibling blending.
