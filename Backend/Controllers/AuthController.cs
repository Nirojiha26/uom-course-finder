using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // 🔐 All endpoints protected unless [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly UserService _users;
        private readonly JwtService _jwt;
        private readonly EmailService _email;

        public AuthController(UserService users, JwtService jwt, EmailService email)
        {
            _users = users;
            _jwt = jwt;
            _email = email;
        }

        // REGISTER → Sends OTP
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (await _users.GetByEmailAsync(dto.Email) != null)
                return BadRequest("Email already used");

            if (await _users.GetByUsernameAsync(dto.Username) != null)
                return BadRequest("Username already used");

            string otp = new Random().Next(100000, 999999).ToString();

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                IsEmailVerified = false,
                EmailVerificationCode = otp,
                EmailVerificationExpires = DateTime.UtcNow.AddMinutes(10)
            };

            await _users.CreateAsync(user);

            var html = $@"
                <h2>Email Verification</h2>
                <p>Your verification code is:</p>
                <h1 style='font-size:40px; letter-spacing:8px'>{otp}</h1>
                <p>This code expires in 10 minutes.</p>
            ";

            await _email.SendEmailAsync(user.Email, "Verify your email", html);

            return Ok("Verification code sent to your email.");
        }

        // VERIFY EMAIL
        [AllowAnonymous]
        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail(VerifyEmailDto dto)
        {
            var user = await _users.GetByEmailAsync(dto.Email);
            if (user == null)
                return BadRequest("Invalid email");

            if (user.EmailVerificationCode != dto.Code)
                return BadRequest("Invalid verification code");

            if (user.EmailVerificationExpires < DateTime.UtcNow)
                return BadRequest("Verification code expired");

            user.IsEmailVerified = true;
            user.EmailVerificationCode = null;
            user.EmailVerificationExpires = null;

            await _users.UpdateAsync(user);

            return Ok("Email verified successfully.");
        }

        // LOGIN → Returns JWT
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user =
                await _users.GetByEmailAsync(dto.EmailOrUsername) ??
                await _users.GetByUsernameAsync(dto.EmailOrUsername);

            if (user == null)
                return Unauthorized("Invalid credentials");

            if (!user.IsEmailVerified)
                return Unauthorized("Email not verified");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials");

            var token = _jwt.GenerateToken(user);

            return Ok(new
            {
                token,
                user.Username,
                user.Email
            });
        }

        // FORGOT PASSWORD → Send reset link
        [AllowAnonymous]
[HttpPost("forgot-password")]
public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
{
    var user = await _users.GetByEmailAsync(dto.Email);
    if (user == null)
        return Ok("If the email exists, a reset code has been sent.");

    string otp = new Random().Next(100000, 999999).ToString();

    user.PasswordResetCode = otp;
    user.PasswordResetExpires = DateTime.UtcNow.AddMinutes(10);

    await _users.UpdateAsync(user);

    var html = $@"
        <h2>Reset Password</h2>
        <p>Your reset code is:</p>
        <h1 style='font-size:40px; letter-spacing:8px'>{otp}</h1>
        <p>This code expires in 10 minutes.</p>
    ";

    await _email.SendEmailAsync(user.Email, "Password Reset Code", html);

    return Ok("Reset code sent to your email.");
}


        // RESET PASSWORD
        [AllowAnonymous]
[HttpPost("reset-password")]
public async Task<IActionResult> ResetPassword(ResetPasswordOtpDto dto)
{
    var user = await _users.GetByEmailAsync(dto.Email);
    if (user == null)
        return BadRequest("Invalid email");

    if (user.PasswordResetCode != dto.Code)
        return BadRequest("Invalid reset code");

    if (user.PasswordResetExpires < DateTime.UtcNow)
        return BadRequest("Reset code expired");

    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
    user.PasswordResetCode = null;
    user.PasswordResetExpires = null;

    await _users.UpdateAsync(user);

    return Ok("Password reset successfully.");
}

    }
}
