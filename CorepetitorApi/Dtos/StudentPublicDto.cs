namespace CorepetitorApi.Dtos
{
    public class StudentPublicDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
    }
}
