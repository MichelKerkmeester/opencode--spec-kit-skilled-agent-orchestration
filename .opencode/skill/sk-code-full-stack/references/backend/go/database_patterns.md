---
title: Database Patterns - GORM Repository and Transaction Patterns
description: Guidelines for working with databases in backend systems, covering the generic repository pattern, transaction management, entity definitions, and query patterns using GORM.
---

# Database Patterns - GORM Repository and Transaction Patterns

Guidelines for working with databases in backend systems, covering the generic repository pattern, transaction management, entity definitions, and query patterns using GORM.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose


- **Repository pattern** - Generic `database.Repository[T]` for all data access
- **Transaction management** - Data layer-based transaction handling
- **Entity modeling** - GORM entity definitions with proper types
- **Query patterns** - Complex queries, JSON operations, and pipelines

### Progressive Disclosure

```
Level 1: This file (database_patterns.md)
         - Repository pattern, transactions, entity definitions
            |
Level 2: Related knowledge files
         |- domain_layers.md - Generic service pattern with transactions
         |- go_standards.md - Project structure and naming
         +- database_patterns_gorm_type_mappings.md - GORM type mappings
```

### When to Use This File

- Implementing new repositories
- Working with database transactions
- Defining new entities
- Writing complex queries

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:data-layer-architecture -->
## 2. DATA LAYER ARCHITECTURE

### How Do I Structure a Data Layer?

Each domain has a data layer that consolidates all repositories:

```go
type PaymentsDataLayer struct {
    layer.GenericDataLayer
    config                             PaymentsDataLayerConfiguration
    CouponRepository                   payments_repositories.CouponRepository
    BillableItemRepository             payments_repositories.BillableItemsRepository
    WalletRepository                   payments_repositories.WalletRepository
    WalletSubscriptionRepository       payments_repositories.WalletSubscriptionRepository
    PaymentProviderEventRepository     payments_repositories.PaymentProviderEventsRepository
    // ... more repositories
}

func NewPaymentDataLayer(_ context.Context, orm *database.Orm, layerConfig PaymentsDataLayerConfiguration) (PaymentsDataLayer, error) {
    return PaymentsDataLayer{
        GenericDataLayer:         layer.NewGenericDataLayer(orm),
        config:                   layerConfig,
        CouponRepository:         payments_repositories.NewCouponRepository(orm.DB),
        BillableItemRepository:   payments_repositories.NewBillableItemsRepository(orm.DB),
        WalletRepository:         payments_repositories.NewWalletRepository(orm.DB),
        // ... initialize other repositories
    }, nil
}
```

**Key Principles**:
- One data layer per domain
- Embeds `GenericDataLayer` for common functionality (Health, Transaction, Connection)
- Aggregates all repositories for the domain
- Registered via DI system

---

<!-- /ANCHOR:data-layer-architecture -->
<!-- ANCHOR:repository-pattern -->
## 3. REPOSITORY PATTERN

### How Do I Create a Repository?

All repositories use the generic `database.Repository[T]` pattern:

```go
type WalletRepository struct {
    database.Repository[WalletRepository]
}

func NewWalletRepository(db *database.DB) WalletRepository {
    return WalletRepository{database.NewRepository(db, NewWalletRepository)}
}
```

**The generic repository provides**:
- `WithTx(*database.DB)` - Creates a copy with transaction
- `Transaction(handler, opts)` - Manages transactions
- Access to underlying DB via `.DB`

### How Do I Implement CRUD Operations?

**Create with auto-generated ID**:
```go
func (r WalletRepository) Create(
    entityID uid.UID,
    entityType string,
    metadata database_models.JSONB,
) (payments_entities.Wallet, error) {
    wallet := payments_entities.Wallet{
        ID:         uidgen.Wallet(),
        EntityID:   entityID,
        EntityType: entityType,
        Metadata:   metadata,
    }
    return wallet, r.DB.Model(&payments_entities.Wallet{}).Create(&wallet).Error
}
```

**Get by ID**:
```go
func (r WalletRepository) GetByID(ID uid.UID) (wallet payments_entities.Wallet, err error) {
    return wallet, r.DB.
        Model(&payments_entities.Wallet{}).
        Where("id = ?", ID).
        First(&wallet).Error
}
```

**Update specific field**:
```go
func (r WalletRepository) UpdateMetadata(walletID uid.UID, metadata database_models.JSONB) error {
    return r.DB.
        Model(&payments_entities.Wallet{}).
        Where("id = ?", walletID).
        Update("metadata", metadata).Error
}
```

**Delete**:
```go
func (r WalletRepository) Delete(walletID uid.UID) error {
    return r.DB.
        Model(&payments_entities.Wallet{}).
        Where("id = ?", walletID).
        Delete(&payments_entities.Wallet{}).
        Error
}
```

