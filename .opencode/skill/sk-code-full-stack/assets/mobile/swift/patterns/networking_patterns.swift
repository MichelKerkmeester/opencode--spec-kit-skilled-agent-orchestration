/* ─────────────────────────────────────────────────────────────
   Networking Patterns - Modern Async/Await API Client

   PURPOSE: Production-ready networking patterns using async/await
   USAGE: Copy and adapt these patterns for your API integration
──────────────────────────────────────────────────────────────── */

import Foundation

/* ─────────────────────────────────────────────────────────────
   1. API CLIENT FOUNDATION
──────────────────────────────────────────────────────────────── */

/// Core API client with async/await support
actor APIClient {
    // MARK: - Configuration
    private let baseURL: URL
    private let session: URLSession
    private let decoder: JSONDecoder
    private let encoder: JSONEncoder

    // MARK: - Authentication
    private var authToken: String?
    private var refreshToken: String?
    private var tokenRefreshTask: Task<String, Error>?

    // MARK: - Init
    init(
        baseURL: URL,
        session: URLSession = .shared,
        decoder: JSONDecoder = .apiDecoder,
        encoder: JSONEncoder = .apiEncoder
    ) {
        self.baseURL = baseURL
        self.session = session
        self.decoder = decoder
        self.encoder = encoder
    }

    // MARK: - Token Management
    func setAuthToken(_ token: String, refreshToken: String? = nil) {
        self.authToken = token
        self.refreshToken = refreshToken
    }

    func clearAuth() {
        authToken = nil
        refreshToken = nil
        tokenRefreshTask = nil
    }

    // MARK: - Request Execution
    func execute<T: Decodable>(_ endpoint: Endpoint) async throws -> T {
        let request = try await buildRequest(for: endpoint)

        do {
            let (data, response) = try await session.data(for: request)
            try validateResponse(response)
            return try decoder.decode(T.self, from: data)
        } catch let error as APIError where error == .unauthorized {
            // Attempt token refresh and retry
            if refreshToken != nil {
                try await refreshAuthToken()
                let retryRequest = try await buildRequest(for: endpoint)
                let (data, response) = try await session.data(for: retryRequest)
                try validateResponse(response)
                return try decoder.decode(T.self, from: data)
            }
            throw error
        }
    }

    func execute(_ endpoint: Endpoint) async throws {
        let request = try await buildRequest(for: endpoint)
        let (_, response) = try await session.data(for: request)
        try validateResponse(response)
    }

    // MARK: - Request Building
    private func buildRequest(for endpoint: Endpoint) async throws -> URLRequest {
        guard let url = URL(string: endpoint.path, relativeTo: baseURL) else {
            throw APIError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = endpoint.method.rawValue
        request.timeoutInterval = endpoint.timeout

        // Set headers
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        // Add auth header if required
        if endpoint.requiresAuth, let token = authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        // Add custom headers
        for (key, value) in endpoint.headers {
            request.setValue(value, forHTTPHeaderField: key)
        }

        // Add query parameters
        if !endpoint.queryItems.isEmpty {
            var components = URLComponents(url: url, resolvingAgainstBaseURL: true)
            components?.queryItems = endpoint.queryItems
            request.url = components?.url
        }

        // Add body
        if let body = endpoint.body {
            request.httpBody = try encoder.encode(body)
        }

        return request
    }

    // MARK: - Response Validation
    private func validateResponse(_ response: URLResponse) throws {
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        switch httpResponse.statusCode {
        case 200...299:
            return
        case 401:
            throw APIError.unauthorized
        case 403:
            throw APIError.forbidden
        case 404:
            throw APIError.notFound
        case 422:
            throw APIError.validationError
        case 429:
            throw APIError.rateLimited
        case 500...599:
            throw APIError.serverError(httpResponse.statusCode)
        default:
            throw APIError.httpError(httpResponse.statusCode)
        }
    }

    // MARK: - Token Refresh
    private func refreshAuthToken() async throws {
        // Coalesce multiple refresh requests
        if let existingTask = tokenRefreshTask {
            _ = try await existingTask.value
            return
        }

        let task = Task<String, Error> {
            guard let refreshToken = self.refreshToken else {
                throw APIError.unauthorized
            }

            // Make refresh request
            let endpoint = AuthEndpoints.refresh(token: refreshToken)
            let response: TokenResponse = try await executeWithoutAuth(endpoint)

            await MainActor.run {
                // Update tokens in keychain/storage
            }

            return response.accessToken
        }

        tokenRefreshTask = task

        do {
            let newToken = try await task.value
            authToken = newToken
            tokenRefreshTask = nil
        } catch {
            tokenRefreshTask = nil
            throw error
        }
    }

    private func executeWithoutAuth<T: Decodable>(_ endpoint: Endpoint) async throws -> T {
        guard let url = URL(string: endpoint.path, relativeTo: baseURL) else {
            throw APIError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = endpoint.method.rawValue
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if let body = endpoint.body {
            request.httpBody = try encoder.encode(body)
        }

        let (data, response) = try await session.data(for: request)
        try validateResponse(response)
        return try decoder.decode(T.self, from: data)
    }
}

/* ─────────────────────────────────────────────────────────────
   2. ENDPOINT DEFINITION
──────────────────────────────────────────────────────────────── */

/// HTTP methods
enum HTTPMethod: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case patch = "PATCH"
    case delete = "DELETE"
}

/// Endpoint protocol for type-safe API definitions
protocol Endpoint {
    var path: String { get }
    var method: HTTPMethod { get }
    var headers: [String: String] { get }
    var queryItems: [URLQueryItem] { get }
    var body: Encodable? { get }
    var requiresAuth: Bool { get }
    var timeout: TimeInterval { get }
}

/// Default implementation
extension Endpoint {
    var headers: [String: String] { [:] }
    var queryItems: [URLQueryItem] { [] }
    var body: Encodable? { nil }
    var requiresAuth: Bool { true }
    var timeout: TimeInterval { 30 }
}

/// Example: Product endpoints
enum ProductEndpoints: Endpoint {
    case list(page: Int, limit: Int)
    case detail(id: String)
    case create(CreateProductRequest)
    case update(id: String, UpdateProductRequest)
    case delete(id: String)
    case search(query: String, filters: ProductFilters?)

    var path: String {
        switch self {
        case .list: return "/products"
        case .detail(let id): return "/products/\(id)"
        case .create: return "/products"
        case .update(let id, _): return "/products/\(id)"
        case .delete(let id): return "/products/\(id)"
        case .search: return "/products/search"
        }
    }

    var method: HTTPMethod {
        switch self {
        case .list, .detail, .search: return .get
        case .create: return .post
        case .update: return .patch
        case .delete: return .delete
        }
    }

    var queryItems: [URLQueryItem] {
        switch self {
        case .list(let page, let limit):
            return [
                URLQueryItem(name: "page", value: "\(page)"),
                URLQueryItem(name: "limit", value: "\(limit)")
            ]
        case .search(let query, let filters):
            var items = [URLQueryItem(name: "q", value: query)]
            if let filters {
                if let minPrice = filters.minPrice {
                    items.append(URLQueryItem(name: "min_price", value: "\(minPrice)"))
                }
                if let maxPrice = filters.maxPrice {
                    items.append(URLQueryItem(name: "max_price", value: "\(maxPrice)"))
                }
                if let category = filters.category {
                    items.append(URLQueryItem(name: "category", value: category))
                }
            }
            return items
        default:
            return []
        }
    }

    var body: Encodable? {
        switch self {
        case .create(let request): return request
        case .update(_, let request): return request
        default: return nil
        }
    }
}

/// Auth endpoints
enum AuthEndpoints: Endpoint {
    case login(email: String, password: String)
    case register(RegisterRequest)
    case refresh(token: String)
    case logout

    var path: String {
        switch self {
        case .login: return "/auth/login"
        case .register: return "/auth/register"
        case .refresh: return "/auth/refresh"
        case .logout: return "/auth/logout"
        }
    }

    var method: HTTPMethod {
        switch self {
        case .login, .register, .refresh, .logout:
            return .post
        }
    }

    var body: Encodable? {
        switch self {
        case .login(let email, let password):
            return LoginRequest(email: email, password: password)
        case .register(let request):
            return request
        case .refresh(let token):
            return RefreshRequest(refreshToken: token)
        case .logout:
            return nil
        }
    }

    var requiresAuth: Bool {
        switch self {
        case .login, .register, .refresh:
            return false
        case .logout:
            return true
        }
    }
}

/* ─────────────────────────────────────────────────────────────
   3. REQUEST/RESPONSE MODELS
──────────────────────────────────────────────────────────────── */

/// Generic paginated response
struct PaginatedResponse<T: Decodable>: Decodable {
    let data: [T]
    let page: Int
    let totalPages: Int
    let totalItems: Int
    let hasNextPage: Bool
}

/// API error response
struct ErrorResponse: Decodable {
    let code: String
    let message: String
    let details: [String: String]?
}

/// Token response
struct TokenResponse: Decodable {
    let accessToken: String
    let refreshToken: String?
    let expiresIn: Int

    enum CodingKeys: String, CodingKey {
        case accessToken = "access_token"
        case refreshToken = "refresh_token"
        case expiresIn = "expires_in"
    }
}

/// Login request
struct LoginRequest: Encodable {
    let email: String
    let password: String
}

/// Register request
struct RegisterRequest: Encodable {
    let email: String
    let password: String
    let firstName: String
    let lastName: String

    enum CodingKeys: String, CodingKey {
        case email, password
        case firstName = "first_name"
        case lastName = "last_name"
    }
}

/// Refresh request
struct RefreshRequest: Encodable {
    let refreshToken: String

    enum CodingKeys: String, CodingKey {
        case refreshToken = "refresh_token"
    }
}

/// Create product request
struct CreateProductRequest: Encodable {
    let name: String
    let description: String
    let price: Decimal
    let categoryId: String

    enum CodingKeys: String, CodingKey {
        case name, description, price
        case categoryId = "category_id"
    }
}

/// Update product request
struct UpdateProductRequest: Encodable {
    var name: String?
    var description: String?
    var price: Decimal?
}

/// Product filters
struct ProductFilters {
    var minPrice: Decimal?
    var maxPrice: Decimal?
    var category: String?
}

/* ─────────────────────────────────────────────────────────────
   4. ERROR HANDLING
──────────────────────────────────────────────────────────────── */

/// API error types
enum APIError: LocalizedError, Equatable {
    case invalidURL
    case invalidResponse
    case decodingError(String)
    case encodingError(String)
    case unauthorized
    case forbidden
    case notFound
    case validationError
    case rateLimited
    case serverError(Int)
    case httpError(Int)
    case networkError(String)
    case timeout
    case cancelled

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .invalidResponse:
            return "Invalid response from server"
        case .decodingError(let details):
            return "Failed to decode response: \(details)"
        case .encodingError(let details):
            return "Failed to encode request: \(details)"
        case .unauthorized:
            return "Authentication required"
        case .forbidden:
            return "Access denied"
        case .notFound:
            return "Resource not found"
        case .validationError:
            return "Validation failed"
        case .rateLimited:
            return "Too many requests. Please try again later."
        case .serverError(let code):
            return "Server error (\(code))"
        case .httpError(let code):
            return "HTTP error (\(code))"
        case .networkError(let message):
            return "Network error: \(message)"
        case .timeout:
            return "Request timed out"
        case .cancelled:
            return "Request was cancelled"
        }
    }

    var isRetryable: Bool {
        switch self {
        case .serverError, .rateLimited, .timeout, .networkError:
            return true
        default:
            return false
        }
    }
}

