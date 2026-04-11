# Tasks: 001-architecture-boundary-freeze

1. Record the preserved Public authorities and non-goals in `spec.md`.
2. Bind the boundary to real files in `plan.md`.
3. Add downstream-handoff tasks that require every later phase to preserve the frozen authorities.
4. Verify the packet still treats this phase as prerequisite-only with `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/001-architecture-boundary-freeze --strict`.
