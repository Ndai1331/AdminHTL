namespace Menilo.Models.Auth
{
    /// <summary>
    /// User information model
    /// </summary>
    public class UserInfo
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Avatar { get; set; }
        public string? RoleName { get; set; }
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public bool IsAuthenticated { get; set; }

        /// <summary>
        /// Get full name (LastName + FirstName)
        /// </summary>
        public string GetFullName()
        {
            var parts = new List<string>();
            if (!string.IsNullOrWhiteSpace(LastName))
                parts.Add(LastName);
            if (!string.IsNullOrWhiteSpace(FirstName))
                parts.Add(FirstName);
            
            return parts.Count > 0 ? string.Join(" ", parts) : Email;
        }
    }
}

