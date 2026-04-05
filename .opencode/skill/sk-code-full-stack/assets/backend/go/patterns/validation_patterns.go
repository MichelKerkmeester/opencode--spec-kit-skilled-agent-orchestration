/* ─────────────────────────────────────────────────────────────
   Validation Patterns - Custom Validator Registration Templates

   Production-ready templates for validation in Go including:
   - Custom validator registration
   - Enum validation
   - Struct validation
   - Error message formatting
   - Conditional validation

   Usage: Copy and adapt these patterns for your validation requirements.
──────────────────────────────────────────────────────────────── */

package patterns

import (
	"fmt"
	"reflect"
	"regexp"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
)

/* ─────────────────────────────────────────────────────────────
   1. VALIDATOR REGISTRY
──────────────────────────────────────────────────────────────── */

// ValidatorRegistry manages custom validators.
type ValidatorRegistry struct {
	v          *validator.Validate
	enumLists  map[string][]string
	registered map[string]bool
}

// NewValidatorRegistry creates a new validator registry.
func NewValidatorRegistry() *ValidatorRegistry {
	v := validator.New()

	// Register custom tag name function to use json tags
	v.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})

	return &ValidatorRegistry{
		v:          v,
		enumLists:  make(map[string][]string),
		registered: make(map[string]bool),
	}
}

// Validator returns the underlying validator instance.
func (r *ValidatorRegistry) Validator() *validator.Validate {
	return r.v
}

// ValidateStruct validates a struct and returns formatted errors.
func (r *ValidatorRegistry) ValidateStruct(s interface{}) map[string]string {
	err := r.v.Struct(s)
	if err == nil {
		return nil
	}

	var validationErrors validator.ValidationErrors
	if ok := err.(validator.ValidationErrors); ok != nil {
		validationErrors = ok
	} else {
		return map[string]string{"_error": "validation failed"}
	}

	errors := make(map[string]string)
	for _, e := range validationErrors {
		errors[e.Field()] = formatValidationMessage(e)
	}

	return errors
}

// formatValidationMessage creates a human-readable validation message.
func formatValidationMessage(e validator.FieldError) string {
	switch e.Tag() {
	case "required":
		return "This field is required"
	case "email":
		return "Must be a valid email address"
	case "min":
		return fmt.Sprintf("Must be at least %s characters", e.Param())
	case "max":
		return fmt.Sprintf("Must be at most %s characters", e.Param())
	case "uuid":
		return "Must be a valid UUID"
	case "oneof":
		return fmt.Sprintf("Must be one of: %s", e.Param())
	case "url":
		return "Must be a valid URL"
	case "gte":
		return fmt.Sprintf("Must be greater than or equal to %s", e.Param())
	case "lte":
		return fmt.Sprintf("Must be less than or equal to %s", e.Param())
	case "isEnum":
		return fmt.Sprintf("Must be a valid %s value", e.Param())
	case "isOver18":
		return "Must be 18 years or older"
	case "notEqual":
		return fmt.Sprintf("Must not equal %s", e.Param())
	case "todayOrBefore":
		return "Must be today or before"
	case "todayOrLater":
		return "Must be today or later"
	case "noDuplicates":
		return "Must not contain duplicate values"
	case "isWeekday":
		return "Must be a weekday"
	case "isHashtag":
		return "Must be a valid hashtag"
	default:
		return fmt.Sprintf("Failed validation: %s", e.Tag())
	}
}

/* ─────────────────────────────────────────────────────────────
   2. ENUM VALIDATION
──────────────────────────────────────────────────────────────── */

// RegisterEnumValidator registers a validator for an enum type.
// Usage: validate:"isEnum:EnumName"
func (r *ValidatorRegistry) RegisterEnumValidator(enumName string, validValues []string) error {
	tagName := fmt.Sprintf("isEnum:%s", enumName)
	if r.registered[tagName] {
		return nil // Already registered
	}

	// Store enum values for lookup
	r.enumLists[enumName] = validValues
	validSet := make(map[string]bool)
	for _, v := range validValues {
		validSet[v] = true
	}

	err := r.v.RegisterValidation(tagName, func(fl validator.FieldLevel) bool {
		value := fl.Field().String()
		return validSet[value]
	})
	if err != nil {
		return fmt.Errorf("failed to register enum validator %s: %w", enumName, err)
	}

	r.registered[tagName] = true
	return nil
}

// IsEnumValidator creates a validator function for enum validation.
// This is a factory function that returns a validator registration option.
func IsEnumValidator(enumName string, validValues []string) ValidatorOption {
	return func(r *ValidatorRegistry) error {
		return r.RegisterEnumValidator(enumName, validValues)
	}
}

