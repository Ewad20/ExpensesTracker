using System.ComponentModel.DataAnnotations;

namespace _2023pz_trrepo.Model
{
    public abstract class AbstractTransaction
    {
        protected AbstractTransaction(string title, double amount, long walletId, long iconId, string? description="")
        {
            Title = title;
            Description = description;
            Amount = amount;
            WalletId = walletId;
            IconId = iconId;
        }
        [Key]
        public long Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public double Amount { get; set; }
        public long WalletId { get; set; }
        public long IconId { get; set; }
        public abstract string TransactionType();
    }
}
