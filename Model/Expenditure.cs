using System.ComponentModel.DataAnnotations.Schema;

namespace _2023pz_trrepo.Model
{
    public class Expenditure : AbstractTransaction
    {
		[ForeignKey("CategoryId")]
        public Category ExpenseCategory { get; set; }
        public override string TransactionType()
        {
            return "Expenditure";
        }
    }
}