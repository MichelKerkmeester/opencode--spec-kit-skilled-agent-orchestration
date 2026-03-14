// ---------------------------------------------------------------
// MODULE: JSONC Strip
// ---------------------------------------------------------------
// Strips comments from JSONC content, correctly handling comments inside strings.
// Handles: // line comments, /* block comments */, escaped quotes, string literals

// 1. HELPERS

/**
 * Checks whether the quote character at `index` is escaped by counting
 * consecutive preceding backslashes. An odd count means the quote is escaped.
 */
function isEscapedQuoteAt(str: string, index: number): boolean {
  if (index === 0) return false;
  let backslashCount = 0;
  let k = index - 1;
  while (k >= 0 && str[k] === '\\') {
    backslashCount++;
    k--;
  }
  return backslashCount % 2 === 1;
}

// ---------------------------------------------------------------
// 2. MAIN
// ---------------------------------------------------------------

/**
 * Strips JSONC comments from a string while preserving comment-like content
 * inside JSON string values (e.g. URLs containing `//`).
 *
 * Two-phase approach:
 *   Step 1 — character-level scan removes block comments (`/* ... *​/`)
 *   Step 2 — per-line scan removes single-line comments (`// ...`)
 *
 * Both phases track whether the scanner is inside a JSON string literal
 * so that comment-like sequences within strings are left untouched.
 */
export function stripJsoncComments(content: string): string {
  if (!content) return '';

  // --- Step 1: Strip block comments (char-by-char, string-aware) ---
  let stripped = '';
  let inBlockComment = false;
  let inStr = false;

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    const next = content[i + 1];

    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i++; // skip closing '/'
      }
      continue;
    }

    if (ch === '"' && !isEscapedQuoteAt(content, i)) {
      inStr = !inStr;
    }

    if (!inStr && ch === '/' && next === '*') {
      inBlockComment = true;
      i++; // skip opening '*'
      continue;
    }

    stripped += ch;
  }

  // --- Step 2: Strip single-line comments (per-line, string-aware) ---
  const lines = stripped.split('\n');
  const cleanLines: string[] = [];

  for (const line of lines) {
    let inString = false;
    let commentStart = -1;

    for (let i = 0; i < line.length - 1; i++) {
      const char = line[i];
      if (char === '"' && !isEscapedQuoteAt(line, i)) {
        inString = !inString;
      }
      if (!inString && char === '/' && line[i + 1] === '/') {
        commentStart = i;
        break;
      }
    }

    cleanLines.push(commentStart !== -1 ? line.substring(0, commentStart) : line);
  }

  return cleanLines.join('\n');
}
