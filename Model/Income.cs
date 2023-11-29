namespace _2023pz_trrepo.Model
{
    public class Income : AbstractTransaction
    {
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public override string TransactionType()
        {
            return "income";
        }
    }
}
