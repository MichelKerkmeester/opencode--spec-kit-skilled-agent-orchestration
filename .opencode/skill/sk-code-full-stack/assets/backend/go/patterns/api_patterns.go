/* ─────────────────────────────────────────────────────────────
   API Patterns - HTTP Handler and Middleware Templates

   Production-ready templates for HTTP API implementation including:
   - HTTP handler templates (Fiber framework)
   - Middleware patterns
   - Request validation
   - Response formatting
   - Error responses

   Usage: Copy and adapt these patterns for your API handlers.
──────────────────────────────────────────────────────────────── */

package patterns

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

/* ─────────────────────────────────────────────────────────────
   1. HTTP RESPONSE TYPES
──────────────────────────────────────────────────────────────── */

// APIResponse represents a standard API response wrapper.
type APIResponse[T any] struct {
	Success bool   `json:"success"`
	Data    T      `json:"data,omitempty"`
	Error   *Error `json:"error,omitempty"`
	Meta    *Meta  `json:"meta,omitempty"`
}

// Error represents an API error response.
type Error struct {
	Code    string            `json:"code"`
	Message string            `json:"message"`
	Details map[string]string `json:"details,omitempty"`
}

// Meta contains pagination and other metadata.
type Meta struct {
	Page       int   `json:"page,omitempty"`
	PerPage    int   `json:"per_page,omitempty"`
	Total      int64 `json:"total,omitempty"`
	TotalPages int   `json:"total_pages,omitempty"`
}

// PaginatedResponse wraps paginated data.
type PaginatedResponse[T any] struct {
	Items      []T   `json:"items"`
	Page       int   `json:"page"`
	PerPage    int   `json:"per_page"`
	Total      int64 `json:"total"`
	TotalPages int   `json:"total_pages"`
}

// NewPaginatedResponse creates a paginated response.
func NewPaginatedResponse[T any](items []T, page, perPage int, total int64) PaginatedResponse[T] {
	totalPages := int(total) / perPage
	if int(total)%perPage != 0 {
		totalPages++
	}
	return PaginatedResponse[T]{
		Items:      items,
		Page:       page,
		PerPage:    perPage,
		Total:      total,
		TotalPages: totalPages,
	}
}

/* ─────────────────────────────────────────────────────────────
   2. RESPONSE HELPERS
──────────────────────────────────────────────────────────────── */

// RespondSuccess sends a successful JSON response.
func RespondSuccess[T any](c *fiber.Ctx, statusCode int, data T) error {
	return c.Status(statusCode).JSON(APIResponse[T]{
		Success: true,
		Data:    data,
	})
}

// RespondSuccessWithMeta sends a successful response with metadata.
func RespondSuccessWithMeta[T any](c *fiber.Ctx, statusCode int, data T, meta *Meta) error {
	return c.Status(statusCode).JSON(APIResponse[T]{
		Success: true,
		Data:    data,
		Meta:    meta,
	})
}

// RespondError sends an error JSON response.
func RespondError(c *fiber.Ctx, statusCode int, code, message string) error {
	return c.Status(statusCode).JSON(APIResponse[any]{
		Success: false,
		Error: &Error{
			Code:    code,
			Message: message,
		},
	})
}

// RespondErrorWithDetails sends an error response with details.
func RespondErrorWithDetails(c *fiber.Ctx, statusCode int, code, message string, details map[string]string) error {
	return c.Status(statusCode).JSON(APIResponse[any]{
		Success: false,
		Error: &Error{
			Code:    code,
			Message: message,
			Details: details,
		},
	})
}

// RespondCreated sends a 201 Created response.
func RespondCreated[T any](c *fiber.Ctx, data T) error {
	return RespondSuccess(c, fiber.StatusCreated, data)
}

// RespondOK sends a 200 OK response.
func RespondOK[T any](c *fiber.Ctx, data T) error {
	return RespondSuccess(c, fiber.StatusOK, data)
}

// RespondNoContent sends a 204 No Content response.
func RespondNoContent(c *fiber.Ctx) error {
	return c.SendStatus(fiber.StatusNoContent)
}

/* ─────────────────────────────────────────────────────────────
   3. ERROR RESPONSE HELPERS
──────────────────────────────────────────────────────────────── */

