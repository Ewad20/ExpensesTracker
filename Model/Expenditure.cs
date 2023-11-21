namespace _2023pz_trrepo.Model
{
    public class Expenditure : AbstractTransaction
    {
        public Expenditure(string title, double amount, long walletId, long CategoryId, string? description = "") : base(title, amount, walletId, CategoryId, description)
        {

        }
        public override string TransactionType()
        {
            return "Expenditure";
        }
    }
}