/* ─────────────────────────────────────────────────────────────
   5. RETRY LOGIC
──────────────────────────────────────────────────────────────── */

/// Retry configuration
struct RetryConfiguration {
    let maxAttempts: Int
    let initialDelay: TimeInterval
    let maxDelay: TimeInterval
    let multiplier: Double
    let retryableErrors: Set<Int>

    static let `default` = RetryConfiguration(
        maxAttempts: 3,
        initialDelay: 1.0,
        maxDelay: 30.0,
        multiplier: 2.0,
        retryableErrors: [408, 429, 500, 502, 503, 504]
    )
}

/// Extension for retry capability
extension APIClient {
    func executeWithRetry<T: Decodable>(
        _ endpoint: Endpoint,
        config: RetryConfiguration = .default
    ) async throws -> T {
        var lastError: Error?
        var delay = config.initialDelay

        for attempt in 1...config.maxAttempts {
            do {
                return try await execute(endpoint)
            } catch let error as APIError where error.isRetryable {
                lastError = error

                if attempt < config.maxAttempts {
                    try await Task.sleep(for: .seconds(delay))
                    delay = min(delay * config.multiplier, config.maxDelay)
                }
            } catch {
                throw error
            }
        }

        throw lastError ?? APIError.networkError("Max retries exceeded")
    }
}

