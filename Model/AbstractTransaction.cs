using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Transactions;

namespace _2023pz_trrepo.Model
{
    public abstract class AbstractTransaction
    {
        [Key]
        public long Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public double Amount { get; set; }
        public DateTime Date {  get; set; }
        [ForeignKey("WalletId")]
        public long WalletId { get; set; }
        public Wallet Wallet;
        public long CategoryId { get; set; }
        public abstract string TransactionType();
    }
}
