namespace CorepetitorApi.Models
{
    public class Module
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int TutorId { get; set; }
        public Tutor Tutor { get; set; }
        public int StudentId { get; set; }
        public Student Student { get; set; }
        public decimal? PricePerHour { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }


    }
}
