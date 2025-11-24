using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("username")]
        public string Username { get; set; } = null!;

        [BsonElement("email")]
        public string Email { get; set; } = null!;

        [BsonElement("passwordHash")]
        public string PasswordHash { get; set; } = null!;

        [BsonElement("isEmailVerified")]
        public bool IsEmailVerified { get; set; } = false;

        // New OTP-based verification fields
        [BsonElement("emailVerificationCode")]
        public string? EmailVerificationCode { get; set; }

        [BsonElement("emailVerificationExpires")]
        public DateTime? EmailVerificationExpires { get; set; }

        [BsonElement("passwordResetCode")]
public string? PasswordResetCode { get; set; }

[BsonElement("passwordResetExpires")]
public DateTime? PasswordResetExpires { get; set; }

}
}