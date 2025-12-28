using System.Text.Json.Serialization;

namespace Menilo.Models.Auth
{
    /// <summary>
    /// Login response model from Directus API
    /// </summary>
    public class LoginResponse
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; } = string.Empty;

        [JsonPropertyName("refresh_token")]
        public string RefreshToken { get; set; } = string.Empty;

        [JsonPropertyName("expires")]
        public long Expires { get; set; }
    }
}