**Repository Patterns**:
- Methods return entities and error
- Use GORM's fluent API for queries
- Always specify model with `.Model()`
- Return GORM errors directly (handled by upper layers)
- Use typed UIDs for IDs

---

<!-- /ANCHOR:repository-pattern -->
<!-- ANCHOR:transactions -->
## 4. TRANSACTIONS

### How Do I Use Data Layer Transactions?

The `GenericDataLayer` provides transaction handling:

```go
func (l GenericDataLayer) Transaction(ctx context.Context, handler func(db *database.DB) error, opts ...*database.TxOptions) (err error) {
    return database.NewRepository(l.Connection(ctx), func(db *database.DB) any {
        panic("wrong GenericDataLayer usage of transaction")
    }).Transaction(handler, opts...)
}
```

### How Do I Use Transactions in Services?

Services use data layer transactions:

```go
func (s WalletService) GetAll(ctx context.Context, queryParams map[string][]string) (operators.PaginatedResult[[]payments_entities.Wallet], error) {
    var (
        walletEntities []payments_entities.Wallet
        records        *operators.UntypedPaginatedResult
        err            error
    )

    err = s.paymentsDataLayer.Transaction(ctx, func(tx *database.DB) error {
        txWalletRepo := s.paymentsDataLayer.WalletRepository.WithTx(tx)

        records, err = txWalletRepo.GetAllThroughPipeline(ctx, pipeline.NewPipeline(...))
        if err != nil {
            return err
        }

        return nil
    }, &database.TxOptions{
        Isolation: database.IsolationLevelReadCommitted,
        ReadOnly:  true,
    })

    if err != nil {
        return operators.PaginatedResult[[]payments_entities.Wallet]{}, err
    }

    return operators.PaginatedResult[[]payments_entities.Wallet]{
        UntypedPaginatedResult: *records,
        Data:                   walletEntities,
    }, nil
}
```

**Transaction Patterns**:
1. Call `dataLayer.Transaction(ctx, handler, opts)`
2. Inside handler, create tx-aware repositories with `repo.WithTx(tx)` - no nil check needed
3. Perform all operations within transaction
4. Return errors to trigger rollback
5. Specify transaction options (isolation level, read-only)

### How Do I Use Repository WithTx?

The `WithTx` method creates a transaction-aware copy of the repository. **It handles nil transactions internally**, so you don't need to check `TxNil()` before calling it:

```go
// CORRECT - Simple, clean pattern (standard across all services)
func (s WalletService) CreateWalletWithID(
    _ context.Context,
    id uid.UID,
    entityID uid.UID,
    entityType string,
    metadata database_models.JSONB,
) (payments_entities.Wallet, error) {
    txWalletRepo := s.paymentsDataLayer.WalletRepository.WithTx(s.Tx)

    if !uidgen.IsWallet(id) {
        return payments_entities.Wallet{}, errors.New("Invalid ULID for wallet").WithErrorCode(errors.DBInvalidValueErrorCode)
    }

    return txWalletRepo.CreateWithID(id, entityID, entityType, metadata)
}
```

**How `WithTx(tx)` works internally:**
- If `tx` is `nil` then returns the original repository instance (no-op)
- If `tx` is not `nil` then returns a new repository instance with the transaction applied

This design means you can always call `WithTx(s.Tx)` unconditionally, regardless of whether the service is running inside a transaction or not.

**DEPRECATED - Don't do this:**
```go
// Unnecessary - the TxNil() check is redundant since WithTx handles nil internally
txRepo := s.dataLayer.MyRepository
if !s.TxNil() {
    txRepo = txRepo.WithTx(s.Tx)
}
```

**Key Point**: Services receive transactions from `services.Service[T]` and pass them to repositories via `WithTx()`. The method's nil-safety makes transaction handling consistent whether the service method is called standalone or within a transaction context.

---

<!-- /ANCHOR:transactions -->
<!-- ANCHOR:entities -->
## 5. ENTITIES

### How Do I Define an Entity?

Entities are defined in `{domain}_data_layer/{domain}_entities/`:

```go
type Wallet struct {
    database_models.SoftDeletable  // Provides ID, CreatedAt, UpdatedAt, DeletedAt

    ID         uid.UID               `gorm:"primaryKey;type:uuid"`
    EntityID   uid.UID               `gorm:"type:uuid"`
    EntityType string                `gorm:"type:text"`
    Metadata   database_models.JSONB `gorm:"type:jsonb;not null"`
}

func (Wallet) TableName() string {
    return "wallets"
}
```

**Entity Patterns**:
- Embed `database_models.SoftDeletable` for standard fields (ID, CreatedAt, UpdatedAt, DeletedAt)
- Use `uid.UID` for IDs
- Use `database_models.JSONB` for JSON columns
- Define `TableName()` method
- Use GORM struct tags for schema definition

