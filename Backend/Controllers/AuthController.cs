using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly JwtService _jwtService;

        public AuthController(UserService userService, JwtService jwtService)
        {
            _userService = userService;
            _jwtService = jwtService;
        }

        // REGISTER
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto dto)
        {
            var existing = await _userService.GetByEmailAsync(dto.Email);
            if (existing != null)
                return BadRequest("Email already exists");

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            await _userService.CreateAsync(user);

            return Ok("User registered successfully");
        }

        // LOGIN
        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDto dto)
        {
            var user = await _userService.GetByEmailAsync(dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid email or password");

            var token = _jwtService.GenerateToken(user);

            return Ok(new { token });
        }
    }
}
