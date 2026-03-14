// ───────────────────────────────────────────────────────────────
// MODULE: Encoding Intent
// ───────────────────────────────────────────────────────────────
// Classify content intent for metadata enrichment.
//
// Classifies each memory's content at index time into one of three
// Intent categories: 'document' (prose), 'code' (programming),
// Or 'structured_data' (tables/JSON/YAML). The classification is
// Stored in the `encoding_intent` column alongside the embedding
// And serves as read-only metadata — it has NO retrieval-time
// Scoring impact.
//
// Feature Flag:
// Controlled by SPECKIT_ENCODING_INTENT (default ON, graduated).
// Set SPECKIT_ENCODING_INTENT=false to disable.
// When the flag is off, classifyEncodingIntent() still returns a
// Classification (default 'document') but callers should gate
// Persistence on isEncodingIntentEnabled().

// Feature catalog: Encoding-intent capture at index time

export type EncodingIntent = 'document' | 'code' | 'structured_data';

/**
 * Classify the encoding intent of content for metadata enrichment.
 *
 * Heuristic classification based on content structure:
 * - 'code': Contains code blocks, function definitions, import statements
 * - 'structured_data': Primarily tables, JSON, YAML front matter, key-value pairs
 * - 'document': Default — prose, markdown, natural language
 */
export function classifyEncodingIntent(content: string): EncodingIntent {
  if (!content || content.length === 0) return 'document';

  const codeScore = computeCodeScore(content);
  const structuredScore = computeStructuredScore(content);

  // Threshold: >0.4 for classification
  if (codeScore > 0.4 && codeScore > structuredScore) return 'code';
  if (structuredScore > 0.4 && structuredScore >= codeScore) return 'structured_data';

  return 'document';
}

function computeCodeScore(content: string): number {
  const lines = content.split('\n');
  const totalLines = lines.length || 1;

  let codeIndicators = 0;

  // Fenced code blocks
  const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
  const codeBlockLines = codeBlocks.reduce(
    (sum, block) => sum + block.split('\n').length,
    0,
  );
  codeIndicators += codeBlockLines / totalLines;

  // Import/require/export statements and programming keywords
  const importLines = lines.filter((l) =>
    /^\s*(import|export|require|const|let|var|function|class|interface|type)\b/.test(l),
  ).length;
  codeIndicators += (importLines / totalLines) * 0.8;

  // Programming punctuation density (braces, semicolons, arrows)
  // Threshold: typical prose has <1% punctuation density; code exceeds 3%
  const CODE_PUNCTUATION_DENSITY_THRESHOLD = 0.03;
  const codePunctuation = (content.match(/[{}();=>\[\]]/g) || []).length;
  const punctDensity = codePunctuation / content.length;
  codeIndicators += punctDensity > CODE_PUNCTUATION_DENSITY_THRESHOLD ? 0.3 : punctDensity * 10;

  return Math.min(1.0, codeIndicators);
}

function computeStructuredScore(content: string): number {
  const lines = content.split('\n');
  const totalLines = lines.length || 1;

  let structuredIndicators = 0;

  // YAML front matter
  if (content.startsWith('---\n')) {
    const yamlEnd = content.indexOf('\n---', 4);
    if (yamlEnd > 0) {
      const yamlLines = content.slice(0, yamlEnd).split('\n').length;
      structuredIndicators += (yamlLines / totalLines) * 0.5;
    }
  }

  // Markdown tables (lines with |)
  const tableLines = lines.filter((l) => /^\|.*\|/.test(l.trim())).length;
  structuredIndicators += (tableLines / totalLines) * 1.2;

  // Key-value pairs (YAML-style or JSON-style)
  const kvLines = lines.filter((l) =>
    /^\s*["']?\w+["']?\s*[:=]/.test(l),
  ).length;
  structuredIndicators += (kvLines / totalLines) * 0.6;

  // JSON blocks
  const jsonBlocks = (content.match(/\{[\s\S]*?\}/g) || []).length;
  if (jsonBlocks > 2) structuredIndicators += 0.2;

  return Math.min(1.0, structuredIndicators);
}
