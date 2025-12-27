using Microsoft.AspNetCore.Mvc;

namespace Menilo.Controllers
{
    public class MapsController : Controller
    {
        // GET: Maps
        public IActionResult google()
        {
            return View();
        }
        public IActionResult leaflet()
        {
            return View();
        }
        public IActionResult vector()
        {
            return View();
        }
    }
}