namespace _2023pz_trrepo.Model
{
    public class Income : AbstractTransaction
    {
        public Income(string title, string description, int amount, long walletId, long iconId) : base(title, description, amount, walletId, iconId)
        {
        }

        public override string TransactionType()
        {
            return "income";
        }
    }
}