// ValidatorOption is a function that registers a validator.
type ValidatorOption func(*ValidatorRegistry) error

// NewValidatorWithOptions creates a validator with multiple options.
func NewValidatorWithOptions(opts ...ValidatorOption) (*ValidatorRegistry, error) {
	r := NewValidatorRegistry()

	for _, opt := range opts {
		if err := opt(r); err != nil {
			return nil, err
		}
	}

	return r, nil
}

// Example enum type and validation:
//
//	type UserStatus string
//
//	const (
//	    UserStatusActive   UserStatus = "active"
//	    UserStatusInactive UserStatus = "inactive"
//	    UserStatusPending  UserStatus = "pending"
//	)
//
//	func UserStatusList() []string {
//	    return []string{
//	        string(UserStatusActive),
//	        string(UserStatusInactive),
//	        string(UserStatusPending),
//	    }
//	}
//
//	// Request struct with enum validation
//	type UpdateUserRequest struct {
//	    Status UserStatus `json:"status" validate:"required,isEnum:UserStatus"`
//	}
//
//	// Registration
//	registry, _ := NewValidatorWithOptions(
//	    IsEnumValidator("UserStatus", UserStatusList()),
//	)

/* ─────────────────────────────────────────────────────────────
   3. DATE/TIME VALIDATORS
──────────────────────────────────────────────────────────────── */

// IsOver18Validator validates that a date is at least 18 years ago.
func IsOver18Validator() ValidatorOption {
	return func(r *ValidatorRegistry) error {
		return r.v.RegisterValidation("isOver18", func(fl validator.FieldLevel) bool {
			date, ok := fl.Field().Interface().(time.Time)
			if !ok {
				return false
			}

			eighteenYearsAgo := time.Now().AddDate(-18, 0, 0)
			return date.Before(eighteenYearsAgo) || date.Equal(eighteenYearsAgo)
		})
	}
}

// TodayOrBeforeValidator validates that a date is today or before.
func TodayOrBeforeValidator() ValidatorOption {
	return func(r *ValidatorRegistry) error {
		return r.v.RegisterValidation("todayOrBefore", func(fl validator.FieldLevel) bool {
			date, ok := fl.Field().Interface().(time.Time)
			if !ok {
				return false
			}

			today := time.Now().Truncate(24 * time.Hour)
			dateOnly := date.Truncate(24 * time.Hour)
			return dateOnly.Before(today) || dateOnly.Equal(today)
		})
	}
}

// TodayOrLaterValidator validates that a date is today or later.
func TodayOrLaterValidator() ValidatorOption {
	return func(r *ValidatorRegistry) error {
		return r.v.RegisterValidation("todayOrLater", func(fl validator.FieldLevel) bool {
			date, ok := fl.Field().Interface().(time.Time)
			if !ok {
				return false
			}

			today := time.Now().Truncate(24 * time.Hour)
			dateOnly := date.Truncate(24 * time.Hour)
			return dateOnly.After(today) || dateOnly.Equal(today)
		})
	}
}

// DateAfterValidator validates that a date field is after another field.
// Usage: validate:"dateAfter=StartDate"
func DateAfterValidator() ValidatorOption {
	return func(r *ValidatorRegistry) error {
		return r.v.RegisterValidation("dateAfter", func(fl validator.FieldLevel) bool {
			date, ok := fl.Field().Interface().(time.Time)
			if !ok {
				return false
			}

			otherFieldName := fl.Param()
			otherField := fl.Parent().FieldByName(otherFieldName)
			if !otherField.IsValid() {
				return false
			}

			otherDate, ok := otherField.Interface().(time.Time)
			if !ok {
				return false
			}

			return date.After(otherDate)
		})
	}
}

// IsWeekdayValidator validates that a date falls on a weekday.
func IsWeekdayValidator() ValidatorOption {
	return func(r *ValidatorRegistry) error {
		return r.v.RegisterValidation("isWeekday", func(fl validator.FieldLevel) bool {
			date, ok := fl.Field().Interface().(time.Time)
			if !ok {
				return false
			}

			weekday := date.Weekday()
			return weekday != time.Saturday && weekday != time.Sunday
		})
	}
}

/* ─────────────────────────────────────────────────────────────
   4. COLLECTION VALIDATORS
──────────────────────────────────────────────────────────────── */

