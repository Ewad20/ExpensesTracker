using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace _2023pz_trrepo.Model
{
    public abstract class AbstractTransaction
    {
        [Key]
        public long Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public double Amount { get; set; }
        [ForeignKey("Wallets")]
        public long WalletId { get; set; }
        public long CategoryId { get; set; }

        protected AbstractTransaction(string title, double amount, long walletId, long categoryId, string? description = "")
        {
            Title = title;
            Description = description;
            Amount = amount;
            WalletId = walletId;
            CategoryId = categoryId;
        }
        public abstract string TransactionType();
    }
}
