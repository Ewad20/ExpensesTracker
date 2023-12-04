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
            modelBuilder.Entity<Wallet>().HasKey(x => x.Id);
            modelBuilder.Entity<Wallet>()
                .HasOne(w => w.User)
                .WithMany(u => u.Wallets)
                .HasForeignKey(w => w.UserId);

            modelBuilder.Entity<Income>(x=> {
                x.HasKey(i => i.Id);
                x.HasOne(i => i.Wallet)
                .WithMany(w => w.Incomes)
                .HasForeignKey(i => i.WalletId);
            });

            modelBuilder.Entity<Expenditure>(x=> {
                x.HasKey(i => i.Id);
                x.HasOne(i => i.Wallet)
                .WithMany(w => w.Expenditures)
                .HasForeignKey(i => i.WalletId);
            });

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