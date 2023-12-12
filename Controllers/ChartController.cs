using _2023pz_trrepo.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace _2023pz_trrepo.Controllers
{
    [ApiController]
    [Route("/v1/api/chart")]
    public class ChartController : Controller
    {
        private readonly ETDbContext _dbContext;

        public ChartController(ETDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        [Authorize]
        [HttpGet("getChart1")]
        public async Task<IActionResult> getChart1()
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return new UnauthorizedObjectResult(""); 
            }

            IEnumerable<Wallet> wallets = _dbContext.Wallets.Where(x => x.UserId == userId).Include(x => x.Incomes).Include(x=>x.Expenditures).ToList();

            double incomes = 0;
            double expenditures = 0;

            foreach (Wallet wallet in wallets)
            {
                incomes += wallet.Incomes.Sum(x => x.Amount);
                expenditures += wallet.Expenditures.Sum(x => x.Amount);
            }

            List<double> result = new List<double> { incomes, expenditures };

            return new JsonResult(result);
        }

        [Authorize]
        [HttpGet("getChart2")]
        public async Task<IActionResult> GetChart2()
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return new UnauthorizedObjectResult("");
            }


            List<Category> expenditureCategories = _dbContext.Categories.Where(x => x.UserId == userId && x.Type == CategoryType.Expenditure).ToList();

            Dictionary<string, double> categoryExpenses = new Dictionary<string, double>();
            foreach (Category category in expenditureCategories)
            {
                double totalExpense = _dbContext.Expenditures
                    .Where(e => e.CategoryId == category.Id)
                    .Sum(e => e.Amount);

                categoryExpenses.Add(category.Name, totalExpense);
            }

            return new JsonResult(categoryExpenses);
        }

    }
}
