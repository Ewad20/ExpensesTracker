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
        public IActionResult ExportWallet(string userName, string filePath){
        
            return Ok();
        }

        [HttpPost("test")]
        public void Test()
        {
            Console.WriteLine("TEST XD");
        }
    }
}