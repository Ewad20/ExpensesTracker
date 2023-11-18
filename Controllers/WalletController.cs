using _2023pz_trrepo.Model;
using Microsoft.AspNetCore.Mvc;

namespace _2023pz_trrepo.Controllers
{
    [ApiController]
    [Route("/api/transaction")]
    public class WalletController : ControllerBase
    {
        private readonly ETDbContext _dbContext;
        public WalletController(ETDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("addWallet")]
        public void AddWallet([FromBody] Wallet wallet)
        {
            _dbContext.Wallets.Add(wallet);
            _dbContext.SaveChanges();
        }
    }
}
