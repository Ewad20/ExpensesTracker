using System.ComponentModel.DataAnnotations;

namespace _2023pz_trrepo.Model
{
    public class Wallet
    {
        [Key]
        public long Id { get; set; }

        public string Name { get; set; }

        public long IconId { get; set; }

        public decimal AccountBalance { get; set; }
        public string UserId { get; set; }
        public ICollection<Income> incomes { get; } = new List<Income>();
        public ICollection<Expenditure> expenditures { get; } = new List<Expenditure>();
    }

}