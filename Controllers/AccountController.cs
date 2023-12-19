using Microsoft.AspNetCore.Mvc;
using _2023pz_trrepo.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Google.Authenticator;
using System.Text;
using Newtonsoft.Json.Linq;
using System.Net;

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

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            try{
            await _signInManager.SignOutAsync();
            }
            catch(Exception exception){
                return BadRequest("Unable to logout. " + exception.ToString());
            }
            return Ok("Sucsessfully logged out!");
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
            
            // Two-Factor Authentication is needed
            if (user.TwoFactorEnabled && cred.AuthKey == null)
            {
                return StatusCode(202, "Two-Factor Authentication");
            }
            else if(user.TwoFactorEnabled && cred.AuthKey != null)
            {
                // Validate key
                TwoFactorAuthenticator TwoFacAuth = new TwoFactorAuthenticator();
                bool isValid = TwoFacAuth.ValidateTwoFactorPIN(user.GoogleAuthKey, cred.AuthKey, TimeSpan.FromSeconds(15));

                if (!isValid)
                {
                    return Unauthorized("Invalid credentials");
                }
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
                return BadRequest("Registration failed. " + result.ToString());
            }

            return Ok("Registartion succeded");
        }

        [Authorize]
        [HttpGet("getWallets")]
        public async Task<JsonResult> getWallets(){
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return new JsonResult(Unauthorized("Session ended! Sign in again"));
            }   
            var wallets = await _dbContext.Wallets.Where(w => w.UserId == userId).ToListAsync();
            return new JsonResult(wallets);
        }

        [Authorize]
        [HttpPost("addWallet")]
        public async Task<IActionResult> AddWallet([FromBody] WalletRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("Session ended! Sign in again");
            }

            var user = await _dbContext.Users
            .Include("Wallets")
            .FirstOrDefaultAsync(u => u.Id==userId);

            if (user == null)
            {
                return NotFound("Unable to find user with this user id");
            }
            Wallet wallet = new()
            {
                User = user,
                UserId = userId,
                Name = request.name,
                IconId = 1,
                AccountBalance = 0,
                Incomes = new List<Income>(),
                Expenditures = new List<Expenditure>()
            };

            user.Wallets.Add(wallet);
            await _dbContext.SaveChangesAsync();
            return Ok("Wallet added succesfully");
        }

        private static byte[] ConvertSecretToBytes(string secret, bool secretIsBase32) =>
           secretIsBase32 ? Base32Encoding.ToBytes(secret) : Encoding.UTF8.GetBytes(secret);

        [Authorize]
        [HttpGet("GetTwoFactorStatus")]
        public async Task<IActionResult> GetTwoFactorStatus()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);

                if (user != null)
                {
                    return Ok(new { twoFactorEnabled = user.TwoFactorEnabled});
                }
                else
                {
                    return NotFound("User not found");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error:" + ex.Message);
            }
        }
        [Authorize]
        [HttpGet("GetTwoFactorKey")]
        public async Task<IActionResult> GetTwoFactorKey()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);

                if (user != null)
                {
                    string GoogleAuthKey = "";
                    string QrImageUrl = "";
                    const string validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                    // Generate 10 char secret key
                    Random random = new Random();
                    for (int i = 0; i < 10; i++)
                    {
                        GoogleAuthKey += validChars[random.Next(0, validChars.Length)];
                    }
                    // Generate setupcode
                    TwoFactorAuthenticator TwoFacAuth = new TwoFactorAuthenticator();
                    var setupInfo = TwoFacAuth.GenerateSetupCode("ExpensionTracker", user.UserName, ConvertSecretToBytes(GoogleAuthKey, false), 200);
                    QrImageUrl = setupInfo.QrCodeSetupImageUrl;
                    return Ok(new {authKey = GoogleAuthKey, barcodeImageUrl = QrImageUrl });
                }
                else
                {
                    return NotFound("User not found");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error:" + ex.Message);
            }
        }
        [Authorize]
        [HttpPost("enableTwoFactor")]
        public async Task<IActionResult> enableTwoFactor()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);

                if (user != null)
                {
                    // Read json data from body
                    string requestBody;
                    using (var reader = new System.IO.StreamReader(Request.Body))
                    {
                        requestBody = await reader.ReadToEndAsync();
                    }
                    dynamic data = JObject.Parse(requestBody);
                    string authKey = data.authKey;
                    string enteredAuthKey = data.enteredAuthKey;
                    // Validate key
                    TwoFactorAuthenticator TwoFacAuth = new TwoFactorAuthenticator();
                    bool isValid = TwoFacAuth.ValidateTwoFactorPIN(authKey, enteredAuthKey, TimeSpan.FromSeconds(15));

                    if (isValid)
                    {
                        user.TwoFactorEnabled = true;
                        user.GoogleAuthKey = authKey;
                        await _dbContext.SaveChangesAsync();

                        return Ok(true);
                    }

                    return Ok(false);
                }
                else
                {
                    return NotFound("User not found");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error:" + ex.Message);
            }
        }
        [Authorize]
        [HttpPost("disableTwoFactor")]
        public async Task<IActionResult> disableTwoFactor()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);

                if (user != null)
                {
                    // Read json data from body
                    string requestBody;
                    using (var reader = new System.IO.StreamReader(Request.Body))
                    {
                        requestBody = await reader.ReadToEndAsync();
                    }
                    dynamic data = JObject.Parse(requestBody);
                    string enteredAuthKey = data.enteredAuthKey;
                    // Validate key
                    TwoFactorAuthenticator TwoFacAuth = new TwoFactorAuthenticator();
                    bool isValid = TwoFacAuth.ValidateTwoFactorPIN(user.GoogleAuthKey, enteredAuthKey, TimeSpan.FromSeconds(15));

                    if (isValid)
                    {
                        user.TwoFactorEnabled = false;
                        user.GoogleAuthKey = null;
                        await _dbContext.SaveChangesAsync();
                        return Ok(true);
                    }

                    return Ok(false);
                }
                else
                {
                    return NotFound("User not found");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error:" + ex.Message);
            }
        }
        [HttpGet("GetProfilePageData")]
        [Authorize]
        public async Task<IActionResult> GetProfilePageData()
        {
            try
            {
                string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new ArgumentNullException(nameof(userId));
                User user = await _userManager.FindByIdAsync(userId) ?? throw new Exception($"User {userId} not found in DB");
                IEnumerable<UserLoginInfo> logins = await _userManager.GetLoginsAsync(user);

                return new OkObjectResult(new { user, logins});
            }
            catch(Exception ex) 
            {
                return new StatusCodeResult((int)HttpStatusCode.InternalServerError);
            }
        }

        public class Credentials
        {
            public Credentials(string login, string password, string? authKey)
            {
                Login = login;
                Password = password;
                AuthKey = authKey;
            }

            public string Login { get; set; }
            public string Password { get; set; }
            public string? AuthKey { get; set; }
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

    public class WalletRequest
    {
        public string name { get; set; }
    }
}