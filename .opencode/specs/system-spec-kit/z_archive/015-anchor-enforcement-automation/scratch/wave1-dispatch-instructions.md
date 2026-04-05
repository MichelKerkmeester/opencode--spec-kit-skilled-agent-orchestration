# Wave 1 Dispatch Instructions

## Context Package Output Requirements
ALL @context agents MUST return Context Package format with these 6 sections:
1. 🗄️ Memory Context
2. 📁 Codebase Findings  
3. 🔍 Pattern Analysis
4. 🤖 Dispatched Analyses
5. ⚠️ Gaps & Unknowns
6. 📋 Recommendation

## Output Size Constraint (Pattern B)
- Max 30 lines per agent
- Write detailed findings to scratch/agent-N-[topic].md
- Return 3-line summary to orchestrator

## Format
Agent N returns:
```
**Agent N Summary:**
- Key Finding 1
- Key Finding 2
- Key Finding 3
[Full details: scratch/agent-N-[topic].md]
```
