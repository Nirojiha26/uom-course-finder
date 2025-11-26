using Backend.Models;
using Backend.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Backend.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IOptions<MongoDbSettings> mongoSettings)
        {
            var client = new MongoClient(mongoSettings.Value.ConnectionString);
            var db = client.GetDatabase(mongoSettings.Value.DatabaseName);

            _users = db.GetCollection<User>("Users");
        }

        public Task<User> GetByEmailAsync(string email) =>
            _users.Find(u => u.Email == email).FirstOrDefaultAsync();

        public Task<User> GetByUsernameAsync(string username) =>
            _users.Find(u => u.Username == username).FirstOrDefaultAsync();

        // For OTP Reset
        public Task<User> GetByResetCodeAsync(string code) =>
            _users.Find(u => u.PasswordResetCode == code).FirstOrDefaultAsync();

        public Task CreateAsync(User user) =>
            _users.InsertOneAsync(user);

        public Task UpdateAsync(User user) =>
            _users.ReplaceOneAsync(u => u.Id == user.Id, user);


            public Task<User> GetByIdAsync(string id) =>
    _users.Find(u => u.Id == id).FirstOrDefaultAsync();


    }
}
