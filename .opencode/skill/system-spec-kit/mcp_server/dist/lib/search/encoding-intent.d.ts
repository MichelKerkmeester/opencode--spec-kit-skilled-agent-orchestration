export type EncodingIntent = 'document' | 'code' | 'structured_data';
/**
 * Classify the encoding intent of content for metadata enrichment.
 *
 * Heuristic classification based on content structure:
 * - 'code': Contains code blocks, function definitions, import statements
 * - 'structured_data': Primarily tables, JSON, YAML front matter, key-value pairs
 * - 'document': Default — prose, markdown, natural language
 */
export declare function classifyEncodingIntent(content: string): EncodingIntent;
//# sourceMappingURL=encoding-intent.d.ts.map