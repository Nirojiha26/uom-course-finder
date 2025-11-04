using Backend.Models;
using Backend.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Backend.Services
{
    public class CourseService
    {
        private readonly IMongoCollection<Course> _courseCollection;

        public CourseService(IOptions<MongoDbSettings> mongoDbSettings)
        {
            var client = new MongoClient(mongoDbSettings.Value.ConnectionString);
            var database = client.GetDatabase(mongoDbSettings.Value.DatabaseName);
            _courseCollection = database.GetCollection<Course>("Courses");
        }

        public async Task<List<Course>> GetAllAsync() =>
            await _courseCollection.Find(_ => true).ToListAsync();

        public async Task<Course?> GetByIdAsync(string id) =>
            await _courseCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Course newCourse) =>
            await _courseCollection.InsertOneAsync(newCourse);
    }
}
