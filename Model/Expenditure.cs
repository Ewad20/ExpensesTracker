using System.ComponentModel.DataAnnotations.Schema;

namespace _2023pz_trrepo.Model
{
    public class Expenditure : AbstractTransaction
    {
		[ForeignKey("CategoryId")]
        public Category ExpenseCategory { get; set; }

		public Expenditure(string title, double amount, long walletId, long categoryId, string? description = "") : base(title, amount, walletId, categoryId, description)
        {

        }
        public override string TransactionType()
        {
            return "Expenditure";
        }
    }
}