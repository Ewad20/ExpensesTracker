using Microsoft.AspNetCore.Identity;

namespace _2023pz_trrepo.Model
{
    public class User : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        public string? GoogleAuthKey { get; set; }
        public ICollection<Wallet> Wallets { get; set; }
    }
}