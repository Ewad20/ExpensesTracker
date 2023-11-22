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

        [HttpGet("get")]
        public Wallet get(){
            return _dbContext.Wallets.First();
        }

        [HttpPost("register")]
        public void AddUser([FromBody] User user)
        {
            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();
        }
        
        [HttpPost("addWallet")]
        public void AddWallet([FromBody] Wallet wallet)
        {
            _dbContext.Wallets.Add(wallet);
            _dbContext.SaveChanges();
        }
    }
}