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
        public void Income([FromBody] Income Exp)
        {
            _dbContext.Add(Exp);
            _dbContext.SaveChanges();
        }

        [HttpPost("addExpenditure")]
        public void Expenditure([FromBody] Expenditure Exp)
        {
            _dbContext.Add(Exp);
            _dbContext.SaveChanges();
        }
    }
}