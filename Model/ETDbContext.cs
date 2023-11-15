using Microsoft.EntityFrameworkCore;

namespace Projekt_zespołowy.Model
{
    public class ETDbContext : DbContext
    {
        public ETDbContext(DbContextOptions<ETDbContext> options): base(options) { }
    }
}
