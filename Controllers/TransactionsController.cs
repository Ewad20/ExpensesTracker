﻿using _2023pz_trrepo.Model;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;


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
				income.Date = DateTime.Now;
				var wallet = _dbContext.Wallets.FirstOrDefault(w => w.Id == income.WalletId);

                if (wallet == null)
                {
                    return NotFound("Wallet not found");
                }

                wallet.incomes.Add(income);
				wallet.AccountBalance += income.Amount;
				_dbContext.SaveChanges();

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
				expenditure.Date = DateTime.Now;
				var wallet = _dbContext.Wallets.FirstOrDefault(w => w.Id == expenditure.WalletId);

                if (wallet == null)
                {
                    return NotFound("Wallet not found");
                }

                wallet.expenditures.Add(expenditure);
				wallet.AccountBalance -= expenditure.Amount;
				_dbContext.SaveChanges();

                return Ok("Expenditure added successfully."); 
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

                return JsonSerializer.Serialize(transactions);
            }
            catch (Exception ex)
            {
                return "";
            }
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

	}
}