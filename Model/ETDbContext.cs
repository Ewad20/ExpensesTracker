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
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasMany(user => user.wallets)
                .WithOne(wallet => wallet.User)
                .HasForeignKey(Wallet => Wallet.UserId);

            modelBuilder.Entity<Wallet>()
                .HasMany(wallet => wallet.Incomes)
                .WithOne(income => income.Wallet)
                .HasForeignKey(income => income.WalletId);

            modelBuilder.Entity<Wallet>()
                .HasMany(wallet => wallet.Expenditures)
                .WithOne(expenditure => expenditure.Wallet)
                .HasForeignKey(expenditure => expenditure.WalletId);
                
            base.OnModelCreating(modelBuilder);
        }
    }
}