// Common error codes.
const (
	ErrorCodeValidation         = "VALIDATION_ERROR"
	ErrorCodeNotFound           = "NOT_FOUND"
	ErrorCodeUnauthorized       = "UNAUTHORIZED"
	ErrorCodeForbidden          = "FORBIDDEN"
	ErrorCodeConflict           = "CONFLICT"
	ErrorCodeInternalError      = "INTERNAL_ERROR"
	ErrorCodeBadRequest         = "BAD_REQUEST"
	ErrorCodeServiceUnavailable = "SERVICE_UNAVAILABLE"
)

// RespondValidationError sends a 400 validation error response.
func RespondValidationError(c *fiber.Ctx, details map[string]string) error {
	return RespondErrorWithDetails(c, fiber.StatusBadRequest, ErrorCodeValidation, "Validation failed", details)
}

// RespondNotFound sends a 404 not found response.
func RespondNotFound(c *fiber.Ctx, resource string) error {
	return RespondError(c, fiber.StatusNotFound, ErrorCodeNotFound, fmt.Sprintf("%s not found", resource))
}

// RespondUnauthorized sends a 401 unauthorized response.
func RespondUnauthorized(c *fiber.Ctx, message string) error {
	if message == "" {
		message = "Authentication required"
	}
	return RespondError(c, fiber.StatusUnauthorized, ErrorCodeUnauthorized, message)
}

// RespondForbidden sends a 403 forbidden response.
func RespondForbidden(c *fiber.Ctx, message string) error {
	if message == "" {
		message = "Access denied"
	}
	return RespondError(c, fiber.StatusForbidden, ErrorCodeForbidden, message)
}

// RespondConflict sends a 409 conflict response.
func RespondConflict(c *fiber.Ctx, message string) error {
	return RespondError(c, fiber.StatusConflict, ErrorCodeConflict, message)
}

// RespondInternalError sends a 500 internal error response.
func RespondInternalError(c *fiber.Ctx) error {
	return RespondError(c, fiber.StatusInternalServerError, ErrorCodeInternalError, "An internal error occurred")
}

// RespondBadRequest sends a 400 bad request response.
func RespondBadRequest(c *fiber.Ctx, message string) error {
	return RespondError(c, fiber.StatusBadRequest, ErrorCodeBadRequest, message)
}

/* ─────────────────────────────────────────────────────────────
   4. REQUEST PARSING HELPERS
──────────────────────────────────────────────────────────────── */

// ParseUUIDParam extracts and parses a UUID from route parameters.
func ParseUUIDParam(c *fiber.Ctx, param string) (uuid.UUID, error) {
	idStr := c.Params(param)
	id, err := uuid.Parse(idStr)
	if err != nil {
		return uuid.Nil, fmt.Errorf("invalid %s: must be a valid UUID", param)
	}
	return id, nil
}

// ParsePagination extracts pagination parameters from query string.
func ParsePagination(c *fiber.Ctx) (page, perPage int) {
	page, _ = strconv.Atoi(c.Query("page", "1"))
	perPage, _ = strconv.Atoi(c.Query("per_page", "20"))

	// Enforce limits
	if page < 1 {
		page = 1
	}
	if perPage < 1 {
		perPage = 20
	}
	if perPage > 100 {
		perPage = 100
	}

	return page, perPage
}

// ParseSort extracts and validates sort parameter.
func ParseSort(c *fiber.Ctx, allowedFields []string, defaultSort string) string {
	sort := c.Query("sort", defaultSort)
	field := strings.TrimPrefix(sort, "-")

	for _, allowed := range allowedFields {
		if field == allowed {
			return sort
		}
	}

	return defaultSort
}

// ParseFilters extracts filter parameters into a map.
func ParseFilters(c *fiber.Ctx, allowedFilters []string) map[string]string {
	filters := make(map[string]string)

	for _, filter := range allowedFilters {
		if value := c.Query(filter); value != "" {
			filters[filter] = value
		}
	}

	return filters
}

/* ─────────────────────────────────────────────────────────────
   5. REQUEST BODY PARSING AND VALIDATION
──────────────────────────────────────────────────────────────── */

// Validate is the shared validator instance.
var Validate = validator.New()

// BindAndValidate parses request body and validates it.
func BindAndValidate[T any](c *fiber.Ctx) (*T, map[string]string, error) {
	var req T

	if err := c.BodyParser(&req); err != nil {
		return nil, nil, fmt.Errorf("invalid request body: %w", err)
	}

	if err := Validate.Struct(req); err != nil {
		var validationErrors validator.ValidationErrors
		if errors.As(err, &validationErrors) {
			details := make(map[string]string)
			for _, e := range validationErrors {
				details[strings.ToLower(e.Field())] = formatValidationError(e)
			}
			return nil, details, err
		}
		return nil, nil, err
	}

	return &req, nil, nil
}

