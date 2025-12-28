using Menilo.Models.Auth;

namespace Menilo.Services.Auth
{
    /// <summary>
    /// Service interface for managing authentication state
    /// </summary>
    public interface IAuthService
    {
        /// <summary>
        /// Check if user is authenticated
        /// </summary>
        bool IsAuthenticated();

        /// <summary>
        /// Get current user information
        /// </summary>
        UserInfo? GetCurrentUser();

        /// <summary>
        /// Set user authentication data (token, email, etc.)
        /// </summary>
        void SetUser(UserInfo userInfo);

        /// <summary>
        /// Clear authentication data (logout)
        /// </summary>
        void ClearUser();

        /// <summary>
        /// Get access token from session
        /// </summary>
        string? GetAccessToken();

        /// <summary>
        /// Get refresh token from session
        /// </summary>
        string? GetRefreshToken();
    }
}