// NoDuplicatesValidator validates that a slice contains no duplicate values.
func NoDuplicatesValidator() ValidatorOption {
	return func(r *ValidatorRegistry) error {
		return r.v.RegisterValidation("noDuplicates", func(fl validator.FieldLevel) bool {
			field := fl.Field()
			if field.Kind() != reflect.Slice {
				return false
			}

			seen := make(map[interface{}]bool)
			for i := 0; i < field.Len(); i++ {
				val := field.Index(i).Interface()
				if seen[val] {
					return false
				}
				seen[val] = true
			}

			return true
		})
	}
}

// SliceContainsValidator validates that a slice contains a specific value.
// Usage: validate:"sliceContains=value"
func SliceContainsValidator() ValidatorOption {
	return func(r *ValidatorRegistry) error {
		return r.v.RegisterValidation("sliceContains", func(fl validator.FieldLevel) bool {
			field := fl.Field()
			if field.Kind() != reflect.Slice {
				return false
			}

			required := fl.Param()
			for i := 0; i < field.Len(); i++ {
				if fmt.Sprintf("%v", field.Index(i).Interface()) == required {
					return true
				}
			}

			return false
		})
	}
}

// MapContainsKeyValidator validates that a map contains a specific key.
// Usage: validate:"mapContainsKey=keyName"
func MapContainsKeyValidator() ValidatorOption {
	return func(r *ValidatorRegistry) error {
		return r.v.RegisterValidation("mapContainsKey", func(fl validator.FieldLevel) bool {
			field := fl.Field()
			if field.Kind() != reflect.Map {
				return false
			}

			required := fl.Param()
			for _, key := range field.MapKeys() {
				if fmt.Sprintf("%v", key.Interface()) == required {
					return true
				}
			}

			return false
		})
	}
}

/* ─────────────────────────────────────────────────────────────
   5. STRING VALIDATORS
──────────────────────────────────────────────────────────────── */

// NotEqualValidator validates that a field does not equal a specific value.
// Usage: validate:"notEqual=forbidden_value"
func NotEqualValidator() ValidatorOption {
	return func(r *ValidatorRegistry) error {
		return r.v.RegisterValidation("notEqual", func(fl validator.FieldLevel) bool {
			return fl.Field().String() != fl.Param()
		})
	}
}

// NotEqualFieldValidator validates that a field does not equal another field.
// Usage: validate:"notEqualField=OtherField"
func NotEqualFieldValidator() ValidatorOption {
	return func(r *ValidatorRegistry) error {
		return r.v.RegisterValidation("notEqualField", func(fl validator.FieldLevel) bool {
			otherFieldName := fl.Param()
			otherField := fl.Parent().FieldByName(otherFieldName)
			if !otherField.IsValid() {
				return true
			}

			return fl.Field().String() != otherField.String()
		})
	}
}

// IsHashtagValidator validates that a string is a valid hashtag.
func IsHashtagValidator() ValidatorOption {
	hashtagRegex := regexp.MustCompile(`^#[a-zA-Z][a-zA-Z0-9_]*$`)

	return func(r *ValidatorRegistry) error {
		return r.v.RegisterValidation("isHashtag", func(fl validator.FieldLevel) bool {
			return hashtagRegex.MatchString(fl.Field().String())
		})
	}
}

// IsSlugValidator validates that a string is a valid URL slug.
func IsSlugValidator() ValidatorOption {
	slugRegex := regexp.MustCompile(`^[a-z0-9]+(?:-[a-z0-9]+)*$`)

	return func(r *ValidatorRegistry) error {
		return r.v.RegisterValidation("isSlug", func(fl validator.FieldLevel) bool {
			return slugRegex.MatchString(fl.Field().String())
		})
	}
}

/* ─────────────────────────────────────────────────────────────
   6. CONDITIONAL VALIDATORS
──────────────────────────────────────────────────────────────── */

// RequiredIfValidator validates that a field is required if another field has a value.
// Usage: validate:"requiredIf=OtherField value"
func RequiredIfValidator() ValidatorOption {
	return func(r *ValidatorRegistry) error {
		return r.v.RegisterValidation("requiredIf", func(fl validator.FieldLevel) bool {
			params := strings.SplitN(fl.Param(), " ", 2)
			if len(params) != 2 {
				return true
			}

			otherFieldName := params[0]
			requiredValue := params[1]

			otherField := fl.Parent().FieldByName(otherFieldName)
			if !otherField.IsValid() {
				return true
			}

			// If the other field matches the required value, this field is required
			if fmt.Sprintf("%v", otherField.Interface()) == requiredValue {
				return !fl.Field().IsZero()
			}

			return true
		})
	}
}