/* ─────────────────────────────────────────────────────────────
   6. URLSESSION CONFIGURATION
──────────────────────────────────────────────────────────────── */

extension URLSession {
    /// Configured session for API calls
    static var api: URLSession {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        config.timeoutIntervalForResource = 60
        config.waitsForConnectivity = true
        config.requestCachePolicy = .reloadIgnoringLocalCacheData

        // Custom headers for all requests
        config.httpAdditionalHeaders = [
            "X-Client-Version": Bundle.main.appVersion,
            "X-Platform": "iOS"
        ]

        return URLSession(configuration: config)
    }

    /// Session with logging delegate
    static func logged(delegate: URLSessionDelegate? = nil) -> URLSession {
        let config = URLSessionConfiguration.default
        return URLSession(configuration: config, delegate: delegate, delegateQueue: nil)
    }
}

/* ─────────────────────────────────────────────────────────────
   7. JSON CODERS
──────────────────────────────────────────────────────────────── */

extension JSONDecoder {
    /// Decoder configured for API responses
    static var apiDecoder: JSONDecoder {
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        decoder.dateDecodingStrategy = .custom { decoder in
            let container = try decoder.singleValueContainer()
            let dateString = try container.decode(String.self)

            // Try ISO8601 with fractional seconds
            if let date = ISO8601DateFormatter.fractional.date(from: dateString) {
                return date
            }

            // Try ISO8601 without fractional seconds
            if let date = ISO8601DateFormatter.standard.date(from: dateString) {
                return date
            }

            throw DecodingError.dataCorruptedError(
                in: container,
                debugDescription: "Cannot decode date: \(dateString)"
            )
        }
        return decoder
    }
}

