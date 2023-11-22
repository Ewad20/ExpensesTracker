using _2023pz_trrepo.Model;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace _2023pz_trrepo.Controllers
{
    [ApiController]
    [Route("/api/export")]
    public class ExportController : ControllerBase
    {
        private readonly ETDbContext _dbContext;
        public ExportController(ETDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        private void saveJsonFile(string filePath, object outcome){
            string serializedOutcome = JsonSerializer.Serialize(outcome);

            using (StreamWriter writer = new StreamWriter(filePath))
            {
                writer.WriteLine(outcome);
            }
        }

        [HttpPost("exportWallet")]
        public IActionResult ExportWallet(string userName, string filePath){
        

            List<Wallet> walletsList = _dbContext.Wallets.ToList();
            List<User> userList = _dbContext.Users.ToList();

            var foundUser = userList.FirstOrDefault(user => user.Username == userName);

            if(foundUser == null)
                return BadRequest("Brak usera na liście!");
            
            var userWallets = walletsList.Where(wallet => wallet.UserId.ToString() == foundUser.ToString());
            saveJsonFile(filePath, userWallets);
            return Ok();
        }

        [HttpPost("test")]
        public void Test()
        {
            Console.WriteLine("TEST XD");
        }
    }
}