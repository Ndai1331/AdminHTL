using Microsoft.AspNetCore.Mvc;
using Menilo.Models.Auth;
using Menilo.Services.Auth;
using Menilo.Filters;

namespace Menilo.Controllers
{
    /// <summary>
    /// Authentication controller for login, logout operations
    /// </summary>
    public class AuthController : Controller
    {
        private readonly IUserService _userService;
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IUserService userService,
            IAuthService authService,
            ILogger<AuthController> logger)
        {
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _authService = authService ?? throw new ArgumentNullException(nameof(authService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Display login page
        /// If already authenticated, redirect to dashboard
        /// </summary>
        [HttpGet]
        public IActionResult SignIn(string? returnUrl = null)
        {
            // If already authenticated, redirect to dashboard or returnUrl
            if (_authService.IsAuthenticated())
            {
                _logger.LogInformation("User already authenticated, redirecting to dashboard");
                return RedirectToAction("Index", "Dashboard");
            }

            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        /// <summary>
        /// Handle login form submission
        /// </summary>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SignIn(LoginRequest request, string? returnUrl = null)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Login attempt with invalid model state");
                return View(request);
            }

            try
            {
                _logger.LogInformation("Processing login request for email: {Email}", request.Email);

                var response = await _userService.LoginAsync(request);

                if (response.IsSuccess && response.Data != null)
                {
                    _logger.LogInformation("Login successful for email: {Email}", request.Email);

                    // Redirect to returnUrl or dashboard
                    if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                    {
                        return Redirect(returnUrl);
                    }

                    return RedirectToAction("Index", "Dashboard");
                }
                else
                {
                    // Add errors to ModelState
                    foreach (var error in response.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Message);
                    }

                    _logger.LogWarning("Login failed for email: {Email}, Errors: {Errors}",
                        request.Email, string.Join(", ", response.Errors.Select(e => e.Message)));

                    return View(request);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for email: {Email}", request.Email);
                ModelState.AddModelError(string.Empty, "An error occurred during login. Please try again.");
                return View(request);
            }
        }

        /// <summary>
        /// Handle logout
        /// </summary>
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        public async Task<IActionResult> SignOut()
        {
            try
            {
                var userInfo = _authService.GetCurrentUser();
                var email = userInfo?.Email ?? "Unknown";

                _logger.LogInformation("Logout request for email: {Email}", email);

                await _userService.LogoutAsync();

                _logger.LogInformation("Logout successful for email: {Email}", email);

                return RedirectToAction("SignIn");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                return RedirectToAction("SignIn");
            }
        }
    }
}
