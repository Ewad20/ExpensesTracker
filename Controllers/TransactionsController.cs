using _2023pz_trrepo.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Transactions;


namespace _2023pz_trrepo.Controllers
{
    [ApiController]
    [Route("/api/transaction")]
    public class TransactionsController : ControllerBase
    {
        private readonly ETDbContext _dbContext;
        public TransactionsController(ETDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [Authorize]
        [HttpPost("addIncome")]
        public async Task<IActionResult> AddIncome([FromBody] Income income)
        {
            try
            {
                var wallet = await _dbContext.Wallets
                .Include("Incomes")
                .FirstOrDefaultAsync(w => w.Id == income.WalletId);

                if (wallet == null)
                {
                    return NotFound("Wallet not found");
                }
                wallet.Incomes.Add(income);
                wallet.AccountBalance += income.Amount;
                _dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }

            return Ok("Income added successfully.");
        }


        [Authorize]
        [HttpPost("addExpenditure")]
        public async Task<IActionResult> AddExpenditure([FromBody] Expenditure expenditure)
        {
            try
            {
                var wallet = await _dbContext.Wallets
                .Include("Expenditures")
                .FirstOrDefaultAsync(w => w.Id == expenditure.WalletId);
                if (wallet == null)
                {
                    return NotFound("Wallet not found");
                }
                if (wallet.AccountBalance <= expenditure.Amount)
                {
                    return BadRequest("Insuficient funds!");
                }
                wallet.AccountBalance -= expenditure.Amount;
                wallet.Expenditures.Add(expenditure);
                _dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }

            return Ok("Income added successfully.");
        }

        [Authorize]
        [HttpGet("transactionsForWallet/{walletId}")]
        public async Task<JsonResult> GetTransactionsForWallet(long walletId, DateTime? startDate, DateTime? endDate)
        {
            startDate = startDate != null ? startDate : DateTime.MinValue;
            endDate = endDate != null ? endDate : DateTime.MaxValue;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return new JsonResult(Unauthorized("Session ended! Sign in again"));
            }

            var user = await _dbContext.Users
            .Include("Wallets.Incomes")
            .Include("Wallets.Expenditures")
            .FirstOrDefaultAsync(u => u.Id==userId);

            if (user == null)
            {
                return new JsonResult(NotFound("Unable to find user with this user id"));
            }
            var wallet = user.Wallets.FirstOrDefault(w => w.Id == walletId);

            if(wallet == null)
            {
                return new JsonResult(NotFound("Unable to find wallet with this wallet id assigned to this account"));
            }
            var transactions = new List<AbstractTransaction>();
            transactions.AddRange(wallet.Incomes.Where(i => i.Date > startDate && i.Date < endDate).ToList());
            transactions.AddRange(wallet.Expenditures.Where(i => i.Date > startDate && i.Date < endDate).ToList());
            return new JsonResult(transactions);
        }

        [Authorize]
        [HttpGet("incomesForWallet/{walletId}")]
        public async Task<JsonResult> GetIncomesForWallet(long walletId, DateTime? startDate, DateTime? endDate)
        {
            startDate = startDate != null ? startDate : DateTime.MinValue;
            endDate = endDate != null ? endDate : DateTime.MaxValue;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return new JsonResult(Unauthorized("Session ended! Sign in again"));
            }

            var user = await _dbContext.Users
            .Include("Wallets.Incomes")
            .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return new JsonResult(NotFound("Unable to find user with this user id"));
            }
            var wallet = user.Wallets.FirstOrDefault(w => w.Id == walletId);

            if (wallet == null)
            {
                return new JsonResult(NotFound("Unable to find wallet with this wallet id assigned to this account"));
            }

            return new JsonResult(wallet.Incomes.Where(i => i.Date > startDate && i.Date < endDate).ToList());
        }

        [HttpGet("expendituresForWallet/{walletId}")]
        public async Task<JsonResult> GetExpendituresForWallet(long walletId, DateTime? startDate, DateTime? endDate)
        {
            startDate = startDate != null ? startDate : DateTime.MinValue;
            endDate = endDate != null ? endDate : DateTime.MaxValue;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return new JsonResult(Unauthorized("Session ended! Sign in again"));
            }

            var user = await _dbContext.Users
            .Include("Wallets.Expenditures")
            .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return new JsonResult(NotFound("Unable to find user with this user id"));
            }
            var wallet = user.Wallets.FirstOrDefault(w => w.Id == walletId);

            if (wallet == null)
            {
                return new JsonResult(NotFound("Unable to find wallet with this wallet id assigned to this account"));
            }

            return new JsonResult(wallet.Expenditures.Where(i => i.Date > startDate && i.Date < endDate).ToList());
        }



        [HttpGet("monthlySummary/{walletId}/{year}/{month}")]
        public IActionResult GetMonthlySummary(long walletId, int year, int month)
        {
            try
            {
                var startDate = new DateTime(year, month, 1);
                var endDate = startDate.AddMonths(1).AddDays(-1);

                var incomes = _dbContext.Incomes
                    .Where(i => i.WalletId == walletId && i.Date >= startDate && i.Date <= endDate)
                    .ToList();

                var expenditures = _dbContext.Expenditures
                    .Where(e => e.WalletId == walletId && e.Date >= startDate && e.Date <= endDate)
                    .ToList();

                var totalIncome = incomes.Sum(i => i.Amount);
                var totalExpenditure = expenditures.Sum(e => e.Amount);

                var monthlySummary = new
                {
                    WalletId = walletId,
                    Year = year,
                    Month = month,
                    TotalIncome = totalIncome,
                    TotalExpenditure = totalExpenditure,
                    NetBalance = totalIncome - totalExpenditure
                };

                return Ok(monthlySummary);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("transactionsForWallet/{walletId}")]
        public string GetTransactionsForWallet(long walletId)
        {
            try
            {

                var incomes = _dbContext.Incomes
               .Where(i => i.WalletId == walletId)
               .ToList();


                var expenditures = _dbContext.Expenditures
               .Where(e => e.WalletId == walletId)
               .ToList();


                var transactions = incomes.Cast<AbstractTransaction>().Concat(expenditures.Cast<AbstractTransaction>()).ToList();

                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) },
                    WriteIndented = true // Opcjonalne - czy czytelnie sformatować JSON
                };

                options.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
                options.Converters.Add(new JsonStringDateTimeConverter());

                return JsonSerializer.Serialize(transactions);
            }
            catch (Exception ex)
            {
                return "";
            }
        }
    }
}