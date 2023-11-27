using System.Runtime.CompilerServices;
using System.Transactions;
using Microsoft.AspNetCore.Identity;
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
            modelBuilder.Entity<User>().HasKey(x => x.Id);
            modelBuilder.Entity<User>().Property(x => x.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<User>().HasIndex(x => x.UserName).IsUnique();
            modelBuilder.Entity<User>().HasMany(u => u.wallets);
            modelBuilder.Entity<Wallet>().HasMany(u => u.incomes);
            modelBuilder.Entity<Wallet>().HasMany(u => u.expenditures);
            modelBuilder.Entity<IdentityUserClaim<string>>().ToTable("UserClaims");

            modelBuilder.Entity<IdentityUserRole<string>>(b =>
            {
                b.HasKey(ur => new { ur.UserId, ur.RoleId });
                b.ToTable("UserRoles");
            });

            modelBuilder.Entity<IdentityUserLogin<string>>(b =>
            {
                b.HasKey(x => new { x.LoginProvider, x.ProviderKey });
                b.ToTable("UserLogins");
            });

            modelBuilder.Entity<IdentityUserToken<string>>(b =>
            {
                b.HasKey(ut => new { ut.UserId, ut.LoginProvider, ut.Name });
                b.ToTable("UserTokens");
            });

            modelBuilder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
            modelBuilder.Entity<IdentityRole>().ToTable("Roles");

            base.OnModelCreating(modelBuilder);
        }
    }
}