using Microsoft.EntityFrameworkCore;

namespace _2023pz_trrepo.Model
{
    public class ETDbContext : DbContext
    {
        public ETDbContext(DbContextOptions<ETDbContext> options): base(options) { }
        public DbSet<Income> Incomes { get; set; }
        public DbSet<User> Users { get; set; }

        public DbSet<Expenditure> Expenditures { get; set; }

        public DbSet<Wallet> Wallets { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}