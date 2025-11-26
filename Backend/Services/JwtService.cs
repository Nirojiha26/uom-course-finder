using Backend.Models;
using Backend.Settings;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http;

namespace Backend.Services
{
    public class JwtService
    {
        private readonly JwtSettings _settings;

        public JwtService(IOptions<JwtSettings> settings)
        {
            _settings = settings.Value;
        }

        // ---------------------------------------------
        // 1️⃣ Generate Token with BOTH id + sub claims
        // ---------------------------------------------
        public string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim("id", user.Id!),                                // <--- REQUIRED
                new Claim(JwtRegisteredClaimNames.Sub, user.Id!),         // <--- fallback
                new Claim(JwtRegisteredClaimNames.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_settings.ExpiresInMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // ---------------------------------------------
        // 2️⃣ Safely extract UserId from Token
        // ---------------------------------------------
        public string GetUserIdFromToken(HttpRequest request)
        {
            var header = request.Headers["Authorization"].ToString();

            if (string.IsNullOrWhiteSpace(header) || !header.StartsWith("Bearer "))
                throw new UnauthorizedAccessException("Authorization header missing");

            var token = header.Replace("Bearer ", "").Trim();
            var handler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_settings.Secret);

            var principal = handler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _settings.Issuer,
                ValidateAudience = true,
                ValidAudience = _settings.Audience,
                ValidateLifetime = true
            }, out SecurityToken validated);

            // Try id claim
            var id = principal.FindFirst("id")?.Value;

            // Try sub claim
            if (string.IsNullOrEmpty(id))
                id = principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (string.IsNullOrEmpty(id))
                throw new UnauthorizedAccessException("Invalid token: No user id");

            return id;
        }
    }
}
