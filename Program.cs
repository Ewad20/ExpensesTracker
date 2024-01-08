using _2023pz_trrepo.Model;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<ETDbContext>(options =>

options.UseNpgsql(builder.Configuration.GetConnectionString("OlaConnection")));
builder.Services.AddCors();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
    .AddCookie(options =>
    {
        options.Cookie.HttpOnly = true;
        options.ExpireTimeSpan = TimeSpan.Zero;
        options.SlidingExpiration = true;
        options.Cookie.SameSite = SameSiteMode.Strict;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    });


builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<ETDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthorization();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseRouting();

app.UseCors(options =>
    options.WithOrigins("https://localhost:44485")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();