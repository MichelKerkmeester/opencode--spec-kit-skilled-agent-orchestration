# Anchor Cleanup Audit — 2026-04-30

## Totals

| metric | value |
| --- | ---: |
| files | 296 |
| validate_pass | 296 |
| validate_fail | 0 |
| p0_count | 0 |
| p1_count | 24 |
| p2_count | 14 |
| mean_dqi | 88.27 |
| median_dqi | 93.0 |

## DQI Distribution

   0-9 |  0
 10-19 |  0
 20-29 |  0
 30-39 |  0
 40-49 |  0
 50-59 | #### 24
 60-69 | ## 11
 70-79 | ### 17
 80-89 | ########## 51
90-100 | ######################################## 193

## Worst Offenders (bottom 20 by DQI)

| path | dqi_total | dqi_band | violation_count |
| --- | ---: | --- | ---: |
| .opencode/skill/sk-code/references/go/debugging/debugging_workflows.md | 54 | needs_work | 0 |
| .opencode/skill/sk-code/references/go/debugging/pprof_profiling.md | 54 | needs_work | 0 |
| .opencode/skill/sk-code/references/go/deployment/docker_railway.md | 54 | needs_work | 0 |
| .opencode/skill/sk-code/references/go/implementation/api_design.md | 54 | needs_work | 0 |
| .opencode/skill/sk-code/references/go/implementation/database_sqlc_postgres.md | 54 | needs_work | 0 |
| .opencode/skill/sk-code/references/go/implementation/error_envelopes.md | 54 | needs_work | 0 |
| .opencode/skill/sk-code/references/go/implementation/gin_handler_patterns.md | 54 | needs_work | 0 |
| .opencode/skill/sk-code/references/go/implementation/jwt_middleware.md | 54 | needs_work | 0 |
| .opencode/skill/sk-code/references/go/implementation/service_layer.md | 54 | needs_work | 0 |
| .opencode/skill/sk-code/references/go/implementation/validation_patterns.md | 54 | needs_work | 0 |
| .opencode/skill/sk-code/references/go/standards/code_style.md | 54 | needs_work | 0 |
| .opencode/skill/sk-code/references/go/verification/verification_workflows.md | 54 | needs_work | 0 |
| .opencode/skill/sk-code/references/nextjs/implementation/accessibility_aria.md | 54 | needs_work | 0 |
| .opencode/skill/sk-code/references/nextjs/implementation/content_tinacms.md | 54 | needs_work | 0 |
| .opencode/skill/sk-code/references/nextjs/debugging/debugging_workflows.md | 55 | needs_work | 0 |
| .opencode/skill/sk-code/references/nextjs/debugging/hydration_errors.md | 55 | needs_work | 0 |
| .opencode/skill/sk-code/references/nextjs/deployment/vercel_deploy.md | 55 | needs_work | 0 |
| .opencode/skill/sk-code/references/nextjs/implementation/api_integration.md | 55 | needs_work | 0 |
| .opencode/skill/sk-code/references/nextjs/implementation/app_router_patterns.md | 55 | needs_work | 0 |
| .opencode/skill/sk-code/references/nextjs/implementation/forms_validation.md | 55 | needs_work | 0 |

## Per-Skill Breakdown

| skill | files | validate_pass | validate_fail | mean_dqi |
| --- | ---: | ---: | ---: | ---: |
| cli-claude-code | 7 | 7 | 0 | 92.0 |
| cli-codex | 8 | 8 | 0 | 91.38 |
| cli-copilot | 8 | 8 | 0 | 91.88 |
| cli-gemini | 7 | 7 | 0 | 92.71 |
| cli-opencode | 7 | 7 | 0 | 91.29 |
| mcp-chrome-devtools | 4 | 4 | 0 | 94.25 |
| mcp-coco-index | 7 | 7 | 0 | 95.14 |
| mcp-code-mode | 8 | 8 | 0 | 97.12 |
| mcp-figma | 4 | 4 | 0 | 94.75 |
| sk-code | 81 | 81 | 0 | 77.31 |
| sk-code-opencode | 26 | 26 | 0 | 97.04 |
| sk-code-review | 9 | 9 | 0 | 90.56 |
| sk-deep-research | 9 | 9 | 0 | 86.89 |
| sk-deep-review | 7 | 7 | 0 | 86.29 |
| sk-doc | 34 | 34 | 0 | 90.06 |
| sk-git | 10 | 10 | 0 | 94.6 |
| sk-improve-agent | 14 | 14 | 0 | 87.57 |
| sk-improve-prompt | 7 | 7 | 0 | 89.57 |
| system-spec-kit | 39 | 39 | 0 | 94.44 |

