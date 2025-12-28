using Menilo.Models.RequestHttps;

namespace Menilo.Services.Http
{
    /// <summary>
    /// Interface for HTTP client service that makes authenticated API requests to Directus
    /// </summary>
    public interface IHttpClientService
    {
        /// <summary>
        /// Attach authentication token to the client
        /// </summary>
        void AttachToken(string token);

        /// <summary>
        /// Remove authentication token from the client
        /// </summary>
        void RemoveToken();

        /// <summary>
        /// Make a GET request to the specified URL
        /// </summary>
        Task<RequestHttpResponse<T>> GetAsync<T>(string url);

        /// <summary>
        /// Make a GET request without authentication
        /// </summary>
        Task<RequestHttpResponse<T>> GetWithoutAuthAsync<T>(string url);

        /// <summary>
        /// Make a POST request with JSON data without return type
        /// </summary>
        Task PostAsync(string url, object input);

        /// <summary>
        /// Make a POST request with JSON data and return type
        /// </summary>
        Task<RequestHttpResponse<T>> PostAsync<T>(string url, object input);

        /// <summary>
        /// Make a PATCH request with JSON data
        /// </summary>
        Task<RequestHttpResponse<T>> PatchAsync<T>(string url, object input);

        /// <summary>
        /// Make a PUT request with JSON data
        /// </summary>
        Task<RequestHttpResponse<T>> PutAsync<T>(string url, object input);

        /// <summary>
        /// Make a DELETE request
        /// </summary>
        Task<RequestHttpResponse<T>> DeleteAsync<T>(string url);
    }
}

