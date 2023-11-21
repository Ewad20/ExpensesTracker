using Microsoft.AspNetCore.Mvc;
using _2023pz_trrepo.Model;

namespace _2023pz_trrepo.Controllers
{
    [ApiController]
    [Route("api/account")]
    public class AccountController : ControllerBase
    {
        private readonly ETDbContext _dbContext;

        public AccountController(ETDbContext dbContext)

        {
            _dbContext = dbContext;
        }

        [HttpPost("register")]
        public void Register([FromBody] User user)
        {
            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();
        }
    }
}