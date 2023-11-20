using Microsoft.AspNetCore.Mvc;
using _2023pz_trrepo.Model;

namespace _2023pz_trrepo.Controllers
{
    [ApiController]
    [Route("api/register")]
    public class AccountController : ControllerBase
    {
        private readonly ETDbContext _dbContext;

        public AccountController(ETDbContext dbContext)

        {
            _dbContext = dbContext;
        }

        [HttpPost("register")]
        public void Register([FromBody] User userData)
        {
            var user = new User { FirstName = userData.FirstName, LastName = userData.LastName, UserName = userData.UserName, Email = userData.Email, Password = userData.Password };
            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();
        }
    }
}