### How Do I Define Activity Log Entities?

Pattern for tracking changes:

```go
type WalletActivityLog struct {
    database_models.SoftDeletable

    ID         uid.UID                                  `gorm:"primaryKey;type:uuid"`
    EntityType payments.WalletActivityLogEntityTypeEnum `gorm:"type:text"`
    EntityID   uid.UID                                  `gorm:"type:uuid"`
    Action     payments.WalletActivityLogActionEnum     `gorm:"type:text;not null"`
    Before     database_models.JSONB                    `gorm:"type:json;not null"`
    After      database_models.JSONB                    `gorm:"type:json;not null"`
    Metadata   database_models.JSONB                    `gorm:"type:jsonb;not null"`
}
```

---

<!-- /ANCHOR:entities -->
<!-- ANCHOR:query-patterns -->
## 6. QUERY PATTERNS

### How Do I Write Complex Queries with Joins?

```go
func (r WalletRepository) GetWithMoreThanOneActiveWalletSubscription(
    walletSubscriptionType payments.WalletSubscriptionTypeEnum,
    page int, perPage int,
) (wallets []payments_entities.Wallet, err error) {
    return wallets, r.DB.
        Model(&payments_entities.Wallet{}).
        Joins("JOIN wallet_subscriptions on wallets.id = wallet_subscriptions.wallet_id").
        Where("wallet_subscriptions.status = ?", payments.WalletSubscriptionStatusActive).
        Where("wallet_subscriptions.type = ?", walletSubscriptionType).
        Group("wallets.id").
        Having("COUNT(*) > 1").
        Limit(perPage).
        Offset(perPage * page).
        Find(&wallets).Error
}
```

### How Do I Query JSON Columns?

Query into JSONB columns:

```go
func (r WalletRepository) GetByProviderID(provider payments.PaymentProviderEnum, providerID string) (wallet payments_entities.Wallet, err error) {
    return wallet, r.DB.
        Model(&payments_entities.Wallet{}).
        Where("metadata -> 'provider_mappings' ->> ? = ?", provider, providerID).
        First(&wallet).Error
}
```

### How Do I Use Pipeline Queries?

Use pipelines for complex filtering/pagination:

```go
func (r WalletRepository) GetAllThroughPipeline(ctx context.Context, pipe *pipeline.Pipeline) (*operators.UntypedPaginatedResult, error) {
    db := r.DB.Model(&payments_entities.Wallet{})

    exec, err := pipe.ExecWithPassable(ctx, operators.NewResult(db))
    if err != nil {
        return nil, err
    }

    if exec.Error() != nil {
        return nil, exec.Error()
    }

    result, ok := exec.GetPassable().(*operators.UntypedPaginatedResult)
    if !ok {
        return nil, errors.New("cannot get paginated result")
    }

    return result, nil
}
```

---

<!-- /ANCHOR:query-patterns -->
<!-- ANCHOR:gorm-relationships-and-soft-delete-pitfalls -->
## 7. GORM RELATIONSHIPS AND SOFT-DELETE PITFALLS

### The Problem: Nil Pointer Relations

When using GORM's `Joins()` with **pointer relation fields**, GORM respects soft-delete filters by default. If the related record is soft-deleted (`deleted_at IS NOT NULL`), the pointer remains `nil`, causing panics when accessing nested fields.

**Example Scenario**:
```go
// Entity definition with pointer relation
type User struct {
    ProfileID uint
    Profile   *profile_entities.Profile  // Pointer - can be nil!
}

// Repository query using Joins
func (r UsersRepository) GetAllThroughPipeline(...) {
    db := r.DB.Model(&User{}).
        Joins("Profile").           // GORM loads Profile, but respects soft-delete
        Joins("Profile.Images")     // Nested join
    // ...
}
```

**What happens**: If `Profile` is soft-deleted, GORM does NOT load it leading to `user.Profile` is `nil` which means accessing `user.Profile.Images.URL` panics.

### The Pattern: Safe Nil-Checking in Adapters

**BAD - Will panic if Profile is soft-deleted or missing**:
```go
func (a UserAdapter) AdaptShort(user users_entities.User) users_models.UsersShortView {
    return users_models.UsersShortView{
        ProfileID: user.ProfileID,
        ImageURL:  user.Profile.Images.URL,  // PANIC if Profile is nil!
    }
}
```

**GOOD - Safe access with nil check**:
```go
func (a UserAdapter) AdaptShort(user users_entities.User) users_models.UsersShortView {
    var imageURL string
    if user.Profile != nil {
        imageURL = user.Profile.Images.URL
    }

    return users_models.UsersShortView{
        ProfileID: user.ProfileID,
        ImageURL:  imageURL,
    }
}
```

