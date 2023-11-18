using System;
using System.ComponentModel.DataAnnotations;

namespace _2023pz_trrepo.Model
{
    public class Wallet
    {
        [Key]
        public int WalletId { get; set; }

        [Required]
        public string Name { get; set; }

        public string Icon { get; set; }

        public int AccountBalance { get; set; }

        public int UserId { get; set; } 
    }

}