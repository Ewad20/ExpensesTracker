﻿using _2023pz_trrepo.Model;
using iText.Kernel.Pdf;
using iText.Layout.Element;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.IO;
using System.Globalization;
using System.Linq;
using OfficeOpenXml;


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

        [HttpPost("addCategory")]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("Session ended! Sign in again");
            }
            else
            {
                category.UserId = userId;
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
        }

        [Authorize]
        [HttpPost("updateIncome")]
        public async Task<IActionResult> updateIncome([FromBody] Income transaction)
        {
            try
            {
                var inc = await _dbContext.Incomes.FirstOrDefaultAsync(t => t.Id == transaction.Id);
                if (inc != null)
                {
                    inc.Title = transaction.Title;
                    inc.CategoryId = transaction.CategoryId;
                    inc.Amount = transaction.Amount;
                    inc.Date = transaction.Date.ToLocalTime();
                    inc.Description = transaction.Description;
                    _dbContext.Incomes.Update(inc);
                    await _dbContext.SaveChangesAsync();
                    return Ok();
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, "Unable to update transaction! Error: " + e.Message);
            }
        }
        [Authorize]
        [HttpPost("updateExpenditure")]
        public async Task<IActionResult> upadateExpenditure([FromBody] Expenditure transaction)
        {
            try
            {
                var exp = await _dbContext.Expenditures.FirstOrDefaultAsync(t => t.Id == transaction.Id);
                if (exp != null)
                {
                    exp.Title = transaction.Title;
                    exp.CategoryId = transaction.CategoryId;
                    exp.Amount = transaction.Amount;
                    exp.Date = transaction.Date.ToLocalTime();
                    exp.Description = transaction.Description;
                    _dbContext.Expenditures.Update(exp);
                    await _dbContext.SaveChangesAsync();
                    return Ok();
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, "Unable to update transaction! Error: " + e.Message);
            }
        }
        [Authorize]
        [HttpPost("addCategoryAuthorized")]
        public async Task<IActionResult> AddCategoryAuthorized([FromBody] Category category)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var user = await _dbContext.Users.Include("UserCategories").FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
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
        public string GetTransactionsForWallet(long walletId, DateTime? startDate, DateTime? endDate, long? selectedCategory, double? minValue, double? maxValue)
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

                if (minValue.HasValue)
                {
                    filteredTransaction = filteredTransaction
                    .Where(transaction => transaction.Amount >= minValue)
                    .ToList();
                }

                if (maxValue.HasValue)
                {
                    filteredTransaction = filteredTransaction
                    .Where(transaction => transaction.Amount <= maxValue)
                    .ToList();
                }

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
        public string GetIncomesForWallet(long walletId, DateTime? startDate, DateTime? endDate, long? selectedCategory, double? minValue, double? maxValue)
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

                if (minValue.HasValue)
                {
                    filteredTransaction = filteredTransaction
                    .Where(transaction => transaction.Amount >= minValue)
                    .ToList();
                }

                if (maxValue.HasValue)
                {
                    filteredTransaction = filteredTransaction
                    .Where(transaction => transaction.Amount <= maxValue)
                    .ToList();
                }

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
        public string GetExpendituresForWallet(long walletId, DateTime? startDate, DateTime? endDate, long? selectedCategory, double? minValue, double? maxValue)
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

                if (minValue.HasValue)
                {
                    filteredTransaction = filteredTransaction
                    .Where(transaction => transaction.Amount >= minValue)
                    .ToList();
                }

                if (maxValue.HasValue)
                {
                    filteredTransaction = filteredTransaction
                    .Where(transaction => transaction.Amount <= maxValue)
                    .ToList();
                }

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
                        Description = i.Description,
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
                        Description = e.Description,
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
        [HttpGet("yearlySummary/{walletId}/{year}")]
        public IActionResult GetYearlySummary(long walletId, int year)
        {
            try
            {
                var startDate = new DateTime(year, 1, 1);
                var endDate = startDate.AddYears(1).AddDays(-1);

                var incomes = _dbContext.Incomes
                     .Where(i => i.WalletId == walletId && i.Date >= startDate && i.Date <= endDate)
                     .Select(i => new
                     {
                         Date = i.Date,
                         Title = i.Title,
                         Description = i.Description,
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
                        Description = e.Description,
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


                var yearlySummary = new
                {
                    WalletId = walletId,
                    Year = year,
                    TotalIncome = totalIncome,
                    TotalExpenditure = totalExpenditure,
                    NetBalance = totalIncome - totalExpenditure,
                    Transactions = transactions,
                    IncomeByCategory = incomeByCategory,
                    ExpenditureByCategory = expenditureByCategory
                };

                return Ok(yearlySummary);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }


        [Authorize]
        [HttpGet("generateMonthlyReportPDF/{walletId}/{year}/{month}")]
        public IActionResult GenerateMonthlyReportPDF(long walletId, int year, int month)
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
                        Description = i.Description,
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
                        Description = e.Description,
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

                var incomeByCategory = incomes
                    .GroupBy(i => i.Category)
                    .Select(group => new
                    {
                        Category = group.Key,
                        CategoryName = _dbContext.Categories.FirstOrDefault(c => c.Id == group.Key)?.Name,
                        TotalAmount = group.Sum(i => i.Amount)
                    })
                    .ToList();

                var expenditureByCategory = expenditures
                    .GroupBy(i => i.Category)
                    .Select(group => new
                    {
                        Category = group.Key,
                        CategoryName = _dbContext.Categories.FirstOrDefault(c => c.Id == group.Key)?.Name,
                        TotalAmount = group.Sum(i => i.Amount)
                    })
                    .ToList();
                var walletName = _dbContext.Wallets
                    .Where(w => w.Id == walletId)
                    .Select(w => w.Name)
                    .FirstOrDefault();

                // Tworzenie nowego dokumentu PDF
                Document document = new Document();
                MemoryStream memoryStream = new MemoryStream();
                iTextSharp.text.pdf.PdfWriter writer = iTextSharp.text.pdf.PdfWriter.GetInstance(document, memoryStream);
                document.Open();

                // Dodawanie zawartości do dokumentu PDF
                iTextSharp.text.Font titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.BLACK);
                iTextSharp.text.Paragraph title = new iTextSharp.text.Paragraph($"Monthly Report for {CultureInfo.GetCultureInfo("en-US").DateTimeFormat.GetMonthName(month)} {year}", titleFont);
                title.Alignment = iTextSharp.text.Element.ALIGN_CENTER;
                title.SpacingAfter = 18f;
                document.Add(title);

                // Dodawanie informacji o raporcie
                BaseFont baseFont = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1250, BaseFont.NOT_EMBEDDED);
                iTextSharp.text.Font normalFont = new iTextSharp.text.Font(baseFont, 12, iTextSharp.text.Font.NORMAL);
                iTextSharp.text.Font headerFont = new iTextSharp.text.Font(baseFont, 12, iTextSharp.text.Font.BOLD);

                iTextSharp.text.Paragraph walletInfo = new iTextSharp.text.Paragraph($"Wallet Name: {walletName}", normalFont);
                iTextSharp.text.Paragraph incomeInfo = new iTextSharp.text.Paragraph($"Total Income: {totalIncome} PLN", normalFont);
                iTextSharp.text.Paragraph expenditureInfo = new iTextSharp.text.Paragraph($"Total Expenditure: {totalExpenditure} PLN", normalFont);
                iTextSharp.text.Paragraph balanceInfo = new iTextSharp.text.Paragraph($"Net Balance: {totalIncome - totalExpenditure} PLN", normalFont);

                document.Add(walletInfo);
                document.Add(incomeInfo);
                document.Add(expenditureInfo);
                document.Add(balanceInfo);

                document.Add(new iTextSharp.text.Paragraph("\n"));
                // Dodawanie transakcji
                PdfPTable table = new PdfPTable(4); // 4 kolumny dla daty, tytułu, opisu i kwoty

                table.AddCell(new PdfPCell(new Phrase("Date", headerFont)));
                table.AddCell(new PdfPCell(new Phrase("Title", headerFont)));
                table.AddCell(new PdfPCell(new Phrase("Description", headerFont)));
                table.AddCell(new PdfPCell(new Phrase("Amount", headerFont)));

                foreach (var transaction in transactions)
                {
                    table.AddCell(new PdfPCell(new Phrase(transaction.Date.ToShortDateString(), normalFont)));
                    table.AddCell(new PdfPCell(new Phrase(transaction.Title, normalFont)));
                    table.AddCell(new PdfPCell(new Phrase(transaction.Description, normalFont)));
                    string formattedAmount = $"{transaction.Amount} PLN";
                    if (transaction.Type == "income")
                    {
                        formattedAmount = $"+{formattedAmount}";
                    }
                    else if (transaction.Type == "expenditure")
                    {
                        formattedAmount = $"-{formattedAmount}";
                    }

                    table.AddCell(new PdfPCell(new Phrase(formattedAmount, normalFont)));
                }

                document.Add(table);

                // Zakończenie edycji dokumentu
                document.Close();
                writer.Close();

                // Pobierz zawartość pliku z pamięci podręcznej
                byte[] fileContents = memoryStream.ToArray();

                // Zwróć plik PDF jako odpowiedź HTTP
                string fileName = $"{walletName}_monthly_report_{month}_{year}.pdf";

                return File(fileContents, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [Authorize]
        [HttpGet("generateMonthlyReportExcel/{walletId}/{year}/{month}")]
        public IActionResult GenerateMonthlyReportExcel(long walletId, int year, int month)
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
                        Description = i.Description,
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
                        Description = e.Description,
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

                var incomeByCategory = incomes
                    .GroupBy(i => i.Category)
                    .Select(group => new
                    {
                        Category = group.Key,
                        CategoryName = _dbContext.Categories.FirstOrDefault(c => c.Id == group.Key)?.Name,
                        TotalAmount = group.Sum(i => i.Amount)
                    })
                    .ToList();

                var expenditureByCategory = expenditures
                    .GroupBy(i => i.Category)
                    .Select(group => new
                    {
                        Category = group.Key,
                        CategoryName = _dbContext.Categories.FirstOrDefault(c => c.Id == group.Key)?.Name,
                        TotalAmount = group.Sum(i => i.Amount)
                    })
                    .ToList();
                var walletName = _dbContext.Wallets
                    .Where(w => w.Id == walletId)
                    .Select(w => w.Name)
                    .FirstOrDefault();

                // Tworzenie nowego arkusza
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial; // Ustawienie kontekstu licencji
                ExcelPackage excelPackage = new ExcelPackage();
                ExcelWorksheet worksheet = excelPackage.Workbook.Worksheets.Add("Monthly Report");

                // Ustawienie nagłówków kolumn
                worksheet.Cells[1, 1].Value = "Date";
                worksheet.Cells[1, 2].Value = "Title";
                worksheet.Cells[1, 3].Value = "Description";
                worksheet.Cells[1, 4].Value = "Amount";

                // Wypełnienie danymi
                int row = 2;
                foreach (var transaction in transactions)
                {
                    worksheet.Cells[row, 1].Value = transaction.Date.ToShortDateString();
                    worksheet.Cells[row, 2].Value = transaction.Title;
                    worksheet.Cells[row, 3].Value = transaction.Description;
                    var amount = transaction.Type == "expenditure" ? -transaction.Amount : transaction.Amount;
                    worksheet.Cells[row, 4].Value = amount;

                    row++;
                }

                // Zapisanie pliku
                byte[] fileContents;
                string fileName = $"{walletName}_monthly_report_{month}_{year}.xlsx";
                fileContents = excelPackage.GetAsByteArray();

                // Zwrócenie pliku Excel jako odpowiedź HTTP
                return File(fileContents, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }


        [Authorize]
        [HttpGet("allCategories")]
        public async Task<string> GetAllCategories()
        {
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
            await _dbContext.SaveChangesAsync();
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = _dbContext.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
                return "";
            try
            {
                List<Category> categories = _dbContext.Categories.Where(c => c.UserId == user.Id || c.UserId == null).ToList();
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

        [HttpDelete("deleteTransaction/{transactionId}")]
        public async Task<IActionResult> DeleteTransaction(long transactionId)
        {
            try
            {
                var income = await _dbContext.Incomes.FirstOrDefaultAsync(transaction => transaction.Id == transactionId);
                if (income != null)
                {
                    _dbContext.Incomes.Remove(income);
                    await _dbContext.SaveChangesAsync();
                    return Ok();
                }
                var expenditure = await _dbContext.Expenditures.FirstOrDefaultAsync(transaction => transaction.Id == transactionId);
                if (expenditure != null)
                {
                    _dbContext.Expenditures.Remove(expenditure);
                    await _dbContext.SaveChangesAsync();
                    return Ok();
                }
                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Unable to delete transaction! Error: " + ex.Message);
            }
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

        [HttpGet("checkTransactions/{categoryId}")]
        public async Task<IActionResult> CheckTransactions(long categoryId)
        {
            try
            {
                var categoryExists = await _dbContext.Categories.AnyAsync(c => c.Id == categoryId);

                if (!categoryExists)
                {
                    return NotFound("Category not found");
                }

                var hasTransactions = await _dbContext.Expenditures.AnyAsync(e => e.CategoryId == categoryId);

                return Ok(new { HasTransactions = hasTransactions });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error checking transactions: {ex.Message}");
            }
        }

    }
}
