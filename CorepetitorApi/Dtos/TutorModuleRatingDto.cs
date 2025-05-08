namespace CorepetitorApi.Dtos
{
    public class TutorModuleRatingDto
    {
        public int TutorId { get; set; }
        public int StudentId { get; set; }
        public int ModuleId { get; set; }
        public double Rating { get; set; }
    }
}
