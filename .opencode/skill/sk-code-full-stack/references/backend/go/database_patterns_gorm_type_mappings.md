---
title: GORM Type Mappings & Database Types
description: Critical reference for Go-to-PostgreSQL type mappings in GORM entities, database migrations, and type safety for PostgreSQL.
---

# GORM Type Mappings & Database Types

Critical reference for Go-to-PostgreSQL type mappings in GORM entities, database migrations, and type safety for PostgreSQL.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This document defines the correct type mappings between Golang types and PostgreSQL database types when using GORM. Following these mappings is essential to avoid runtime errors and data integrity issues.

### Progressive Disclosure

| If you need to...                          | Read section...                    |
| ------------------------------------------ | ---------------------------------- |
| Fix a "wrong column type" error            | 2. UID/UUID TYPES - CRITICAL       |
| Map a Go type to PostgreSQL                | 3. STANDARD TYPE MAPPINGS          |
| Use embedded types like SoftDeletable      | 4. EMBEDDED TYPES                  |
| Add indexes or constraints                 | 5. CONSTRAINTS & INDEXES           |
| Handle nullable fields                     | 6. NULLABLE FIELDS                 |
| Write a database migration                 | 7. MIGRATION PATTERNS              |
| Verify your entity definition              | 8. VALIDATION CHECKLIST            |
| Quick lookup any type mapping              | 9. QUICK REFERENCE TABLE           |
| Avoid common mistakes                      | 10. COMMON MISTAKES & FIXES        |

### File Relationships

```
database_patterns_gorm_type_mappings.md (this file)
    |- depends on: database_patterns.md (general patterns)
    |- depends on: go_standards.md (Go conventions)
    |- used by: All entity definitions in internal/domain/*/data_layer/*_entities/
    +- used by: All migrations in internal/domain/*/data_layer/*_migrations/
```

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:uid-uuid-types-critical -->
## 2. UID/UUID TYPES - CRITICAL

### How do I correctly define a uid.UID field?

**WRONG - Will create VARCHAR column:**
```go
type MyEntity struct {
    ID uid.UID `gorm:"primaryKey"` // MISSING type:uuid
}
```

**CORRECT - Creates UUID column:**
```go
type MyEntity struct {
    ID uid.UID `gorm:"type:uuid;primaryKey"` // ALWAYS specify type:uuid
}
```

### What is uid.UID?

Our codebase uses a custom UID type defined in `pkg/uid/uid.go`:

```go
// uid.UID is an alias for pulid.ULID (UUID-compatible ULID)
type UID = pulid.ULID
```

| Fact                                           | Details                                      |
| ---------------------------------------------- | -------------------------------------------- |
| Auto-recognized by GORM?                       | **NO** - must specify `type:uuid`            |
| Default GORM behavior without type tag         | VARCHAR or TEXT (wrong!)                     |
| Storage format in PostgreSQL                   | UUID v4                                      |
| String conversion methods                      | `.String()` (ULID format), `.UUID()` (UUID)  |

### How do I use uid.UID in different contexts?

| Context                   | GORM Tag Pattern                                              |
| ------------------------- | ------------------------------------------------------------- |
| Primary Keys              | `gorm:"type:uuid;primaryKey"`                                 |
| Foreign Keys              | `gorm:"type:uuid;not null;index"`                             |
| Optional Foreign Keys     | `gorm:"type:uuid"`                                            |
| Nullable Foreign Keys     | Use `*uid.UID` with `gorm:"type:uuid"`                        |
| With Named Index          | `gorm:"type:uuid;not null;index:idx_workflow_logs_workflow_id"` |

### Real-World Examples

**From workflows entities:**
```go
type Workflows struct {
    ID            uid.UID               `json:"id" gorm:"type:uuid;primary_key"`
    EventName     string                `json:"event_name" gorm:"type:varchar(255);not null;index:idx_workflows_event_name"`
    Configuration database_models.JSONB `json:"configuration" gorm:"type:jsonb;not null"`
}

type WorkflowActivityLog struct {
    ID         uid.UID `json:"id" gorm:"type:uuid;primary_key"`
    WorkflowID uid.UID `json:"workflow_id" gorm:"type:uuid;not null;index:idx_workflow_activity_logs_workflow_id"`
    EventName  string  `json:"event_name" gorm:"type:varchar(255);not null"`
}
```

---

<!-- /ANCHOR:uid-uuid-types-critical -->
<!-- ANCHOR:standard-type-mappings -->
## 3. STANDARD TYPE MAPPINGS

### How do I map string types?

