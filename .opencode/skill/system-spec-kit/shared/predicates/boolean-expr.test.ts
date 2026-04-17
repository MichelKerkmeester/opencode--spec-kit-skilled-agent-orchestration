// ---------------------------------------------------------------
// TEST: BooleanExpr — Typed YAML Predicate Grammar (S7 / M11)
// ---------------------------------------------------------------
// Runner: `node --experimental-vm-modules .../boolean-expr.test.js` after tsc.
// Standalone assertions (no Vitest dependency) to mirror the existing
// quality-extractors.test.ts convention in this directory.
// ---------------------------------------------------------------

import {
  evaluateBooleanExpr,
  findProseBleed,
  parseBooleanExprString,
  parseWhenField,
  validateBooleanExpr,
} from './boolean-expr.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

function assert(cond: boolean, label: string): void {
  if (!cond) {
    throw new Error(`FAIL: ${label}`);
  }
  console.log(`PASS: ${label}`);
}

// ---------------------------------------------------------------
// 1. STRING PARSER
// ---------------------------------------------------------------

// Canonical TRUE/FALSE uppercase form (current runtime contract).
{
  const result = parseBooleanExprString('intake_only == TRUE');
  assert(result.ok === true, 'uppercase TRUE parses cleanly');
  assert(result.expr?.field === 'intake_only', 'field captured');
  assert(result.expr?.op === '==', 'op captured');
  assert(result.expr?.value === true, 'boolean literal captured');
}

{
  const result = parseBooleanExprString('intake_only == FALSE');
  assert(result.ok === true, 'uppercase FALSE parses cleanly');
  assert(result.expr?.value === false, 'FALSE literal captured');
}

// Lowercase / Titlecase booleans rejected per T-TEST-NEW-19 regression.
{
  const result = parseBooleanExprString('intake_only == true');
  assert(result.ok === false, "lowercase 'true' rejected");
}

{
  const result = parseBooleanExprString('intake_only == True');
  assert(result.ok === false, "titlecase 'True' rejected");
}

// Enum token form.
{
  const result = parseBooleanExprString('folder_state == populated-folder');
  assert(result.ok === true, 'enum token predicate parses');
  assert(result.expr?.value === 'populated-folder', 'enum value captured verbatim');
}

// Not-equal operator.
{
  const result = parseBooleanExprString('folder_state != populated-folder');
  assert(result.ok === true, '!= operator accepted');
  assert(result.expr?.op === '!=', '!= op captured');
}

// in / not_in operators with bracketed arrays.
{
  const result = parseBooleanExprString('folder_state in [populated-folder, partial-folder]');
  assert(result.ok === true, 'in operator accepted');
  assert(Array.isArray(result.expr?.value) && result.expr?.value.length === 2, 'array literal captured');
}

// Malformed strings rejected.
{
  const result = parseBooleanExprString('folder_state populated-folder');
  assert(result.ok === false, 'missing operator rejected');
}

// Prose-bleed detection (T-YML-PLN-04 / T-YML-CMP-01).
{
  const prose = 'Immediately after the canonical spec document is refreshed on disk';
  assert(findProseBleed(prose) !== null, 'prose bleed detected');
  const parsed = parseBooleanExprString(prose);
  assert(parsed.ok === false, 'prose predicate rejected before grammar parse');
  assert((parsed.error ?? '').includes('after'), "error suggests moving narrative into 'after:'");
}

// ---------------------------------------------------------------
// 2. OBJECT VALIDATOR
// ---------------------------------------------------------------

{
  const result = validateBooleanExpr({ field: 'intake_only', op: '==', value: true });
  assert(result.ok === true, 'typed object form validates');
}

{
  const result = validateBooleanExpr({ field: 'folder_state', op: 'in', value: ['populated-folder'] });
  assert(result.ok === true, 'in operator with array passes');
}

{
  const result = validateBooleanExpr({ field: 'folder_state', op: 'in', value: 'populated-folder' });
  assert(result.ok === false, 'in without array rejected');
}

{
  const result = validateBooleanExpr({ field: '', op: '==', value: true });
  assert(result.ok === false, 'empty field rejected');
}

{
  const result = validateBooleanExpr({ field: 'x', op: '<', value: 1 });
  assert(result.ok === false, 'unsupported op rejected');
}

// ---------------------------------------------------------------
// 3. UNIFIED WHEN-FIELD PARSER
// ---------------------------------------------------------------

{
  const asString = parseWhenField('intake_only == TRUE');
  const asObject = parseWhenField({ field: 'intake_only', op: '==', value: true });
  assert(asString.ok === true && asObject.ok === true, 'both forms accepted by parseWhenField');
  assert(
    asString.expr?.field === asObject.expr?.field && asString.expr?.op === asObject.expr?.op,
    'string and object forms produce equivalent predicates',
  );
}

{
  const assetPath = fileURLToPath(
    new URL('../../../../command/spec_kit/assets/spec_kit_complete_confirm.yaml', import.meta.url),
  );
  const asset = readFileSync(assetPath, 'utf8');
  const block = asset.match(/post_save_indexing:[\s\S]*?(?=\n\s{4}[A-Za-z_][A-Za-z0-9_]*:)/)?.[0] ?? '';
  assert(
    block.includes('after: "Immediately after the canonical spec document is refreshed on disk"'),
    'post_save_indexing uses after for prose timing',
  );
  assert(
    !block.includes('\n      when:'),
    'post_save_indexing no longer stores prose timing under when',
  );
}

// ---------------------------------------------------------------
// 4. EVALUATOR
// ---------------------------------------------------------------

{
  const expr = { field: 'intake_only', op: '==' as const, value: true };
  const ok = evaluateBooleanExpr(expr, { intake_only: true });
  assert(ok.ok === true && ok.result === true, 'intake_only == TRUE evaluates true');
  const nok = evaluateBooleanExpr(expr, { intake_only: false });
  assert(nok.ok === true && nok.result === false, 'intake_only == TRUE evaluates false when bound is FALSE');
}

{
  const expr = { field: 'folder_state', op: '!=' as const, value: 'populated-folder' };
  const branch = evaluateBooleanExpr(expr, { folder_state: 'partial-folder' });
  assert(branch.ok === true && branch.result === true, '!= branch fires for non-populated folder');
}

{
  const expr = { field: 'folder_state', op: 'in' as const, value: ['populated-folder', 'partial-folder'] };
  const branch = evaluateBooleanExpr(expr, { folder_state: 'partial-folder' });
  assert(branch.ok === true && branch.result === true, 'in branch fires for member value');
}

{
  const expr = { field: 'missing', op: '==' as const, value: 'x' };
  const result = evaluateBooleanExpr(expr, {});
  assert(result.ok === false, 'unbound field surfaces as diagnostic');
}

console.log('\nAll BooleanExpr test cases passed.');
