using Microsoft.AspNetCore.Mvc;

namespace Menilo.Controllers
{
    public class DashboardController : Controller
    {
        // GET: Dashboard
        public IActionResult fitness()
        {
            return View();
        }
        public IActionResult prodcast()
        {
            return View();
        }
        public IActionResult realEstate()
        {
            return View();
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}