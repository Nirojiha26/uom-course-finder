using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models
{
    public class EnrolledCourse
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string UserId { get; set; }
        public string CourseId { get; set; }
        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
    }
}
