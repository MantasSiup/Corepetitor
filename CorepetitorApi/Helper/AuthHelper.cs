using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
namespace CorepetitorApi.Helper
{
    public class AuthHelper
    {
        private readonly IConfiguration _configuration;
        private readonly string jwtKey;
        private readonly string jwtIssuer;
        private readonly string jwtAudience;

        public AuthHelper(IConfiguration configuration)
        {
            _configuration = configuration;

            jwtKey = _configuration.GetValue<string>("JwtSettings:Key");
            jwtIssuer = _configuration.GetValue<string>("JwtSettings:Issuer");
            jwtAudience = _configuration.GetValue<string>("JwtSettings:Audience");
        }

        public bool DoesPasswordMatch(string loginPassword, string storedPassword)
        {
            return loginPassword == storedPassword;
        }

        public string GenerateJwtToken(int userId, string role)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Role, role)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Issuer = jwtIssuer,
                Audience = jwtAudience,
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public static int GetUserId(ClaimsPrincipal user)
        {
            var userIdClaim = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null || int.TryParse(userIdClaim.Value, out int userId) == false)
            {
                return 0;
            }
            return userId;
        }
    }
}