namespace CorepetitorApi.Repositories
{
    using CorepetitorApi.Data;
    using CorepetitorApi.Models;

    public class LessonScheduleRepository : ILessonScheduleRepository
    {
        private readonly CorepetitorDbContext _context;

        public LessonScheduleRepository(CorepetitorDbContext context)
        {
            _context = context;
        }

        public IEnumerable<LessonSchedule> GetLessonsForUser(int userId, string role)
        {
            if (role == "tutor")
            {
                return _context.Lessons
                    .Where(l => l.TutorId == userId)
                    .ToList();
            }
            else if (role == "student")
            {
                return _context.Lessons
                    .Where(l => l.StudentId == userId)
                    .ToList();
            }

            return Enumerable.Empty<LessonSchedule>();
        }

        public void AddLesson(LessonSchedule lesson)
        {
            _context.Lessons.Add(lesson);
            _context.SaveChanges();
        }
    }

}
