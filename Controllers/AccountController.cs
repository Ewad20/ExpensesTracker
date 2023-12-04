using Microsoft.AspNetCore.Mvc;
using _2023pz_trrepo.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;


namespace _2023pz_trrepo.Controllers
{
    [ApiController]
    [Route("api/account")]
    public class AccountController : ControllerBase
    {
        private readonly ETDbContext _dbContext;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, ETDbContext dbContext)

        {
            _dbContext = dbContext;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] Credentials cred)
        {
            var user = await _userManager.FindByNameAsync(cred.Login);

            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(cred.Login);
                if (user == null)
                    return Unauthorized("Invalid credentials");
            }

            var signInResult = await _signInManager.CheckPasswordSignInAsync(user, cred.Password, lockoutOnFailure: false);

            if (!signInResult.Succeeded)
            {
                return Unauthorized("Invalid credentials.");
            }

            await _signInManager.SignInAsync(user, isPersistent: false);

            return Ok("Login successful.");
        }

        [HttpPost("register")]
        public async Task<IActionResult> AddUser([FromBody] UserModelForRegistration user)
        {
            var existingUser = await _userManager.FindByNameAsync(user.Username);
            if (existingUser != null)
            {
                return Conflict("Username already taken");
            }
            existingUser = await _userManager.FindByEmailAsync(user.Email);
            if (existingUser != null)
            {
                return Conflict("Email already in use");
            }
            var newUser = new User
            {
                UserName = user.Username,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Wallets = new List<Wallet>()
            };

            var result = await _userManager.CreateAsync(newUser, user.Password);

            if (!result.Succeeded)
            {
                return BadRequest("Registration failed." + "\n" + result.ToString());
            }

            return Ok("Registartion succeded");
        }

        [Authorize]
        [HttpPost("addWallet")]
        public async Task<IActionResult> AddWallet([FromBody] Wallet wallet)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("Session ended! Sign in again");
            }

            var user = await _dbContext.Users
            .Include("Wallets")
            .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound("Unable to find user with this user id");
            }

            wallet.Incomes = new List<Income>();
            wallet.Expenditures = new List<Expenditure>();
            user.Wallets.Add(wallet);

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return BadRequest("Unable to resolve");
            }

            return Ok("Wallet added succesfully");
        }

        public class Credentials
        {
            public Credentials(string login, string password)
            {
                Login = login;
                Password = password;
            }

            public string Login { get; set; }
            public string Password { get; set; }

        }

        public class UserModelForRegistration
        {
            public UserModelForRegistration(string firstName, string lastName, string username, string email, string password)
            {
                FirstName = firstName;
                LastName = lastName;
                Username = username;
                Email = email;
                Password = password;
            }

            public long Id { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }
    }
}