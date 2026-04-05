# Research Iteration 114: Why the Missing Startup Digest and Invalid Prompt Likely Share One Cause

## Focus

Explain why the startup hook can look "not fired" in the UI even though the invalid-prompt error still appears.

## Findings

1. The startup digest is injected through `experimental.chat.system.transform`, which simply pushes a string into `output.system`. That hook is independent from the `messages.transform` code path. [SOURCE: `.opencode/plugins/spec-kit-compact-code-graph.js:303-324`]

2. However, the final prompt the runtime sends to the model is assembled from all transformed pieces together. If `messages.transform` later produces an invalid `messages` payload, the host can reject prompt assembly even if the system transform itself succeeded earlier in the same lifecycle. [INFERENCE: based on the layered hook outputs in `.opencode/plugins/spec-kit-compact-code-graph.js:303-374` plus the live runtime error naming `ModelMessage[]`]

3. That means two user-visible symptoms can be downstream of one fault:
   - the runtime surfaces `Invalid prompt: The messages do not match the ModelMessage[] schema`
   - the user no longer sees the expected startup digest reliably in the visible prompt/UI

4. This is a better fit for the evidence than "the startup hook separately stopped firing while an unrelated prompt error also survived." [INFERENCE: synthesized from findings 1-3]

## Recommendation

Do not split the debugging effort into "fix startup hook" and "fix invalid prompt" yet. First prove or disprove that `messages.transform` is poisoning the final prompt assembly. If it is, the startup symptom is probably secondary and will normalize once the invalid message mutation is removed.

## Ruled Out Directions

- Treating "startup digest not visible" as independent proof that `system.transform` never ran
- Chasing bridge/bootstrap regressions before isolating the prompt-shape fault
