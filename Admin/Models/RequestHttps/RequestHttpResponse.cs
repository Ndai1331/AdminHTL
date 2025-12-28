using System.Net;
using System.Text.Json.Serialization;

namespace Menilo.Models.RequestHttps
{
    /// <summary>
    /// Generic response wrapper for API requests
    /// </summary>
    public class RequestHttpResponse<T>
    {
        [JsonPropertyName("data")]
        public T? Data { get; set; }
        
        [JsonPropertyName("meta")]
        public Meta? Meta { get; set; }
        
        [JsonPropertyName("errors")]
        public List<ErrorResponse> Errors { get; set; } = new List<ErrorResponse>();
        
        /// <summary>
        /// Indicates if the request was successful
        /// </summary>
        public bool IsSuccess
        {
            get { return Errors.Count == 0; }
        }

        /// <summary>
        /// Gets the first error message if any errors exist
        /// </summary>
        public string Message
        {
            get { return Errors.Count > 0 ? Errors[0].Message : string.Empty; }
        }
        
        /// <summary>
        /// HTTP status code of the response
        /// </summary>
        public HttpStatusCode StatusCode
        {
            set;
            get;
        }
    }

    /// <summary>
    /// Error response model
    /// </summary>
    public class ErrorResponse
    {
        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;
        
        public string Code { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        
        [JsonPropertyName("extensions")]
        public ExtensionsResponse Extensions { get; set; } = new();
    }
    
    /// <summary>
    /// Extensions response containing additional error information
    /// </summary>
    public class ExtensionsResponse
    {
        [JsonPropertyName("code")]
        public string Code { get; set; } = string.Empty;
        
        [JsonPropertyName("reason")]
        public string Reason { get; set; } = string.Empty;
    }

    /// <summary>
    /// Metadata for paginated responses
    /// </summary>
    public class Meta
    {
        [JsonPropertyName("total_count")]
        public int? TotalCount { get; set; }
        
        [JsonPropertyName("filter_count")]
        public int? FilterCount { get; set; }
        
        [JsonPropertyName("page")]
        public int? Page { get; set; }
        
        [JsonPropertyName("page_count")]
        public int? PageCount { get; set; }
        
        [JsonPropertyName("limit")]
        public int? Limit { get; set; }
        
        [JsonPropertyName("offset")]
        public int? Offset { get; set; }
        
        [JsonPropertyName("fields")]
        public string? Fields { get; set; }
    }
}

