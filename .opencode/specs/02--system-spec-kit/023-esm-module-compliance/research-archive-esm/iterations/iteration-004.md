# Iteration 004

## Focus

Inspect 022 `021`, `022`, and `015` for wrapper precedent, indexing sensitivity, and verification caveats.

## Evidence Reviewed

- `022-hybrid-rag-fusion/021-ground-truth-id-remapping/spec.md`
- `022-hybrid-rag-fusion/022-spec-doc-indexing-bypass/implementation-summary.md`
- `022-hybrid-rag-fusion/015-manual-testing-per-playbook/implementation-summary.md`

## Findings

- The repo prefers thin compatibility wrappers over boundary-blurring runtime-local script logic.
- Spec-doc indexing is a release-significant runtime path that depends on rebuilt `dist/` artifacts.
- The large 015 manual-testing pass was based on static source analysis, not live runtime execution.
- Later ESM verification must therefore lean on dist-sensitive runtime commands and targeted smoke tests.

## Ruled Out

- Treating the 015 manual-testing pass as sufficient runtime evidence.

## Dead Ends

- Assuming wrapper precedent implies wrappers should absorb ESM complexity.

## Next Focus

Check the release history for hidden module-system work.
