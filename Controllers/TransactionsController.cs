using _2023pz_trrepo.Model;
using Microsoft.AspNetCore.Mvc;

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

                wallet.Incomes.Add(income);_dbContext.SaveChanges();

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

                wallet.Expenditures.Add(expenditure);
                _dbContext.SaveChanges();

                return Ok("Expenditure added successfully."); 
            }
            catch
            {
                return StatusCode(500, "An error occurred."); 
            }
        }
    }
}