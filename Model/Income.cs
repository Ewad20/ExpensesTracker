namespace _2023pz_trrepo.Model
{
    public class Income : AbstractTransaction
    {
		public override string TransactionType()
        {
            return "income";
        }
    }
}
