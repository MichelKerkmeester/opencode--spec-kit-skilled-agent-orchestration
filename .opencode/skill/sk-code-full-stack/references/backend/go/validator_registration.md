---
title: Validator Registration - Enum and Custom Validation Patterns
description: How to register validators for enum types and custom validation rules across microservices and lambdas in backend systems.
---

# Validator Registration - Enum and Custom Validation Patterns

How to register validators for enum types and custom validation rules across microservices and lambdas in backend systems.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This document explains how validation works in backend systems, specifically how to register custom validators (like enum validators) in microservices and lambdas. **Missing validator registration is a common cause of 500 errors** when validation tags reference undefined validators.

### Common Error Pattern

When you see an error like:
```
Undefined validation function 'isEnum:UserGender' on field 'Gender'
```

This means the `UserGender` enum validator was never registered in the service handling the request.

### File Relationships

```
validator_registration.md (this file)
    ├── Validator definitions → pkg/models/validators/*.go
    ├── Validation bundle → bundles/validations_bundle.go
    ├── Injection tokens → infra/di/injection_tokens.go
    ├── Request models → pkg/models/*/requests.go
    └── Organizations enums → pkg/models/organizations_enums/
```

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:validation-system-architecture -->
## 2. VALIDATION SYSTEM ARCHITECTURE

### 2.1 How Validation Works

1. **Request models** use struct tags like `validate:"isEnum:UserGender"`
2. **Validators** must be registered before they can be used
3. **ValidationsBundle** registers validators based on injection token
4. **Each microservice/lambda** must register the validators it needs

### 2.2 The ValidationsBundle

Located in `bundles/validations_bundle.go`, this bundle registers different validator sets based on injection tokens:

```go
func RegisterValidationBundle(dictx di.Context, opts *di.RegistryOpts) (*ValidationsBundle, error) {
    switch opts.InjectionToken {
    case coredi.RegistryTokenPaymentsValidators:
        validators.V, err = validators.New(
            validators.IsEnumValidator("BillableItemTypeEnum", payments.BillableItemTypeEnumList()),
            // ...
        )
    case coredi.RegistryTokenMediaValidators:
        validators.V, err = validators.New(
            validators.IsEnumValidator("MediaObjectTypeEnum", media_enums.MediaObjectTypeEnumList()),
            // ...
        )
    case coredi.RegistryTokenAuthenticationValidators:
        validators.V, err = validators.New(
            validators.IsEnumValidator("SessionChannel", session_manager_models.SessionChannelList),
            validators.IsEnumValidator("UserGender", users_enums.UserGenderList),
            validators.IsEnumValidator("VendorOrganizationSize", vendors_enums.VendorOrganizationSizeEnumList()),
            validators.IsEnumValidator("VendorReference", vendors_enums.VendorReferenceEnumList()),
            validators.IsOver18Validator(),
            validators.NotEqualValidator,
            validators.TodayOrBefore,
        )
    // ... more cases
    }
}
```

### 2.3 Available Validator Tokens

| Token | Validators Included | Used By |
|-------|---------------------|---------|
| `RegistryTokenPaymentsValidators` | BillableItemTypeEnum, PaymentProviderEnum, BillableItemStatusEnum, BillableItemForEnum, CurrencyEnum | ms_payments |
| `RegistryTokenMediaValidators` | MediaObjectTypeEnum, UploadProcessStatusEnum | ms_media |
| `RegistryTokenAuthenticationValidators` | SessionChannel, UserGender, VendorOrganizationSize, VendorReference, IsOver18, NotEqual, TodayOrBefore | ms_authentication, ms_core |
| `RegistryTokenVendorsValidators` | VendorSocialMediaType, AIEnhancedType, LocationPublicationStatus, ReportReason, **OrganizationState**, NoDuplicates, **OrganizationLocationTypeEnum** | ms_vendors |
| `RegistryTokenOrdersValidators` | NotEqual, TodayOrLater, DateAfter, NoDuplicates, IsWeekday, IsHashtag, OrderStatus, OrderType, ScheduleType, OrderGenderEnum, AIEnhancedType, MetricsTargetType, Metric, ReportReason, ApplicationDeclinedRemark, ApplicationCancelledRemark, ReviewPositiveRemarks, ReviewNegativeRemarks, Conditional | ms_orders |
| `RegistryTokenFeedValidators` | MapContainsRule, SliceContainsRule, NotRepeated, NotEqual, IsBool, FeedTypeEnum, FeedStatusEnum, FeedBlockTypeEnum, FeedBlockStatusEnum, FeedContentTypeEnum, FeedPlatformEnum | ms_feed |