// formatValidationError converts a validation error to a human-readable message.
func formatValidationError(e validator.FieldError) string {
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
	default:
		return fmt.Sprintf("Failed validation: %s", e.Tag())
	}
}

/* ─────────────────────────────────────────────────────────────
   6. CONTROLLER STRUCTURE PATTERN
──────────────────────────────────────────────────────────────── */

// Controller provides a base for HTTP controllers.
type Controller struct {
	validator *validator.Validate
}

// NewController creates a new controller instance.
func NewController() *Controller {
	return &Controller{
		validator: validator.New(),
	}
}

// HTTPControllers defines the interface for controllers.
type HTTPControllers interface {
	SetupHTTP() error
}

// Example controller implementation:
//
//	type UserController struct {
//	    *Controller
//	    server        *fiber.App
//	    userService   UserServiceInterface
//	    authGate      AuthenticationGate
//	}
//
//	func NewUserController(server *fiber.App, userService UserServiceInterface, authGate AuthenticationGate) *UserController {
//	    return &UserController{
//	        Controller:  NewController(),
//	        server:      server,
//	        userService: userService,
//	        authGate:    authGate,
//	    }
//	}
//
//	func (c *UserController) SetupHTTP() error {
//	    users := c.server.Group("/users", c.authGate.Authenticated())
//
//	    // Static routes FIRST
//	    users.Get("/me", c.getCurrentUser)
//	    users.Get("/statistics", c.getStatistics)
//
//	    // Parameterized routes LAST
//	    users.Get("/:id", c.getUserByID)
//	    users.Put("/:id", c.updateUser)
//	    users.Delete("/:id", c.deleteUser)
//
//	    return nil
//	}

/* ─────────────────────────────────────────────────────────────
   7. MIDDLEWARE PATTERNS
──────────────────────────────────────────────────────────────── */

// RequestIDMiddleware adds a unique request ID to each request.
func RequestIDMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		requestID := c.Get("X-Request-ID")
		if requestID == "" {
			requestID = uuid.New().String()
		}
		c.Set("X-Request-ID", requestID)
		c.Locals("request_id", requestID)
		return c.Next()
	}
}

// LoggingMiddleware logs request details.
func LoggingMiddleware(logger Logger) fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()

		err := c.Next()

		logger.Info("HTTP Request",
			"method", c.Method(),
			"path", c.Path(),
			"status", c.Response().StatusCode(),
			"duration", time.Since(start),
			"request_id", c.Locals("request_id"),
		)

		return err
	}
}

// Logger interface for middleware logging.
type Logger interface {
	Info(msg string, keysAndValues ...interface{})
	Error(msg string, keysAndValues ...interface{})
}

// RecoveryMiddleware recovers from panics and returns 500.
func RecoveryMiddleware(logger Logger) fiber.Handler {
	return func(c *fiber.Ctx) error {
		defer func() {
			if r := recover(); r != nil {
				logger.Error("Panic recovered",
					"error", r,
					"path", c.Path(),
					"request_id", c.Locals("request_id"),
				)
				_ = RespondInternalError(c)
			}
		}()
		return c.Next()
	}
}

// TimeoutMiddleware adds request timeout.
func TimeoutMiddleware(timeout time.Duration) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ctx, cancel := context.WithTimeout(c.Context(), timeout)
		defer cancel()

		c.SetUserContext(ctx)
		return c.Next()
	}
}

// CORSMiddleware configures CORS headers.
func CORSMiddleware(allowedOrigins []string) fiber.Handler {
	originsMap := make(map[string]bool)
	for _, origin := range allowedOrigins {
		originsMap[origin] = true
	}

	return func(c *fiber.Ctx) error {
		origin := c.Get("Origin")
		if originsMap[origin] || originsMap["*"] {
			c.Set("Access-Control-Allow-Origin", origin)
			c.Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
			c.Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Request-ID")
			c.Set("Access-Control-Allow-Credentials", "true")
			c.Set("Access-Control-Max-Age", "86400")
		}

		if c.Method() == "OPTIONS" {
			return c.SendStatus(fiber.StatusNoContent)
		}

		return c.Next()
	}
}

