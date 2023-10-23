namespace CorepetitorApi.Models
{
    public class StudentModule
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int ModuleId { get; set; }
        public Student Student { get; set; }
        public Module Module { get; set; }
    }

}
