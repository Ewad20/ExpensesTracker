namespace _2023pz_trrepo.Model
{
    public class Income : AbstractTransaction
    {
        public Income(string title, double amount, long walletId, long iconId, string? description = "") : base(title, amount, walletId, iconId, description)
        {
        }

        public override string TransactionType()
        {
            return "income";
        }
    }
}
    