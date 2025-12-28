using Menilo.Models.Auth;
using Menilo.Models.RequestHttps;
using Menilo.Services.Http;
using System.Text.Json;

namespace Menilo.Services.Auth
{
    /// <summary>
    /// Service for user operations (login, logout)
    /// </summary>
    public class UserService : IUserService
    {
        private readonly IHttpClientService _httpClientService;
        private readonly IAuthService _authService;
        private readonly ILogger<UserService> _logger;

        public UserService(
            IHttpClientService httpClientService,
            IAuthService authService,
            ILogger<UserService> logger)
        {
            _httpClientService = httpClientService ?? throw new ArgumentNullException(nameof(httpClientService));
            _authService = authService ?? throw new ArgumentNullException(nameof(authService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Login user with email and password
        /// </summary>
        public async Task<RequestHttpResponse<LoginResponse>> LoginAsync(LoginRequest request)
        {
            if (request == null)
            {
                _logger.LogError("LoginAsync called with null request");
                return new RequestHttpResponse<LoginResponse>
                {
                    StatusCode = System.Net.HttpStatusCode.BadRequest,
                    Errors = new List<ErrorResponse>
                    {
                        new ErrorResponse
                        {
                            Message = "Login request cannot be null",
                            Code = "INVALID_REQUEST"
                        }
                    }
                };
            }

            try
            {
                _logger.LogInformation("Login attempt for email: {Email}", request.Email);

                // Create request body for Directus API
                var loginRequest = new
                {
                    email = request.Email,
                    password = request.Password
                };

                // Use PostAsync (without auth) for login (public endpoint)
                // Directus auth/login requires POST with email and password
                var response = await _httpClientService.PostAsync<LoginResponse>("auth/login", loginRequest);

                // Handle Directus response structure
                if (response.IsSuccess && response.Data != null)
                {
                    var loginResponse = response.Data;
                    if (loginResponse != null)
                    {
                        // Calculate expiration time (expires is usually in seconds)
                        var expiresAt = DateTime.UtcNow.AddSeconds(loginResponse.Expires);

                        // Attach token to HTTP client for future requests
                        _httpClientService.AttachToken(loginResponse.AccessToken);

                        // Get user info from API
                        var userInfoResponse = await GetCurrentUserInfoAsync();
                        if (userInfoResponse.IsSuccess && userInfoResponse.Data != null)
                        {
                            var userData = userInfoResponse.Data;
                            var userInfo = new UserInfo
                            {
                                Id = userData.Id,
                                Email = userData.Email ?? request.Email,
                                FirstName = userData.FirstName,
                                LastName = userData.LastName,
                                Avatar = userData.Avatar,
                                RoleName = userData.Role?.Name,
                                AccessToken = loginResponse.AccessToken,
                                RefreshToken = loginResponse.RefreshToken,
                                ExpiresAt = expiresAt,
                                IsAuthenticated = true
                            };

                            _authService.SetUser(userInfo);

                            _logger.LogInformation("Login successful for user: {Email}, Name: {FullName}, Expires at: {ExpiresAt}",
                                userInfo.Email, userInfo.GetFullName(), expiresAt);
                        }
                        else
                        {
                            // If get user info fails, still store basic info with token
                            var userInfo = new UserInfo
                            {
                                Email = request.Email,
                                AccessToken = loginResponse.AccessToken,
                                RefreshToken = loginResponse.RefreshToken,
                                ExpiresAt = expiresAt,
                                IsAuthenticated = true
                            };

                            _authService.SetUser(userInfo);

                            _logger.LogWarning("Login successful but failed to get user info for email: {Email}, Expires at: {ExpiresAt}",
                                request.Email, expiresAt);
                        }

                        return new RequestHttpResponse<LoginResponse>
                        {
                            StatusCode = response.StatusCode,
                            Data = loginResponse
                        };
                    }
                }

                // If response is not successful, return error
                _logger.LogWarning("Login failed for email: {Email}, Errors: {Errors}",
                    request.Email, string.Join(", ", response.Errors.Select(e => e.Message)));

                return new RequestHttpResponse<LoginResponse>
                {
                    StatusCode = response.StatusCode,
                    Errors = response.Errors
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for email: {Email}", request.Email);
                return new RequestHttpResponse<LoginResponse>
                {
                    StatusCode = System.Net.HttpStatusCode.InternalServerError,
                    Errors = new List<ErrorResponse>
                    {
                        new ErrorResponse
                        {
                            Message = $"Login failed: {ex.Message}",
                            Code = "LOGIN_ERROR"
                        }
                    }
                };
            }
        }

        /// <summary>
        /// Get current user information from API
        /// </summary>
        public async Task<RequestHttpResponse<UserInfoResponse>> GetCurrentUserInfoAsync()
        {
            try
            {
                _logger.LogInformation("Fetching current user info from API");

                // Call /users/me endpoint with fields parameter
                var url = "users/me?fields[]=*&fields[]=role.id,role.name";
                var response = await _httpClientService.GetAsync<UserInfoResponse>(url);

                if (response.IsSuccess && response.Data != null)
                {
                    _logger.LogInformation("Successfully fetched user info: {Email}", response.Data.Email);
                }
                else
                {
                    _logger.LogWarning("Failed to fetch user info. Errors: {Errors}",
                        string.Join(", ", response.Errors.Select(e => e.Message)));
                }

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching current user info");
                return new RequestHttpResponse<UserInfoResponse>
                {
                    StatusCode = System.Net.HttpStatusCode.InternalServerError,
                    Errors = new List<ErrorResponse>
                    {
                        new ErrorResponse
                        {
                            Message = $"Failed to fetch user info: {ex.Message}",
                            Code = "FETCH_USER_INFO_ERROR"
                        }
                    }
                };
            }
        }

        /// <summary>
        /// Logout current user
        /// </summary>
        public Task LogoutAsync()
        {
            try
            {
                var userInfo = _authService.GetCurrentUser();
                var email = userInfo?.Email ?? "Unknown";

                _logger.LogInformation("Logout requested for email: {Email}", email);

                // Clear authentication state
                _authService.ClearUser();
                _httpClientService.RemoveToken();

                _logger.LogInformation("Logout successful for email: {Email}", email);
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                throw;
            }
        }
    }
}

