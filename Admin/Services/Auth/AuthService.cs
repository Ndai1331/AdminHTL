using Menilo.Models.Auth;
using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace Menilo.Services.Auth
{
    /// <summary>
    /// Service for managing authentication state using session
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<AuthService> _logger;
        private const string UserInfoSessionKey = "UserInfo";
        private const string AccessTokenSessionKey = "AccessToken";
        private const string RefreshTokenSessionKey = "RefreshToken";

        public AuthService(
            IHttpContextAccessor httpContextAccessor,
            ILogger<AuthService> logger)
        {
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Check if user is authenticated
        /// </summary>
        public bool IsAuthenticated()
        {
            try
            {
                var session = _httpContextAccessor.HttpContext?.Session;
                if (session == null)
                {
                    _logger.LogDebug("Session is null, user is not authenticated");
                    return false;
                }

                var userInfo = GetCurrentUser();
                if (userInfo == null || !userInfo.IsAuthenticated)
                {
                    return false;
                }

                // Check if token is expired
                if (userInfo.ExpiresAt <= DateTime.UtcNow)
                {
                    _logger.LogInformation("Token expired at {ExpiresAt}, current time: {Now}",
                        userInfo.ExpiresAt, DateTime.UtcNow);
                    ClearUser();
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking authentication status");
                return false;
            }
        }

        /// <summary>
        /// Get current user information
        /// </summary>
        public UserInfo? GetCurrentUser()
        {
            try
            {
                var session = _httpContextAccessor.HttpContext?.Session;
                if (session == null)
                {
                    _logger.LogWarning("Session is null, cannot get user info");
                    return null;
                }

                var userInfoJson = session.GetString(UserInfoSessionKey);
                if (string.IsNullOrEmpty(userInfoJson))
                {
                    return null;
                }

                var userInfo = JsonSerializer.Deserialize<UserInfo>(userInfoJson);
                return userInfo;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting current user info");
                return null;
            }
        }

        /// <summary>
        /// Set user authentication data
        /// </summary>
        public void SetUser(UserInfo userInfo)
        {
            try
            {
                var session = _httpContextAccessor.HttpContext?.Session;
                if (session == null)
                {
                    _logger.LogWarning("Cannot set user: Session is null");
                    return;
                }

                userInfo.IsAuthenticated = true;
                var userInfoJson = JsonSerializer.Serialize(userInfo);
                session.SetString(UserInfoSessionKey, userInfoJson);
                
                // Also store tokens separately for easy access
                if (!string.IsNullOrEmpty(userInfo.AccessToken))
                {
                    session.SetString(AccessTokenSessionKey, userInfo.AccessToken);
                }
                
                if (!string.IsNullOrEmpty(userInfo.RefreshToken))
                {
                    session.SetString(RefreshTokenSessionKey, userInfo.RefreshToken);
                }

                _logger.LogInformation("User authenticated: {Email}, Expires: {ExpiresAt}",
                    userInfo.Email, userInfo.ExpiresAt);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting user info");
                throw;
            }
        }

        /// <summary>
        /// Clear authentication data
        /// </summary>
        public void ClearUser()
        {
            try
            {
                var session = _httpContextAccessor.HttpContext?.Session;
                if (session == null)
                {
                    _logger.LogWarning("Cannot clear user: Session is null");
                    return;
                }

                var email = GetCurrentUser()?.Email ?? "Unknown";
                
                session.Remove(UserInfoSessionKey);
                session.Remove(AccessTokenSessionKey);
                session.Remove(RefreshTokenSessionKey);
                
                _logger.LogInformation("User logged out: {Email}", email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing user info");
            }
        }

        /// <summary>
        /// Get access token from session
        /// </summary>
        public string? GetAccessToken()
        {
            try
            {
                var session = _httpContextAccessor.HttpContext?.Session;
                if (session == null)
                {
                    return null;
                }

                return session.GetString(AccessTokenSessionKey);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting access token");
                return null;
            }
        }

        /// <summary>
        /// Get refresh token from session
        /// </summary>
        public string? GetRefreshToken()
        {
            try
            {
                var session = _httpContextAccessor.HttpContext?.Session;
                if (session == null)
                {
                    return null;
                }

                return session.GetString(RefreshTokenSessionKey);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting refresh token");
                return null;
            }
        }
    }
}

