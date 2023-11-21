using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace _2023pz_trrepo.Model
{
    public class Wallet
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public long IconId { get; set; }

        public int AccountBalance { get; set; }
        [ForeignKey("Users")]

        public int UserId { get; set; } 

        public Wallet(int id, string name, long iconId, int accountBalance, int userId)
        {
            Id = id;
            Name = name;
            IconId = iconId;
            AccountBalance = accountBalance;
            UserId = userId;
        }
    }

}