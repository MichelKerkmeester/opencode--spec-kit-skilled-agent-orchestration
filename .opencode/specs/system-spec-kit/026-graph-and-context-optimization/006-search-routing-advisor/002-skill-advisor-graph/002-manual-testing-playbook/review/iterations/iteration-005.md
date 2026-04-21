# Iteration 005 - Correctness

## State Read

Prior findings showed wrong roots, wrong corpus size, completion drift, and stale metadata. This pass checked the packet's actual template contract against live scenario files.

## Dimension

correctness

## Files Reviewed

- `spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md`

## Findings

| ID | Severity | Finding | Evidence |
| --- | --- | --- | --- |
| F004 | P1 | The specified 5-section RCAF template contract is incompatible with live scenario files. The packet requires OVERVIEW/CURRENT REALITY/TEST EXECUTION/SOURCE FILES/SOURCE METADATA, but live scenarios use SCENARIO/SETUP/STEPS/EXPECTED/FAILURE MODES/RELATED. | `spec.md:87`, `spec.md:95`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md:13`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md:24` |

## Claim Adjudication

```json
[
  {
    "findingId": "F004",
    "claim": "The packet's required snippet template does not match the live manual testing playbook scenario format.",
    "evidenceRefs": ["spec.md:87", "spec.md:95", ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md:13", ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md:24"],
    "counterevidenceSought": "Read live root playbook and representative native/Python scenario files for section contract.",
    "alternativeExplanation": "Only some historical scenarios may have used RCAF snippets; however the packet presents the 5-section contract as the current full-package success criterion.",
    "finalSeverity": "P1",
    "confidence": 0.91,
    "downgradeTrigger": "Downgrade if this packet is explicitly scoped to archived historical snippets and no current live scenario files are expected to comply."
  }
]
```

## Convergence Check

New severity-weighted findings ratio: 0.18. Continue.
