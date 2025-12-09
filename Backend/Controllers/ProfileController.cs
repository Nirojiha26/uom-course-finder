using System;
using System.IO;
using System.Threading.Tasks;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly JwtService _jwt;
        private readonly IWebHostEnvironment _env;

        public ProfileController(UserService userService, JwtService jwt, IWebHostEnvironment env)
        {
            _userService = userService;
            _jwt = jwt;
            _env = env;
        }

        // GET: api/profile
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = _jwt.GetUserIdFromToken(Request);

            var user = await _userService.GetByIdAsync(userId);

            if (user == null) return NotFound("User not found");

            // Build base URL like "http://192.168.1.5:5000"
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            return Ok(new
            {
                id = user.Id,
                fullName = user.FullName,
                username = user.Username,
                email = user.Email,
                preferredDark = user.PreferredDark ?? false,
                profileImageUrl = string.IsNullOrEmpty(user.ProfileImageUrl)
                    ? null
                    : baseUrl + user.ProfileImageUrl
            });
        }

        // PUT: api/profile
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto updated)
        {
            var userId = _jwt.GetUserIdFromToken(Request);

            var user = await _userService.GetByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            // Update only allowed fields
            if (!string.IsNullOrWhiteSpace(updated.FullName))
            {
                user.FullName = updated.FullName;
            }

            if (!string.IsNullOrWhiteSpace(updated.Username))
            {
                user.Username = updated.Username;
            }

            // Persist theme preference when provided
            if (updated.PreferredDark.HasValue)
            {
                user.PreferredDark = updated.PreferredDark.Value;
            }

            // 🔹 Handle profile image (base64)
            if (!string.IsNullOrWhiteSpace(updated.ProfileImageBase64))
            {
                var base64 = updated.ProfileImageBase64;

                // If string is like "data:image/jpeg;base64,AAAA..."
                var commaIndex = base64.IndexOf(',');
                if (commaIndex >= 0)
                {
                    base64 = base64.Substring(commaIndex + 1);
                }

                byte[] bytes;
                try
                {
                    bytes = Convert.FromBase64String(base64);
                }
                catch (FormatException)
                {
                    return BadRequest("Invalid image data");
                }

                // Where to save: wwwroot/profile-images
                var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var uploadsFolder = Path.Combine(webRoot, "profile-images");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var fileName = $"{user.Id}_{Guid.NewGuid():N}.jpg";
                var filePath = Path.Combine(uploadsFolder, fileName);

                await System.IO.File.WriteAllBytesAsync(filePath, bytes);

                // Store relative path in DB (e.g. "/profile-images/xxx.jpg")
                user.ProfileImageUrl = $"/profile-images/{fileName}";
            }

            await _userService.UpdateAsync(user);
            return Ok(new { message = "Profile updated successfully" });
        }
    }
}