| Go Type    | GORM Tag                   | PostgreSQL Type | When to Use                    |
| ---------- | -------------------------- | --------------- | ------------------------------ |
| `string`   | `type:text`                | TEXT            | Unlimited length strings       |
| `string`   | `type:varchar(255)`        | VARCHAR(255)    | Limited length strings         |
| `string`   | `type:varchar(50)`         | VARCHAR(50)     | Short strings like codes       |

```go
Description string `gorm:"type:text"`           // Unlimited length
Email       string `gorm:"type:varchar(255)"`   // Standard limited length
Code        string `gorm:"type:varchar(50)"`    // Short code
```

**Best Practice:** Always specify `type:varchar(N)` or `type:text` explicitly.

### How do I map integer types?

| Go Type   | GORM Tag            | PostgreSQL Type | When to Use         |
| --------- | ------------------- | --------------- | ------------------- |
| `int64`   | `type:bigint`       | BIGINT          | Large numbers       |
| `int`     | `type:integer`      | INTEGER         | Standard integers   |
| `int32`   | `type:integer`      | INTEGER         | 32-bit integers     |
| `int16`   | `type:smallint`     | SMALLINT        | Small numbers       |
| `uint64`  | `type:bigint`       | BIGINT          | Unsigned large      |

### How do I map boolean types?

```go
IsActive  bool `gorm:"type:boolean;default:false"`
IsDeleted bool `gorm:"type:boolean;default:false;not null"`
```

### How do I map decimal/currency types?

| Go Type            | GORM Tag              | PostgreSQL Type | When to Use            |
| ------------------ | --------------------- | --------------- | ---------------------- |
| `decimal.Decimal`  | `type:numeric(19,4)`  | NUMERIC(19,4)   | Currency amounts       |
| `decimal.Decimal`  | `type:numeric(5,2)`   | NUMERIC(5,2)    | Percentages            |
| `float64`          | `type:real`           | REAL            | Coordinates (NOT money)|

**Warning:** Never use `float64` for currency - use `decimal.Decimal` with `type:numeric`.

### How do I map time types?

| Go Type      | GORM Tag            | PostgreSQL Type              | When to Use              |
| ------------ | ------------------- | ---------------------------- | ------------------------ |
| `time.Time`  | `type:timestamptz`  | TIMESTAMP WITH TIME ZONE     | **Recommended** for all  |
| `time.Time`  | `type:timestamp`    | TIMESTAMP WITHOUT TIME ZONE  | Legacy only              |
| `time.Time`  | `type:date`         | DATE                         | Date only                |
| `time.Time`  | `type:time`         | TIME                         | Time only                |

### How do I map JSON types?

| Go Type                  | GORM Tag      | PostgreSQL Type | When to Use                |
| ------------------------ | ------------- | --------------- | -------------------------- |
| `database_models.JSONB`  | `type:jsonb`  | JSONB           | **Preferred** - indexed    |
| `database_models.JSON`   | `type:json`   | JSON            | Legacy only                |

**Best Practice:** Use `type:jsonb` for all JSON columns in PostgreSQL.

### How do I map array types?

```go
Tags       pq.StringArray `gorm:"type:text[]"`      // TEXT ARRAY
Ratings    pq.Int64Array  `gorm:"type:integer[]"`   // INTEGER ARRAY
RelatedIDs pq.StringArray `gorm:"type:uuid[]"`      // UUID ARRAY (stored as strings)
```

### How do I map enum types?

```go
// Option 1: TEXT with check constraint
Status string `gorm:"type:text;check:status IN ('active','inactive','pending')"`

// Option 2: Custom PostgreSQL ENUM (defined in migration)
State MyEnumType `gorm:"type:my_enum_type"`
```

---

<!-- /ANCHOR:standard-type-mappings -->
<!-- ANCHOR:embedded-types -->
## 4. EMBEDDED TYPES

### How do I use SoftDeletable?

```go
type MyEntity struct {
    Name string `gorm:"type:varchar(255)"`

    database_models.SoftDeletable // Embeds at the END of struct
}
```

**SoftDeletable provides:**
| Field       | GORM Tag                           | Type            |
| ----------- | ---------------------------------- | --------------- |
| ID          | `gorm:"primaryKey;type:uuid"`      | uid.UID         |
| CreatedAt   | `gorm:"type:timestamptz"`          | time.Time       |
| UpdatedAt   | `gorm:"type:timestamptz"`          | time.Time       |
| DeletedAt   | `gorm:"index"`                     | gorm.DeletedAt  |

**Note:** When embedding `SoftDeletable`, don't redefine ID, CreatedAt, UpdatedAt, DeletedAt.

---

<!-- /ANCHOR:embedded-types -->
<!-- ANCHOR:constraints-indexes -->
## 5. CONSTRAINTS & INDEXES

### How do I define common constraints?

