using _2023pz_trrepo.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
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
            var Clothes = _dbContext.Categories.FirstOrDefault(c => c.Name == "Clothes");
            var Food = _dbContext.Categories.FirstOrDefault(c => c.Name == "Food");
            var Work = _dbContext.Categories.FirstOrDefault(c => c.Name == "Work");

            if (Clothes == null)
            {
                Clothes = new Category { Name = "Clothes", Type = CategoryType.Expenditure, IsDefault = true };
                _dbContext.Categories.Add(Clothes);
            }

            if (Food == null)
            {
                Food = new Category { Name = "Food", Type = CategoryType.Expenditure, IsDefault = true };
                _dbContext.Categories.Add(Food);
            }

            if (Work == null)
            {
                Work = new Category { Name = "Work", Type = CategoryType.Income, IsDefault = true };
                _dbContext.Categories.Add(Work);
            }
            _dbContext.SaveChanges();
        }

        [HttpPost("addCategory")]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
        {
            try
            {
                await _dbContext.Categories.AddAsync(category);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception e)
            {
                return StatusCode(500, "Unable to add category! Error: " + e.Message);
            }
            return Ok("Category added successfully!");
        }

        [Authorize]
        [HttpPost("addCategoryAuthorized")]
        public async Task<IActionResult> AddCategoryAuthorized([FromBody] Category category)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var user = await _dbContext.Users.Include("UserCategories").FirstOrDefaultAsync(u => u.Id == userId);
                if(user == null) {
                    return NotFound("User not found");
                }
                category.UserId = userId;
                await _dbContext.Categories.AddAsync(category);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception e)
            {
                return StatusCode(500, "Unable to add category! Error: " + e.Message);
            }
            return Ok("Category added successfully!");
        }

        [Authorize]
        [HttpPost("addIncome")]
        public async Task<IActionResult> AddIncome([FromBody] Income income)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var user = await _dbContext.Users.Include("Wallets.Incomes").FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    return NotFound("User not found");
                }

                var wallet = user.Wallets.FirstOrDefault(w => w.Id == income.WalletId);
                if (wallet == null)
                {
                    return NotFound("Wallet not found");
                }

                var category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Id == income.CategoryId);
                if (category == null || category.Type != CategoryType.Income)
                {
                    return BadRequest("You choosed invalid category. Please try again after refreshing the page.");
                }

                income.Wallet = wallet;
                income.Category = category;
                wallet.Incomes.Add(income);
                wallet.AccountBalance += income.Amount;
                await _dbContext.SaveChangesAsync();
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
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var user = await _dbContext.Users.Include("Wallets.Expenditures").FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    return NotFound("User not found");
                }

                var wallet = user.Wallets.FirstOrDefault(w => w.Id == expenditure.WalletId);
                if (wallet == null)
                {
                    return NotFound("Wallet not found");
                }

                if (wallet.AccountBalance < expenditure.Amount)
                {
                    return BadRequest("Insuficient funds!");
                }

                var category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Id == expenditure.CategoryId);
                if (category == null || category.Type != CategoryType.Expenditure)
                {
                    return BadRequest("You chose invalid category. Please try again after refreshing the page.");
                }

                expenditure.Wallet = wallet;
                expenditure.Category = category;
                wallet.AccountBalance -= expenditure.Amount;
                wallet.Expenditures.Add(expenditure);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }

            return Ok("Expenditure added successfully.");
        }

        [Authorize]
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

        [Authorize]
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

        [Authorize]
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
                        Category = i.CategoryId,
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
                        Category = e.CategoryId,
                        Type = "expenditure"
                    })
                    .ToList();

                var transactions = incomes.Concat(expenditures)
                    .OrderByDescending(t => t.Date)
                    .ToList();

                var totalIncome = incomes.Sum(i => i.Amount);
                var totalExpenditure = expenditures.Sum(e => e.Amount);

                var incomeByCategory = incomes.
                    GroupBy(i => i.Category)
                    .Select(group => new
                    {
                        Category = group.Key,
                        CategoryName = _dbContext.Categories.FirstOrDefault(c => c.Id == group.Key)?.Name,
                        TotalAmount = group.Sum(i => i.Amount)
                    })
                    .ToList();

                var expenditureByCategory = expenditures.
                    GroupBy(i => i.Category)
                    .Select(group => new
                    {
                        Category = group.Key,
                        CategoryName = _dbContext.Categories.FirstOrDefault(c => c.Id == group.Key)?.Name,
                        TotalAmount = group.Sum(i => i.Amount)
                    })
                    .ToList();


                var monthlySummary = new
                {
                    WalletId = walletId,
                    Year = year,
                    Month = month,
                    TotalIncome = totalIncome,
                    TotalExpenditure = totalExpenditure,
                    NetBalance = totalIncome - totalExpenditure,
                    Transactions = transactions,
                    IncomeByCategory = incomeByCategory,
                    ExpenditureByCategory = expenditureByCategory
                };

                return Ok(monthlySummary);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [Authorize]
        [HttpGet("allCategories")]
        public string GetAllCategories()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = _dbContext.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
                return "";
            try
            {
                List<Category> categories = new List<Category>();

                var cat = _dbContext.Categories
                .Where(x => x.UserId == userId || x.UserId == null)
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
                Console.WriteLine(ex.ToString());
                return "";
            }
        }

        [HttpPost("editCategory/{categoryId}")]
        public async Task<IActionResult> EditCategory(long categoryId, [FromBody] Category updatedCategory)
        {
            try
            {
                var existingCategory = await _dbContext.Categories.FindAsync(categoryId);

                if (existingCategory == null)
                {
                    return NotFound("Category not found");
                }

                existingCategory.Name = updatedCategory.Name;
                existingCategory.Type = updatedCategory.Type;

                _dbContext.Categories.Update(existingCategory);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception e)
            {
                return StatusCode(500, "Unable to edit category! Error: " + e.Message);
            }
            return Ok("Category edited successfully!");
        }

        [HttpDelete("deleteCategory/{categoryId}")]
        public async Task<IActionResult> DeleteCategory(long categoryId)
        {
            try
            {
                var categoryToDelete = await _dbContext.Categories.FindAsync(categoryId);

                if (categoryToDelete == null)
                {
                    return NotFound("Category not found");
                }

                _dbContext.Categories.Remove(categoryToDelete);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception e)
            {
                return StatusCode(500, "Unable to delete category! Error: " + e.Message);
            }
            return Ok("Category deleted successfully!");
        }

    }
}
 