extension JSONEncoder {
    /// Encoder configured for API requests
    static var apiEncoder: JSONEncoder {
        let encoder = JSONEncoder()
        encoder.keyEncodingStrategy = .convertToSnakeCase
        encoder.dateEncodingStrategy = .iso8601
        return encoder
    }
}

extension ISO8601DateFormatter {
    static let fractional: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter
    }()

    static let standard: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime]
        return formatter
    }()
}

/* ─────────────────────────────────────────────────────────────
   8. NETWORK MONITOR
──────────────────────────────────────────────────────────────── */

import Network

/// Network connectivity monitor
@Observable
final class NetworkMonitor {
    static let shared = NetworkMonitor()

    private(set) var isConnected = true
    private(set) var connectionType: ConnectionType = .unknown

    private let monitor = NWPathMonitor()
    private let queue = DispatchQueue(label: "NetworkMonitor")

    enum ConnectionType {
        case wifi
        case cellular
        case wired
        case unknown
    }

    private init() {
        startMonitoring()
    }

    private func startMonitoring() {
        monitor.pathUpdateHandler = { [weak self] path in
            Task { @MainActor in
                self?.isConnected = path.status == .satisfied
                self?.connectionType = self?.getConnectionType(path) ?? .unknown
            }
        }
        monitor.start(queue: queue)
    }

    private func getConnectionType(_ path: NWPath) -> ConnectionType {
        if path.usesInterfaceType(.wifi) {
            return .wifi
        } else if path.usesInterfaceType(.cellular) {
            return .cellular
        } else if path.usesInterfaceType(.wiredEthernet) {
            return .wired
        }
        return .unknown
    }

    func stopMonitoring() {
        monitor.cancel()
    }
}