| Constraint            | GORM Tag Pattern                                          |
| --------------------- | --------------------------------------------------------- |
| Primary Key           | `gorm:"type:uuid;primaryKey"`                             |
| Not Null              | `gorm:"type:varchar(255);not null"`                       |
| Unique                | `gorm:"type:varchar(100);unique"`                         |
| Unique Composite      | `gorm:"type:uuid;uniqueIndex:idx_user_resource"`          |
| Simple Index          | `gorm:"type:timestamptz;index"`                           |
| Named Index           | `gorm:"type:varchar(255);index:idx_event_name"`           |
| Composite Index       | `gorm:"type:uuid;index:idx_tenant_status"` on both fields |
| Foreign Key           | `gorm:"type:uuid;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"` |
| Default Value         | `gorm:"type:boolean;default:true"`                        |
| Default Timestamp     | `gorm:"type:timestamptz;default:CURRENT_TIMESTAMP"`       |

### Composite Index Example

```go
type Entity struct {
    TenantID uid.UID `gorm:"type:uuid;index:idx_tenant_status"`
    Status   string  `gorm:"type:text;index:idx_tenant_status"`
}
```

---

<!-- /ANCHOR:constraints-indexes -->
<!-- ANCHOR:nullable-fields -->
## 6. NULLABLE FIELDS

### How do I handle nullable vs non-nullable fields?

| Pattern           | When to Use                              | Example                              |
| ----------------- | ---------------------------------------- | ------------------------------------ |
| Non-pointer       | Required fields (NOT NULL)               | `Name string`                        |
| Pointer           | Optional fields (can be NULL)            | `MiddleName *string`                 |
| sql.Null* types   | Alternative to pointers                  | `Age sql.NullInt64`                  |

```go
// Non-nullable (database NOT NULL)
Name   string  `gorm:"type:varchar(255);not null"`
UserID uid.UID `gorm:"type:uuid;not null"`
Count  int64   `gorm:"type:bigint;not null;default:0"`

// Nullable (can be NULL in database)
MiddleName  *string    `gorm:"type:varchar(255)"`   // Pointer allows nil
ParentID    *uid.UID   `gorm:"type:uuid"`           // Nullable foreign key
CompletedAt *time.Time `gorm:"type:timestamptz"`    // Nullable timestamp

// sql.Null* types (alternative)
Email sql.NullString `gorm:"type:varchar(255)"`
Age   sql.NullInt64  `gorm:"type:integer"`
```

**Best Practice:** Use pointers for nullable fields. GORM handles NULL to nil conversion.

---

<!-- /ANCHOR:nullable-fields -->
<!-- ANCHOR:migration-patterns -->
## 7. MIGRATION PATTERNS

### How do I create a migration with correct types?

```go
type workflow1234567890 struct {
    ID            uid.UID               `json:"id" gorm:"type:uuid;primary_key"`
    EventName     string                `json:"event_name" gorm:"type:varchar(255);not null;index:idx_workflows_event_name"`
    Configuration database_models.JSONB `json:"configuration" gorm:"type:jsonb;not null"`
    IsActive      bool                  `json:"is_active" gorm:"type:boolean;default:true"`

    database_models.SoftDeletable // Embeds standard fields at the end
}

func (m *Migration1234567890) Up(db *gorm.DB) error {
    return db.AutoMigrate(&workflow1234567890{})
}
```

---

<!-- /ANCHOR:migration-patterns -->
<!-- ANCHOR:validation-checklist -->
## 8. VALIDATION CHECKLIST

Before committing any entity definition, verify:

| Check                                                  | Status |
| ------------------------------------------------------ | ------ |
| All `uid.UID` fields have `type:uuid`                  | [ ]    |
| String fields specify `type:varchar(N)` or `type:text` | [ ]    |
| JSON fields use `type:jsonb` (not `json`)              | [ ]    |
| Currency fields use `decimal.Decimal` with `type:numeric(19,4)` | [ ]    |
| Timestamps use `type:timestamptz` (with timezone)      | [ ]    |
| Primary keys have both `type:uuid;primaryKey`          | [ ]    |
| Foreign keys have `type:uuid` and appropriate constraints | [ ]    |
| Nullable fields use pointers or sql.Null* types        | [ ]    |
| Indexes are properly named and defined                 | [ ]    |
| Boolean fields have `type:boolean` with defaults       | [ ]    |

---

<!-- /ANCHOR:validation-checklist -->
<!-- ANCHOR:quick-reference-table -->
## 9. QUICK REFERENCE TABLE

