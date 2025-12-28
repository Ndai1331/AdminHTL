using Menilo.Models.Auth;
using Menilo.Models.RequestHttps;

namespace Menilo.Services.Auth
{
    /// <summary>
    /// Service interface for user operations (login, logout, etc.)
    /// </summary>
    public interface IUserService
    {
        /// <summary>
        /// Login user with email and password
        /// </summary>
        Task<RequestHttpResponse<LoginResponse>> LoginAsync(LoginRequest request);

        /// <summary>
        /// Logout current user
        /// </summary>
        Task LogoutAsync();

        /// <summary>
        /// Get current user information from API
        /// </summary>
        Task<RequestHttpResponse<UserInfoResponse>> GetCurrentUserInfoAsync();
    }
}

