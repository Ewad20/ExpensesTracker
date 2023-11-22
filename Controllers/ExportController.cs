using _2023pz_trrepo.Model;
using Microsoft.AspNetCore.Mvc;
using System.Numerics;
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

        //TODO restun file to front end, now saves to server 
        private Boolean saveJsonFile(string filePath, object outcome){
            string serializedOutcome = JsonSerializer.Serialize(outcome);

            using (StreamWriter writer = new StreamWriter(filePath))
            {
                try{
                    writer.WriteLine(outcome);
                }catch(Exception e){
                    Console.WriteLine("Nie duało się zapisać JSON'a" + e.StackTrace);
                    return false;
                }
            }
            return true;
        }

        [HttpPost("exportWallet")]
        public IActionResult ExportWallet(string userName, string filePath){
        
            User user;
            try{
                user = _dbContext.Users.Where(x => x.Username.Equals(userName)).First();
            }catch(Exception e){
                return BadRequest("Brak usera na liście!");
            }

            List<Wallet> userWalletList = _dbContext.Wallets.Where(x => x.UserId == user.Id).ToList();

            //if(!saveJsonFile(filePath, userWallets))
            //    return BadRequest("Nie udało się wyeksortować");
            foreach(Wallet wallet in userWalletList){
                Console.WriteLine(wallet.Name);
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