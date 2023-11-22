using System.Runtime.CompilerServices;
using System.Transactions;
using Microsoft.EntityFrameworkCore;

namespace _2023pz_trrepo.Model
{
    public class ETDbContext : DbContext
    {
        public ETDbContext(DbContextOptions<ETDbContext> options) : base(options) { }
        public DbSet<Income> Incomes { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Expenditure> Expenditures { get; set; }
        public DbSet<Wallet> Wallets { get; set; }
		public DbSet<Category> Categories { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();
            modelBuilder.Entity<User>().HasMany(u => u.wallets);
            modelBuilder.Entity<Wallet>().HasMany(u => u.incomes);
            modelBuilder.Entity<Wallet>().HasMany(u => u.expenditures);
			base.OnModelCreating(modelBuilder);
        }
    }
}