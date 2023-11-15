using Microsoft.EntityFrameworkCore;

namespace _2023pz_trrepo.Model
{
    public class ETDbContext : DbContext
    {
        public ETDbContext(DbContextOptions<ETDbContext> options): base(options) { }
    }
}
