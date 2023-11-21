namespace _2023pz_trrepo.Model
{
    public class Income : AbstractTransaction
    {
        public Income(string title, double amount, long walletId, long categoryId, string? description = "") : base(title, amount, walletId, categoryId, description)
        {
        }

        public override string TransactionType()
        {
            return "income";
        }
    }
}
