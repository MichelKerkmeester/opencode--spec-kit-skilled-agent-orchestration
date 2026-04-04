export interface OntologySchema {
    entityTypes: string[];
    relationTypes: string[];
    extractionRules: Rule[];
}
export interface Rule {
    id: string;
    entityType: string;
    relationType: string;
}
/**
 * Load ontology schema from environment or default.
 * Reads SPECKIT_ONTOLOGY_SCHEMA env var as JSON.
 * Returns null if no schema configured and no default is appropriate.
 * Returns the default schema when no env override is set.
 */
export declare function loadOntologySchema(schemaPath?: string): OntologySchema | null;
/**
 * Validate that an entity/relation pair is allowed by the schema.
 * Comparison is case-insensitive.
 * Returns true if both the entity type and relation type are in the schema.
 */
export declare function validateExtraction(entity: string, relation: string, schema: OntologySchema): boolean;
//# sourceMappingURL=ontology-hooks.d.ts.map