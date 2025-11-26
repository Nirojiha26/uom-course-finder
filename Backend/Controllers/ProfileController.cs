using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly JwtService _jwt;

        public ProfileController(UserService userService, JwtService jwt)
        {
            _userService = userService;
            _jwt = jwt;
        }

        // GET: api/profile
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = _jwt.GetUserIdFromToken(Request);

            var user = await _userService.GetByIdAsync(userId);

            if (user == null) return NotFound("User not found");

            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Username,
                user.Email
            });
        }

        // PUT: api/profile
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] User updated)
        {
            var userId = _jwt.GetUserIdFromToken(Request);

            var user = await _userService.GetByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            user.FullName = updated.FullName ?? user.FullName;
            user.Username = updated.Username ?? user.Username;

            await _userService.UpdateAsync(user);
            return Ok("Profile updated successfully");
        }
    }
}
