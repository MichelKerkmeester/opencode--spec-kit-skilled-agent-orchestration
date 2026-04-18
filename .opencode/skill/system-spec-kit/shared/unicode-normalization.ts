// ---------------------------------------------------------------
// MODULE: Unicode Normalization
// ---------------------------------------------------------------
// Shared canonical fold used by Gate 3, recovered-payload provenance,
// and trigger-phrase sanitization. The pipeline intentionally goes
// beyond NFKC because zero-width / soft-hyphen characters and mixed
// script lookalikes survive compatibility normalization.

export const CANONICAL_FOLD_VERSION = 'nfkc-hidden-mark-confusable-v1';

const HIDDEN_CHAR_PATTERN = /[\u00AD\u200B-\u200F\uFEFF]/g;
const COMBINING_MARK_PATTERN = /\p{M}/gu;

const CONFUSABLE_REPLACEMENTS = Object.freeze([
  [/\u0410|\u0391/g, 'A'],
  [/\u0430|\u03B1/g, 'a'],
  [/\u0412|\u0392/g, 'B'],
  [/\u0432/g, 'v'],
  [/\u0421/g, 'C'],
  [/\u0441|\u03F2/g, 'c'],
  [/\u0395|\u0415/g, 'E'],
  [/\u03B5|\u0435/g, 'e'],
  [/\u041D|\u0397/g, 'H'],
  [/\u043D/g, 'h'],
  [/\u0406|\u0399/g, 'I'],
  [/\u0456|\u03B9/g, 'i'],
  [/\u041A|\u039A/g, 'K'],
  [/\u043A|\u03BA/g, 'k'],
  [/\u041C|\u039C/g, 'M'],
  [/\u043C|\u03BC/g, 'm'],
  [/\u041E|\u039F/g, 'O'],
  [/\u043E|\u03BF/g, 'o'],
  [/\u0420|\u03A1/g, 'P'],
  [/\u0440|\u03C1/g, 'p'],
  [/\u0405|\u03A3/g, 'S'],
  [/\u0455|\u03C3|\u03C2/g, 's'],
  [/\u0422|\u03A4/g, 'T'],
  [/\u0442|\u03C4/g, 't'],
  [/\u0425|\u03A7/g, 'X'],
  [/\u0445|\u03C7/g, 'x'],
  [/\u0423|\u03A5/g, 'Y'],
  [/\u0443|\u03C5/g, 'y'],
] as const);

export interface UnicodeRuntimeFingerprint {
  readonly normalizer: typeof CANONICAL_FOLD_VERSION;
  readonly node: string;
  readonly icu: string;
  readonly unicode: string;
}

export function getUnicodeRuntimeFingerprint(): UnicodeRuntimeFingerprint {
  return {
    normalizer: CANONICAL_FOLD_VERSION,
    node: process.versions.node,
    icu: process.versions.icu ?? 'unknown',
    unicode: process.versions.unicode ?? 'unknown',
  };
}

export function canonicalFold(value: string): string {
  let normalized = value
    .normalize('NFKC')
    .replace(HIDDEN_CHAR_PATTERN, '')
    .normalize('NFD')
    .replace(COMBINING_MARK_PATTERN, '');

  for (const [pattern, replacement] of CONFUSABLE_REPLACEMENTS) {
    normalized = normalized.replace(pattern, replacement);
  }

  return normalized;
}
