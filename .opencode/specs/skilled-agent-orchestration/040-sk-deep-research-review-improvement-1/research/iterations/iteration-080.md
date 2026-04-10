# Iteration 080
## Focus
AutoAgent synthesis: what is worth borrowing for the internal deep-research/deep-review system.

## Questions Evaluated
- Which AutoAgent ideas are directly reusable?
- Which ideas are useful but need a different state model in our system?

## Evidence
- `external/AutoAgent-main/autoagent/core.py:58-208`
- `external/AutoAgent-main/autoagent/fn_call_converter.py:35-247`
- `external/AutoAgent-main/autoagent/tools/meta/edit_agents.py:157-355`
- `external/AutoAgent-main/autoagent/tools/meta/edit_workflow.py:155-279`
- `external/AutoAgent-main/autoagent/agents/system_agent/system_triage_agent.py:8-64`

## Analysis
AutoAgent’s best ideas are its explicit compatibility layer, its create-then-run validation loops, its clear multi-agent handoffs, and its workflow/event formality. Those strengths make it a strong orchestration reference. Its weak spot is the same one our internal system is trying to fix: history is mostly conversational or generated-file based, not a persistent lineage graph with deterministic reduction.

## Findings
- Best transferable ideas: provider capability gating, fallback function-call bridging, generated-agent validation, explicit workflow transitions, and named handoffs.
- Main non-transferable assumption: that runtime prompts or generated files alone are enough to preserve long-term continuity.
- AutoAgent shows that orchestration can be explicit without being lineage-aware.

## Compatibility Impact
If we adopt the good parts, the internal system should still anchor everything in disk-based packet state, canonical lineage IDs, and deterministic reducers so both hook and non-hook CLIs see the same truth.

## Next Focus
Move this external-repo wave into the packet’s shared synthesis layer only if needed by the owner of the whole spec; this worker lane is complete after these 10 iterations.
