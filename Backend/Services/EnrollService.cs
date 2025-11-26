using Backend.Models;
using Backend.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Backend.Services
{
    public class EnrollService
    {
        private readonly IMongoCollection<EnrolledCourse> _enrolled;

        public EnrollService(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var db = client.GetDatabase(settings.Value.DatabaseName);

            _enrolled = db.GetCollection<EnrolledCourse>("EnrolledCourses");
        }

        public Task<List<EnrolledCourse>> GetByUserIdAsync(string userId) =>
            _enrolled.Find(e => e.UserId == userId).ToListAsync();

        public Task<EnrolledCourse?> GetByUserAndCourse(string userId, string courseId) =>
            _enrolled.Find(e => e.UserId == userId && e.CourseId == courseId)
                .FirstOrDefaultAsync();

        public Task CreateAsync(EnrolledCourse e) =>
            _enrolled.InsertOneAsync(e);
    }
}
