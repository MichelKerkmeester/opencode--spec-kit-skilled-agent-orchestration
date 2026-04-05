# Plan: Skill Advisor Routing + README Sync

| Field | Value |
| --- | --- |
| Status | Complete |
| Phase | 011 |
| Approach | 3 deliverables in parallel: README, advisor Public, advisor Barter |

## D1: Update Skill README

**File**: `.opencode/skill/README.md`

Changes:
- Line 165 area: Update version from `0.1.0.0` to `1.0.0.0`
- Update description to: `Evaluator-first agent improvement with 5-dimension integration-aware scoring, dynamic profiling, deterministic benchmarks, and guarded promotion`
- Verify skill count is correct (should still be 5 in research/review/improvement category)

## D2: Update Skill Advisor (Public)

**File**: `.opencode/skill/scripts/skill_advisor.py`

### Add INTENT_BOOSTERS (single-token)
```python
"5-dimension": ("sk-agent-improver", 1.8),
"5d scoring": ("sk-agent-improver", 1.8),
"integration scan": ("sk-agent-improver", 1.6),
"dynamic profile": ("sk-agent-improver", 1.6),
"evaluate agent": ("sk-agent-improver", 1.6),
"score agent": ("sk-agent-improver", 1.6),
"agent evaluation": ("sk-agent-improver", 1.6),
```

### Add PHRASE_INTENT_BOOSTERS (multi-token)
```python
"5-dimension evaluation": [("sk-agent-improver", 2.8)],
"5d agent scoring": [("sk-agent-improver", 2.8)],
"integration scanning": [("sk-agent-improver", 2.6)],
"dynamic profiling": [("sk-agent-improver", 2.6)],
"evaluate agent quality": [("sk-agent-improver", 2.8)],
"score agent dimensions": [("sk-agent-improver", 2.8)],
"agent integration surface": [("sk-agent-improver", 2.6)],
"/improve:agent": [("sk-agent-improver", 3.2)],
"/improve:prompt": [("sk-prompt-improver", 3.2)],
"improve agent": [("sk-agent-improver", 2.8)],
```

### Add COMMAND_BRIDGES
```python
"/improve:agent": "sk-agent-improver",
"/improve:prompt": "sk-prompt-improver",
"/create:agent": "sk-doc",
"/create:changelog": "sk-doc",
"/create:sk-skill": "sk-doc",
"/create:feature-catalog": "sk-doc",
"/create:testing-playbook": "sk-doc",
"/create:folder_readme": "sk-doc",
```

## D3: Sync COMMAND_BRIDGES to Barter

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/.opencode/skill/scripts/skill_advisor.py`

Add same COMMAND_BRIDGES as D2 EXCEPT:
- `/improve:agent` → skip (sk-agent-improver not in Barter)
- All others apply (sk-prompt-improver and sk-doc exist in Barter)

Also add PHRASE_INTENT_BOOSTERS for `/improve:prompt` and `/create:*` commands.

## Verification

```bash
# Test Phase 008+ routing
python3 .opencode/skill/scripts/skill_advisor.py "evaluate agent with 5 dimensions" --threshold 0.8
python3 .opencode/skill/scripts/skill_advisor.py "integration scanning" --threshold 0.8
python3 .opencode/skill/scripts/skill_advisor.py "/improve:agent" --threshold 0.8
python3 .opencode/skill/scripts/skill_advisor.py "/improve:prompt" --threshold 0.8
python3 .opencode/skill/scripts/skill_advisor.py "/create:agent" --threshold 0.8

# Verify README
grep "sk-agent-improver" .opencode/skill/README.md
```