// RateLimitMiddleware provides basic rate limiting.
// For production, use a distributed rate limiter with Redis.
func RateLimitMiddleware(maxRequests int, window time.Duration) fiber.Handler {
	// Note: This is a simplified in-memory implementation.
	// For production, use fiber's limiter middleware or a Redis-backed solution.
	return func(c *fiber.Ctx) error {
		// Implementation would go here
		return c.Next()
	}
}

/* ─────────────────────────────────────────────────────────────
   8. AUTHENTICATION MIDDLEWARE PATTERN
──────────────────────────────────────────────────────────────── */

// AuthenticationGate provides authentication middleware.
type AuthenticationGate interface {
	// Authenticated returns middleware that requires authentication.
	Authenticated() fiber.Handler

	// OptionalAuth returns middleware that extracts user if present.
	OptionalAuth() fiber.Handler

	// HasPermission returns middleware that checks for specific permission.
	HasPermission(permission string) fiber.Handler

	// HasAnyPermission returns middleware that checks for any of the permissions.
	HasAnyPermission(permissions ...string) fiber.Handler
}

// JWTClaims represents the claims in a JWT token.
type JWTClaims struct {
	UserID      uuid.UUID `json:"user_id"`
	Email       string    `json:"email"`
	Permissions []string  `json:"permissions"`
	ExpiresAt   time.Time `json:"exp"`
}

// JWTAuthGate implements AuthenticationGate using JWT.
type JWTAuthGate struct {
	secretKey      []byte
	tokenExtractor func(*fiber.Ctx) string
}

// NewJWTAuthGate creates a new JWT authentication gate.
func NewJWTAuthGate(secretKey []byte) *JWTAuthGate {
	return &JWTAuthGate{
		secretKey: secretKey,
		tokenExtractor: func(c *fiber.Ctx) string {
			auth := c.Get("Authorization")
			if strings.HasPrefix(auth, "Bearer ") {
				return strings.TrimPrefix(auth, "Bearer ")
			}
			return ""
		},
	}
}

// Authenticated returns middleware that requires valid authentication.
func (g *JWTAuthGate) Authenticated() fiber.Handler {
	return func(c *fiber.Ctx) error {
		token := g.tokenExtractor(c)
		if token == "" {
			return RespondUnauthorized(c, "Missing authentication token")
		}

		claims, err := g.validateToken(token)
		if err != nil {
			return RespondUnauthorized(c, "Invalid authentication token")
		}

		// Store claims in context
		c.Locals("user_id", claims.UserID)
		c.Locals("user_claims", claims)

		return c.Next()
	}
}

// OptionalAuth extracts user if token present, continues if not.
func (g *JWTAuthGate) OptionalAuth() fiber.Handler {
	return func(c *fiber.Ctx) error {
		token := g.tokenExtractor(c)
		if token == "" {
			return c.Next()
		}

		claims, err := g.validateToken(token)
		if err == nil {
			c.Locals("user_id", claims.UserID)
			c.Locals("user_claims", claims)
		}

		return c.Next()
	}
}

// HasPermission returns middleware that checks for a specific permission.
func (g *JWTAuthGate) HasPermission(permission string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims, ok := c.Locals("user_claims").(*JWTClaims)
		if !ok {
			return RespondUnauthorized(c, "")
		}

		for _, p := range claims.Permissions {
			if p == permission {
				return c.Next()
			}
		}

		return RespondForbidden(c, "Insufficient permissions")
	}
}

// HasAnyPermission returns middleware that checks for any of the permissions.
func (g *JWTAuthGate) HasAnyPermission(permissions ...string) fiber.Handler {
	permSet := make(map[string]bool)
	for _, p := range permissions {
		permSet[p] = true
	}

	return func(c *fiber.Ctx) error {
		claims, ok := c.Locals("user_claims").(*JWTClaims)
		if !ok {
			return RespondUnauthorized(c, "")
		}

		for _, p := range claims.Permissions {
			if permSet[p] {
				return c.Next()
			}
		}

		return RespondForbidden(c, "Insufficient permissions")
	}
}

