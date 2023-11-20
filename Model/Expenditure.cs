namespace _2023pz_trrepo.Model
{
    public class Expenditure : AbstractTransaction
    {
        public Expenditure(string title, int amount, long walletId, long iconId, string? description = "") : base(title, amount, walletId, iconId, description)
        {

        }
        public override string TransactionType()
        {
            return "Expenditure";
        }
    }
}