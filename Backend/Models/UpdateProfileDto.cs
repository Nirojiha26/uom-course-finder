namespace Backend.Models
{
    public class UpdateProfileDto
    {
        public string? FullName { get; set; }
        public string? Username { get; set; }
        public bool? PreferredDark { get; set; }
    }
}