// validateToken validates a JWT token and returns claims.
// Note: This is a placeholder - use a proper JWT library like golang-jwt.
func (g *JWTAuthGate) validateToken(token string) (*JWTClaims, error) {
	// Implement actual JWT validation here
	// Example using github.com/golang-jwt/jwt/v5:
	//
	// parsedToken, err := jwt.ParseWithClaims(token, &JWTClaims{}, func(t *jwt.Token) (interface{}, error) {
	//     return g.secretKey, nil
	// })
	// if err != nil {
	//     return nil, err
	// }
	// claims, ok := parsedToken.Claims.(*JWTClaims)
	// if !ok || !parsedToken.Valid {
	//     return nil, errors.New("invalid token")
	// }
	// return claims, nil

	return nil, errors.New("not implemented")
}

/* ─────────────────────────────────────────────────────────────
   9. HANDLER PATTERNS
──────────────────────────────────────────────────────────────── */

// GetByIDHandler is a generic handler for fetching a single entity.
//
//	func (c *UserController) getUserByID(ctx *fiber.Ctx) error {
//	    id, err := ParseUUIDParam(ctx, "id")
//	    if err != nil {
//	        return RespondBadRequest(ctx, err.Error())
//	    }
//
//	    user, err := c.userService.GetByID(ctx.Context(), id)
//	    if err != nil {
//	        if errors.Is(err, ErrNotFound) {
//	            return RespondNotFound(ctx, "User")
//	        }
//	        return RespondInternalError(ctx)
//	    }
//
//	    return RespondOK(ctx, user)
//	}

// CreateHandler is a generic handler for creating an entity.
//
//	func (c *UserController) createUser(ctx *fiber.Ctx) error {
//	    req, details, err := BindAndValidate[CreateUserRequest](ctx)
//	    if err != nil {
//	        if details != nil {
//	            return RespondValidationError(ctx, details)
//	        }
//	        return RespondBadRequest(ctx, err.Error())
//	    }
//
//	    user, err := c.userService.Create(ctx.Context(), req)
//	    if err != nil {
//	        if errors.Is(err, ErrAlreadyExists) {
//	            return RespondConflict(ctx, "User already exists")
//	        }
//	        return RespondInternalError(ctx)
//	    }
//
//	    return RespondCreated(ctx, user)
//	}

// ListHandler is a generic handler for listing entities with pagination.
//
//	func (c *UserController) listUsers(ctx *fiber.Ctx) error {
//	    page, perPage := ParsePagination(ctx)
//	    sort := ParseSort(ctx, []string{"created_at", "name"}, "-created_at")
//	    filters := ParseFilters(ctx, []string{"status", "role"})
//
//	    users, total, err := c.userService.List(ctx.Context(), page, perPage, sort, filters)
//	    if err != nil {
//	        return RespondInternalError(ctx)
//	    }
//
//	    response := NewPaginatedResponse(users, page, perPage, total)
//	    return RespondOK(ctx, response)
//	}

/* ─────────────────────────────────────────────────────────────
   10. ERROR MAPPING
──────────────────────────────────────────────────────────────── */

// HTTPError maps domain errors to HTTP responses.
func HTTPError(c *fiber.Ctx, err error) error {
	switch {
	case errors.Is(err, ErrNotFound):
		return RespondNotFound(c, "Resource")
	case errors.Is(err, ErrAlreadyExists):
		return RespondConflict(c, "Resource already exists")
	case errors.Is(err, ErrValidation):
		return RespondBadRequest(c, err.Error())
	case errors.Is(err, ErrUnauthorized):
		return RespondUnauthorized(c, "")
	case errors.Is(err, ErrForbidden):
		return RespondForbidden(c, "")
	case errors.Is(err, ErrConflict):
		return RespondConflict(c, err.Error())
	case errors.Is(err, ErrBadRequest):
		return RespondBadRequest(c, err.Error())
	default:
		return RespondInternalError(c)
	}
}

// ErrorHandler is a custom error handler for Fiber.
func ErrorHandler(logger Logger) fiber.ErrorHandler {
	return func(c *fiber.Ctx, err error) error {
		// Handle Fiber-specific errors
		var e *fiber.Error
		if errors.As(err, &e) {
			if e.Code == http.StatusNotFound {
				return RespondNotFound(c, "Endpoint")
			}
			return RespondError(c, e.Code, "HTTP_ERROR", e.Message)
		}

		// Log unexpected errors
		logger.Error("Unhandled error",
			"error", err,
			"path", c.Path(),
			"method", c.Method(),
			"request_id", c.Locals("request_id"),
		)

		return RespondInternalError(c)
	}
}
