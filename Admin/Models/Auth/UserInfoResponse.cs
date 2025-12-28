using System.Text.Json.Serialization;

namespace Menilo.Models.Auth
{
    /// <summary>
    /// Response model for /users/me API
    /// </summary>
    public class UserInfoResponse
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [JsonPropertyName("first_name")]
        public string? FirstName { get; set; }

        [JsonPropertyName("last_name")]
        public string? LastName { get; set; }

        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("avatar")]
        public string? Avatar { get; set; }

        [JsonPropertyName("role")]
        public UserRole? Role { get; set; }

        [JsonPropertyName("status")]
        public string? Status { get; set; }
    }

    public class UserRole
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
    }
}

