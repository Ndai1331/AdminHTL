using Microsoft.AspNetCore.Mvc;

namespace Menilo.Controllers
{
    public class TablesController : Controller
    {
        // GET: Tables
        public IActionResult basic()
        {
            return View();
        }
        public IActionResult datatables()
        {
            return View();
        }
        public IActionResult gridjs()
        {
            return View();
        }
        public IActionResult listjs()
        {
            return View();
        }
    }
}