| Go Type                  | GORM Tag                  | PostgreSQL Type              | Notes                       |
| ------------------------ | ------------------------- | ---------------------------- | --------------------------- |
| `uid.UID`                | `type:uuid`               | UUID                         | **REQUIRED** - never omit!  |
| `string`                 | `type:varchar(255)`       | VARCHAR(255)                 | Specify length              |
| `string`                 | `type:text`               | TEXT                         | Unlimited length            |
| `int64`                  | `type:bigint`             | BIGINT                       | 64-bit integer              |
| `int`                    | `type:integer`            | INTEGER                      | 32-bit integer              |
| `bool`                   | `type:boolean`            | BOOLEAN                      | True/false                  |
| `time.Time`              | `type:timestamptz`        | TIMESTAMP WITH TIME ZONE     | **Preferred** for timestamps|
| `decimal.Decimal`        | `type:numeric(19,4)`      | NUMERIC                      | For currency                |
| `database_models.JSONB`  | `type:jsonb`              | JSONB                        | **Preferred** for JSON      |
| `pq.StringArray`         | `type:text[]`             | TEXT[]                       | Array of strings            |
| `*uid.UID`               | `type:uuid`               | UUID                         | Nullable UUID               |
| `*string`                | `type:varchar(255)`       | VARCHAR                      | Nullable string             |

---

<!-- /ANCHOR:quick-reference-table -->
<!-- ANCHOR:common-mistakes-fixes -->
## 10. COMMON MISTAKES & FIXES

### Mistake 1: Missing type:uuid

```go
// WRONG - will create VARCHAR column
type User struct {
    ID uid.UID `gorm:"primaryKey"`
}

// CORRECT
type User struct {
    ID uid.UID `gorm:"type:uuid;primaryKey"`
}
```

### Mistake 2: Using float64 for Currency

```go
// WRONG - precision loss!
Price float64 `gorm:"type:real"`

// CORRECT
Price decimal.Decimal `gorm:"type:numeric(19,4)"`
```

### Mistake 3: Missing type for JSON

```go
// WRONG - may default to TEXT
Metadata database_models.JSONB `gorm:"not null"`

// CORRECT
Metadata database_models.JSONB `gorm:"type:jsonb;not null"`
```

### Mistake 4: Unspecified String Length

```go
// WRONG - unpredictable default length
Email string `gorm:"not null"`

// CORRECT
Email string `gorm:"type:varchar(255);not null"`
```

### Mistake 5: Timestamp Without Timezone

```go
// AVOID - loses timezone info
CreatedAt time.Time `gorm:"type:timestamp"`

// CORRECT
CreatedAt time.Time `gorm:"type:timestamptz"`
```

---

<!-- /ANCHOR:common-mistakes-fixes -->
<!-- ANCHOR:rules -->
## 11. RULES

### ✅ ALWAYS

- Specify `type:uuid` for all `uid.UID` fields
- Use `type:timestamptz` for all timestamp fields
- Use `type:jsonb` (not `json`) for JSON columns
- Use `decimal.Decimal` with `type:numeric(19,4)` for currency
- Specify explicit `type:varchar(N)` or `type:text` for strings
- Place `database_models.SoftDeletable` at the END of struct
- Use pointers for nullable fields

### ❌ NEVER

- Omit `type:uuid` from `uid.UID` fields (creates VARCHAR)
- Use `float64` for currency amounts (precision loss)
- Use `type:timestamp` without timezone (loses timezone info)
- Use `type:json` instead of `type:jsonb` (not indexed)
- Leave string types without explicit length specification

### ⚠️ ESCALATE IF

- Existing table has wrong column type (requires migration)
- Need to change primary key type on existing table
- Unsure about correct type mapping for custom types
- Performance issues with JSON queries (may need index)

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:related-resources -->
## 12. RELATED RESOURCES

| Topic                        | Document                    | Section                          |
| ---------------------------- | --------------------------- | -------------------------------- |
| General database patterns    | [database_patterns.md](./database_patterns.md) | All sections                     |
| Go coding standards          | [go_standards.md](./go_standards.md) | Type definitions                 |
| Entity layer conventions     | [domain_layers.md](./domain_layers.md) | Data Layer                       |
| Migration patterns           | [database_patterns.md](./database_patterns.md) | Migrations                       |

---

<!-- /ANCHOR:related-resources -->
<!-- ANCHOR:resources -->
## 13. RESOURCES

### Finding Examples

```bash
# Find uid.UID usage patterns
rg "uid\.UID.*type:uuid" --type go

# Find JSONB usage patterns
rg "database_models\.JSONB.*type:jsonb" --type go
```

### Documentation Links

- **GORM Documentation:** https://gorm.io/docs/
- **PostgreSQL Data Types:** https://www.postgresql.org/docs/current/datatype.html
- **Our UID Package:** `pkg/uid/uid.go`
- **Database Models:** `pkg/models/database/`
- **Entity Examples:** `internal/domain/*/data_layer/*_entities/`
<!-- /ANCHOR:resources -->
