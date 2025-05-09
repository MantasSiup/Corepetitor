namespace CorepetitorApi.Models
{
    public class LessonSchedule
    {
        public int Id { get; set; }

        public int TutorId { get; set; }
        public int StudentId { get; set; }
        public int ModuleId { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public string? Description { get; set; }

        public Tutor? Tutor { get; set; }
        public Student? Student { get; set; }
        public Module? Module { get; set; }
    }

}
