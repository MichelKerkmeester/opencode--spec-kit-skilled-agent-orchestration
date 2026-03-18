---
title: Main-Agent Review Protocol
description: Scenario acceptance rules, feature verdict logic, and release readiness criteria for the CocoIndex Code manual testing playbook package.
---

# Main-Agent Review Protocol

Acceptance rules and release readiness criteria for reviewing CocoIndex Code playbook execution results.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Inputs Required

1. `manual_testing_playbook.md`
2. Snippet modules under `snippets/`
3. Scenario execution evidence (logs, tool outputs, artifacts)
4. Coverage ledger and feature-to-snippet map from `manual_testing_playbook.md`
5. Triage notes for all non-pass outcomes

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:scenario-acceptance -->
## 2. SCENARIO ACCEPTANCE RULES

For each executed scenario, check:

1. Preconditions were satisfied
2. Prompt and command sequence were executed as written
3. Expected signals are present
4. Evidence is complete and readable
5. Outcome rationale is explicit

### Scenario Verdict

| Verdict | Criteria |
|---------|----------|
| `PASS` | All acceptance checks true |
| `PARTIAL` | Core behavior works but non-critical evidence or metadata is incomplete |
| `FAIL` | Expected behavior missing, contradictory output, or critical check failed |

<!-- /ANCHOR:scenario-acceptance -->

---

<!-- ANCHOR:feature-verdict -->
## 3. FEATURE VERDICT RULES

| Verdict | Criteria |
|---------|----------|
| `PASS` | All mapped scenarios for feature are `PASS` |
| `PARTIAL` | At least one mapped scenario is `PARTIAL`, none are `FAIL` |
| `FAIL` | Any mapped scenario is `FAIL` |

**Hard rule**: Any critical-path scenario `FAIL` forces feature verdict to `FAIL`.

<!-- /ANCHOR:feature-verdict -->

---

<!-- ANCHOR:release-readiness -->
## 4. RELEASE READINESS

Release is `READY` only when:

1. No feature verdict is `FAIL`
2. All critical scenarios are `PASS`
3. Coverage is 100% of features defined in the root index and backed by snippet files (`COVERED_FEATURES == TOTAL_FEATURES`)
4. No unresolved blocking triage item remains

Otherwise release is `NOT READY`.

### Deterministic Coverage Check for the Root Index Package

Run from repository root:

```bash
TOTAL_FEATURES=$(python3 - <<'PY'
from pathlib import Path
import re
path = Path('.opencode/skill/mcp-cocoindex-code/manual_testing_playbook/manual_testing_playbook.md')
count = 0
in_ledger = False
pattern = re.compile(r'^\| (CCC-\d{3}|MCP-\d{3}|CFG-\d{3}|DMN-\d{3}|ADV-\d{3}|ERR-\d{3}) \|')
for line in path.read_text().splitlines():
    if line.startswith('## Feature Catalog Cross-Reference Index'):
        in_ledger = True
        continue
    if in_ledger and line.startswith('## '):
        break
    if in_ledger and pattern.match(line):
        count += 1
print(count)
PY
)

COVERED_FEATURES=$(python3 - <<'PY'
from pathlib import Path
import re
root = Path('.opencode/skill/mcp-cocoindex-code/manual_testing_playbook/snippets')
pattern = re.compile(r'^\| (CCC-\d{3}|MCP-\d{3}|CFG-\d{3}|DMN-\d{3}|ADV-\d{3}|ERR-\d{3}) \|')
ids = set()
for path in root.rglob('*.md'):
    for line in path.read_text().splitlines():
        match = pattern.match(line)
        if match:
            ids.add(match.group(1))
print(len(ids))
PY
)
```

Final verdict report must include `COVERED_FEATURES/TOTAL_FEATURES`.

<!-- /ANCHOR:release-readiness -->

---

<!-- ANCHOR:destructive-scenarios -->
## 5. DESTRUCTIVE SCENARIO RULES

- `CCC-005` (Index reset) MUST run on non-production data only
- Before executing, verify the index can be rebuilt from scratch
- Never run destructive scenarios in parallel with other scenarios that depend on the index

<!-- /ANCHOR:destructive-scenarios -->

---

<!-- ANCHOR:mandatory-flows -->
## 6. COCOINDEX-SPECIFIC MANDATORY FLOWS

Treat the root playbook plus referenced snippets as the canonical source of truth: use `manual_testing_playbook.md` for the scenario inventory and coverage ledger, and use the snippet modules for per-scenario execution semantics.

**Rule**: Do not duplicate or restate command text in this protocol; update the matching snippet when commands change and keep the root coverage ledger in sync.

<!-- /ANCHOR:mandatory-flows -->
