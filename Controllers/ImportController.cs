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

        [HttpPost("test")]
        public void Test()
        {
            Console.WriteLine("TEST XD");
        }
    }
}