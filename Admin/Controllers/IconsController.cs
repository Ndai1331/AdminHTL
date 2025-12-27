using Microsoft.AspNetCore.Mvc;

namespace Menilo.Controllers
{
    public class IconsController : Controller
    {
        // GET: Icons
        public IActionResult bootstrap()
        {
            return View();
        }
        public IActionResult lucide()
        {
            return View();
        }
        public IActionResult remix()
        {
            return View();
        }
    }
}