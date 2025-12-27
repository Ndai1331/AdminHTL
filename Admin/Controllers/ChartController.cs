using Microsoft.AspNetCore.Mvc;

namespace Menilo.Controllers
{
    public class ChartController : Controller
    {
        // GET: Chart
        public IActionResult apexline()
        {
            return View();
        }
        public IActionResult jsChart()
        {
            return View();
        }
        public IActionResult echartChart()
        {
            return View();
        }
    }
}