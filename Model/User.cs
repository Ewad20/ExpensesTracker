using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace _2023pz_trrepo.Model
{
    public class User : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public ICollection<Wallet> wallets { get; } = new List<Wallet>();
        
    }
}

