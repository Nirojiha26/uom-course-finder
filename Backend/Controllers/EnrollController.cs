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
        private readonly CourseService _courseService;

        public EnrollController(EnrollService enrollService, JwtService jwtService, CourseService courseService)
        {
            _enroll = enrollService;
            _jwt = jwtService;
            _courseService = courseService;
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
            var enrollments = await _enroll.GetByUserIdAsync(userId);
            
            // Fetch full course details for each enrollment
            var coursesList = new List<object>();
            foreach (var enrollment in enrollments)
            {
                var course = await _courseService.GetCourseByIdAsync(enrollment.CourseId);
                if (course != null)
                {
                    coursesList.Add(new
                    {
                        id = enrollment.Id,
                        courseId = enrollment.CourseId,
                        title = course.Title,
                        description = course.Description,
                        department = course.Department,
                        imageUrl = course.ImageUrl,
                        enrolledAt = enrollment.EnrolledAt
                    });
                }
            }
            
            return Ok(coursesList);
        }
    }
}
