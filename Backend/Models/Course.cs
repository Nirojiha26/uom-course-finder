using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models
{
    public class Course
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("title")]
        public string? Title { get; set; }

        [BsonElement("description")]
        public string? Description { get; set; }

        [BsonElement("imageUrl")]
        public string? ImageUrl { get; set; }

        [BsonElement("department")]
        public string? Department { get; set; }
    }
}
