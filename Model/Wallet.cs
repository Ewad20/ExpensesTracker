using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace _2023pz_trrepo.Model
{
    public class Wallet
    {
        [Key]
        public long Id { get; set; }

        public string Name { get; set; }

        public long IconId { get; set; }

        public int AccountBalance { get; set; }
        public long UserId { get; set; }
        public User User { get; set; }
        public ICollection<Income> Incomes;
        public ICollection<Expenditure> Expenditures;

    }

}