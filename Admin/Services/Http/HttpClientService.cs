using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Menilo.Models.RequestHttps;
using Microsoft.AspNetCore.Http;

namespace Menilo.Services.Http
{
    /// <summary>
    /// Service for making authenticated API requests to Directus
    /// Uses IHttpContextAccessor to manage authentication tokens via session/cookies
    /// </summary>
    public class HttpClientService : IHttpClientService
    {
        private readonly HttpClient _httpClient;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<HttpClientService> _logger;
        private readonly IConfiguration _configuration;
        private const string TokenSessionKey = "AccessToken";
        private const string RefreshTokenSessionKey = "RefreshToken";

        public HttpClientService(
            HttpClient httpClient,
            IHttpContextAccessor httpContextAccessor,
            ILogger<HttpClientService> logger,
            IConfiguration configuration)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));

            // Configure base address from appsettings
            // BaseAddress and headers are configured in Program.cs via AddHttpClient
            // Only set if not already configured
            if (_httpClient.BaseAddress == null)
            {
                var baseUrl = _configuration["DirectusApi:BaseUrl"];
                if (string.IsNullOrEmpty(baseUrl))
                {
                    _logger.LogWarning("DirectusApi:BaseUrl is not configured in appsettings.json");
                }
                else
                {
                    _httpClient.BaseAddress = new Uri(baseUrl);
                    _logger.LogInformation("HttpClientService initialized with BaseAddress: {BaseAddress}", baseUrl);
                }
            }
        }

        /// <summary>
        /// Attach authentication token to the client
        /// </summary>
        public void AttachToken(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                _logger.LogWarning("Attempted to attach empty token");
                return;
            }

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            _logger.LogDebug("Token attached to HTTP client");
        }

        /// <summary>
        /// Remove authentication token from the client
        /// </summary>
        public void RemoveToken()
        {
            _httpClient.DefaultRequestHeaders.Authorization = null;
            _logger.LogDebug("Token removed from HTTP client");
        }

        /// <summary>
        /// Get current access token from session
        /// </summary>
        private string? GetCurrentToken()
        {
            try
            {
                var session = _httpContextAccessor.HttpContext?.Session;
                if (session == null)
                {
                    _logger.LogWarning("HttpContext or Session is null");
                    return null;
                }

                return session.GetString(TokenSessionKey);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting token from session");
                return null;
            }
        }

        /// <summary>
        /// Ensure token is attached before making request
        /// </summary>
        private Task EnsureTokenAttachedAsync()
        {
            if (_httpClient.DefaultRequestHeaders.Authorization == null)
            {
                var token = GetCurrentToken();
                if (!string.IsNullOrEmpty(token))
                {
                    AttachToken(token);
                    _logger.LogDebug("Token automatically attached from session");
                }
                else
                {
                    _logger.LogWarning("No token found in session for authenticated request");
                }
            }
            return Task.CompletedTask;
        }

        /// <summary>
        /// Store token in session
        /// </summary>
        private void StoreToken(string token)
        {
            try
            {
                var session = _httpContextAccessor.HttpContext?.Session;
                if (session == null)
                {
                    _logger.LogWarning("Cannot store token: HttpContext or Session is null");
                    return;
                }

                session.SetString(TokenSessionKey, token);
                _logger.LogDebug("Token stored in session");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error storing token in session");
            }
        }

        /// <summary>
        /// Make a GET request to the specified URL
        /// </summary>
        public async Task<RequestHttpResponse<T>> GetAsync<T>(string url)
        {
            if (string.IsNullOrEmpty(url))
            {
                _logger.LogError("GetAsync called with empty URL");
                return CreateErrorResponse<T>("URL cannot be empty", "INVALID_URL", HttpStatusCode.BadRequest);
            }

            try
            {
                _logger.LogInformation("GET request to: {Url}", url);
                await EnsureTokenAttachedAsync();

                var response = await _httpClient.GetAsync(url);
                var result = await ProcessResponseAsync<T>(response, url, "GET");

                _logger.LogInformation("GET request completed: {Url}, Status: {StatusCode}, Success: {IsSuccess}", 
                    url, result.StatusCode, result.IsSuccess);

                return result;
            }
            catch (TaskCanceledException ex)
            {
                _logger.LogError(ex, "Request timeout for GET: {Url}", url);
                return CreateErrorResponse<T>("Request timeout", "TIMEOUT", HttpStatusCode.RequestTimeout);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GET request to {Url}: {Message}", url, ex.Message);
                return CreateErrorResponse<T>($"Request failed: {ex.Message}", "REQUEST_FAILED", HttpStatusCode.InternalServerError);
            }
        }

        /// <summary>
        /// Make a GET request without authentication
        /// </summary>
        public async Task<RequestHttpResponse<T>> GetWithoutAuthAsync<T>(string url)
        {
            if (string.IsNullOrEmpty(url))
            {
                _logger.LogError("GetWithoutAuthAsync called with empty URL");
                return CreateErrorResponse<T>("URL cannot be empty", "INVALID_URL", HttpStatusCode.BadRequest);
            }

            try
            {
                _logger.LogInformation("GET request (no auth) to: {Url}", url);
                var originalAuth = _httpClient.DefaultRequestHeaders.Authorization;
                RemoveToken();

                var response = await _httpClient.GetAsync(url);
                var result = await ProcessResponseAsync<T>(response, url, "GET");

                // Restore original auth header
                if (originalAuth != null)
                {
                    _httpClient.DefaultRequestHeaders.Authorization = originalAuth;
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GET request (no auth) to {Url}: {Message}", url, ex.Message);
                return CreateErrorResponse<T>($"Request failed: {ex.Message}", "REQUEST_FAILED", HttpStatusCode.InternalServerError);
            }
        }

        /// <summary>
        /// Make a POST request with JSON data without return type
        /// </summary>
        public async Task PostAsync(string url, object input)
        {
            if (string.IsNullOrEmpty(url))
            {
                _logger.LogError("PostAsync called with empty URL");
                throw new ArgumentException("URL cannot be empty", nameof(url));
            }

            try
            {
                _logger.LogInformation("POST request to: {Url}", url);

                if (url.Contains("/auth/login", StringComparison.OrdinalIgnoreCase))
                {
                    RemoveToken();
                }
                else
                {
                    await EnsureTokenAttachedAsync();
                }

                var content = new StringContent(
                    JsonSerializer.Serialize(input),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.PostAsync(url, content);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("POST request failed: {Url}, Status: {StatusCode}, Response: {ErrorContent}",
                        url, response.StatusCode, errorContent);
                    throw new HttpRequestException($"Request failed with status code {response.StatusCode}: {errorContent}");
                }

                _logger.LogInformation("POST request completed successfully: {Url}", url);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in POST request to {Url}: {Message}", url, ex.Message);
                throw;
            }
        }

        /// <summary>
        /// Make a POST request with JSON data and return type
        /// </summary>
        public async Task<RequestHttpResponse<T>> PostAsync<T>(string url, object input)
        {
            if (string.IsNullOrEmpty(url))
            {
                _logger.LogError("PostAsync<T> called with empty URL");
                return CreateErrorResponse<T>("URL cannot be empty", "INVALID_URL", HttpStatusCode.BadRequest);
            }

            try
            {
                _logger.LogInformation("POST request to: {Url}", url);

                if (url.Contains("/auth/login", StringComparison.OrdinalIgnoreCase))
                {
                    RemoveToken();
                }
                else
                {
                    await EnsureTokenAttachedAsync();
                }

                var content = new StringContent(
                    JsonSerializer.Serialize(input),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.PostAsync(url, content);
                var result = await ProcessResponseAsync<T>(response, url, "POST");

                _logger.LogInformation("POST request completed: {Url}, Status: {StatusCode}, Success: {IsSuccess}",
                    url, result.StatusCode, result.IsSuccess);

                return result;
            }
            catch (TaskCanceledException ex)
            {
                _logger.LogError(ex, "Request timeout for POST: {Url}", url);
                return CreateErrorResponse<T>("Request timeout", "TIMEOUT", HttpStatusCode.RequestTimeout);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in POST request to {Url}: {Message}", url, ex.Message);
                return CreateErrorResponse<T>($"Request failed: {ex.Message}", "REQUEST_FAILED", HttpStatusCode.InternalServerError);
            }
        }

        /// <summary>
        /// Make a PATCH request with JSON data
        /// </summary>
        public async Task<RequestHttpResponse<T>> PatchAsync<T>(string url, object input)
        {
            if (string.IsNullOrEmpty(url))
            {
                _logger.LogError("PatchAsync called with empty URL");
                return CreateErrorResponse<T>("URL cannot be empty", "INVALID_URL", HttpStatusCode.BadRequest);
            }

            try
            {
                _logger.LogInformation("PATCH request to: {Url}", url);
                await EnsureTokenAttachedAsync();

                var content = new StringContent(
                    JsonSerializer.Serialize(input),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.PatchAsync(url, content);
                var result = await ProcessResponseAsync<T>(response, url, "PATCH");

                _logger.LogInformation("PATCH request completed: {Url}, Status: {StatusCode}, Success: {IsSuccess}",
                    url, result.StatusCode, result.IsSuccess);

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in PATCH request to {Url}: {Message}", url, ex.Message);
                return CreateErrorResponse<T>($"Request failed: {ex.Message}", "REQUEST_FAILED", HttpStatusCode.InternalServerError);
            }
        }

        /// <summary>
        /// Make a PUT request with JSON data
        /// </summary>
        public async Task<RequestHttpResponse<T>> PutAsync<T>(string url, object input)
        {
            if (string.IsNullOrEmpty(url))
            {
                _logger.LogError("PutAsync called with empty URL");
                return CreateErrorResponse<T>("URL cannot be empty", "INVALID_URL", HttpStatusCode.BadRequest);
            }

            try
            {
                _logger.LogInformation("PUT request to: {Url}", url);
                await EnsureTokenAttachedAsync();

                var content = new StringContent(
                    JsonSerializer.Serialize(input),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.PutAsync(url, content);
                var result = await ProcessResponseAsync<T>(response, url, "PUT");

                _logger.LogInformation("PUT request completed: {Url}, Status: {StatusCode}, Success: {IsSuccess}",
                    url, result.StatusCode, result.IsSuccess);

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in PUT request to {Url}: {Message}", url, ex.Message);
                return CreateErrorResponse<T>($"Request failed: {ex.Message}", "REQUEST_FAILED", HttpStatusCode.InternalServerError);
            }
        }

        /// <summary>
        /// Make a DELETE request
        /// </summary>
        public async Task<RequestHttpResponse<T>> DeleteAsync<T>(string url)
        {
            if (string.IsNullOrEmpty(url))
            {
                _logger.LogError("DeleteAsync called with empty URL");
                return CreateErrorResponse<T>("URL cannot be empty", "INVALID_URL", HttpStatusCode.BadRequest);
            }

            try
            {
                _logger.LogInformation("DELETE request to: {Url}", url);
                await EnsureTokenAttachedAsync();

                var response = await _httpClient.DeleteAsync(url);
                var result = await ProcessResponseAsync<T>(response, url, "DELETE");

                _logger.LogInformation("DELETE request completed: {Url}, Status: {StatusCode}, Success: {IsSuccess}",
                    url, result.StatusCode, result.IsSuccess);

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DELETE request to {Url}: {Message}", url, ex.Message);
                return CreateErrorResponse<T>($"Request failed: {ex.Message}", "REQUEST_FAILED", HttpStatusCode.InternalServerError);
            }
        }

        /// <summary>
        /// Process HTTP response and convert to RequestHttpResponse
        /// </summary>
        private async Task<RequestHttpResponse<T>> ProcessResponseAsync<T>(
            HttpResponseMessage response,
            string url,
            string method)
        {
            var result = new RequestHttpResponse<T>
            {
                StatusCode = response.StatusCode
            };

            try
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                _logger.LogDebug("Response from {Method} {Url}: {StatusCode}, Body: {Body}",
                    method, url, response.StatusCode, jsonResponse);

                if (response.IsSuccessStatusCode)
                {
                    // Try to deserialize as Directus response format
                    try
                    {
                        var directusResponse = JsonSerializer.Deserialize<RequestHttpResponse<T>>(jsonResponse, new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });

                        if (directusResponse != null)
                        {
                            result.Data = directusResponse.Data;
                            result.Meta = directusResponse.Meta;
                            result.Errors = directusResponse.Errors ?? new List<ErrorResponse>();
                        }
                        else
                        {
                            // Try to deserialize directly as T
                            result.Data = JsonSerializer.Deserialize<T>(jsonResponse, new JsonSerializerOptions
                            {
                                PropertyNameCaseInsensitive = true
                            });
                        }
                    }
                    catch (JsonException)
                    {
                        // If deserialization fails, try to deserialize directly as T
                        result.Data = JsonSerializer.Deserialize<T>(jsonResponse, new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });
                    }
                }
                else
                {
                    // Handle error response
                    try
                    {
                        var errorResponse = JsonSerializer.Deserialize<GraphQLErrorResponse>(jsonResponse, new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });

                        if (errorResponse?.errors != null && errorResponse.errors.Any())
                        {
                            result.Errors = errorResponse.errors.Select(e => new ErrorResponse
                            {
                                Message = e.message ?? "Unknown error",
                                Code = e.extensions?.code ?? string.Empty,
                                Reason = e.extensions?.reason ?? string.Empty,
                                Extensions = new ExtensionsResponse
                                {
                                    Code = e.extensions?.code ?? string.Empty,
                                    Reason = e.extensions?.reason ?? string.Empty
                                }
                            }).ToList();
                        }
                        else
                        {
                            result.Errors.Add(new ErrorResponse
                            {
                                Message = $"HTTP {response.StatusCode}: {response.ReasonPhrase}",
                                Code = response.StatusCode.ToString(),
                                Reason = jsonResponse
                            });
                        }
                    }
                    catch (JsonException)
                    {
                        result.Errors.Add(new ErrorResponse
                        {
                            Message = $"HTTP {response.StatusCode}: {response.ReasonPhrase}",
                            Code = response.StatusCode.ToString(),
                            Reason = jsonResponse
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing response from {Method} {Url}", method, url);
                result.Errors.Add(new ErrorResponse
                {
                    Message = $"Failed to process response: {ex.Message}",
                    Code = "PARSE_ERROR",
                    Reason = ex.ToString()
                });
            }

            return result;
        }

        /// <summary>
        /// Create error response
        /// </summary>
        private static RequestHttpResponse<T> CreateErrorResponse<T>(string message, string code, HttpStatusCode statusCode = HttpStatusCode.BadRequest)
        {
            return new RequestHttpResponse<T>
            {
                StatusCode = statusCode,
                Errors = new List<ErrorResponse>
                {
                    new()
                    {
                        Message = message,
                        Code = code
                    }
                }
            };
        }
    }

    /// <summary>
    /// Internal class for deserializing GraphQL error responses from Directus
    /// </summary>
    internal class GraphQLErrorResponse
    {
        public List<GraphQLError>? errors { get; set; }
        public object? data { get; set; }
    }

    /// <summary>
    /// Internal class for GraphQL error structure
    /// </summary>
    internal class GraphQLError
    {
        public string? message { get; set; }
        public GraphQLErrorExtensions? extensions { get; set; }
    }

    /// <summary>
    /// Internal class for GraphQL error extensions
    /// </summary>
    internal class GraphQLErrorExtensions
    {
        public string? code { get; set; }
        public string? reason { get; set; }
    }
}

