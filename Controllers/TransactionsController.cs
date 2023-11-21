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
        public void AddIncome([FromBody] Income income)
        {
            _dbContext.Incomes.Add(income);
            _dbContext.SaveChanges();
        }

        [HttpPost("addExpenditure")]
        public void AddExpenditure([FromBody] Expenditure expenditure)
        {
            _dbContext.Expenditures.Add(expenditure);
            _dbContext.SaveChanges();
        }
    }
}