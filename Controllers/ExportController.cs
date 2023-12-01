using _2023pz_trrepo.Model;
using Microsoft.AspNetCore.Mvc;
using System.Numerics;
using System.Runtime.InteropServices;
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

        [HttpPost("Wallet")]
        public IActionResult ExportWallet(string userName, string filePath)
        {

            User user;
            try
            {
                user = _dbContext.Users.Where(x => x.UserName!.Equals(userName)).First();
            }
            catch (Exception e)
            {
                Console.WriteLine("Brak usera na liście!" + e.StackTrace);
                return BadRequest("Brak usera na liście!");
            }

            List<Wallet> userWalletList = _dbContext.Wallets.Where(x => x.UserId == user.Id).ToList();

            //if(!saveJsonFile(filePath, userWallets))
            //    return BadRequest("Nie udało się wyeksortować");
            foreach (Wallet wallet in userWalletList)
            {
                Console.WriteLine(wallet.Name);
            }
            return Ok();
        }

        //get list of user wallets
        [HttpPost("Wallets")]
        public IActionResult GetUserWallets([FromBody] string userId)
        {
            List<Wallet> userWalletList = _dbContext.Wallets.Where(x => x.UserId.Equals(userId)).ToList();

            if(userWalletList.Count() == 0){
                return StatusCode(404, "Nie znaleziono portfeli!");
            }

            string serializeWallets = JsonSerializer.Serialize(userWalletList);
            return Ok(serializeWallets);
        }

        [HttpPost("test")]
        public IActionResult Test()
        {
            Console.WriteLine("ExportController test OK()...");
            return Ok();
        }
    }
}