// RequiredUnlessValidator validates that a field is required unless another field has a value.
// Usage: validate:"requiredUnless=OtherField value"
func RequiredUnlessValidator() ValidatorOption {
	return func(r *ValidatorRegistry) error {
		return r.v.RegisterValidation("requiredUnless", func(fl validator.FieldLevel) bool {
			params := strings.SplitN(fl.Param(), " ", 2)
			if len(params) != 2 {
				return true
			}

			otherFieldName := params[0]
			unlessValue := params[1]

			otherField := fl.Parent().FieldByName(otherFieldName)
			if !otherField.IsValid() {
				return !fl.Field().IsZero()
			}

			// If the other field does NOT match the unless value, this field is required
			if fmt.Sprintf("%v", otherField.Interface()) != unlessValue {
				return !fl.Field().IsZero()
			}

			return true
		})
	}
}

/* ─────────────────────────────────────────────────────────────
   7. VALIDATION BUNDLE PATTERN
──────────────────────────────────────────────────────────────── */

// ValidationBundle contains a configured validator for a specific context.
type ValidationBundle struct {
	Registry *ValidatorRegistry
}

// NewValidationBundle creates a new validation bundle with specified validators.
func NewValidationBundle(opts ...ValidatorOption) (*ValidationBundle, error) {
	registry, err := NewValidatorWithOptions(opts...)
	if err != nil {
		return nil, err
	}

	return &ValidationBundle{Registry: registry}, nil
}

// Validate validates a struct and returns any errors.
func (b *ValidationBundle) Validate(s interface{}) map[string]string {
	return b.Registry.ValidateStruct(s)
}

// Example usage in microservice registry:
//
//	func RegistryMicroservice(ctx context.Context) (*Microservice, error) {
//	    validationBundle, err := NewValidationBundle(
//	        IsEnumValidator("UserStatus", UserStatusList()),
//	        IsEnumValidator("UserGender", UserGenderList()),
//	        IsOver18Validator(),
//	        NoDuplicatesValidator(),
//	        NotEqualValidator(),
//	        TodayOrBeforeValidator(),
//	    )
//	    if err != nil {
//	        return nil, fmt.Errorf("failed to create validation bundle: %w", err)
//	    }
//
//	    return &Microservice{
//	        validationBundle: validationBundle,
//	    }, nil
//	}

/* ─────────────────────────────────────────────────────────────
   8. STRUCT-LEVEL VALIDATION
──────────────────────────────────────────────────────────────── */

// RegisterStructValidation registers a struct-level validation function.
func (r *ValidatorRegistry) RegisterStructValidation(fn validator.StructLevelFunc, types ...interface{}) {
	r.v.RegisterStructValidation(fn, types...)
}

// Example struct-level validation:
//
//	type DateRange struct {
//	    StartDate time.Time `json:"start_date" validate:"required"`
//	    EndDate   time.Time `json:"end_date" validate:"required"`
//	}
//
//	func DateRangeValidation(sl validator.StructLevel) {
//	    dateRange := sl.Current().Interface().(DateRange)
//
//	    if !dateRange.EndDate.After(dateRange.StartDate) {
//	        sl.ReportError(dateRange.EndDate, "end_date", "EndDate", "endDateAfterStart", "")
//	    }
//	}
//
//	// Registration:
//	registry.RegisterStructValidation(DateRangeValidation, DateRange{})

/* ─────────────────────────────────────────────────────────────
   9. CUSTOM TYPE VALIDATION
──────────────────────────────────────────────────────────────── */

// RegisterCustomTypeFunc registers a custom type validation function.
func (r *ValidatorRegistry) RegisterCustomTypeFunc(fn validator.CustomTypeFunc, types ...interface{}) {
	r.v.RegisterCustomTypeFunc(fn, types...)
}

// Example custom type validation for sql.NullString:
//
//	registry.RegisterCustomTypeFunc(func(field reflect.Value) interface{} {
//	    if nullString, ok := field.Interface().(sql.NullString); ok {
//	        if nullString.Valid {
//	            return nullString.String
//	        }
//	    }
//	    return nil
//	}, sql.NullString{})

/* ─────────────────────────────────────────────────────────────
   10. GLOBAL VALIDATOR INSTANCE
──────────────────────────────────────────────────────────────── */

// V is the global validator instance.
// Initialize this in your application startup.
var V *ValidatorRegistry

// InitGlobalValidator initializes the global validator with the given options.
func InitGlobalValidator(opts ...ValidatorOption) error {
	registry, err := NewValidatorWithOptions(opts...)
	if err != nil {
		return err
	}
	V = registry
	return nil
}

// ValidateGlobal validates a struct using the global validator.
func ValidateGlobal(s interface{}) map[string]string {
	if V == nil {
		return map[string]string{"_error": "validator not initialized"}
	}
	return V.ValidateStruct(s)
}
