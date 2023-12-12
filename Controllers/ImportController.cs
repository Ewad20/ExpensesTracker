using System.Security.Claims;
using _2023pz_trrepo.Model;
using Microsoft.AspNetCore.Mvc;

namespace _2023pz_trrepo.Controllers
{
    [ApiController]
    [Route("/api/import")]
    public class ImportController : ControllerBase
    {
        private readonly ETDbContext _dbContext;
        public ImportController(ETDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("importWallet")]
        public IActionResult ExportWallet()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return StatusCode(401, "Uzytkownik nie jest zalogowany!");
            }

            return Ok();
        }

        [HttpPost("user")]
        public IActionResult IsUserLogged()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return StatusCode(401, "Uzytkownik nie jest zalogowany!");
            }
            return Ok();
        }

        [HttpPost("test")]
        public void Test()
        {
            Console.WriteLine("TEST XD");
        }
    }
}