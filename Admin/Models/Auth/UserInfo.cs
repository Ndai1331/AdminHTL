namespace Menilo.Models.Auth
{
    /// <summary>
    /// User information model
    /// </summary>
    public class UserInfo
    {
        public string Email { get; set; } = string.Empty;
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public bool IsAuthenticated { get; set; }
    }
}

