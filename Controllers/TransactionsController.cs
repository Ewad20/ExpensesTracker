using _2023pz_trrepo.Model;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;

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

        [HttpPost("addIncome")]
        public IActionResult AddIncome([FromBody] Income income)
        {
            try
            {
        
                var wallet = _dbContext.Wallets.FirstOrDefault(w => w.Id == income.WalletId);

                if (wallet == null)
                {
                    return NotFound("Wallet not found");
                }

                wallet.incomes.Add(income); _dbContext.SaveChanges();

                return Ok("Income added successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

      
        [HttpPost("addExpenditure")]
        public IActionResult AddExpenditure([FromBody] Expenditure expenditure)
        {
            try
            {
                var wallet = _dbContext.Wallets.FirstOrDefault(w => w.Id == expenditure.WalletId);

                if (wallet == null)
                {
                    return NotFound("Wallet not found");
                }

                wallet.expenditures.Add(expenditure);
                _dbContext.SaveChanges();

                return Ok("Expenditure added successfully."); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("transactionsForWallet/{walletId}")]
        public string GetTransactionsForWallet(long walletId, DateTime? startDate, DateTime? endDate)
        {
            try
            {
                List<AbstractTransaction> transactions = new List<AbstractTransaction>();
                if (startDate.HasValue && endDate.HasValue)
                {
                    var incomes = _dbContext.Incomes
                    .Where(i => i.WalletId == walletId && i.Date >= startDate.Value && i.Date <= endDate.Value)
                    .OrderByDescending(i => i.Date)
                    .ToList();


                    var expenditures = _dbContext.Expenditures
                   .Where(e => e.WalletId == walletId && e.Date >= startDate.Value && e.Date <= endDate.Value)
                   .OrderByDescending(e => e.Date)
                   .ToList();

                    transactions = incomes.Cast<AbstractTransaction>().Concat(expenditures.Cast<AbstractTransaction>()).ToList();
                }

                else if (startDate.HasValue && !endDate.HasValue)
                {
                    var incomes = _dbContext.Incomes
                    .Where(i => i.WalletId == walletId && i.Date >= startDate.Value)
                    .OrderByDescending(i => i.Date)
                    .ToList();


                    var expenditures = _dbContext.Expenditures
                   .Where(e => e.WalletId == walletId && e.Date >= startDate.Value)
                   .OrderByDescending(e => e.Date)
                   .ToList();

                    transactions = incomes.Cast<AbstractTransaction>().Concat(expenditures.Cast<AbstractTransaction>()).ToList();
                }

                else if (!startDate.HasValue && endDate.HasValue)
                {
                    var incomes = _dbContext.Incomes
                    .Where(i => i.WalletId == walletId && i.Date <= endDate.Value)
                    .OrderByDescending(i => i.Date)
                    .ToList();


                    var expenditures = _dbContext.Expenditures
                   .Where(e => e.WalletId == walletId && e.Date <= endDate.Value)
                   .OrderByDescending(e => e.Date)
                   .ToList();

                    transactions = incomes.Cast<AbstractTransaction>().Concat(expenditures.Cast<AbstractTransaction>()).ToList();
                }

                else
                {
                var incomes = _dbContext.Incomes
               .Where(i => i.WalletId == walletId)
                    .OrderByDescending(i => i.Date)
               .ToList();


                var expenditures = _dbContext.Expenditures
               .Where(e => e.WalletId == walletId)
                   .OrderByDescending(e => e.Date)
               .ToList();

                    transactions = incomes.Cast<AbstractTransaction>().Concat(expenditures.Cast<AbstractTransaction>()).ToList();
                }

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