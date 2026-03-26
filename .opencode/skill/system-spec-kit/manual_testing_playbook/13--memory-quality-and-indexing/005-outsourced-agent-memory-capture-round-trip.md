---
title: "M-005 -- Outsourced Agent Memory Capture Round-Trip"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-005`."
---

# M-005 -- Outsourced Agent Memory Capture Round-Trip

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-005`.

---

## 2. CURRENT REALITY

This scenario remains prose-first because it carries compound operator logic, supplemental checks, or shared closure rules that are clearer than a single-row matrix.

---

## 3. TEST EXECUTION

- Prompt: `Dispatch task to external CLI agent and capture memory back to Spec Kit. Capture the evidence needed to prove Agent output contains structured memory section; saved context is discoverable via search. Return a concise user-facing pass/fail verdict with the main reason.`
- Commands:
  - Dispatch task via `cli-codex` (or any cli-* skill) with memory epilogue in prompt
  - Extract structured memory section from agent stdout
  - Write JSON to `/tmp/save-context-data.json`
  - `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<target-spec>`
  - `memory_index_scan({ specFolder: "specs/<target-spec>" })`
  - `memory_search({ query: "<key term from agent session>", specFolder: "specs/<target-spec>" })`
- Expected: Agent output contains structured memory section; saved context is discoverable via search.
- Evidence: agent stdout with memory section + generate-context output + search result showing saved memory.
- Pass: Saved memory from outsourced agent session is searchable and contains session summary, files modified, decisions.
- Fail triage: Check memory epilogue in prompt template → Verify generate-context.js JSON mode input → Inspect agent stdout for structured section → Verify index scan ran post-save.

#### M-005a: JSON-mode hard-fail (REQ-001)
1. Create an invalid JSON file: `echo "not json" > /tmp/save-context-data.json`
2. Run: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<target-spec>`
3. Verify: Command exits with error containing `EXPLICIT_DATA_FILE_LOAD_FAILED`

#### M-005b: nextSteps persistence (REQ-002)
1. Create valid JSON with nextSteps: `echo '{"nextSteps":["Fix bug X","Deploy Y"]}' > /tmp/save-context-data.json`
2. Run generate-context.js with the JSON file
3. Verify: Output memory contains `Next:` or `NEXT_ACTION` observations derived from the nextSteps array

#### M-005c: Verification freshness (REQ-004/REQ-005)
1. Do not claim outsourced CLI live round-trip passed unless freshly rerun with evidence
2. Check that checklist.md verification claims are backed by current evidence (e.g., CHK-025 should cite a dated round-trip artifact)

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md](../../feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: M-005
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md`
