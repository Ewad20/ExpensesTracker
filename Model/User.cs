using System.ComponentModel.DataAnnotations;
using System.Net.Http.Headers;

namespace _2023pz_trrepo.Model
{
    public class User
    {
        public User(string firstName, string lastName, string username, string email, string password)
        {
            FirstName = firstName;
            LastName = lastName;
            Username = username;
            Email = email;
            Password = password;
        }

        [Key]
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public ICollection<Wallet> wallets { get; } = new List<Wallet>();
    }
}

