using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Menilo.Services.Auth;

namespace Menilo.Filters
{
    /// <summary>
    /// Custom authorization attribute to check if user is authenticated
    /// Redirects to login page if not authenticated
    /// </summary>
    public class AuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var authService = context.HttpContext.RequestServices.GetRequiredService<IAuthService>();

            if (!authService.IsAuthenticated())
            {
                // User is not authenticated, redirect to login
                var returnUrl = context.HttpContext.Request.Path + context.HttpContext.Request.QueryString;
                var loginUrl = $"/Auth/SignIn?returnUrl={Uri.EscapeDataString(returnUrl)}";
                
                context.Result = new RedirectResult(loginUrl);
            }
        }
    }
}

