using _2023pz_trrepo.Model;
using Microsoft.AspNetCore.Mvc;
using System.Numerics;
using System.Runtime.InteropServices;
using System.Security.Claims;
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

        [HttpPost("Wallet")]
        public IActionResult ExportWallet(string userName)
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
        public IActionResult GetUserWallets()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return StatusCode(401, "Uzytkownik nie jest zalogowany!");
            }   
            
            List<Wallet> userWalletList = _dbContext.Wallets.Where(x => x.UserId.Equals(userId)).ToList();

            if(userWalletList.Count() == 0){
                return StatusCode(404, "Nie znaleziono portfeli!");
            }

            string serializeWallets = JsonSerializer.Serialize(userWalletList);
            return Ok(serializeWallets);
        }

        [HttpPost("numberOfIncomesInWallet")]
        public IActionResult numberOfIncomesInWallet([FromBody] int walletId)
        {
            List<Income> walletIncomes = _dbContext.Incomes.Where(x => x.WalletId == walletId).ToList();
            int numberOfIncomes = walletIncomes.Count;
            
            Console.WriteLine("Number of incomes for wallet id " + walletId + " is: " + numberOfIncomes);
            string serializedNumberOfIncomes = JsonSerializer.Serialize(numberOfIncomes);
            return Ok(serializedNumberOfIncomes);
        }

        [HttpPost("numberOfExpendituresInWallet")]
        public IActionResult numberOfExpendituresInWallet([FromBody] int walletId)
        {
            List<Expenditure> walletExpenditures = _dbContext.Expenditures.Where(x => x.WalletId == walletId).ToList();
            int numberOfExpenditures = walletExpenditures.Count;
            
            Console.WriteLine("Number of expenditures for wallet id " + walletId + " is: " + numberOfExpenditures);
            string serializedNumberOfExpenditures = JsonSerializer.Serialize(numberOfExpenditures);
            return Ok(serializedNumberOfExpenditures);
        }

        [HttpPost("test")]
        public IActionResult Test()
        {
            Console.WriteLine("ExportController test OK()...");
            return Ok();
        }
    }
}