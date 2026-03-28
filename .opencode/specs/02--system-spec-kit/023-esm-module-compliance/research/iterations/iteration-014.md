# Iteration 014

## Focus

Apply primary-source Node and TypeScript guidance to the candidate strategies.

## Evidence Reviewed

- Node packages docs
- Node ESM docs
- Node `node:module` docs
- TypeScript modules reference
- TypeScript choosing compiler options

## Findings

- Node requires explicit relative file extensions for native ESM imports.
- Node package-local `"type": "module"` is the correct boundary switch for emitted `.js`.
- TypeScript `module: "nodenext"` with `moduleResolution: "nodenext"` is the correct validation mode for Node-run outputs.
- The official guidance supports package-local ESM boundaries while sibling CommonJS packages remain separate.

## Ruled Out

- Bundler-style resolution as the primary validator for a package that runs directly in Node.

## Dead Ends

- Looking for a root-workspace setting that avoids package-local decisions.

## Next Focus

Audit which tests and commands encode CommonJS assumptions today.
