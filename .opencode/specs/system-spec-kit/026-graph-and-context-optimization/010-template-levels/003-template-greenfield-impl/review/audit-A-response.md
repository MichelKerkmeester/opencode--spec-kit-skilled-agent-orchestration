## `.opencode/agent/`

| Path | Action | Reason | Lines (if MODIFY) |
| --- | --- | --- | --- |
| `.opencode/agent/README.txt` | UNTOUCHED | No matching template-path or banned-vocabulary hits. |  |
| `.opencode/agent/context.md` | MODIFY | AI-facing heading uses banned vocabulary. | 59: `## 2. CAPABILITY SCAN` → `## 2. ROUTING SCAN` |
| `.opencode/agent/debug.md` | MODIFY | Same banned heading. | 57: `## 2. CAPABILITY SCAN` → `## 2. ROUTING SCAN` |
| `.opencode/agent/deep-research.md` | MODIFY | Same banned heading. | 220: `## 2. CAPABILITY SCAN` → `## 2. ROUTING SCAN` |
| `.opencode/agent/deep-review.md` | MODIFY | Same banned heading. | 241: `## 2. CAPABILITY SCAN` → `## 2. ROUTING SCAN` |
| `.opencode/agent/improve-agent.md` | MODIFY | Multiple AI-facing `manifest` leaks plus banned heading. | 36,52,60,62,76,98,108,122,124,189,234: replace `manifest` with `control file`, `run contract`, or `approved scope`; 46: `## 2. CAPABILITY SCAN` → `## 2. ROUTING SCAN` |
| `.opencode/agent/improve-prompt.md` | MODIFY | AI-facing heading uses banned vocabulary. | 46: `## 2. CAPABILITY SCAN` → `## 2. ROUTING SCAN` |
| `.opencode/agent/orchestrate.md` | MODIFY | Banned heading plus deleted `templates/level_N` references. | 87: heading → `ROUTING SCAN`; 337: ``templates/level_N/``; 357: ``templates/level_N/``; 377: ``templates/level_N/``; 389: ``templates/level_3/spec.md``. Replace with “Level template source resolved by the system-spec-kit template resolver.” |
| `.opencode/agent/review.md` | MODIFY | AI-facing heading uses banned vocabulary. | 70: `## 3. CAPABILITY SCAN` → `## 3. ROUTING SCAN` |
| `.opencode/agent/ultra-think.md` | MODIFY | AI-facing heading uses banned vocabulary. | 64: `## 2. CAPABILITY SCAN` → `## 2. ROUTING SCAN` |
| `.opencode/agent/write.md` | MODIFY | AI-facing heading/table uses banned vocabulary. | 159: `CAPABILITY SCAN`; 167: `## 3. CAPABILITY SCAN` → `ROUTING SCAN` |

## `.opencode/command/spec_kit/`

| Path | Action | Reason | Lines (if MODIFY) |
| --- | --- | --- | --- |
| `.opencode/command/spec_kit/README.txt` | UNTOUCHED | No matching hits. |  |
| `.opencode/command/spec_kit/implement.md` | CITED | Covered by plan’s command-doc scan, but no direct hits. |  |
| `.opencode/command/spec_kit/deep-research.md` | MODIFY | AI-facing `kind`/`manifest` leaks. | 68,74,81,139: replace `config.executor.kind` with `config.executor.type`; 336: `Optimizer manifest` → `Optimizer configuration` |
| `.opencode/command/spec_kit/deep-review.md` | MODIFY | Same leaks as deep-research. | 66,72,79,151: `config.executor.kind` → `config.executor.type`; 386: `Optimizer manifest` → `Optimizer configuration` |
| `.opencode/command/spec_kit/resume.md` | MODIFY | AI-facing `child manifest` leak. | 66: `child manifest` → `child list` |
| `.opencode/command/spec_kit/plan.md` | MODIFY | Deleted `templates/phase_parent` path and level-folder taxonomy. | 433: replace whole lean-parent paragraph with resolver-based “phase parent uses Level-facing phase-parent template contract.” |
| `.opencode/command/spec_kit/complete.md` | MODIFY | Deleted `templates/phase_parent` path. | 248: replace ``templates/phase_parent/spec.md`` with “phase-parent Level template contract.” |
| `assets/spec_kit_resume_auto.yaml` | MODIFY | `child manifest/listing` leak. | 62: → `child list` |
| `assets/spec_kit_resume_confirm.yaml` | MODIFY | Same leak. | 62: → `child list` |
| `assets/spec_kit_plan_auto.yaml` | MODIFY | Deleted addendum, level-folder, and root template paths. | 56,59-60,162-190,474,476,555,557: replace explicit paths with Level contract resolver outputs. |
| `assets/spec_kit_plan_confirm.yaml` | MODIFY | Same deleted path matrix. | 56,59-60,168-196,512,514,604,606 |
| `assets/spec_kit_implement_auto.yaml` | MODIFY | Deleted phase-parent and level/root template paths. | 63,74,125-142,349,351,477 |
| `assets/spec_kit_implement_confirm.yaml` | MODIFY | Same deleted path matrix. | 111-128,357,359,515 |
| `assets/spec_kit_complete_auto.yaml` | MODIFY | Deleted addendum, level/root template paths. | 82,85-86,167-195,605,607,650,652,742,744,746,795,797,979 |
| `assets/spec_kit_complete_confirm.yaml` | MODIFY | Same deleted path matrix. | 70,73-74,176-204,631,633,687,689,775,777,826,828,1029 |
| `assets/spec_kit_deep-research_auto.yaml` | MODIFY | AI-facing `kind` executor keys. | 555,561,577,625,638,641,700,745,786,790: rename to executor `type`/approved state wording. |
| `assets/spec_kit_deep-research_confirm.yaml` | MODIFY | Same `kind` leaks. | 566,572,661,665 |
| `assets/spec_kit_deep-review_auto.yaml` | MODIFY | `kind` and `Capability` leaks. | 647,653,688,691,793,797,869-870: rename schema wording; 1200: `Playbook vs Capability` → `Playbook vs Support` |
| `assets/spec_kit_deep-review_confirm.yaml` | MODIFY | Same leaks. | 663,669,770,774,842-843,1209 |