## P0 Violations

None.

## P1 Files (DQI < 60)

| path | dqi_total | top violation summary |
| --- | ---: | --- |
| .opencode/skill/sk-code/references/go/debugging/debugging_workflows.md | 54 |  |
| .opencode/skill/sk-code/references/go/debugging/pprof_profiling.md | 54 |  |
| .opencode/skill/sk-code/references/go/deployment/docker_railway.md | 54 |  |
| .opencode/skill/sk-code/references/go/implementation/api_design.md | 54 |  |
| .opencode/skill/sk-code/references/go/implementation/database_sqlc_postgres.md | 54 |  |
| .opencode/skill/sk-code/references/go/implementation/error_envelopes.md | 54 |  |
| .opencode/skill/sk-code/references/go/implementation/gin_handler_patterns.md | 54 |  |
| .opencode/skill/sk-code/references/go/implementation/jwt_middleware.md | 54 |  |
| .opencode/skill/sk-code/references/go/implementation/service_layer.md | 54 |  |
| .opencode/skill/sk-code/references/go/implementation/validation_patterns.md | 54 |  |
| .opencode/skill/sk-code/references/go/standards/code_style.md | 54 |  |
| .opencode/skill/sk-code/references/go/verification/verification_workflows.md | 54 |  |
| .opencode/skill/sk-code/references/nextjs/debugging/debugging_workflows.md | 55 |  |
| .opencode/skill/sk-code/references/nextjs/debugging/hydration_errors.md | 55 |  |
| .opencode/skill/sk-code/references/nextjs/deployment/vercel_deploy.md | 55 |  |
| .opencode/skill/sk-code/references/nextjs/implementation/accessibility_aria.md | 54 |  |
| .opencode/skill/sk-code/references/nextjs/implementation/api_integration.md | 55 |  |
| .opencode/skill/sk-code/references/nextjs/implementation/app_router_patterns.md | 55 |  |
| .opencode/skill/sk-code/references/nextjs/implementation/content_tinacms.md | 54 |  |
| .opencode/skill/sk-code/references/nextjs/implementation/forms_validation.md | 55 |  |
| .opencode/skill/sk-code/references/nextjs/implementation/motion_animation.md | 55 |  |
| .opencode/skill/sk-code/references/nextjs/implementation/vanilla_extract_styling.md | 55 |  |
| .opencode/skill/sk-code/references/nextjs/standards/code_style.md | 55 |  |
| .opencode/skill/sk-code/references/nextjs/verification/verification_workflows.md | 55 |  |

## P2 Files (60 <= DQI < 75)

| path | dqi_total |
| --- | ---: |
| .opencode/skill/sk-code/assets/go/checklists/code_quality_checklist.md | 62 |
| .opencode/skill/sk-code/assets/go/checklists/debugging_checklist.md | 61 |
| .opencode/skill/sk-code/assets/go/checklists/verification_checklist.md | 61 |
| .opencode/skill/sk-code/assets/nextjs/checklists/code_quality_checklist.md | 63 |
| .opencode/skill/sk-code/assets/nextjs/checklists/debugging_checklist.md | 61 |
| .opencode/skill/sk-code/assets/nextjs/checklists/verification_checklist.md | 61 |
| .opencode/skill/sk-code/assets/nextjs/integrations/tinacms_bootstrap.md | 61 |
| .opencode/skill/sk-code/assets/nextjs/integrations/untitled_ui_setup.md | 61 |
| .opencode/skill/sk-code/assets/nextjs/integrations/vanilla_extract_setup.md | 61 |
| .opencode/skill/sk-code/references/go/README.md | 72 |
| .opencode/skill/sk-code/references/go/implementation/implementation_workflows.md | 68 |
| .opencode/skill/sk-code/references/nextjs/README.md | 72 |
| .opencode/skill/sk-code/references/nextjs/implementation/implementation_workflows.md | 68 |
| .opencode/skill/sk-doc/assets/documentation/install_guide_template.md | 72 |

## README Audit Summary

Return code: `2`

```text
TimeoutExpired after 60s: python3 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-doc/scripts/audit_readmes.py --repo-root /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public --json-out /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/audit-reports/readme-audit-2026-04-30.json --markdown-out /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/audit-reports/readme-audit-2026-04-30.md
```
