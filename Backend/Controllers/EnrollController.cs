using Backend.Services;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EnrollController : ControllerBase
    {
        private readonly EnrollService _enroll;
        private readonly JwtService _jwt;

        public EnrollController(EnrollService enrollService, JwtService jwtService)
        {
            _enroll = enrollService;
            _jwt = jwtService;
        }

        [HttpPost("{courseId}")]
        public async Task<IActionResult> Enroll(string courseId)
        {
            var userId = _jwt.GetUserIdFromToken(Request);

            var existing = await _enroll.GetByUserAndCourse(userId, courseId);
            if (existing != null)
                return BadRequest("Already enrolled");

            await _enroll.CreateAsync(new EnrolledCourse
            {
                UserId = userId,
                CourseId = courseId
            });

            return Ok("Enrolled successfully");
        }

        [HttpGet("my-courses")]
        public async Task<IActionResult> GetMyCourses()
        {
            var userId = _jwt.GetUserIdFromToken(Request);
            var courses = await _enroll.GetByUserIdAsync(userId);
            return Ok(courses);
        }
    }
}
