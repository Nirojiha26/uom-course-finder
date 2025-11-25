using Backend.Models;
using Backend.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Backend.Services
{
    public class CourseService
    {
        private readonly IMongoCollection<Course> _courses;

        public CourseService(IOptions<MongoDbSettings> mongoSettings)
        {
            var client = new MongoClient(mongoSettings.Value.ConnectionString);
            var db = client.GetDatabase(mongoSettings.Value.DatabaseName);

            _courses = db.GetCollection<Course>("Courses");
        }

        public Task<List<Course>> GetCoursesAsync() =>
            _courses.Find(_ => true).ToListAsync();

        public Task<Course> GetCourseByIdAsync(string id) =>
            _courses.Find(c => c.Id == id).FirstOrDefaultAsync();

        public Task CreateCourseAsync(Course course) =>
            _courses.InsertOneAsync(course);
    }
}