/* ─────────────────────────────────────────────────────────────
   9. MULTIPART UPLOAD
──────────────────────────────────────────────────────────────── */

/// Multipart form data builder
struct MultipartFormData {
    private var boundary: String
    private var data = Data()

    init(boundary: String = UUID().uuidString) {
        self.boundary = boundary
    }

    var contentType: String {
        "multipart/form-data; boundary=\(boundary)"
    }

    mutating func append(_ value: String, name: String) {
        data.append("--\(boundary)\r\n".data(using: .utf8)!)
        data.append("Content-Disposition: form-data; name=\"\(name)\"\r\n\r\n".data(using: .utf8)!)
        data.append("\(value)\r\n".data(using: .utf8)!)
    }

    mutating func append(_ fileData: Data, name: String, fileName: String, mimeType: String) {
        data.append("--\(boundary)\r\n".data(using: .utf8)!)
        data.append("Content-Disposition: form-data; name=\"\(name)\"; filename=\"\(fileName)\"\r\n".data(using: .utf8)!)
        data.append("Content-Type: \(mimeType)\r\n\r\n".data(using: .utf8)!)
        data.append(fileData)
        data.append("\r\n".data(using: .utf8)!)
    }

    func finalize() -> Data {
        var finalData = data
        finalData.append("--\(boundary)--\r\n".data(using: .utf8)!)
        return finalData
    }
}

/// Extension for file uploads
extension APIClient {
    func upload<T: Decodable>(
        _ data: Data,
        to path: String,
        fileName: String,
        mimeType: String,
        additionalFields: [String: String] = [:]
    ) async throws -> T {
        guard let url = URL(string: path, relativeTo: baseURL) else {
            throw APIError.invalidURL
        }

        var formData = MultipartFormData()
        formData.append(data, name: "file", fileName: fileName, mimeType: mimeType)

        for (key, value) in additionalFields {
            formData.append(value, name: key)
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue(formData.contentType, forHTTPHeaderField: "Content-Type")

        if let token = authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        request.httpBody = formData.finalize()

        let (responseData, response) = try await session.data(for: request)
        try validateResponse(response)
        return try decoder.decode(T.self, from: responseData)
    }
}

/* ─────────────────────────────────────────────────────────────
   10. HELPER EXTENSIONS
──────────────────────────────────────────────────────────────── */

extension Bundle {
    var appVersion: String {
        infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0"
    }

    var buildNumber: String {
        infoDictionary?["CFBundleVersion"] as? String ?? "1"
    }
}

/// URL builder helper
extension URL {
    init?(baseURL: String, path: String, queryItems: [URLQueryItem]? = nil) {
        guard var components = URLComponents(string: baseURL) else { return nil }
        components.path += path
        components.queryItems = queryItems
        guard let url = components.url else { return nil }
        self = url
    }
}

/* ─────────────────────────────────────────────────────────────
   USAGE EXAMPLES
──────────────────────────────────────────────────────────────── */

/*

 // Initialize API client
 let apiClient = APIClient(
     baseURL: URL(string: "https://api.example.com")!,
     session: .api
 )

 // Login
 let tokenResponse: TokenResponse = try await apiClient.execute(
     AuthEndpoints.login(email: "user@example.com", password: "password")
 )
 await apiClient.setAuthToken(tokenResponse.accessToken, refreshToken: tokenResponse.refreshToken)

 // Fetch products
 let products: PaginatedResponse<Product> = try await apiClient.execute(
     ProductEndpoints.list(page: 1, limit: 20)
 )

 // Create product
 let request = CreateProductRequest(
     name: "New Product",
     description: "Description",
     price: 29.99,
     categoryId: "cat-123"
 )
 let newProduct: Product = try await apiClient.execute(
     ProductEndpoints.create(request)
 )

 // With retry
 let result: Product = try await apiClient.executeWithRetry(
     ProductEndpoints.detail(id: "123"),
     config: .default
 )

 // Upload file
 let imageData = /* ... */
 let uploadResponse: UploadResponse = try await apiClient.upload(
     imageData,
     to: "/uploads/images",
     fileName: "photo.jpg",
     mimeType: "image/jpeg"
 )

 */
