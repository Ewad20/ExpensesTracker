using System.Security.Claims;
using _2023pz_trrepo.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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


        [HttpPost("importWallets")]
        public async Task<IActionResult> ImportWallets([FromBody] List<ImportedWallet> wallets)
        {
            //currentUserId
            var currentUserId = GetCurrentUserId();
            //current User
            var user = await _dbContext.Users
            .Include("Wallets")
            .FirstOrDefaultAsync(u => u.Id == currentUserId);

            Console.WriteLine("Received wallets:");
            //console log information about improted wallets
            foreach (var wallet in wallets)
            {
                if (wallet != null && user != null)
                {
                    Wallet newWallet = new()
                    {
                        User = user,
                        UserId = user.Id,
                        Name = wallet.Name,
                        IconId = wallet.IconId,
                        AccountBalance = (double)wallet.AccountBalance,
                        Incomes = wallet.Incomes,
                        Expenditures = wallet.Expenditures
                    };

                    user.Wallets.Add(newWallet);
                }
                consoleWriteWalletDetails(wallet);
            }

            await _dbContext.SaveChangesAsync();
            Console.Write("Changes saved!");

            return Ok("Pomyślnie dodano portfele do konta uzytkownika!");
        }

        private string? GetCurrentUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return userId;
        }

        [HttpPost("user")]
        public IActionResult IsUserLogged()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return StatusCode(401, "Uzytkownik nie jest zalogowany!");
            }
            return Ok();
        }

        [HttpPost("test")]
        public void Test()
        {
            Console.WriteLine("TEST XD");
        }

        public void consoleWriteWalletDetails(ImportedWallet wallet)
        {
            Console.WriteLine($"Id: {wallet.Id}, Name: {wallet.Name}, IconId: {wallet.IconId}, AccountBalance: {wallet.AccountBalance}, UserId: {wallet.UserId}");
            Console.WriteLine("Expenditures:");
            if (wallet.Expenditures != null)
            {
                foreach (var expenditure in wallet.Expenditures)
                {
                    Console.WriteLine($"  Id: {expenditure.Id}, Amount: {expenditure.Amount}, Description: {expenditure.Description}");
                }
            }

            Console.WriteLine("Incomes:");
            if (wallet.Incomes != null)
            {
                foreach (var income in wallet.Incomes)
                {
                    Console.WriteLine($"  Id: {income.Id}, Amount: {income.Amount}, Description: {income.Description}");
                }
            }

            Console.WriteLine();
        }
    }
    public class ImportedWallet
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int IconId { get; set; }
        public decimal AccountBalance { get; set; }
        public string? UserId { get; set; }
        public List<Expenditure>? Expenditures { get; set; }
        public List<Income>? Incomes { get; set; }
    }
}