### Understanding Struct vs Pointer Relations

| Type | Example | Nil Risk | Notes |
|------|---------|----------|-------|
| **Pointer** | `Profile *profile_entities.Profile` | **YES** | Can be `nil` if not loaded or soft-deleted |
| **Struct** | `Images media_entities.Image` | No | Zero-value struct, safe to access fields |

**Nested Access Safety**:
- `user.Profile.Images.URL` - `Profile` is pointer (unsafe), `Images` is struct (safe after nil-check)
- Always check the **pointer** in the chain, struct fields after that are safe

### Diagnostic SQL for Debugging

When you encounter nil pointer panics in adapters, run this diagnostic:

```sql
-- Check if related records are soft-deleted
SELECT
    u.id AS user_id,
    u.profile_id,
    p.id AS profile_table_id,
    p.deleted_at AS profile_deleted_at,
    CASE WHEN p.deleted_at IS NOT NULL THEN 'SOFT-DELETED' ELSE 'ACTIVE' END AS status
FROM users u
LEFT JOIN "profile" p ON p.id = u.profile_id
WHERE u.profile_id IN (1931, 1775, 894, 1261, 1164, 1715);
```

**Signs of this issue**:
- `profile_table_id` is NOT NULL but `profile_deleted_at` IS NOT NULL: soft-deleted
- `profile_table_id` IS NULL: foreign key references non-existent record

### When Does This Happen?

1. **Soft-deleted related records** - Profile deleted but User still references them
2. **Orphaned foreign keys** - Related record hard-deleted without cascade
3. **Data inconsistency** - FK constraint not enforced at DB level
4. **Race conditions** - Record deleted between query planning and execution

### Options for Handling

| Approach | Pros | Cons | Use When |
|----------|------|------|----------|
| **Nil-check in adapter** | Simple, explicit | Must remember everywhere | Default approach |
| **`Unscoped()` in query** | Loads soft-deleted | May expose deleted data | Need full history |
| **Filter orphans in query** | Clean data returned | More complex query | Performance critical |

**Using Unscoped (loads soft-deleted records)**:
```go
db.Model(&User{}).
    Joins("JOIN \"profile\" p ON p.id = users.profile_id").  // Raw join
    Unscoped()  // Includes soft-deleted
```

**Filter orphans in query**:
```go
db.Model(&User{}).
    Joins("Profile").
    Where("\"Profile\".id IS NOT NULL")  // Exclude where join failed
```

---

<!-- /ANCHOR:gorm-relationships-and-soft-delete-pitfalls -->
<!-- ANCHOR:rules -->
## 8. RULES

### ✅ ALWAYS

1. **Use `database.Repository[T]`** for all repositories
2. **Create tx-aware repos with `WithTx(tx)`** in transactions - no nil check needed, `WithTx` handles nil internally
3. **Embed `GenericDataLayer`** in data layers
4. **Define entities with GORM tags** - Proper type mappings
5. **Use typed UIDs** (`uid.UID`) for IDs
6. **Return errors directly from GORM** - Let upper layers handle
7. **Use `database_models.JSONB`** for JSON columns
8. **Specify transaction isolation levels** - Appropriate for use case
9. **Use `.Model(&Entity{})`** before GORM operations
10. **Nil-check pointer relations in adapters** before accessing nested fields (see section 7)

### ❌ NEVER

1. **Create transactions manually** - Use data layer's `Transaction()`
2. **Mix transactional and non-transactional** repository access
3. **Forget to pass transaction** to repositories via `WithTx`
4. **Return database entities to HTTP layer** - Use business models
5. **Ignore GORM errors** - Always handle/propagate
6. **Use string IDs** - Use `uid.UID`
7. **Skip `.Model()` in queries** - Required for proper table targeting
8. **Use raw SQL without justification** - Prefer GORM's fluent API
9. **Access nested fields on pointer relations without nil-checking** (e.g., `entity.Relation.Field` where `Relation` is a pointer) - causes panics with soft-deleted records

### ⚠️ ESCALATE IF

1. **Complex joins needed** - May require query optimization
2. **Performance issues** - Transaction isolation or query tuning needed
3. **Schema changes** - Requires migration planning
4. **New GORM pattern needed** - Consult team before introducing

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

| File                                                                                 | Purpose                                               |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| [domain_layers.md](./domain_layers.md)                                               | Generic service pattern, transaction flow in services |
| [go_standards.md](./go_standards.md)                                                 | Project structure, naming conventions                 |
| [database_patterns_gorm_type_mappings.md](./database_patterns_gorm_type_mappings.md) | GORM type mappings reference                          |
| [models_vs_entities_and_adapters.md](./models_vs_entities_and_adapters.md)           | Entity/model boundaries                               |
<!-- /ANCHOR:related-resources -->