**Note:** Organizations domain validators (OrganizationState, OrganizationLocationTypeEnum) are registered under `RegistryTokenVendorsValidators`.

---

<!-- /ANCHOR:validation-system-architecture -->
<!-- ANCHOR:registering-validators-in-microservices -->
## 3. REGISTERING VALIDATORS IN MICROSERVICES

### 3.1 The Problem

A microservice that handles requests with validation tags **must register the corresponding validators**. If validators aren't registered, any request that triggers validation will fail with:
```
Undefined validation function 'isEnum:EnumName' on field 'FieldName'
```

### 3.2 How to Register Validators

Add the ValidationsBundle creation in the microservice's registry function:

```go
// internal/ms/ms_your_service/registry.go

func RegistryYourMicroservice(dictx di.Context, opts *di.RegistryOpts) (*YourMicroservice, error) {
    // ... other setup ...

    // Register validators BEFORE any handlers that need them
    _, err = di.Create[*bundles.ValidationsBundle](
        dictx,
        di.WithOpts(opts),
        di.WithToken(coredi.RegistryTokenAuthenticationValidators),  // Choose appropriate token
    )
    if err != nil {
        return nil, err
    }

    // ... rest of setup ...
}
```

### 3.3 Real Example: ms_core Profile Endpoints

**The Problem:**
The `ms_core` microservice has endpoints at `/backoffice/profile/{user_id}/{field}` that update profile fields. The request model `BackOfficeUpdateProfileRequest` has:

```go
// pkg/models/profile_models/requests.go
type BackOfficeUpdateProfileRequest struct {
    Name         string                         `json:"name,omitempty"`
    Gender       users_enums.UserGender         `json:"gender,omitempty" validate:"isEnum:UserGender"`
    Birthday     time.Time                      `json:"birthday,omitempty"`
    // ...
}
```

**The Fix:**
Add validator registration in `internal/ms/ms_core/registry.go`:

```go
func RegistryCoreMicroservice(dictx di.Context, opts *di.RegistryOpts) (*CoreMicroservice, error) {
    // ... existing setup ...

    _, err = di.Create[*bundles.S3BucketBundle](dictx, di.WithOpts(opts), di.WithToken(coredi.RegistryS3BucketBundle))
    if err != nil {
        return nil, err
    }

    // ADD THIS: Register validators for profile update endpoints (Gender enum validation)
    _, err = di.Create[*bundles.ValidationsBundle](dictx, di.WithOpts(opts), di.WithToken(coredi.RegistryTokenAuthenticationValidators))
    if err != nil {
        return nil, err
    }

    serverBundle, err := di.Create[*bundles.HttpServerBundle](dictx, di.WithOpts(opts), di.WithToken(coredi.RegistryTokenHTTPServerBundle))
    // ...
}
```

---

<!-- /ANCHOR:registering-validators-in-microservices -->
<!-- ANCHOR:registering-validators-in-lambdas -->
## 4. REGISTERING VALIDATORS IN LAMBDAS

### 4.1 Lambda Validator Registration

Lambdas register validators in their `lambda.go` file during initialization:

```go
// internal/lambdas/api_profile/lambda.go

func NewAPIProfileLambda(ctx context.Context) (*APIProfileLambda, error) {
    // ...

    // Register validators
    validators.V, err = validators.New(
        validators.IsEnumValidator("UserGender", users_enums.UserGenderList),
        validators.IsEnumValidator[users_enums.UserGender]("UserGender", users_enums.UserGenderList),
        // ... other validators
    )
    if err != nil {
        return nil, err
    }

    // ...
}
```

### 4.2 Lambdas That Already Have Validators

Check these files for examples:
- `internal/lambdas/api_auth_registration/lambda.go` - Has `UserGender` validator
- `internal/lambdas/api_profile/lambda.go` - Has `UserGender` validator

---

<!-- /ANCHOR:registering-validators-in-lambdas -->
<!-- ANCHOR:debugging-checklist -->
## 5. DEBUGGING CHECKLIST

When you encounter "Undefined validation function" errors:

### Step 1: Identify the Validator Name
```
Undefined validation function 'isEnum:UserGender' on field 'Gender'
                              ^^^^^^^^^^^^^^^^^^^^
```
The validator name is `UserGender`.

### Step 2: Find Which Token Registers It
```bash
grep -r "UserGender" bundles/validations_bundle.go
```
Output shows it's in `RegistryTokenAuthenticationValidators`.

### Step 3: Check if Microservice Registers That Token
```bash
grep -r "RegistryTokenAuthenticationValidators" internal/ms/ms_your_service/
```
If no results, the validators aren't registered.

### Step 4: Add the Registration
Add to the microservice's registry function:
```go
_, err = di.Create[*bundles.ValidationsBundle](dictx, di.WithOpts(opts), di.WithToken(coredi.RegistryTokenAuthenticationValidators))
```

---

<!-- /ANCHOR:debugging-checklist -->
<!-- ANCHOR:creating-new-validators -->
## 6. CREATING NEW VALIDATORS

### 6.1 Adding to Existing Token

If your validator fits an existing category, add it to `bundles/validations_bundle.go`:

```go
case coredi.RegistryTokenAuthenticationValidators:
    validators.V, err = validators.New(
        // Existing validators...
        validators.IsEnumValidator("YourNewEnum", your_enums.YourEnumList),  // Add here
    )
```

### 6.2 Creating a New Token

For a new validator category:

1. **Add token in `infra/di/injection_tokens.go`:**
```go
RegistryTokenYourValidators = pdi.RegisterInjectionToken("your_validators")
```

2. **Add case in `bundles/validations_bundle.go`:**
```go
case coredi.RegistryTokenYourValidators:
    validators.V, err = validators.New(
        validators.IsEnumValidator("YourEnum", your_enums.YourEnumList),
    )
```

3. **Register in your microservice:**
```go
_, err = di.Create[*bundles.ValidationsBundle](dictx, di.WithOpts(opts), di.WithToken(coredi.RegistryTokenYourValidators))
```

---

<!-- /ANCHOR:creating-new-validators -->
<!-- ANCHOR:rules -->
## 7. RULES

### ✅ ALWAYS

- Register validators BEFORE handlers that use them
- Check which validator token contains the validators you need
- Test endpoints after adding new validation tags
- Register validators in both microservices AND lambdas that use them

### ❌ NEVER

- Assume validators are globally available
- Add validation tags without ensuring the validator is registered
- Skip validator registration for "simple" services

### ⚠️ ESCALATE IF

- You need a validator that doesn't fit any existing token category
- Multiple services need conflicting validator configurations
- Validation errors occur only in specific environments

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

| Topic | Location | Description |
|-------|----------|-------------|
| Validation bundle | `bundles/validations_bundle.go` | Central validator registration |
| Validators package | `pkg/models/validators/` | Validator implementations |
| Injection tokens | `infra/di/injection_tokens.go` | Token definitions |
| Request models | `pkg/models/*/requests.go` | Models with validation tags |
| DI Configuration | [di_configuration.md](./di_configuration.md) | DI system patterns |
<!-- /ANCHOR:related-resources -->
