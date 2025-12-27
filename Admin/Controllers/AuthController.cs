using Microsoft.AspNetCore.Mvc;

namespace Menilo.Controllers
{
    public class AuthController : Controller
    {
        // GET: Auth
        public IActionResult emailVerify()
        {
            return View();
        }
        public IActionResult forgotPassword()
        {
            return View();
        }
        public IActionResult resetPassword()
        {
            return View();
        }
        public IActionResult signin()
        {
            return View();
        }
        public IActionResult signout()
        {
            return View();
        }
        public IActionResult signup()
        {
            return View();
        }
        public IActionResult twoStepVerify()
        {
            return View();
        }
        public IActionResult comingSoon()
        {
            return View();
        }
        public IActionResult notAuthorize()
        {
            return View();
        }
        public IActionResult underMaintenance()
        {
            return View();
        }
    }
}