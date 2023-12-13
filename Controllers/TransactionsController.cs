using _2023pz_trrepo.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
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
                income.Wallet = wallet;
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
                expenditure.Wallet = wallet;
                wallet.AccountBalance -= expenditure.Amount;
                wallet.Expenditures.Add(expenditure);
                _dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }

            return Ok("Expenditure added successfully.");
        }

        [HttpGet("transactionsForWallet/{walletId}")]
        public string GetTransactionsForWallet(long walletId, DateTime? startDate, DateTime? endDate, long? selectedCategory)
        {
            try
            {
                List<AbstractTransaction> transaction = new List<AbstractTransaction>();
                List<AbstractTransaction> filteredTransaction = new List<AbstractTransaction>();

                if (startDate.HasValue && endDate.HasValue)
                {
                    var incomes = _dbContext.Incomes
                    .Where(i => i.WalletId == walletId && i.Date >= startDate && i.Date <= endDate)
                    .OrderByDescending(i => i.Date)
                    .ToList();


                    var expenditures = _dbContext.Expenditures
                   .Where(e => e.WalletId == walletId && e.Date >= startDate && e.Date <= endDate)
                   .OrderByDescending(e => e.Date)
                   .ToList();

                    transaction = incomes.Cast<AbstractTransaction>().Concat(expenditures.Cast<AbstractTransaction>()).ToList();
                }

                else if (startDate.HasValue && !endDate.HasValue)
                {
                    var incomes = _dbContext.Incomes
                    .Where(i => i.WalletId == walletId && i.Date >= startDate)
                    .OrderByDescending(i => i.Date)
                    .ToList();


                    var expenditures = _dbContext.Expenditures
                   .Where(e => e.WalletId == walletId && e.Date >= startDate)
                   .OrderByDescending(e => e.Date)
                   .ToList();

                    transaction = incomes.Cast<AbstractTransaction>().Concat(expenditures.Cast<AbstractTransaction>()).ToList();
                }

                else if (!startDate.HasValue && endDate.HasValue)
                {
                    var incomes = _dbContext.Incomes
                    .Where(i => i.WalletId == walletId && i.Date <= endDate)
                    .OrderByDescending(i => i.Date)
                    .ToList();


                    var expenditures = _dbContext.Expenditures
                   .Where(e => e.WalletId == walletId && e.Date <= endDate)
                   .OrderByDescending(e => e.Date)
                   .ToList();

                    transaction = incomes.Cast<AbstractTransaction>().Concat(expenditures.Cast<AbstractTransaction>()).ToList();
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

                    transaction = incomes.Cast<AbstractTransaction>().Concat(expenditures.Cast<AbstractTransaction>()).ToList();
                }

                if (selectedCategory.HasValue)
                {
                    filteredTransaction = transaction
                    .Where(transaction => transaction.CategoryId == selectedCategory)
                    .ToList();
                }
                else { filteredTransaction = transaction; }

                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) },
                    WriteIndented = true // Opcjonalne - czy czytelnie sformatować JSON
                };

                options.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
                options.Converters.Add(new JsonStringDateTimeConverter());

                return JsonSerializer.Serialize(filteredTransaction);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                return "";
            }
        }

        [HttpGet("incomesForWallet/{walletId}")]
        public string GetIncomesForWallet(long walletId, DateTime? startDate, DateTime? endDate, long? selectedCategory)
        {
            try
            {
                List<AbstractTransaction> transaction = new List<AbstractTransaction>();
                List<AbstractTransaction> filteredTransaction = new List<AbstractTransaction>();

                if (startDate.HasValue && endDate.HasValue)
                {
                    var incomes = _dbContext.Incomes
                    .Where(i => i.WalletId == walletId && i.Date >= startDate && i.Date <= endDate)
                    .OrderByDescending(i => i.Date)
                    .ToList();


                    transaction = incomes.Cast<AbstractTransaction>().ToList();
                }

                else if (startDate.HasValue && !endDate.HasValue)
                {
                    var incomes = _dbContext.Incomes
                    .Where(i => i.WalletId == walletId && i.Date >= startDate)
                    .OrderByDescending(i => i.Date)
                    .ToList();

                    transaction = incomes.Cast<AbstractTransaction>().ToList();
                }

                else if (!startDate.HasValue && endDate.HasValue)
                {
                    var incomes = _dbContext.Incomes
                    .Where(i => i.WalletId == walletId && i.Date <= endDate)
                    .OrderByDescending(i => i.Date)
                    .ToList();

                    transaction = incomes.Cast<AbstractTransaction>().ToList(); ;
                }

                else
                {
                    var incomes = _dbContext.Incomes
                   .Where(i => i.WalletId == walletId)
                        .OrderByDescending(i => i.Date)
                   .ToList();

                    transaction = incomes.Cast<AbstractTransaction>().ToList();
                }

                if (selectedCategory.HasValue)
                {
                    filteredTransaction = transaction
                    .Where(transaction => transaction.CategoryId == selectedCategory)
                    .ToList();
                }
                else { filteredTransaction = transaction; }

                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) },
                    WriteIndented = true // Opcjonalne - czy czytelnie sformatować JSON
                };

                options.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
                options.Converters.Add(new JsonStringDateTimeConverter());

                return JsonSerializer.Serialize(filteredTransaction);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                return "";
            }
        }

        [HttpGet("expendituresForWallet/{walletId}")]
        public string GetExpendituresForWallet(long walletId, DateTime? startDate, DateTime? endDate, long? selectedCategory)
        {
            try
            {
                List<AbstractTransaction> transaction = new List<AbstractTransaction>();
                List<AbstractTransaction> filteredTransaction = new List<AbstractTransaction>();

                if (startDate.HasValue && endDate.HasValue)
                {

                    var expenditures = _dbContext.Expenditures
                   .Where(e => e.WalletId == walletId && e.Date >= startDate && e.Date <= endDate)
                   .OrderByDescending(e => e.Date)
                   .ToList();

                    transaction = expenditures.Cast<AbstractTransaction>().ToList();
                }

                else if (startDate.HasValue && !endDate.HasValue)
                {

                    var expenditures = _dbContext.Expenditures
                   .Where(e => e.WalletId == walletId && e.Date >= startDate)
                   .OrderByDescending(e => e.Date)
                   .ToList();

                    transaction = expenditures.Cast<AbstractTransaction>().ToList();
                }

                else if (!startDate.HasValue && endDate.HasValue)
                {

                    var expenditures = _dbContext.Expenditures
                   .Where(e => e.WalletId == walletId && e.Date <= endDate)
                   .OrderByDescending(e => e.Date)
                   .ToList();

                    transaction = expenditures.Cast<AbstractTransaction>().ToList();
                }

                else
                {

                    var expenditures = _dbContext.Expenditures
                   .Where(e => e.WalletId == walletId)
                       .OrderByDescending(e => e.Date)
                   .ToList();

                    transaction = expenditures.Cast<AbstractTransaction>().ToList();
                }

                if (selectedCategory.HasValue)
                {
                    filteredTransaction = transaction
                    .Where(transaction => transaction.CategoryId == selectedCategory)
                    .ToList();
                }
                else { filteredTransaction = transaction; }

                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) },
                    WriteIndented = true // Opcjonalne - czy czytelnie sformatować JSON
                };

                options.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
                options.Converters.Add(new JsonStringDateTimeConverter());

                return JsonSerializer.Serialize(filteredTransaction);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                return "";
            }
        }
        [Authorize]
        [HttpGet("monthlySummary/{walletId}/{year}/{month}")]
        public IActionResult GetMonthlySummary(long walletId, int year, int month)
        {
            try
            {
                var startDate = new DateTime(year, month, 1);
                var endDate = startDate.AddMonths(1).AddDays(-1);

                var incomes = _dbContext.Incomes
                    .Where(i => i.WalletId == walletId && i.Date >= startDate && i.Date <= endDate)
                    .Select(i => new
                    {
                        Date = i.Date,
                        Title = i.Title,
                        Amount = i.Amount,
                        Type = "income"
                    })
                    .ToList();

                var expenditures = _dbContext.Expenditures
                    .Where(e => e.WalletId == walletId && e.Date >= startDate && e.Date <= endDate)
                    .Select(e => new
                    {
                        Date = e.Date,
                        Title = e.Title,
                        Amount = e.Amount,
                        Type = "expenditure"
                    })
                    .ToList();

                var transactions = incomes.Concat(expenditures)
                    .OrderByDescending(t => t.Date)
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
                    NetBalance = totalIncome - totalExpenditure,
                    Transactions = transactions
                };

                return Ok(monthlySummary);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("allCategories")]
        public string GetAllCategories()
        {
            try
            {
                List<Category> categories = new List<Category>();

                var cat = _dbContext.Categories
                .ToList();

                categories = cat;

                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) },
                    WriteIndented = true // Opcjonalne - czy czytelnie sformatować JSON
                };

                options.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));

                return JsonSerializer.Serialize(categories);
            }
            catch (Exception ex)
            {
                return "";
            }
        }
    }
}