using _2023pz_trrepo.Model;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Dodaj us³ugi do kontenera.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<ETDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Konfiguruj potok ¿¹dania HTTP.
if (!app.Environment.IsDevelopment())
{
    // Domyœlna wartoœæ HSTS wynosi 30 dni. Mo¿esz to dostosowaæ do scenariuszy produkcyjnych, zobacz https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

// Dodaj przekierowanie z g³ównego adresu do strony rejestracji
app.MapGet("/", ctx =>
{
    ctx.Response.Redirect("/Register");
    return Task.CompletedTask;
});

app.Run();
