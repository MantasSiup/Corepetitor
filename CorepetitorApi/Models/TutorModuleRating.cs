namespace CorepetitorApi.Models
{
    public class TutorModuleRating
    {
        public int Id { get; set; }

        public int TutorId { get; set; }
        public int ModuleId { get; set; }
        public int StudentId { get; set; }

        public decimal Rating { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }

}
